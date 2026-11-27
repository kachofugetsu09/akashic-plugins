"""值班的配置与设置表单；不配置主对话就不运行。"""
from __future__ import annotations

from collections.abc import Mapping
import re
from typing import cast
from zoneinfo import ZoneInfo

from pydantic import BaseModel, ConfigDict, Field, field_validator

from agent.plugin_composition import Context
from plugins.models.contract import ModelChoice, ModelUse, model_options
from plugins.main_session.contract import MAIN_SESSION
from plugins.onboarding.contract import Ability
from plugins.plugin_settings.contract import SETTINGS_FORMS, Setup, SettingsField, SettingsForm, StatusReader, declare_setup
from plugins.ui.contract import ModelSettings

WAKE_MODEL = ModelUse("watch", "值班叫醒后的主 Agent")


# 兼容老配置：磁盘原配置未写 watch_enabled 但已有非空 target 时按开启处理；其余以 watch_enabled 为准。
def watch_enabled_in(raw: Mapping[str, object]) -> bool:
    if "watch_enabled" in raw:
        return raw["watch_enabled"] is True
    target = raw.get("target")
    return isinstance(target, str) and bool(target.strip())


class Config(BaseModel):
    model_config = ConfigDict(extra="forbid")
    # 默认关闭：后台持续轮询消耗 token，找不到低价或免费 token 时不建议开启。
    # 避开宿主设置协议的保留键 enabled，防止保存时被宿主状态覆盖。
    watch_enabled: bool = False
    # 主对话的会话 ID，形如 akashic:xxxx 或 telegram:123；主 Agent 想说话时发到这里。
    target: str = ""
    interval_minutes: int = Field(default=10, ge=1, le=240)
    # 值班员用的模型 ID，按顺序退避；留空用默认模型。
    watch_models: tuple[str, ...] = ()
    model: ModelChoice = ModelChoice(follow="default")
    daily_wakes: int = Field(default=8, ge=0, le=100)
    # 待看列表有新条目、而主 Agent 已经这么久没醒过时，叫它过一眼；0 表示不这样做。
    digest_hours: int = Field(default=4, ge=0, le=72)
    review_at: str = "05:00"
    timezone: str = "Asia/Shanghai"
    memory_file: str = "memory/MEMORY.md"
    # 主 Agent 对用户这个人的认识，整理记忆时重写；值班员每一批都读。
    profile_file: str = "memory/topics/user.md"

    @field_validator("target")
    @classmethod
    def _target(cls, value: str) -> str:
        value = value.strip()
        if value and (":" not in value or value.startswith(":") or value.endswith(":")):
            raise ValueError("主对话需要写成 渠道:会话 的形式，例如 akashic:1234abcd")
        return value

    @field_validator("review_at")
    @classmethod
    def _clock(cls, value: str) -> str:
        value = value.strip()
        if value != "off" and re.fullmatch(r"([01]?\d|2[0-3]):[0-5]\d", value) is None:
            raise ValueError("复盘时间写成 HH:MM，不复盘写 off")
        return value

    @field_validator("timezone")
    @classmethod
    def _zone(cls, value: str) -> str:
        _ = ZoneInfo(value)
        return value

    @field_validator("model")
    @classmethod
    def _model(cls, value: ModelChoice) -> ModelChoice:
        return WAKE_MODEL.check(value)

    @field_validator("watch_models")
    @classmethod
    def _lines(cls, value: tuple[str, ...]) -> tuple[str, ...]:
        return tuple(item.strip() for item in value if item.strip())


_COST = "值班每 10 分钟用便宜模型看一次新事件，一天大约 100–200 万 token；没有低价或免费 token 时不建议开启。"

FORM = SettingsForm(
    title="值班",
    description="便宜的模型看着事件流，只在该叫的时候叫醒主 Agent；主 Agent 在后台醒来后自己决定做什么、说不说话。" + _COST,
    fields=(
        SettingsField("watch_enabled", "开启值班", kind="toggle", hint="默认关闭；打开并保存后按下面的设置开始值班。"),
        SettingsField("watch_models", "值班模型", kind="lines",
                      hint="定时看事件用，越便宜越好，免费或包月的最合适。每行一个模型 ID，按顺序退避。留空会用默认模型，可能很贵。"),
        SettingsField("model", "叫醒后由谁处理", kind="model", use=WAKE_MODEL),
        SettingsField("target", "有事发到", hint="主 Agent 想说话时发到的会话。留空时跟随侧栏顶部的 Akashic 对话；也可以写成 akashic:1234abcd 或 telegram:123。"),
        SettingsField("interval_minutes", "值班间隔（分钟）", kind="number", hint="每隔这么久把新事件攒成一批看一次。", advanced=True),
        SettingsField("daily_wakes", "每天最多叫醒几次", kind="number", hint="超出的不丢，放进待看列表；标成紧急的不受此限。", advanced=True),
        SettingsField("digest_hours", "待看列表多久看一次（小时）", kind="number",
                      hint="待看列表有新条目、主 Agent 又这么久没醒过时叫它过一眼；0 表示只在被叫醒和复盘时看。", advanced=True),
        SettingsField("review_at", "每日复盘时间", hint="HH:MM；写 off 表示不复盘。", advanced=True),
        SettingsField("timezone", "时区", advanced=True),
    ),
    setup=Setup("watch", "值班", Ability(
        pitch="替你留意要紧的事",
        benefit="它在后台定时看一眼邮件、日程、手机通知等新事件，真有要紧的才叫醒主 Agent 来找你。",
        default_on=False,
        caution=_COST,
    )),
)


class WatchSettings(ModelSettings):
    """读写时按保存前配置固化老实例的 watch_enabled，防止新用户只填 target 时被误开启。"""

    async def read(self) -> dict[str, object]:
        result = await super().read()
        if "watch_enabled" not in self.ctx.config and watch_enabled_in(self.ctx.config):
            raw_values = result.get("values")
            values: dict[str, object] = dict(cast(dict[str, object], raw_values)) if isinstance(raw_values, dict) else {}
            values["watch_enabled"] = True
            result["values"] = values
        return result

    # 保存时补两件事：老配置固化 watch_enabled；开启值班却没写主对话时，跟随侧栏顶部的 Akashic 对话。
    async def save(self, request_id: str, expected_input: str, values: dict[str, object]) -> dict[str, object]:
        patched = dict(values)
        if "watch_enabled" not in patched:
            patched["watch_enabled"] = watch_enabled_in(self.ctx.config)
        target = patched.get("target", self.ctx.config.get("target"))
        if patched["watch_enabled"] is True and not (isinstance(target, str) and target.strip()):
            with self.ctx.borrow(MAIN_SESSION) as main:
                current = None if main is None else main.current()
            if current is None:
                raise ValueError("还没有主对话：先在侧栏顶部固定一段 Akashic 对话，或在「有事发到」里填写会话")
            patched["target"] = current
        return await super().save(request_id, expected_input, patched)


# 引导里这一步算完成：值班关着（用户没打开）或已开启且有主对话。
def _status(ctx: Context) -> StatusReader:
    async def read() -> Mapping[str, object]:
        enabled = watch_enabled_in(ctx.config)
        target = ctx.config.get("target")
        ready = enabled and isinstance(target, str) and bool(target.strip())
        return {"enabled": enabled, "ready": ready, "reason": "" if ready or not enabled else "还没有主对话"}
    return read


async def register_settings(ctx: Context) -> object:
    uses = {field.name: field.use for field in FORM.fields if field.use is not None}
    options, status = model_options(ctx, uses), _status(ctx)

    # 表单底部的开关状态跟随 watch_enabled，而不是插件本身是否启用。
    async def merged() -> Mapping[str, object]:
        return {**await options(), **await status()}

    settings = WatchSettings(ctx, Config, tuple(field.name for field in FORM.fields), status=merged)
    return await ctx.require(SETTINGS_FORMS).register(ctx, FORM, settings)


async def register_setup(ctx: Context) -> None:
    await declare_setup(ctx, Config, FORM, status=_status(ctx))
