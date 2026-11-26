"""值班的配置与设置表单；不配置主对话就不运行。"""
from __future__ import annotations

from collections.abc import Mapping
import re
from zoneinfo import ZoneInfo

from pydantic import BaseModel, ConfigDict, Field, field_validator

from agent.plugin_composition import Context
from plugins.models.contract import ModelChoice, ModelUse, model_options
from plugins.plugin_settings.contract import SETTINGS_FORMS, SettingsField, SettingsForm
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


FORM = SettingsForm(
    title="值班",
    description="便宜的模型看着事件流，只在该叫的时候叫醒主 Agent；主 Agent 在后台醒来后自己决定做什么、说不说话。默认关闭，后台持续轮询消耗大量 token，找不到低价或免费 token 时不建议开启。",
    fields=(
        SettingsField("watch_enabled", "开启值班", kind="toggle",
                      hint="默认关闭。后台持续轮询日均约消耗 100 万–200 万 token，找不到低价或免费 token 时不建议开启。"),
        SettingsField("target", "主对话", hint="主 Agent 想说话时发到的会话 ID，例如 akashic:1234abcd。留空则值班不运行。"),
        SettingsField("interval_minutes", "值班间隔（分钟）", kind="number", hint="每隔这么久把新事件攒成一批看一次。"),
        SettingsField("watch_models", "值班模型", kind="lines", hint="每行一个模型 ID，按顺序退避：前一个失败或输出不合格就换下一个。留空用默认模型。"),
        SettingsField("model", "主 Agent 模型", kind="model", use=WAKE_MODEL),
        SettingsField("daily_wakes", "每天最多叫醒几次", kind="number", hint="超出的不丢，放进待看列表；标成紧急的不受此限。"),
        SettingsField("digest_hours", "待看列表多久看一次（小时）", kind="number",
                      hint="待看列表有新条目、主 Agent 又这么久没醒过时叫它过一眼；0 表示只在被叫醒和复盘时看。"),
        SettingsField("review_at", "每日复盘时间", hint="HH:MM；写 off 表示不复盘。"),
        SettingsField("timezone", "时区"),
    ),
)


class WatchSettings(ModelSettings):
    """读写时按保存前配置固化老实例的 watch_enabled，防止新用户只填 target 时被误开启。"""

    async def read(self) -> dict[str, object]:
        result = await super().read()
        if "watch_enabled" not in self.ctx.config and watch_enabled_in(self.ctx.config):
            values = dict(result["values"]) if isinstance(result.get("values"), dict) else {}
            values["watch_enabled"] = True
            result["values"] = values
        return result

    async def save(self, request_id: str, expected_input: str, values: dict[str, object]) -> dict[str, object]:
        patched = dict(values)
        if "watch_enabled" not in patched:
            patched["watch_enabled"] = watch_enabled_in(self.ctx.config)
        return await super().save(request_id, expected_input, patched)


async def register_settings(ctx: Context) -> object:
    uses = {field.name: field.use for field in FORM.fields if field.use is not None}
    settings = WatchSettings(
        ctx,
        Config,
        tuple(field.name for field in FORM.fields),
        status=model_options(ctx, uses) if uses else None,
    )
    return await ctx.require(SETTINGS_FORMS).register(ctx, FORM, settings)
