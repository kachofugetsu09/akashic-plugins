var Wp=(e,n)=>{if(typeof e=="number"){if(n===3)return{mode:"rgb",r:(e>>8&15|e>>4&240)/255,g:(e>>4&15|e&240)/255,b:(e&15|e<<4&240)/255};if(n===4)return{mode:"rgb",r:(e>>12&15|e>>8&240)/255,g:(e>>8&15|e>>4&240)/255,b:(e>>4&15|e&240)/255,alpha:(e&15|e<<4&240)/255};if(n===6)return{mode:"rgb",r:(e>>16&255)/255,g:(e>>8&255)/255,b:(e&255)/255};if(n===8)return{mode:"rgb",r:(e>>24&255)/255,g:(e>>16&255)/255,b:(e>>8&255)/255,alpha:(e&255)/255}}},vr=Wp;var Xp={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Va=Xp;var jp=e=>vr(Va[e.toLowerCase()],6),Fa=jp;var Kp=/^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i,Yp=e=>{let n;return(n=e.match(Kp))?vr(parseInt(n[1],16),n[1].length):void 0},Ga=Yp;var Se="([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)",cE=`(?:${Se}|none)`,wn=`${Se}%`,fE=`(?:${Se}%|none)`,At=`(?:${Se}%|${Se})`,$p=`(?:${Se}%|${Se}|none)`,Ba=`(?:${Se}(deg|grad|rad|turn)|${Se})`,dE=`(?:${Se}(deg|grad|rad|turn)|${Se}|none)`,vn="\\s*,\\s*";var pE=new RegExp("^"+$p+"$");var qp=new RegExp(`^rgba?\\(\\s*${Se}${vn}${Se}${vn}${Se}\\s*(?:,\\s*${At}\\s*)?\\)$`),Jp=new RegExp(`^rgba?\\(\\s*${wn}${vn}${wn}${vn}${wn}\\s*(?:,\\s*${At}\\s*)?\\)$`),Zp=e=>{let n={mode:"rgb"},t;if(t=e.match(qp))t[1]!==void 0&&(n.r=t[1]/255),t[2]!==void 0&&(n.g=t[2]/255),t[3]!==void 0&&(n.b=t[3]/255);else if(t=e.match(Jp))t[1]!==void 0&&(n.r=t[1]/100),t[2]!==void 0&&(n.g=t[2]/100),t[3]!==void 0&&(n.b=t[3]/100);else return;return t[4]!==void 0?n.alpha=Math.max(0,Math.min(1,t[4]/100)):t[5]!==void 0&&(n.alpha=Math.max(0,Math.min(1,+t[5]))),n},Ua=Zp;var Qp=(e,n)=>e===void 0?void 0:typeof e!="object"?Zi(e):e.mode!==void 0?e:n?{...e,mode:n}:void 0,Jn=Qp;var em=(e="rgb")=>n=>(n=Jn(n,e))!==void 0?n.mode===e?n:Be[n.mode][e]?Be[n.mode][e](n):e==="rgb"?Be[n.mode].rgb(n):Be.rgb[e](Be[n.mode].rgb(n)):void 0,de=em;var Be={},za={},Nt=[],Qi={},nm=e=>e,$=e=>(Be[e.mode]={...Be[e.mode],...e.toMode},Object.keys(e.fromMode||{}).forEach(n=>{Be[n]||(Be[n]={}),Be[n][e.mode]=e.fromMode[n]}),e.ranges||(e.ranges={}),e.difference||(e.difference={}),e.channels.forEach(n=>{if(e.ranges[n]===void 0&&(e.ranges[n]=[0,1]),!e.interpolate[n])throw new Error(`Missing interpolator for: ${n}`);typeof e.interpolate[n]=="function"&&(e.interpolate[n]={use:e.interpolate[n]}),e.interpolate[n].fixup||(e.interpolate[n].fixup=nm)}),za[e.mode]=e,(e.parse||[]).forEach(n=>{tm(n,e.mode)}),de(e.mode)),ln=e=>za[e],tm=(e,n)=>{if(typeof e=="string"){if(!n)throw new Error("'mode' required when 'parser' is a string");Qi[e]=n}else typeof e=="function"&&Nt.indexOf(e)<0&&Nt.push(e)};var eo=/[^\x00-\x7F]|[a-zA-Z_]/,rm=/[^\x00-\x7F]|[-\w]/,b={Function:"function",Ident:"ident",Number:"number",Percentage:"percentage",ParenClose:")",None:"none",Hue:"hue",Alpha:"alpha"},V=0;function Tr(e){let n=e[V],t=e[V+1];return n==="-"||n==="+"?/\d/.test(t)||t==="."&&/\d/.test(e[V+2]):n==="."?/\d/.test(t):/\d/.test(n)}function no(e){if(V>=e.length)return!1;let n=e[V];if(eo.test(n))return!0;if(n==="-"){if(e.length-V<2)return!1;let t=e[V+1];return!!(t==="-"||eo.test(t))}return!1}var im={deg:1,rad:180/Math.PI,grad:9/10,turn:360};function Ct(e){let n="";if((e[V]==="-"||e[V]==="+")&&(n+=e[V++]),n+=Sr(e),e[V]==="."&&/\d/.test(e[V+1])&&(n+=e[V++]+Sr(e)),(e[V]==="e"||e[V]==="E")&&((e[V+1]==="-"||e[V+1]==="+")&&/\d/.test(e[V+2])?n+=e[V++]+e[V++]+Sr(e):/\d/.test(e[V+1])&&(n+=e[V++]+Sr(e))),no(e)){let t=br(e);return t==="deg"||t==="rad"||t==="turn"||t==="grad"?{type:b.Hue,value:n*im[t]}:void 0}return e[V]==="%"?(V++,{type:b.Percentage,value:+n}):{type:b.Number,value:+n}}function Sr(e){let n="";for(;/\d/.test(e[V]);)n+=e[V++];return n}function br(e){let n="";for(;V<e.length&&rm.test(e[V]);)n+=e[V++];return n}function om(e){let n=br(e);return e[V]==="("?(V++,{type:b.Function,value:n}):n==="none"?{type:b.None,value:void 0}:{type:b.Ident,value:n}}function sm(e=""){let n=e.trim(),t=[],r;for(V=0;V<n.length;){if(r=n[V++],r===`
`||r==="	"||r===" "){for(;V<n.length&&(n[V]===`
`||n[V]==="	"||n[V]===" ");)V++;continue}if(r===",")return;if(r===")"){t.push({type:b.ParenClose});continue}if(r==="+"){if(V--,Tr(n)){t.push(Ct(n));continue}return}if(r==="-"){if(V--,Tr(n)){t.push(Ct(n));continue}if(no(n)){t.push({type:b.Ident,value:br(n)});continue}return}if(r==="."){if(V--,Tr(n)){t.push(Ct(n));continue}return}if(r==="/"){for(;V<n.length&&(n[V]===`
`||n[V]==="	"||n[V]===" ");)V++;let i;if(Tr(n)&&(i=Ct(n),i.type!==b.Hue)){t.push({type:b.Alpha,value:i});continue}if(no(n)&&br(n)==="none"){t.push({type:b.Alpha,value:{type:b.None,value:void 0}});continue}return}if(/\d/.test(r)){V--,t.push(Ct(n));continue}if(eo.test(r)){V--,t.push(om(n));continue}return}return t}function am(e){e._i=0;let n=e[e._i++];if(!n||n.type!==b.Function||n.value!=="color"||(n=e[e._i++],n.type!==b.Ident))return;let t=Qi[n.value];if(!t)return;let r={mode:t},i=Ha(e,!1);if(!i)return;let o=ln(t).channels;for(let s=0,a,l;s<o.length;s++)a=i[s],l=o[s],a.type!==b.None&&(r[l]=a.type===b.Number?a.value:a.value/100,l==="alpha"&&(r[l]=Math.max(0,Math.min(1,r[l]))));return r}function Ha(e,n){let t=[],r;for(;e._i<e.length;){if(r=e[e._i++],r.type===b.None||r.type===b.Number||r.type===b.Alpha||r.type===b.Percentage||n&&r.type===b.Hue){t.push(r);continue}if(r.type===b.ParenClose){if(e._i<e.length)return;continue}return}if(!(t.length<3||t.length>4)){if(t.length===4){if(t[3].type!==b.Alpha)return;t[3]=t[3].value}return t.length===3&&t.push({type:b.None,value:void 0}),t.every(i=>i.type!==b.Alpha)?t:void 0}}function lm(e,n){e._i=0;let t=e[e._i++];if(!t||t.type!==b.Function)return;let r=Ha(e,n);if(r)return r.unshift(t.value),r}var um=e=>{if(typeof e!="string")return;let n=sm(e),t=n?lm(n,!0):void 0,r,i=0,o=Nt.length;for(;i<o;)if((r=Nt[i++](e,t))!==void 0)return r;return n?am(n):void 0},Zi=um;function cm(e,n){if(!n||n[0]!=="rgb"&&n[0]!=="rgba")return;let t={mode:"rgb"},[,r,i,o,s]=n;if(!(r.type===b.Hue||i.type===b.Hue||o.type===b.Hue))return r.type!==b.None&&(t.r=r.type===b.Number?r.value/255:r.value/100),i.type!==b.None&&(t.g=i.type===b.Number?i.value/255:i.value/100),o.type!==b.None&&(t.b=o.type===b.Number?o.value/255:o.value/100),s.type!==b.None&&(t.alpha=Math.min(1,Math.max(0,s.type===b.Number?s.value:s.value/100))),t}var Wa=cm;var fm=e=>e==="transparent"?{mode:"rgb",r:0,g:0,b:0,alpha:0}:void 0,Xa=fm;var ja=(e,n,t)=>e+t*(n-e);var dm=e=>{let n=[];for(let t=0;t<e.length-1;t++){let r=e[t],i=e[t+1];r===void 0&&i===void 0?n.push(void 0):r!==void 0&&i!==void 0?n.push([r,i]):n.push(r!==void 0?[r,r]:[i,i])}return n},Ka=e=>n=>{let t=dm(n);return r=>{let i=r*t.length,o=r>=1?t.length-1:Math.max(Math.floor(i),0),s=t[o];return s===void 0?void 0:e(s[0],s[1],i-o)}};var A=Ka(ja);var j=e=>{let n=!1,t=e.map(r=>r!==void 0?(n=!0,r):1);return n?t:e};var pm={mode:"rgb",channels:["r","g","b","alpha"],parse:[Wa,Ga,Ua,Fa,Xa,"srgb"],serialize:"srgb",interpolate:{r:A,g:A,b:A,alpha:{use:A,fixup:j}},gamut:!0,white:{r:1,g:1,b:1},black:{r:0,g:0,b:0}},Me=pm;var to=(e=0)=>Math.pow(Math.abs(e),2.19921875)*Math.sign(e),mm=e=>{let n=to(e.r),t=to(e.g),r=to(e.b),i={mode:"xyz65",x:.5766690429101305*n+.1855582379065463*t+.1882286462349947*r,y:.297344975250536*n+.6273635662554661*t+.0752914584939979*r,z:.0270313613864123*n+.0706888525358272*t+.9913375368376386*r};return e.alpha!==void 0&&(i.alpha=e.alpha),i},ro=mm;var io=e=>Math.pow(Math.abs(e),.4547069271758437)*Math.sign(e),gm=({x:e,y:n,z:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i={mode:"a98",r:io(e*2.0415879038107465-n*.5650069742788597-.3447313507783297*t),g:io(e*-.9692436362808798+n*1.8759675015077206+.0415550574071756*t),b:io(e*.0134442806320312-n*.1183623922310184+1.0151749943912058*t)};return r!==void 0&&(i.alpha=r),i},oo=gm;var so=(e=0)=>{let n=Math.abs(e);return n<=.04045?e/12.92:(Math.sign(e)||1)*Math.pow((n+.055)/1.055,2.4)},hm=({r:e,g:n,b:t,alpha:r})=>{let i={mode:"lrgb",r:so(e),g:so(n),b:so(t)};return r!==void 0&&(i.alpha=r),i},Pe=hm;var ym=e=>{let{r:n,g:t,b:r,alpha:i}=Pe(e),o={mode:"xyz65",x:.4123907992659593*n+.357584339383878*t+.1804807884018343*r,y:.2126390058715102*n+.715168678767756*t+.0721923153607337*r,z:.0193308187155918*n+.119194779794626*t+.9505321522496607*r};return i!==void 0&&(o.alpha=i),o},Ae=ym;var ao=(e=0)=>{let n=Math.abs(e);return n>.0031308?(Math.sign(e)||1)*(1.055*Math.pow(n,.4166666666666667)-.055):e*12.92},Im=({r:e,g:n,b:t,alpha:r},i="rgb")=>{let o={mode:i,r:ao(e),g:ao(n),b:ao(t)};return r!==void 0&&(o.alpha=r),o},we=Im;var vm=({x:e,y:n,z:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=we({r:e*3.2409699419045226-n*1.537383177570094-.4986107602930034*t,g:e*-.9692436362808796+n*1.8759675015077204+.0415550574071756*t,b:e*.0556300796969936-n*.2039769588889765+1.0569715142428784*t});return r!==void 0&&(i.alpha=r),i},Ne=vm;var Tm={...Me,mode:"a98",parse:["a98-rgb"],serialize:"a98-rgb",fromMode:{rgb:e=>oo(Ae(e)),xyz65:oo},toMode:{rgb:e=>Ne(ro(e)),xyz65:ro}},Ya=Tm;var Sm=e=>(e=e%360)<0?e+360:e,J=Sm;var bm=(e,n)=>e.map((t,r,i)=>{if(t===void 0)return t;let o=J(t);return r===0||e[r-1]===void 0?o:n(o-J(i[r-1]))}).reduce((t,r)=>!t.length||r===void 0||t[t.length-1]===void 0?(t.push(r),t):(t.push(r+t[t.length-1]),t),[]),pe=e=>bm(e,n=>Math.abs(n)<=180?n:n-360*Math.sign(n));var ce=[-.14861,1.78277,-.29227,-.90649,1.97294,0],$a=Math.PI/180,qa=180/Math.PI;var Ja=ce[3]*ce[4],Za=ce[1]*ce[4],Qa=ce[1]*ce[2]-ce[0]*ce[3],Em=({r:e,g:n,b:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=(Qa*t+e*Ja-n*Za)/(Qa+Ja-Za),o=t-i,s=(ce[4]*(n-i)-ce[2]*o)/ce[3],a={mode:"cubehelix",l:i,s:i===0||i===1?void 0:Math.sqrt(o*o+s*s)/(ce[4]*i*(1-i))};return a.s&&(a.h=Math.atan2(s,o)*qa-120),r!==void 0&&(a.alpha=r),a},el=Em;var Am=({h:e,s:n,l:t,alpha:r})=>{let i={mode:"rgb"};e=(e===void 0?0:e+120)*$a,t===void 0&&(t=0);let o=n===void 0?0:n*t*(1-t),s=Math.cos(e),a=Math.sin(e);return i.r=t+o*(ce[0]*s+ce[1]*a),i.g=t+o*(ce[2]*s+ce[3]*a),i.b=t+o*(ce[4]*s+ce[5]*a),r!==void 0&&(i.alpha=r),i},nl=Am;var un=(e,n)=>{if(e.h===void 0||n.h===void 0||!e.s||!n.s)return 0;let t=J(e.h),r=J(n.h),i=Math.sin((r-t+360)/2*Math.PI/180);return 2*Math.sqrt(e.s*n.s)*i},lo=(e,n)=>{if(e.h===void 0||n.h===void 0)return 0;let t=J(e.h),r=J(n.h);return Math.abs(r-t)>180?t-(r-360*Math.sign(r-t)):r-t},cn=(e,n)=>{if(e.h===void 0||n.h===void 0||!e.c||!n.c)return 0;let t=J(e.h),r=J(n.h),i=Math.sin((r-t+360)/2*Math.PI/180);return 2*Math.sqrt(e.c*n.c)*i},Ot=(e="rgb",n=[1,1,1,0])=>{let t=ln(e),r=t.channels,i=t.difference,o=de(e);return(s,a)=>{let l=o(s),u=o(a);return Math.sqrt(r.reduce((c,f,d)=>{let p=i[f]?i[f](l,u):l[f]-u[f];return c+(n[d]||0)*Math.pow(isNaN(p)?0:p,2)},0))}};var me=e=>{let n=e.reduce((r,i)=>{if(i!==void 0){let o=i*Math.PI/180;r.sin+=Math.sin(o),r.cos+=Math.cos(o)}return r},{sin:0,cos:0}),t=Math.atan2(n.sin,n.cos)*180/Math.PI;return t<0?360+t:t};var Nm={mode:"cubehelix",channels:["h","s","l","alpha"],parse:["--cubehelix"],serialize:"--cubehelix",ranges:{h:[0,360],s:[0,4.614],l:[0,1]},fromMode:{rgb:el},toMode:{rgb:nl},interpolate:{h:{use:A,fixup:pe},s:A,l:A,alpha:{use:A,fixup:j}},difference:{h:un},average:{h:me}},tl=Nm;var Cm=({l:e,a:n,b:t,alpha:r},i="lch")=>{n===void 0&&(n=0),t===void 0&&(t=0);let o=Math.sqrt(n*n+t*t),s={mode:i,l:e,c:o};return o&&(s.h=J(Math.atan2(t,n)*180/Math.PI)),r!==void 0&&(s.alpha=r),s},Oe=Cm;var Om=({l:e,c:n,h:t,alpha:r},i="lab")=>{t===void 0&&(t=0);let o={mode:i,l:e,a:n?n*Math.cos(t/180*Math.PI):0,b:n?n*Math.sin(t/180*Math.PI):0};return r!==void 0&&(o.alpha=r),o},xe=Om;var Er=Math.pow(29,3)/Math.pow(3,3),Ar=Math.pow(6,3)/Math.pow(29,3);var ie={X:.9642956764295677,Y:1,Z:.8251046025104602},Tn={X:.3127/.329,Y:1,Z:(1-.3127-.329)/.329},x1=Math.pow(29,3)/Math.pow(3,3),D1=Math.pow(6,3)/Math.pow(29,3);var uo=e=>Math.pow(e,3)>Ar?Math.pow(e,3):(116*e-16)/Er,xm=({l:e,a:n,b:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=(e+16)/116,o=n/500+i,s=i-t/200,a={mode:"xyz65",x:uo(o)*Tn.X,y:uo(i)*Tn.Y,z:uo(s)*Tn.Z};return r!==void 0&&(a.alpha=r),a},Nr=xm;var Dm=e=>Ne(Nr(e)),Sn=Dm;var co=e=>e>Ar?Math.cbrt(e):(Er*e+16)/116,Rm=({x:e,y:n,z:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=co(e/Tn.X),o=co(n/Tn.Y),s=co(t/Tn.Z),a={mode:"lab65",l:116*o-16,a:500*(i-o),b:200*(o-s)};return r!==void 0&&(a.alpha=r),a},Cr=Rm;var Mm=e=>{let n=Cr(Ae(e));return e.r===e.b&&e.b===e.g&&(n.a=n.b=0),n},bn=Mm;var kn=.14444444444444443*Math.PI,Zn=Math.cos(kn),Qn=Math.sin(kn),Or=100/Math.log(139/100);var Pm=({l:e,c:n,h:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i={mode:"lab65",l:(Math.exp(e*1/Or)-1)/.0039},o=(Math.exp(.0435*n*1*1)-1)/.075,s=o*Math.cos(t/180*Math.PI-kn),a=o*Math.sin(t/180*Math.PI-kn);return i.a=s*Zn-a/.83*Qn,i.b=s*Qn+a/.83*Zn,r!==void 0&&(i.alpha=r),i},Dt=Pm;var wm=({l:e,a:n,b:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=n*Zn+t*Qn,o=.83*(t*Zn-n*Qn),s=Math.sqrt(i*i+o*o),a={mode:"dlch",l:Or/1*Math.log(1+.0039*e),c:Math.log(1+.075*s)/(.0435*1*1)};return a.c&&(a.h=J((Math.atan2(o,i)+kn)/Math.PI*180)),r!==void 0&&(a.alpha=r),a},Rt=wm;var rl=e=>Dt(Oe(e,"dlch")),il=e=>xe(Rt(e),"dlab"),km={mode:"dlab",parse:["--din99o-lab"],serialize:"--din99o-lab",toMode:{lab65:rl,rgb:e=>Sn(rl(e))},fromMode:{lab65:il,rgb:e=>il(bn(e))},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-40.09,45.501],b:[-40.469,44.344]},interpolate:{l:A,a:A,b:A,alpha:{use:A,fixup:j}}},ol=km;var Lm={mode:"dlch",parse:["--din99o-lch"],serialize:"--din99o-lch",toMode:{lab65:Dt,dlab:e=>xe(e,"dlab"),rgb:e=>Sn(Dt(e))},fromMode:{lab65:Rt,dlab:e=>Oe(e,"dlch"),rgb:e=>Rt(bn(e))},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,51.484],h:[0,360]},interpolate:{l:A,c:A,h:{use:A,fixup:pe},alpha:{use:A,fixup:j}},difference:{h:cn},average:{h:me}},sl=Lm;function po({h:e,s:n,i:t,alpha:r}){e=J(e!==void 0?e:0),n===void 0&&(n=0),t===void 0&&(t=0);let i=Math.abs(e/60%2-1),o;switch(Math.floor(e/60)){case 0:o={r:t*(1+n*(3/(2-i)-1)),g:t*(1+n*(3*(1-i)/(2-i)-1)),b:t*(1-n)};break;case 1:o={r:t*(1+n*(3*(1-i)/(2-i)-1)),g:t*(1+n*(3/(2-i)-1)),b:t*(1-n)};break;case 2:o={r:t*(1-n),g:t*(1+n*(3/(2-i)-1)),b:t*(1+n*(3*(1-i)/(2-i)-1))};break;case 3:o={r:t*(1-n),g:t*(1+n*(3*(1-i)/(2-i)-1)),b:t*(1+n*(3/(2-i)-1))};break;case 4:o={r:t*(1+n*(3*(1-i)/(2-i)-1)),g:t*(1-n),b:t*(1+n*(3/(2-i)-1))};break;case 5:o={r:t*(1+n*(3/(2-i)-1)),g:t*(1-n),b:t*(1+n*(3*(1-i)/(2-i)-1))};break;default:o={r:t*(1-n),g:t*(1-n),b:t*(1-n)}}return o.mode="rgb",r!==void 0&&(o.alpha=r),o}function mo({r:e,g:n,b:t,alpha:r}){e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=Math.max(e,n,t),o=Math.min(e,n,t),s={mode:"hsi",s:e+n+t===0?0:1-3*o/(e+n+t),i:(e+n+t)/3};return i-o!==0&&(s.h=(i===e?(n-t)/(i-o)+(n<t)*6:i===n?(t-e)/(i-o)+2:(e-n)/(i-o)+4)*60),r!==void 0&&(s.alpha=r),s}var _m={mode:"hsi",toMode:{rgb:po},parse:["--hsi"],serialize:"--hsi",fromMode:{rgb:mo},channels:["h","s","i","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:A,fixup:pe},s:A,i:A,alpha:{use:A,fixup:j}},difference:{h:un},average:{h:me}},al=_m;function go({h:e,s:n,l:t,alpha:r}){e=J(e!==void 0?e:0),n===void 0&&(n=0),t===void 0&&(t=0);let i=t+n*(t<.5?t:1-t),o=i-(i-t)*2*Math.abs(e/60%2-1),s;switch(Math.floor(e/60)){case 0:s={r:i,g:o,b:2*t-i};break;case 1:s={r:o,g:i,b:2*t-i};break;case 2:s={r:2*t-i,g:i,b:o};break;case 3:s={r:2*t-i,g:o,b:i};break;case 4:s={r:o,g:2*t-i,b:i};break;case 5:s={r:i,g:2*t-i,b:o};break;default:s={r:2*t-i,g:2*t-i,b:2*t-i}}return s.mode="rgb",r!==void 0&&(s.alpha=r),s}function ho({r:e,g:n,b:t,alpha:r}){e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=Math.max(e,n,t),o=Math.min(e,n,t),s={mode:"hsl",s:i===o?0:(i-o)/(1-Math.abs(i+o-1)),l:.5*(i+o)};return i-o!==0&&(s.h=(i===e?(n-t)/(i-o)+(n<t)*6:i===n?(t-e)/(i-o)+2:(e-n)/(i-o)+4)*60),r!==void 0&&(s.alpha=r),s}var Vm=(e,n)=>{switch(n){case"deg":return+e;case"rad":return e/Math.PI*180;case"grad":return e/10*9;case"turn":return e*360}},ll=Vm;var Fm=new RegExp(`^hsla?\\(\\s*${Ba}${vn}${wn}${vn}${wn}\\s*(?:,\\s*${At}\\s*)?\\)$`),Gm=e=>{let n=e.match(Fm);if(!n)return;let t={mode:"hsl"};return n[3]!==void 0?t.h=+n[3]:n[1]!==void 0&&n[2]!==void 0&&(t.h=ll(n[1],n[2])),n[4]!==void 0&&(t.s=Math.min(Math.max(0,n[4]/100),1)),n[5]!==void 0&&(t.l=Math.min(Math.max(0,n[5]/100),1)),n[6]!==void 0?t.alpha=Math.max(0,Math.min(1,n[6]/100)):n[7]!==void 0&&(t.alpha=Math.max(0,Math.min(1,+n[7]))),t},ul=Gm;function Bm(e,n){if(!n||n[0]!=="hsl"&&n[0]!=="hsla")return;let t={mode:"hsl"},[,r,i,o,s]=n;if(r.type!==b.None){if(r.type===b.Percentage)return;t.h=r.value}if(i.type!==b.None){if(i.type===b.Hue)return;t.s=i.value/100}if(o.type!==b.None){if(o.type===b.Hue)return;t.l=o.value/100}return s.type!==b.None&&(t.alpha=Math.min(1,Math.max(0,s.type===b.Number?s.value:s.value/100))),t}var cl=Bm;var Um={mode:"hsl",toMode:{rgb:go},fromMode:{rgb:ho},channels:["h","s","l","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[cl,ul],serialize:e=>`hsl(${e.h!==void 0?e.h:"none"} ${e.s!==void 0?e.s*100+"%":"none"} ${e.l!==void 0?e.l*100+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:A,fixup:pe},s:A,l:A,alpha:{use:A,fixup:j}},difference:{h:un},average:{h:me}},xr=Um;function Mt({h:e,s:n,v:t,alpha:r}){e=J(e!==void 0?e:0),n===void 0&&(n=0),t===void 0&&(t=0);let i=Math.abs(e/60%2-1),o;switch(Math.floor(e/60)){case 0:o={r:t,g:t*(1-n*i),b:t*(1-n)};break;case 1:o={r:t*(1-n*i),g:t,b:t*(1-n)};break;case 2:o={r:t*(1-n),g:t,b:t*(1-n*i)};break;case 3:o={r:t*(1-n),g:t*(1-n*i),b:t};break;case 4:o={r:t*(1-n*i),g:t*(1-n),b:t};break;case 5:o={r:t,g:t*(1-n),b:t*(1-n*i)};break;default:o={r:t*(1-n),g:t*(1-n),b:t*(1-n)}}return o.mode="rgb",r!==void 0&&(o.alpha=r),o}function Pt({r:e,g:n,b:t,alpha:r}){e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=Math.max(e,n,t),o=Math.min(e,n,t),s={mode:"hsv",s:i===0?0:1-o/i,v:i};return i-o!==0&&(s.h=(i===e?(n-t)/(i-o)+(n<t)*6:i===n?(t-e)/(i-o)+2:(e-n)/(i-o)+4)*60),r!==void 0&&(s.alpha=r),s}var zm={mode:"hsv",toMode:{rgb:Mt},parse:["--hsv"],serialize:"--hsv",fromMode:{rgb:Pt},channels:["h","s","v","alpha"],ranges:{h:[0,360]},gamut:"rgb",interpolate:{h:{use:A,fixup:pe},s:A,v:A,alpha:{use:A,fixup:j}},difference:{h:un},average:{h:me}},Dr=zm;function yo({h:e,w:n,b:t,alpha:r}){if(n===void 0&&(n=0),t===void 0&&(t=0),n+t>1){let i=n+t;n/=i,t/=i}return Mt({h:e,s:t===1?1:1-n/(1-t),v:1-t,alpha:r})}function Io(e){let n=Pt(e);if(n===void 0)return;let t=n.s!==void 0?n.s:0,r=n.v!==void 0?n.v:0,i={mode:"hwb",w:(1-t)*r,b:1-r};return n.h!==void 0&&(i.h=n.h),n.alpha!==void 0&&(i.alpha=n.alpha),i}function Hm(e,n){if(!n||n[0]!=="hwb")return;let t={mode:"hwb"},[,r,i,o,s]=n;if(r.type!==b.None){if(r.type===b.Percentage)return;t.h=r.value}if(i.type!==b.None){if(i.type===b.Hue)return;t.w=i.value/100}if(o.type!==b.None){if(o.type===b.Hue)return;t.b=o.value/100}return s.type!==b.None&&(t.alpha=Math.min(1,Math.max(0,s.type===b.Number?s.value:s.value/100))),t}var fl=Hm;var Wm={mode:"hwb",toMode:{rgb:yo},fromMode:{rgb:Io},channels:["h","w","b","alpha"],ranges:{h:[0,360]},gamut:"rgb",parse:[fl],serialize:e=>`hwb(${e.h!==void 0?e.h:"none"} ${e.w!==void 0?e.w*100+"%":"none"} ${e.b!==void 0?e.b*100+"%":"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:A,fixup:pe},w:A,b:A,alpha:{use:A,fixup:j}},difference:{h:lo},average:{h:me}},dl=Wm;var et=.1593017578125,pl=78.84375,nt=.8359375,tt=18.8515625,rt=18.6875;function Rr(e){if(e<0)return 0;let n=Math.pow(e,1/pl);return 1e4*Math.pow(Math.max(0,n-nt)/(tt-rt*n),1/et)}function Mr(e){if(e<0)return 0;let n=Math.pow(e/1e4,et);return Math.pow((nt+tt*n)/(1+rt*n),pl)}var vo=e=>Math.max(e/203,0),jm=({i:e,t:n,p:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=Rr(e+.008609037037932761*n+.11102962500302593*t),o=Rr(e-.00860903703793275*n-.11102962500302599*t),s=Rr(e+.5600313357106791*n-.32062717498731885*t),a={mode:"xyz65",x:vo(2.070152218389422*i-1.3263473389671556*o+.2066510476294051*s),y:vo(.3647385209748074*i+.680566024947227*o-.0453045459220346*s),z:vo(-.049747207535812*i-.0492609666966138*o+1.1880659249923042*s)};return r!==void 0&&(a.alpha=r),a},To=jm;var So=(e=0)=>Math.max(e*203,0),Km=({x:e,y:n,z:t,alpha:r})=>{let i=So(e),o=So(n),s=So(t),a=Mr(.3592832590121217*i+.6976051147779502*o-.0358915932320289*s),l=Mr(-.1920808463704995*i+1.1004767970374323*o+.0753748658519118*s),u=Mr(.0070797844607477*i+.0748396662186366*o+.8433265453898765*s),c=.5*a+.5*l,f=1.61376953125*a-3.323486328125*l+1.709716796875*u,d=4.378173828125*a-4.24560546875*l-.132568359375*u,p={mode:"itp",i:c,t:f,p:d};return r!==void 0&&(p.alpha=r),p},bo=Km;var Ym={mode:"itp",channels:["i","t","p","alpha"],parse:["--ictcp"],serialize:"--ictcp",toMode:{xyz65:To,rgb:e=>Ne(To(e))},fromMode:{xyz65:bo,rgb:e=>bo(Ae(e))},ranges:{i:[0,.581],t:[-.369,.272],p:[-.164,.331]},interpolate:{i:A,t:A,p:A,alpha:{use:A,fixup:j}}},ml=Ym;var $m=134.03437499999998,qm=16295499532821565e-27,Eo=e=>{if(e<0)return 0;let n=Math.pow(e/1e4,et);return Math.pow((nt+tt*n)/(1+rt*n),$m)},Ao=(e=0)=>Math.max(e*203,0),Jm=({x:e,y:n,z:t,alpha:r})=>{e=Ao(e),n=Ao(n),t=Ao(t);let i=1.15*e-.15*t,o=.66*n+.34*e,s=Eo(.41478972*i+.579999*o+.014648*t),a=Eo(-.20151*i+1.120649*o+.0531008*t),l=Eo(-.0166008*i+.2648*o+.6684799*t),u=(s+a)/2,c={mode:"jab",j:.44*u/(1-.56*u)-qm,a:3.524*s-4.066708*a+.542708*l,b:.199076*s+1.096799*a-1.295875*l};return r!==void 0&&(c.alpha=r),c},Pr=Jm;var Zm=134.03437499999998,gl=16295499532821565e-27,No=e=>{if(e<0)return 0;let n=Math.pow(e,1/Zm);return 1e4*Math.pow((nt-n)/(rt*n-tt),1/et)},Co=e=>e/203,Qm=({j:e,a:n,b:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=(e+gl)/(.44+.56*(e+gl)),o=No(i+.13860504*n+.058047316*t),s=No(i-.13860504*n-.058047316*t),a=No(i-.096019242*n-.8118919*t),l={mode:"xyz65",x:Co(1.661373024652174*o-.914523081304348*s+.23136208173913045*a),y:Co(-.3250758611844533*o+1.571847026732543*s-.21825383453227928*a),z:Co(-.090982811*o-.31272829*s+1.5227666*a)};return r!==void 0&&(l.alpha=r),l},wr=Qm;var eg=e=>{let n=Pr(Ae(e));return e.r===e.b&&e.b===e.g&&(n.a=n.b=0),n},kr=eg;var ng=e=>Ne(wr(e)),Lr=ng;var tg={mode:"jab",channels:["j","a","b","alpha"],parse:["--jzazbz"],serialize:"--jzazbz",fromMode:{rgb:kr,xyz65:Pr},toMode:{rgb:Lr,xyz65:wr},ranges:{j:[0,.222],a:[-.109,.129],b:[-.185,.134]},interpolate:{j:A,a:A,b:A,alpha:{use:A,fixup:j}}},hl=tg;var rg=({j:e,a:n,b:t,alpha:r})=>{n===void 0&&(n=0),t===void 0&&(t=0);let i=Math.sqrt(n*n+t*t),o={mode:"jch",j:e,c:i};return i&&(o.h=J(Math.atan2(t,n)*180/Math.PI)),r!==void 0&&(o.alpha=r),o},Oo=rg;var ig=({j:e,c:n,h:t,alpha:r})=>{t===void 0&&(t=0);let i={mode:"jab",j:e,a:n?n*Math.cos(t/180*Math.PI):0,b:n?n*Math.sin(t/180*Math.PI):0};return r!==void 0&&(i.alpha=r),i},xo=ig;var og={mode:"jch",parse:["--jzczhz"],serialize:"--jzczhz",toMode:{jab:xo,rgb:e=>Lr(xo(e))},fromMode:{rgb:e=>Oo(kr(e)),jab:Oo},channels:["j","c","h","alpha"],ranges:{j:[0,.221],c:[0,.19],h:[0,360]},interpolate:{h:{use:A,fixup:pe},c:A,j:A,alpha:{use:A,fixup:j}},difference:{h:cn},average:{h:me}},yl=og;var En=Math.pow(29,3)/Math.pow(3,3),it=Math.pow(6,3)/Math.pow(29,3);var Do=e=>Math.pow(e,3)>it?Math.pow(e,3):(116*e-16)/En,sg=({l:e,a:n,b:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=(e+16)/116,o=n/500+i,s=i-t/200,a={mode:"xyz50",x:Do(o)*ie.X,y:Do(i)*ie.Y,z:Do(s)*ie.Z};return r!==void 0&&(a.alpha=r),a},ot=sg;var ag=({x:e,y:n,z:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=we({r:e*3.1341359569958707-n*1.6173863321612538-.4906619460083532*t,g:e*-.978795502912089+n*1.916254567259524+.03344273116131949*t,b:e*.07195537988411677-n*.2289768264158322+1.405386058324125*t});return r!==void 0&&(i.alpha=r),i},Ke=ag;var lg=e=>Ke(ot(e)),_r=lg;var ug=e=>{let{r:n,g:t,b:r,alpha:i}=Pe(e),o={mode:"xyz50",x:.436065742824811*n+.3851514688337912*t+.14307845442264197*r,y:.22249319175623702*n+.7168870538238823*t+.06061979053616537*r,z:.013923904500943465*n+.09708128566574634*t+.7140993584005155*r};return i!==void 0&&(o.alpha=i),o},Ye=ug;var Ro=e=>e>it?Math.cbrt(e):(En*e+16)/116,cg=({x:e,y:n,z:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=Ro(e/ie.X),o=Ro(n/ie.Y),s=Ro(t/ie.Z),a={mode:"lab",l:116*o-16,a:500*(i-o),b:200*(o-s)};return r!==void 0&&(a.alpha=r),a},st=cg;var fg=e=>{let n=st(Ye(e));return e.r===e.b&&e.b===e.g&&(n.a=n.b=0),n},Vr=fg;function dg(e,n){if(!n||n[0]!=="lab")return;let t={mode:"lab"},[,r,i,o,s]=n;if(!(r.type===b.Hue||i.type===b.Hue||o.type===b.Hue))return r.type!==b.None&&(t.l=Math.min(Math.max(0,r.value),100)),i.type!==b.None&&(t.a=i.type===b.Number?i.value:i.value*125/100),o.type!==b.None&&(t.b=o.type===b.Number?o.value:o.value*125/100),s.type!==b.None&&(t.alpha=Math.min(1,Math.max(0,s.type===b.Number?s.value:s.value/100))),t}var Il=dg;var pg={mode:"lab",toMode:{xyz50:ot,rgb:_r},fromMode:{xyz50:st,rgb:Vr},channels:["l","a","b","alpha"],ranges:{l:[0,100],a:[-125,125],b:[-125,125]},parse:[Il],serialize:e=>`lab(${e.l!==void 0?e.l:"none"} ${e.a!==void 0?e.a:"none"} ${e.b!==void 0?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{l:A,a:A,b:A,alpha:{use:A,fixup:j}}},at=pg;var mg={...at,mode:"lab65",parse:["--lab-d65"],serialize:"--lab-d65",toMode:{xyz65:Nr,rgb:Sn},fromMode:{xyz65:Cr,rgb:bn},ranges:{l:[0,100],a:[-125,125],b:[-125,125]}},vl=mg;function gg(e,n){if(!n||n[0]!=="lch")return;let t={mode:"lch"},[,r,i,o,s]=n;if(r.type!==b.None){if(r.type===b.Hue)return;t.l=Math.min(Math.max(0,r.value),100)}if(i.type!==b.None&&(t.c=Math.max(0,i.type===b.Number?i.value:i.value*150/100)),o.type!==b.None){if(o.type===b.Percentage)return;t.h=o.value}return s.type!==b.None&&(t.alpha=Math.min(1,Math.max(0,s.type===b.Number?s.value:s.value/100))),t}var Tl=gg;var hg={mode:"lch",toMode:{lab:xe,rgb:e=>_r(xe(e))},fromMode:{rgb:e=>Oe(Vr(e)),lab:Oe},channels:["l","c","h","alpha"],ranges:{l:[0,100],c:[0,150],h:[0,360]},parse:[Tl],serialize:e=>`lch(${e.l!==void 0?e.l:"none"} ${e.c!==void 0?e.c:"none"} ${e.h!==void 0?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,interpolate:{h:{use:A,fixup:pe},c:A,l:A,alpha:{use:A,fixup:j}},difference:{h:cn},average:{h:me}},lt=hg;var yg={...lt,mode:"lch65",parse:["--lch-d65"],serialize:"--lch-d65",toMode:{lab65:e=>xe(e,"lab65"),rgb:e=>Sn(xe(e,"lab65"))},fromMode:{rgb:e=>Oe(bn(e),"lch65"),lab65:e=>Oe(e,"lch65")},ranges:{l:[0,100],c:[0,150],h:[0,360]}},Sl=yg;var Ig=({l:e,u:n,v:t,alpha:r})=>{n===void 0&&(n=0),t===void 0&&(t=0);let i=Math.sqrt(n*n+t*t),o={mode:"lchuv",l:e,c:i};return i&&(o.h=J(Math.atan2(t,n)*180/Math.PI)),r!==void 0&&(o.alpha=r),o},Mo=Ig;var vg=({l:e,c:n,h:t,alpha:r})=>{t===void 0&&(t=0);let i={mode:"luv",l:e,u:n?n*Math.cos(t/180*Math.PI):0,v:n?n*Math.sin(t/180*Math.PI):0};return r!==void 0&&(i.alpha=r),i},Po=vg;var bl=(e,n,t)=>4*e/(e+15*n+3*t),El=(e,n,t)=>9*n/(e+15*n+3*t),Tg=bl(ie.X,ie.Y,ie.Z),Sg=El(ie.X,ie.Y,ie.Z),bg=e=>e<=it?En*e:116*Math.cbrt(e)-16,Eg=({x:e,y:n,z:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=bg(n/ie.Y),o=bl(e,n,t),s=El(e,n,t);!isFinite(o)||!isFinite(s)?i=o=s=0:(o=13*i*(o-Tg),s=13*i*(s-Sg));let a={mode:"luv",l:i,u:o,v:s};return r!==void 0&&(a.alpha=r),a},wt=Eg;var Ag=(e,n,t)=>4*e/(e+15*n+3*t),Ng=(e,n,t)=>9*n/(e+15*n+3*t),Cg=Ag(ie.X,ie.Y,ie.Z),Og=Ng(ie.X,ie.Y,ie.Z),xg=({l:e,u:n,v:t,alpha:r})=>{if(e===void 0&&(e=0),e===0)return{mode:"xyz50",x:0,y:0,z:0};n===void 0&&(n=0),t===void 0&&(t=0);let i=n/(13*e)+Cg,o=t/(13*e)+Og,s=ie.Y*(e<=8?e/En:Math.pow((e+16)/116,3)),a=s*(9*i)/(4*o),l=s*(12-3*i-20*o)/(4*o),u={mode:"xyz50",x:a,y:s,z:l};return r!==void 0&&(u.alpha=r),u},kt=xg;var Dg=e=>Mo(wt(Ye(e))),Rg=e=>Ke(kt(Po(e))),Mg={mode:"lchuv",toMode:{luv:Po,rgb:Rg},fromMode:{rgb:Dg,luv:Mo},channels:["l","c","h","alpha"],parse:["--lchuv"],serialize:"--lchuv",ranges:{l:[0,100],c:[0,176.956],h:[0,360]},interpolate:{h:{use:A,fixup:pe},c:A,l:A,alpha:{use:A,fixup:j}},difference:{h:cn},average:{h:me}},Al=Mg;var Pg={...Me,mode:"lrgb",toMode:{rgb:we},fromMode:{rgb:Pe},parse:["srgb-linear"],serialize:"srgb-linear"},Nl=Pg;var wg={mode:"luv",toMode:{xyz50:kt,rgb:e=>Ke(kt(e))},fromMode:{xyz50:wt,rgb:e=>wt(Ye(e))},channels:["l","u","v","alpha"],parse:["--luv"],serialize:"--luv",ranges:{l:[0,100],u:[-84.936,175.042],v:[-125.882,87.243]},interpolate:{l:A,u:A,v:A,alpha:{use:A,fixup:j}}},Cl=wg;var kg=({r:e,g:n,b:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=Math.cbrt(.412221469470763*e+.5363325372617348*n+.0514459932675022*t),o=Math.cbrt(.2119034958178252*e+.6806995506452344*n+.1073969535369406*t),s=Math.cbrt(.0883024591900564*e+.2817188391361215*n+.6299787016738222*t),a={mode:"oklab",l:.210454268309314*i+.7936177747023054*o-.0040720430116193*s,a:1.9779985324311684*i-2.42859224204858*o+.450593709617411*s,b:.0259040424655478*i+.7827717124575296*o-.8086757549230774*s};return r!==void 0&&(a.alpha=r),a},Fr=kg;var Lg=e=>{let n=Fr(Pe(e));return e.r===e.b&&e.b===e.g&&(n.a=n.b=0),n},An=Lg;var _g=({l:e,a:n,b:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=Math.pow(e+.3963377773761749*n+.2158037573099136*t,3),o=Math.pow(e-.1055613458156586*n-.0638541728258133*t,3),s=Math.pow(e-.0894841775298119*n-1.2914855480194092*t,3),a={mode:"lrgb",r:4.076741636075957*i-3.3077115392580616*o+.2309699031821044*s,g:-1.2684379732850317*i+2.6097573492876887*o-.3413193760026573*s,b:-.0041960761386756*i-.7034186179359362*o+1.7076146940746117*s};return r!==void 0&&(a.alpha=r),a},$e=_g;var Vg=e=>we($e(e)),Nn=Vg;function Lt(e){let r=1.170873786407767;return .5*(r*e-.206+Math.sqrt((r*e-.206)*(r*e-.206)+4*.03*r*e))}function Ln(e){return(e*e+.206*e)/(1.170873786407767*(e+.03))}function Fg(e,n){let t,r,i,o,s,a,l,u;-1.88170328*e-.80936493*n>1?(t=1.19086277,r=1.76576728,i=.59662641,o=.75515197,s=.56771245,a=4.0767416621,l=-3.3077115913,u=.2309699292):1.81444104*e-1.19445276*n>1?(t=.73956515,r=-.45954404,i=.08285427,o=.1254107,s=.14503204,a=-1.2684380046,l=2.6097574011,u=-.3413193965):(t=1.35733652,r=-.00915799,i=-1.1513021,o=-.50559606,s=.00692167,a=-.0041960863,l=-.7034186147,u=1.707614701);let c=t+r*e+i*n+o*e*e+s*e*n,f=.3963377774*e+.2158037573*n,d=-.1055613458*e-.0638541728*n,p=-.0894841775*e-1.291485548*n;{let g=1+c*f,m=1+c*d,h=1+c*p,T=g*g*g,y=m*m*m,C=h*h*h,L=3*f*g*g,M=3*d*m*m,S=3*p*h*h,x=6*f*f*g,D=6*d*d*m,P=6*p*p*h,B=a*T+l*y+u*C,H=a*L+l*M+u*S,K=a*x+l*D+u*P;c=c-B*H/(H*H-.5*B*K)}return c}function wo(e,n){let t=Fg(e,n),r=$e({l:1,a:t*e,b:t*n}),i=Math.cbrt(1/Math.max(r.r,r.g,r.b)),o=i*t;return[i,o]}function Gg(e,n,t,r,i,o=null){o||(o=wo(e,n));let s;if((t-i)*o[1]-(o[0]-i)*r<=0)s=o[1]*i/(r*o[0]+o[1]*(i-t));else{s=o[1]*(i-1)/(r*(o[0]-1)+o[1]*(i-t));{let a=t-i,l=r,u=.3963377774*e+.2158037573*n,c=-.1055613458*e-.0638541728*n,f=-.0894841775*e-1.291485548*n,d=a+l*u,p=a+l*c,g=a+l*f;{let m=i*(1-s)+s*t,h=s*r,T=m+h*u,y=m+h*c,C=m+h*f,L=T*T*T,M=y*y*y,S=C*C*C,x=3*d*T*T,D=3*p*y*y,P=3*g*C*C,B=6*d*d*T,H=6*p*p*y,K=6*g*g*C,v=4.0767416621*L-3.3077115913*M+.2309699292*S-1,E=4.0767416621*x-3.3077115913*D+.2309699292*P,I=4.0767416621*B-3.3077115913*H+.2309699292*K,N=E/(E*E-.5*v*I),w=-v*N,O=-1.2684380046*L+2.6097574011*M-.3413193965*S-1,R=-1.2684380046*x+2.6097574011*D-.3413193965*P,W=-1.2684380046*B+2.6097574011*H-.3413193965*K,z=R/(R*R-.5*O*W),U=-O*z,G=-.0041960863*L-.7034186147*M+1.707614701*S-1,X=-.0041960863*x-.7034186147*D+1.707614701*P,_=-.0041960863*B-.7034186147*H+1.707614701*K,Q=X/(X*X-.5*G*_),ne=-G*Q;w=N>=0?w:1e6,U=z>=0?U:1e6,ne=Q>=0?ne:1e6,s+=Math.min(w,Math.min(U,ne))}}}return s}function _t(e,n,t=null){t||(t=wo(e,n));let r=t[0],i=t[1];return[i/r,i/(1-r)]}function Gr(e,n,t){let r=wo(n,t),i=Gg(n,t,e,1,e,r),o=_t(n,t,r),s=.11516993+1/(7.4477897+4.1590124*t+n*(-2.19557347+1.75198401*t+n*(-2.13704948-10.02301043*t+n*(-4.24894561+5.38770819*t+4.69891013*n)))),a=.11239642+1/(1.6132032-.68124379*t+n*(.40370612+.90148123*t+n*(-.27087943+.6122399*t+n*(.00299215-.45399568*t-.14661872*n)))),l=i/Math.min(e*o[0],(1-e)*o[1]),u=e*s,c=(1-e)*a,f=.9*l*Math.sqrt(Math.sqrt(1/(1/(u*u*u*u)+1/(c*c*c*c))));return u=e*.4,c=(1-e)*.8,[Math.sqrt(1/(1/(u*u)+1/(c*c))),f,i]}function Br(e){let n=e.l!==void 0?e.l:0,t=e.a!==void 0?e.a:0,r=e.b!==void 0?e.b:0,i={mode:"okhsl",l:Lt(n)};e.alpha!==void 0&&(i.alpha=e.alpha);let o=Math.sqrt(t*t+r*r);if(!o)return i.s=0,i;let[s,a,l]=Gr(n,t/o,r/o),u;if(o<a){let c=0,f=.8*s,d=1-f/a;u=(o-c)/(f+d*(o-c))*.8}else{let c=a,f=.2*a*a*1.25*1.25/s,d=1-f/(l-a);u=.8+.2*((o-c)/(f+d*(o-c)))}return u&&(i.s=u,i.h=J(Math.atan2(r,t)*180/Math.PI)),i}function Ur(e){let n=e.h!==void 0?e.h:0,t=e.s!==void 0?e.s:0,r=e.l!==void 0?e.l:0,i={mode:"oklab",l:Ln(r)};if(e.alpha!==void 0&&(i.alpha=e.alpha),!t||r===1)return i.a=i.b=0,i;let o=Math.cos(n/180*Math.PI),s=Math.sin(n/180*Math.PI),[a,l,u]=Gr(i.l,o,s),c,f,d,p;t<.8?(c=1.25*t,f=0,d=.8*a,p=1-d/l):(c=5*(t-.8),f=l,d=.2*l*l*1.25*1.25/a,p=1-d/(u-l));let g=f+c*d/(1-p*c);return i.a=g*o,i.b=g*s,i}var Bg={...xr,mode:"okhsl",channels:["h","s","l","alpha"],parse:["--okhsl"],serialize:"--okhsl",fromMode:{oklab:Br,rgb:e=>Br(An(e))},toMode:{oklab:Ur,rgb:e=>Nn(Ur(e))}},Ol=Bg;function zr(e){let n=e.l!==void 0?e.l:0,t=e.a!==void 0?e.a:0,r=e.b!==void 0?e.b:0,i=Math.sqrt(t*t+r*r),o=i?t/i:1,s=i?r/i:1,[a,l]=_t(o,s),u=.5,c=1-u/a,f=l/(i+n*l),d=f*n,p=f*i,g=Ln(d),m=p*g/d,h=$e({l:g,a:o*m,b:s*m}),T=Math.cbrt(1/Math.max(h.r,h.g,h.b,0));n=n/T,i=i/T*Lt(n)/n,n=Lt(n);let y={mode:"okhsv",s:i?(u+l)*p/(l*u+l*c*p):0,v:n?n/d:0};return y.s&&(y.h=J(Math.atan2(r,t)*180/Math.PI)),e.alpha!==void 0&&(y.alpha=e.alpha),y}function Hr(e){let n={mode:"oklab"};e.alpha!==void 0&&(n.alpha=e.alpha);let t=e.h!==void 0?e.h:0,r=e.s!==void 0?e.s:0,i=e.v!==void 0?e.v:0,o=Math.cos(t/180*Math.PI),s=Math.sin(t/180*Math.PI),[a,l]=_t(o,s),u=.5,c=1-u/a,f=1-r*u/(u+l-l*c*r),d=r*l*u/(u+l-l*c*r),p=Ln(f),g=d*p/f,m=$e({l:p,a:o*g,b:s*g}),h=Math.cbrt(1/Math.max(m.r,m.g,m.b,0)),T=Ln(i*f),y=d*T/f;return n.l=T*h,n.a=y*o*h,n.b=y*s*h,n}var Ug={...Dr,mode:"okhsv",channels:["h","s","v","alpha"],parse:["--okhsv"],serialize:"--okhsv",fromMode:{oklab:zr,rgb:e=>zr(An(e))},toMode:{oklab:Hr,rgb:e=>Nn(Hr(e))}},xl=Ug;function zg(e,n){if(!n||n[0]!=="oklab")return;let t={mode:"oklab"},[,r,i,o,s]=n;if(!(r.type===b.Hue||i.type===b.Hue||o.type===b.Hue))return r.type!==b.None&&(t.l=Math.min(Math.max(0,r.type===b.Number?r.value:r.value/100),1)),i.type!==b.None&&(t.a=i.type===b.Number?i.value:i.value*.4/100),o.type!==b.None&&(t.b=o.type===b.Number?o.value:o.value*.4/100),s.type!==b.None&&(t.alpha=Math.min(1,Math.max(0,s.type===b.Number?s.value:s.value/100))),t}var Dl=zg;var Hg={...at,mode:"oklab",toMode:{lrgb:$e,rgb:Nn},fromMode:{lrgb:Fr,rgb:An},ranges:{l:[0,1],a:[-.4,.4],b:[-.4,.4]},parse:[Dl],serialize:e=>`oklab(${e.l!==void 0?e.l:"none"} ${e.a!==void 0?e.a:"none"} ${e.b!==void 0?e.b:"none"}${e.alpha<1?` / ${e.alpha}`:""})`},Rl=Hg;function Wg(e,n){if(!n||n[0]!=="oklch")return;let t={mode:"oklch"},[,r,i,o,s]=n;if(r.type!==b.None){if(r.type===b.Hue)return;t.l=Math.min(Math.max(0,r.type===b.Number?r.value:r.value/100),1)}if(i.type!==b.None&&(t.c=Math.max(0,i.type===b.Number?i.value:i.value*.4/100)),o.type!==b.None){if(o.type===b.Percentage)return;t.h=o.value}return s.type!==b.None&&(t.alpha=Math.min(1,Math.max(0,s.type===b.Number?s.value:s.value/100))),t}var Ml=Wg;var Xg={...lt,mode:"oklch",toMode:{oklab:e=>xe(e,"oklab"),rgb:e=>Nn(xe(e,"oklab"))},fromMode:{rgb:e=>Oe(An(e),"oklch"),oklab:e=>Oe(e,"oklch")},parse:[Ml],serialize:e=>`oklch(${e.l!==void 0?e.l:"none"} ${e.c!==void 0?e.c:"none"} ${e.h!==void 0?e.h:"none"}${e.alpha<1?` / ${e.alpha}`:""})`,ranges:{l:[0,1],c:[0,.4],h:[0,360]}},Pl=Xg;var jg=e=>{let{r:n,g:t,b:r,alpha:i}=Pe(e),o={mode:"xyz65",x:.486570948648216*n+.265667693169093*t+.1982172852343625*r,y:.2289745640697487*n+.6917385218365062*t+.079286914093745*r,z:0*n+.0451133818589026*t+1.043944368900976*r};return i!==void 0&&(o.alpha=i),o},ko=jg;var Kg=({x:e,y:n,z:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=we({r:e*2.4934969119414263-n*.9313836179191242-.402710784450717*t,g:e*-.8294889695615749+n*1.7626640603183465+.0236246858419436*t,b:e*.0358458302437845-n*.0761723892680418+.9568845240076871*t},"p3");return r!==void 0&&(i.alpha=r),i},Lo=Kg;var Yg={...Me,mode:"p3",parse:["display-p3"],serialize:"display-p3",fromMode:{rgb:e=>Lo(Ae(e)),xyz65:Lo},toMode:{rgb:e=>Ne(ko(e)),xyz65:ko}},wl=Yg;var _o=e=>{let n=Math.abs(e);return n>=.001953125?Math.sign(e)*Math.pow(n,.5555555555555556):16*e},$g=({x:e,y:n,z:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i={mode:"prophoto",r:_o(e*1.3457868816471585-n*.2555720873797946-.0511018649755453*t),g:_o(e*-.5446307051249019+n*1.5082477428451466+.0205274474364214*t),b:_o(e*0+n*0+1.2119675456389452*t)};return r!==void 0&&(i.alpha=r),i},Vo=$g;var Fo=(e=0)=>{let n=Math.abs(e);return n>=.03125?Math.sign(e)*Math.pow(n,1.8):e/16},qg=e=>{let n=Fo(e.r),t=Fo(e.g),r=Fo(e.b),i={mode:"xyz50",x:.7977666449006423*n+.1351812974005331*t+.0313477341283922*r,y:.2880748288194013*n+.7118352342418731*t+899369387256e-16*r,z:0*n+0*t+.8251046025104602*r};return e.alpha!==void 0&&(i.alpha=e.alpha),i},Go=qg;var Jg={...Me,mode:"prophoto",parse:["prophoto-rgb"],serialize:"prophoto-rgb",fromMode:{xyz50:Vo,rgb:e=>Vo(Ye(e))},toMode:{xyz50:Go,rgb:e=>Ke(Go(e))}},kl=Jg;var Ll=1.09929682680944,Zg=.018053968510807,Bo=e=>{let n=Math.abs(e);return n>Zg?(Math.sign(e)||1)*(Ll*Math.pow(n,.45)-(Ll-1)):4.5*e},Qg=({x:e,y:n,z:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i={mode:"rec2020",r:Bo(e*1.7166511879712683-n*.3556707837763925-.2533662813736599*t),g:Bo(e*-.6666843518324893+n*1.6164812366349395+.0157685458139111*t),b:Bo(e*.0176398574453108-n*.0427706132578085+.9421031212354739*t)};return r!==void 0&&(i.alpha=r),i},Uo=Qg;var _l=1.09929682680944,eh=.018053968510807,zo=(e=0)=>{let n=Math.abs(e);return n<eh*4.5?e/4.5:(Math.sign(e)||1)*Math.pow((n+_l-1)/_l,1/.45)},nh=e=>{let n=zo(e.r),t=zo(e.g),r=zo(e.b),i={mode:"xyz65",x:.6369580483012911*n+.1446169035862083*t+.1688809751641721*r,y:.262700212011267*n+.6779980715188708*t+.059301716469862*r,z:0*n+.0280726930490874*t+1.0609850577107909*r};return e.alpha!==void 0&&(i.alpha=e.alpha),i},Ho=nh;var th={...Me,mode:"rec2020",fromMode:{xyz65:Uo,rgb:e=>Uo(Ae(e))},toMode:{xyz65:Ho,rgb:e=>Ne(Ho(e))},parse:["rec2020"],serialize:"rec2020"},Vl=th;var fn=.0037930732552754493,Wr=Math.cbrt(fn);var Wo=e=>Math.cbrt(e)-Wr,rh=e=>{let{r:n,g:t,b:r,alpha:i}=Pe(e),o=Wo(.3*n+.622*t+.078*r+fn),s=Wo(.23*n+.692*t+.078*r+fn),a=Wo(.2434226892454782*n+.2047674442449682*t+.5518098665095535*r+fn),l={mode:"xyb",x:(o-s)/2,y:(o+s)/2,b:a-(o+s)/2};return i!==void 0&&(l.alpha=i),l},Fl=rh;var Xo=e=>Math.pow(e+Wr,3),ih=({x:e,y:n,b:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i=Xo(e+n)-fn,o=Xo(n-e)-fn,s=Xo(t+n)-fn,a=we({r:11.031566904639861*i-9.866943908131562*o-.16462299650829934*s,g:-3.2541473810744237*i+4.418770377582723*o-.16462299650829934*s,b:-3.6588512867136815*i+2.7129230459360922*o+1.9459282407775895*s});return r!==void 0&&(a.alpha=r),a},Gl=ih;var oh={mode:"xyb",channels:["x","y","b","alpha"],parse:["--xyb"],serialize:"--xyb",toMode:{rgb:Gl},fromMode:{rgb:Fl},ranges:{x:[-.0154,.0281],y:[0,.8453],b:[-.2778,.388]},interpolate:{x:A,y:A,b:A,alpha:{use:A,fixup:j}}},Bl=oh;var sh={mode:"xyz50",parse:["xyz-d50"],serialize:"xyz-d50",toMode:{rgb:Ke,lab:st},fromMode:{rgb:Ye,lab:ot},channels:["x","y","z","alpha"],ranges:{x:[0,.964],y:[0,.999],z:[0,.825]},interpolate:{x:A,y:A,z:A,alpha:{use:A,fixup:j}}},Ul=sh;var ah=e=>{let{x:n,y:t,z:r,alpha:i}=e;n===void 0&&(n=0),t===void 0&&(t=0),r===void 0&&(r=0);let o={mode:"xyz50",x:1.0479298208405488*n+.0229467933410191*t-.0501922295431356*r,y:.0296278156881593*n+.990434484573249*t-.0170738250293851*r,z:-.0092430581525912*n+.0150551448965779*t+.7518742899580008*r};return i!==void 0&&(o.alpha=i),o},zl=ah;var lh=e=>{let{x:n,y:t,z:r,alpha:i}=e;n===void 0&&(n=0),t===void 0&&(t=0),r===void 0&&(r=0);let o={mode:"xyz65",x:.9554734527042182*n-.0230985368742614*t+.0632593086610217*r,y:-.0283697069632081*n+1.0099954580058226*t+.021041398966943*r,z:.0123140016883199*n-.0205076964334779*t+1.3303659366080753*r};return i!==void 0&&(o.alpha=i),o},Hl=lh;var uh={mode:"xyz65",toMode:{rgb:Ne,xyz50:zl},fromMode:{rgb:Ae,xyz50:Hl},ranges:{x:[0,.95],y:[0,1],z:[0,1.088]},channels:["x","y","z","alpha"],parse:["xyz","xyz-d65"],serialize:"xyz-d65",interpolate:{x:A,y:A,z:A,alpha:{use:A,fixup:j}}},Wl=uh;var ch=({r:e,g:n,b:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i={mode:"yiq",y:.29889531*e+.58662247*n+.11448223*t,i:.59597799*e-.2741761*n-.32180189*t,q:.21147017*e-.52261711*n+.31114694*t};return r!==void 0&&(i.alpha=r),i},Xl=ch;var fh=({y:e,i:n,q:t,alpha:r})=>{e===void 0&&(e=0),n===void 0&&(n=0),t===void 0&&(t=0);let i={mode:"rgb",r:e+.95608445*n+.6208885*t,g:e-.27137664*n-.6486059*t,b:e-1.10561724*n+1.70250126*t};return r!==void 0&&(i.alpha=r),i},jl=fh;var dh={mode:"yiq",toMode:{rgb:jl},fromMode:{rgb:Xl},channels:["y","i","q","alpha"],parse:["--yiq"],serialize:"--yiq",ranges:{i:[-.595,.595],q:[-.522,.522]},interpolate:{y:A,i:A,q:A,alpha:{use:A,fixup:j}}},Kl=dh;var XD=de("rgb"),ph=e=>{let n={mode:e.mode,r:Math.max(0,Math.min(e.r!==void 0?e.r:0,1)),g:Math.max(0,Math.min(e.g!==void 0?e.g:0,1)),b:Math.max(0,Math.min(e.b!==void 0?e.b:0,1))};return e.alpha!==void 0&&(n.alpha=e.alpha),n};var mh=e=>e!==void 0&&(e.r===void 0||e.r>=0&&e.r<=1)&&(e.g===void 0||e.g>=0&&e.g<=1)&&(e.b===void 0||e.b>=0&&e.b<=1);function ut(e="rgb"){let{gamut:n}=ln(e);if(!n)return r=>!0;let t=de(typeof n=="string"?n:e);return r=>mh(t(r))}function Yl(e="rgb"){let{gamut:n}=ln(e);if(!n)return o=>Jn(o);let t=typeof n=="string"?n:e,r=de(t),i=ut(t);return o=>{let s=Jn(o);if(!s)return;let a=r(s);if(i(a))return s;let l=ph(a);return s.mode===l.mode?l:de(s.mode)(l)}}function ct(e="rgb",n="oklch",t=Ot("oklch"),r=.02){let i=de(e),o=ln(e);if(!o.gamut)return c=>i(c);let s=ut(e),a=Yl(e),l=de(n),{ranges:u}=ln(n);if(!u.l||!u.c)throw new Error("LCH-like space expected");return c=>{if(c=Jn(c),c===void 0)return;let f={...l(c)};if(f.l===void 0&&(f.l=0),f.c===void 0&&(f.c=0),f.l>=u.l[1]){let h={...o.white,mode:e};return c.alpha!==void 0&&(h.alpha=c.alpha),h}if(f.l<=u.l[0]){let h={...o.black,mode:e};return c.alpha!==void 0&&(h.alpha=c.alpha),h}if(s(f))return i(f);let d=0,p=f.c,g=(u.c[1]-u.c[0])/4e3,m=a(f);for(;p-d>g;)f.c=(d+p)*.5,m=a(f),s(f)||t&&r>0&&t(f,m)<=r?d=f.c:p=f.c;return i(s(f)?f:m)}}var kR=$(Ya),LR=$(tl),_R=$(ol),VR=$(sl),FR=$(al),GR=$(xr),BR=$(Dr),UR=$(dl),zR=$(ml),HR=$(hl),WR=$(yl),XR=$(at),jR=$(vl),KR=$(lt),YR=$(Sl),$R=$(Al),qR=$(Nl),JR=$(Cl),ZR=$(Ol),QR=$(xl),e2=$(Rl),n2=$(Pl),t2=$(wl),r2=$(kl),i2=$(Vl),o2=$(Me),s2=$(Bl),a2=$(Ul),l2=$(Wl),u2=$(Kl);var Cn={r:0,g:0,b:0,a:1};var ft="Inter",Xr=4,jr=1;var $l=["button","textField","textarea","numberField","toggle","switch","checkbox","radio","radioGroup","toggleGroup","slider","progress","tabs","collapsible","accordion"];var Kr,gh={lang:void 0,message:void 0,abortEarly:void 0,abortPipeEarly:void 0};function ql(e){return!e&&!Kr?gh:{lang:e?.lang??Kr?.lang,message:e?.message,abortEarly:e?.abortEarly??Kr?.abortEarly,abortPipeEarly:e?.abortPipeEarly??Kr?.abortPipeEarly}}var hh;function yh(e){return hh?.get(e)}var Ih;function vh(e){return Ih?.get(e)}var Th;function Sh(e,n){return Th?.get(e)?.get(n)}function Vt(e){let n=typeof e;return n==="string"?`"${e}"`:n==="number"||n==="bigint"||n==="boolean"?`${e}`:n==="object"||n==="function"?(e&&Object.getPrototypeOf(e)?.constructor?.name)??"null":n}function ge(e,n,t,r,i){let o=i&&"input"in i?i.input:t.value,s=i?.expected??e.expects??null,a=i?.received??Vt(o),l={kind:e.kind,type:e.type,input:o,expected:s,received:a,message:`Invalid ${n}: ${s?`Expected ${s} but r`:"R"}eceived ${a}`,requirement:e.requirement,path:i?.path,issues:i?.issues,lang:r.lang,abortEarly:r.abortEarly,abortPipeEarly:r.abortPipeEarly},u=e.kind==="schema",c=i?.message??e.message??Sh(e.reference,l.lang)??(u?vh(l.lang):null)??r.message??yh(l.lang);c!==void 0&&(l.message=typeof c=="function"?c(l):c),u&&(t.typed=!1),t.issues?t.issues.push(l):t.issues=[l]}function bh(e,n){return e===n||Number.isNaN(e)&&Number.isNaN(n)}function Eh(e,n){return Object.prototype.hasOwnProperty.call(e,n)&&n!=="__proto__"&&n!=="prototype"&&n!=="constructor"}function Ah(e,n){let t=[...new Set(e)];return t.length>1?`(${t.join(` ${n} `)})`:t[0]??"never"}function be(e){return e["~standard"]={version:1,vendor:"valibot",validate:n=>e["~run"]({value:n},ql())},e}function Yr(e,n){return{kind:"validation",type:"check",reference:Yr,async:!1,expects:null,requirement:e,message:n,"~run"(t,r){return t.typed&&!this.requirement(t.value)&&ge(this,"input",t,r),t}}}function qe(e){return{kind:"validation",type:"finite",reference:qe,async:!1,expects:null,requirement:Number.isFinite,message:e,"~run"(n,t){return n.typed&&!this.requirement(n.value)&&ge(this,"finite",n,t),n}}}function Ft(e,n){return{kind:"validation",type:"max_length",reference:Ft,async:!1,expects:`<=${e}`,requirement:e,message:n,"~run"(t,r){return t.typed&&t.value.length>this.requirement&&ge(this,"length",t,r,{received:`${t.value.length}`}),t}}}function $r(e,n){return{kind:"validation",type:"min_length",reference:$r,async:!1,expects:`>=${e}`,requirement:e,message:n,"~run"(t,r){return t.typed&&t.value.length<this.requirement&&ge(this,"length",t,r,{received:`${t.value.length}`}),t}}}function qr(e,n){return{kind:"validation",type:"min_value",reference:qr,async:!1,expects:`>=${e instanceof Date?e.toJSON():Vt(e)}`,requirement:e,message:n,"~run"(t,r){return t.typed&&!(t.value>=this.requirement)&&ge(this,"value",t,r,{received:t.value instanceof Date?t.value.toJSON():Vt(t.value)}),t}}}function dt(e){return{kind:"validation",type:"non_empty",reference:dt,async:!1,expects:"!0",message:e,"~run"(n,t){return n.typed&&n.value.length===0&&ge(this,"length",n,t,{received:"0"}),n}}}function jo(e,n){return{kind:"transformation",type:"parse_json",reference:jo,config:e,message:n,async:!1,"~run"(t,r){try{t.value=JSON.parse(t.value,this.config?.reviver)}catch(i){if(i instanceof Error)ge(this,"JSON",t,r,{received:`"${i.message}"`}),t.typed=!1;else throw i}return t}}}function Jr(e,n){return{kind:"validation",type:"regex",reference:Jr,async:!1,expects:`${e}`,requirement:e,message:n,"~run"(t,r){return t.typed&&!this.requirement.test(t.value)&&ge(this,"format",t,r),t}}}function _n(e){return{kind:"transformation",type:"transform",reference:_n,async:!1,operation:e,"~run"(n){return n.value=this.operation(n.value),n}}}function Zr(){return{kind:"transformation",type:"trim",reference:Zr,async:!1,"~run"(e){return e.value=e.value.trim(),e}}}function Jl(e,n,t){return typeof e.fallback=="function"?e.fallback(n,t):e.fallback}function Ue(e,n){return be({...e,fallback:n,"~run"(t,r){let i=e["~run"](t,r);return i.issues?{typed:!0,value:Jl(this,i,r)}:i}})}function Ko(e,n,t){return typeof e.default=="function"?e.default(n,t):e.default}function dn(e,n){return be({kind:"schema",type:"array",reference:dn,expects:"Array",async:!1,item:e,message:n,"~run"(t,r){let i=t.value;if(Array.isArray(i)){t.typed=!0,t.value=[];for(let o=0;o<i.length;o++){let s=i[o],a=this.item["~run"]({value:s},r);if(a.issues){let l={type:"array",origin:"value",input:i,key:o,value:s};for(let u of a.issues)u.path?u.path.unshift(l):u.path=[l],t.issues?.push(u);if(t.issues||(t.issues=a.issues),r.abortEarly){t.typed=!1;break}}a.typed||(t.typed=!1),t.value.push(a.value)}}else ge(this,"type",t,r);return t}})}function Qr(e){return be({kind:"schema",type:"boolean",reference:Qr,expects:"boolean",async:!1,message:e,"~run"(n,t){return typeof n.value=="boolean"?n.typed=!0:ge(this,"type",n,t),n}})}function ei(e,n){return be({kind:"schema",type:"custom",reference:ei,expects:"unknown",async:!1,check:e,message:n,"~run"(t,r){return this.check(t.value)?t.typed=!0:ge(this,"type",t,r),t}})}function Yo(e){return be({kind:"schema",type:"lazy",reference:Yo,expects:"unknown",async:!1,getter:e,"~run"(n,t){return this.getter(n.value)["~run"](n,t)}})}function $o(e,n){return be({kind:"schema",type:"literal",reference:$o,expects:Vt(e),async:!1,literal:e,message:n,"~run"(t,r){return bh(t.value,this.literal)?t.typed=!0:ge(this,"type",t,r),t}})}function Gt(e,n){return be({kind:"schema",type:"nullable",reference:Gt,expects:`(${e.expects} | null)`,async:!1,wrapped:e,default:n,"~run"(t,r){return t.value===null&&(this.default!==void 0&&(t.value=Ko(this,t,r)),t.value===null)?(t.typed=!0,t):this.wrapped["~run"](t,r)}})}function Z(e){return be({kind:"schema",type:"number",reference:Z,expects:"number",async:!1,message:e,"~run"(n,t){return typeof n.value=="number"&&!isNaN(n.value)?n.typed=!0:ge(this,"type",n,t),n}})}function te(e,n){return be({kind:"schema",type:"object",reference:te,expects:"Object",async:!1,entries:e,message:n,"~run"(t,r){let i=t.value;if(i&&typeof i=="object"){t.typed=!0,t.value={};for(let o in this.entries){let s=this.entries[o];if(o in i||(s.type==="exact_optional"||s.type==="optional"||s.type==="nullish")&&s.default!==void 0){let a=o in i?i[o]:Ko(s),l=s["~run"]({value:a},r);if(l.issues){let u={type:"object",origin:"value",input:i,key:o,value:a};for(let c of l.issues)c.path?c.path.unshift(u):c.path=[u],t.issues?.push(c);if(t.issues||(t.issues=l.issues),r.abortEarly){t.typed=!1;break}}l.typed||(t.typed=!1),t.value[o]=l.value}else if(s.fallback!==void 0)t.value[o]=Jl(s);else if(s.type!=="exact_optional"&&s.type!=="optional"&&s.type!=="nullish"&&(ge(this,"key",t,r,{input:void 0,expected:`"${o}"`,path:[{type:"object",origin:"key",input:i,key:o,value:i[o]}]}),r.abortEarly))break}}else ge(this,"type",t,r);return t}})}function Y(e,n){return be({kind:"schema",type:"optional",reference:Y,expects:`(${e.expects} | undefined)`,async:!1,wrapped:e,default:n,"~run"(t,r){return t.value===void 0&&(this.default!==void 0&&(t.value=Ko(this,t,r)),t.value===void 0)?(t.typed=!0,t):this.wrapped["~run"](t,r)}})}function Vn(e,n){return be({kind:"schema",type:"picklist",reference:Vn,expects:Ah(e.map(Vt),"|"),async:!1,options:e,message:n,"~run"(t,r){return this.options.includes(t.value)?t.typed=!0:ge(this,"type",t,r),t}})}function pn(e,n,t){return be({kind:"schema",type:"record",reference:pn,expects:"Object",async:!1,key:e,value:n,message:t,"~run"(r,i){let o=r.value;if(o&&typeof o=="object"){r.typed=!0,r.value={};for(let s in o)if(Eh(o,s)){let a=o[s],l=this.key["~run"]({value:s},i);if(l.issues){let c={type:"object",origin:"key",input:o,key:s,value:a};for(let f of l.issues)f.path=[c],r.issues?.push(f);if(r.issues||(r.issues=l.issues),i.abortEarly){r.typed=!1;break}}let u=this.value["~run"]({value:a},i);if(u.issues){let c={type:"object",origin:"value",input:o,key:s,value:a};for(let f of u.issues)f.path?f.path.unshift(c):f.path=[c],r.issues?.push(f);if(r.issues||(r.issues=u.issues),i.abortEarly){r.typed=!1;break}}(!l.typed||!u.typed)&&(r.typed=!1),l.typed&&(r.value[l.value]=u.value)}}else ge(this,"type",r,i);return r}})}function F(e){return be({kind:"schema",type:"string",reference:F,expects:"string",async:!1,message:e,"~run"(n,t){return typeof n.value=="string"?n.typed=!0:ge(this,"type",n,t),n}})}function On(){return be({kind:"schema",type:"unknown",reference:On,expects:"unknown",async:!1,"~run"(e){return e.typed=!0,e}})}function re(...e){return be({...e[0],pipe:e,"~run"(n,t){for(let r of e)if(r.kind!=="metadata"){if(n.issues&&(r.kind==="schema"||r.kind==="transformation")){n.typed=!1;break}(!n.issues||!t.abortEarly&&!t.abortPipeEarly)&&(n=r["~run"](n,t))}return n}})}function Bt(e,n,t){let r=e["~run"]({value:n},ql(t));return{typed:r.typed,success:!r.issues,output:r.value,issues:r.issues}}var qo="open-pencil";function Ie(e,n,t){let r=re(F(),jo(),t);return{key:e,role:n,decode(i){let o=Bt(r,i);return o.success?o.output:void 0},encode:i=>JSON.stringify(i)}}function ni(e,n,t){let r=Vn(t);return{key:e,role:n,decode(i){let o=Bt(r,i);return o.success?o.output:void 0},encode:i=>i}}function Ql(e,n){return e.pluginId==="open-pencil"&&e.key===n.key}function Jo(e,n){return e.filter(t=>!n.some(r=>Ql(t,r)))}var Ch=te({propertyId:F(),on:Y(F()),off:Y(F())});function eu(e){return e.max>e.min&&e.step>0}var Oh=re(te({min:re(Z(),qe()),max:re(Z(),qe()),step:re(Z(),qe()),default:re(Z(),qe())}),Yr(e=>eu(e),"A number value needs max above min and a positive step")),xh={rest:Y(F()),hover:Y(F()),pressed:Y(F()),focus:Y(F()),disabled:Y(F())},Dh=te({propertyId:F(),...xh}),Rh=te({kind:Vn($l),booleans:pn(F(),Ch),texts:Y(pn(F(),te({propertyId:F()})),{}),numbers:pn(F(),Oh),parts:pn(F(),F()),states:Y(Dh)}),nu=["png","jpg","webp","svg","pdf","pptx"];function tu(e){return nu.some(n=>n===e)}var ru=.01,iu=1024;function ti(e){return Math.min(iu,Math.max(ru,e))}var ou=/^[a-z0-9]+(?:-[a-z0-9]+)*:[a-z0-9]+(?:[-_][a-z0-9]+)*$/,su=te({name:re(F(),Jr(ou)),glyph:Y(F())}),au=["fill","stroke"],lu=re(dn(Vn(au)),$r(1)),uu=te({type:re(F(),dt(),Ft(100)),id:Y(F()),props:Y(pn(F(),On())),children:Y(dn(Yo(()=>uu)))}),cu=te({components:re(dn(uu),$r(1)),structureVersion:Y(Z())}),fu=te({image:re(F(),dt()),preset:cu,frame:Y(te({width:re(Z(),qe(),qr(0)),height:re(Z(),qe(),qr(0)),preset:re(F(),dt())}))});var Zo=["ALL_SCOPES","TEXT_CONTENT","CORNER_RADIUS","WIDTH_HEIGHT","GAP","ALL_FILLS","FRAME_FILL","SHAPE_FILL","TEXT_FILL","STROKE","STROKE_FLOAT","EFFECT_FLOAT","EFFECT_COLOR","OPACITY","FONT_STYLE","FONT_FAMILY","FONT_SIZE","LINE_HEIGHT","LETTER_SPACING","PARAGRAPH_SPACING","PARAGRAPH_INDENT","FONT_VARIATIONS","TRANSFORM"],Qo=["WEB","ANDROID","iOS"],du=["none","px","rem","%","ms","s","deg"];var pu=/^[A-Za-z_][\w-]*$/;var Zl=["AUTO","LTR","RTL"],Mh=re(te({x:Z(),y:Z(),width:Z(),height:Z()}),Yr(({x:e,y:n,width:t,height:r})=>Number.isFinite(e+n+t+r)&&t>0&&r>0)),Ph=re(ei(e=>typeof e=="object"&&e!==null&&!Array.isArray(e)),_n(e=>Object.fromEntries(Object.entries(e).filter(n=>typeof n[1]=="string")))),wh=dn(re(te({scale:re(Z(),qe()),format:ei(tu)}),_n(({scale:e,format:n})=>({scale:ti(e),format:n})))),kh=re(te({identity:te({libraryId:F(),assetKey:F(),revisionId:F()}),sourceNodeId:Y(On()),readOnly:Y(On())}),_n(({identity:e,sourceNodeId:n,readOnly:t})=>({identity:e,sourceNodeId:typeof n=="string"?n:null,readOnly:t===!0}))),Lh=te({libraryId:F(),revisionId:F(),enabled:Y(On())}),_h=re(dn(On()),_n(e=>e.flatMap(n=>{let t=Bt(Lh,n);if(!t.success)return[];let{libraryId:r,revisionId:i,enabled:o}=t.output;return[{libraryId:r,revisionId:i,enabled:o===!0}]}))),mu=re(F(),Zr(),dt(),Ft(1e3)),Vh=te({unit:Y(Vn(du)),expressions:Y(pn(F(),te({css:mu,resolved:re(Z(),qe())})))}),Fh=te({version:$o(1),kind:Vn(["fill","stroke"]),index:Z(),color:te({h:Z(),c:Z(),l:Z(),a:Ue(Y(Z()),void 0)})}),Gh=te({libraryId:F(),revisionId:F(),name:F(),catalogSource:Y(F())}),Bh=Ue(Y(te({r:Z(),g:Z(),b:Z(),a:Z()})),void 0),gu={author:Ue(F(),""),authorColor:Bh,text:Ue(F(),""),createdAt:Ue(F(),""),deleted:Y(Qr())},Uh=te({id:F(),...gu}),zh=te({id:F(),pageId:F(),pageName:Y(F()),nodeId:Y(Gt(F())),nodeName:Y(Gt(F())),offsetX:Y(Z()),offsetY:Y(Z()),x:Ue(Z(),0),y:Ue(Z(),0),...gu,updatedAt:Ue(F(),""),resolved:Ue(Qr(),!1),resolvedAt:Y(Gt(F())),replies:Ue(dn(Uh),[])}),Hh=re(dn(On()),_n(e=>e.flatMap(n=>{let t=Bt(zh,n);if(!t.success)return[];let r=t.output;return[{...r,updatedAt:r.updatedAt||r.createdAt}]}))),ze={textDirection:ni("textDirection","format",Zl),layoutDirection:ni("layoutDirection","format",Zl),nodeType:ni("nodeType","format",["COMPONENT_SET"]),boundVariables:Ie("boundVariables","format",Ph),exportSettings:Ie("exportSettings","format",wh),textPathBox:Ie("textPathBox","format",Mh),librarySource:Ie("librarySource","bookkeeping",kh),enabledLibraries:Ie("enabledLibraries","bookkeeping",_h),sourceLibraryPublication:Ie("sourceLibraryPublication","bookkeeping",Gh),comments:Ie("comments","bookkeeping",Hh),token:Ie("token","format",Vh),modeConditions:Ie("modeConditions","format",pn(F(),mu)),modeAttribute:Ie("modeAttribute","format",re(F(),Zr(),Ft(100),Jr(pu))),okhcl:Ie("okhcl","content",Fh),behaviour:Ie("behaviour","content",Rh),icon:Ie("icon","content",su),iconTint:Ie("iconTint","content",lu),shader:Ie("shader","content",fu)},S2=Object.values(ze).filter(e=>e.role!=="content");var es=typeof globalThis=="object"&&globalThis||typeof window=="object"&&window||typeof self=="object"&&self||typeof global=="object"&&global||(function(){return this})();function ns(e){return typeof es.Buffer<"u"&&es.Buffer.isBuffer(e)}function Ut(e){if(!e||typeof e!="object")return!1;let n=Object.getPrototypeOf(e);return n===null||n===Object.prototype||Object.getPrototypeOf(n)===null?Object.prototype.toString.call(e)==="[object Object]":!1}function ri(e){return Ut(e)&&Object.keys(e).length===0}function ts(e){return Object.getOwnPropertySymbols(e).filter(n=>Object.prototype.propertyIsEnumerable.call(e,n))}function rs(e){return e==null?e===void 0?"[object Undefined]":"[object Null]":Object.prototype.toString.call(e)}var hu="[object RegExp]",yu="[object String]",Iu="[object Number]",vu="[object Boolean]";var Tu="[object Symbol]",Su="[object Date]",bu="[object Map]",Eu="[object Set]",Au="[object Array]",Nu="[object Function]",Cu="[object ArrayBuffer]",ii="[object Object]",Ou="[object Error]",xu="[object DataView]",Du="[object Uint8Array]",Ru="[object Uint8ClampedArray]",Mu="[object Uint16Array]",Pu="[object Uint32Array]",wu="[object BigUint64Array]",ku="[object Int8Array]",Lu="[object Int16Array]",_u="[object Int32Array]",Vu="[object BigInt64Array]",Fu="[object Float32Array]",Gu="[object Float64Array]";function Bu(e,n){return e===n||Number.isNaN(e)&&Number.isNaN(n)}function Uu(e,n,t){return zt(e,n,void 0,void 0,void 0,void 0,t)}function zt(e,n,t,r,i,o,s){let a=s(e,n,t,r,i,o);if(a!==void 0)return a;if(typeof e==typeof n)switch(typeof e){case"bigint":case"string":case"boolean":case"symbol":case"undefined":return e===n;case"number":return e===n||Object.is(e,n);case"function":return e===n;case"object":return Ht(e,n,o,s)}return Ht(e,n,o,s)}function Ht(e,n,t,r){if(Object.is(e,n))return!0;let i=rs(e),o=rs(n);if(i==="[object Arguments]"&&(i=ii),o==="[object Arguments]"&&(o=ii),i!==o)return!1;switch(i){case yu:return e.toString()===n.toString();case Iu:{let l=e.valueOf(),u=n.valueOf();return Bu(l,u)}case vu:case Su:case Tu:return Object.is(e.valueOf(),n.valueOf());case hu:return e.source===n.source&&e.flags===n.flags;case Nu:return e===n}t=t??new Map;let s=t.get(e),a=t.get(n);if(s!=null&&a!=null)return s===n;t.set(e,n),t.set(n,e);try{switch(i){case bu:if(e.size!==n.size)return!1;for(let[l,u]of e.entries())if(!n.has(l)||!zt(u,n.get(l),l,e,n,t,r))return!1;return!0;case Eu:{if(e.size!==n.size)return!1;let l=Array.from(e.values()),u=Array.from(n.values());for(let c=0;c<l.length;c++){let f=l[c],d=u.findIndex(p=>zt(f,p,void 0,e,n,t,r));if(d===-1)return!1;u.splice(d,1)}return!0}case Au:case Du:case Ru:case Mu:case Pu:case wu:case ku:case Lu:case _u:case Vu:case Fu:case Gu:if(ns(e)!==ns(n)||e.length!==n.length)return!1;for(let l=0;l<e.length;l++)if(!zt(e[l],n[l],l,e,n,t,r))return!1;return!0;case Cu:return e.byteLength!==n.byteLength?!1:Ht(new Uint8Array(e),new Uint8Array(n),t,r);case xu:return e.byteLength!==n.byteLength||e.byteOffset!==n.byteOffset?!1:Ht(new Uint8Array(e),new Uint8Array(n),t,r);case Ou:return e.name===n.name&&e.message===n.message;case ii:{if(!(Ht(e.constructor,n.constructor,t,r)||Ut(e)&&Ut(n)))return!1;let l=[...Object.keys(e),...ts(e)],u=[...Object.keys(n),...ts(n)];if(l.length!==u.length)return!1;for(let c=0;c<l.length;c++){let f=l[c],d=e[f];if(!Object.hasOwn(n,f))return!1;let p=n[f];if(!zt(d,p,f,e,n,t,r))return!1}return!0}default:return!1}}finally{t.delete(e),t.delete(n)}}function zu(){}function he(e,n){return Uu(e,n,zu)}function Wh(){return{minX:1/0,minY:1/0,maxX:-1/0,maxY:-1/0}}function Xh(e,n,t){e.minX=Math.min(e.minX,n),e.minY=Math.min(e.minY,t),e.maxX=Math.max(e.maxX,n),e.maxY=Math.max(e.maxY,t)}function jh(e){return e.minX===1/0?{x:0,y:0,width:0,height:0}:{x:e.minX,y:e.minY,width:e.maxX-e.minX,height:e.maxY-e.minY}}function oi(e){return e===0?0:e===1||e===2?1:e===3?2:e===4?3:null}function si(e){let n=Wh();for(let t of e){let r=t.commandsBlob,i=new DataView(r.buffer,r.byteOffset,r.byteLength),o=0;for(;o<r.length;){let s=r[o++],a=oi(s);if(a==null)break;for(let l=0;l<a&&!(o+8>r.length);l++)Xh(n,i.getFloat32(o,!0),i.getFloat32(o+4,!0)),o+=8}}return n.minX===1/0?null:jh(n)}function Wu(){return{self:new Map,descendants:new Map}}function is(e){return{self:new Map([...e.self].map(([n,t])=>[n,structuredClone(t)])),descendants:new Map([...e.descendants].map(([n,t])=>[n,new Map([...t].map(([r,i])=>[r,structuredClone(i)]))]))}}function Je(e,n,t,r){return t===n?e.self.get(r):e.descendants.get(t)?.get(r)}function ai(e,n,t,r){return(t===n?e.self:e.descendants.get(t))?.has(r)??!1}function le(e,n,t,r,i=!0){if(t===n){e.self.set(r,i);return}let o=e.descendants.get(t)??new Map;o.set(r,i),e.descendants.set(t,o)}function os(e){e.self.clear(),e.descendants.clear()}function li(e,n){for(let[t,r]of e.self)n("",t,r);for(let[t,r]of e.descendants)for(let[i,o]of r)n(t,i,o)}function Dn(){return{format:null,id:null,orderKey:null,editedFields:[],fig:{rawSize:null,rawTransform:null,rawNodeFields:{},layout:null,symbolOverrides:[],componentPropAssignments:[],derivedSymbolData:[],derivedSymbolDataLayoutVersion:null,uniformScaleFactor:null}}}function ss(e){return e==="LINE"||e==="VECTOR"?"CENTER":e==="TEXT"?"OUTSIDE":"INSIDE"}function mt(e,n,t={}){return{id:e(),type:n,name:n.charAt(0)+n.slice(1).toLowerCase(),parentId:null,childIds:[],x:0,y:0,width:100,height:100,rotation:0,source:Dn(),derivedLayout:null,fills:n==="TEXT"?[{type:"SOLID",color:Cn,opacity:1,visible:!0}]:[],strokes:[],effects:[],layoutGrids:[],guides:[],fillStyleId:null,strokeStyleId:null,textStyleId:null,effectStyleId:null,gridStyleId:null,sharedStyleType:null,opacity:1,cornerRadius:0,topLeftRadius:0,topRightRadius:0,bottomRightRadius:0,bottomLeftRadius:0,independentCorners:!1,cornerSmoothing:0,visible:!0,locked:!1,clipsContent:!1,text:"",fontSize:14,fontFamily:ft,fontWeight:400,italic:!1,textAlignHorizontal:"LEFT",textDirection:"AUTO",textLanguage:null,leadingTrim:"NONE",lineHeight:null,letterSpacing:0,layoutMode:"NONE",layoutDirection:"AUTO",layoutWrap:"NO_WRAP",primaryAxisAlign:"MIN",counterAxisAlign:"MIN",primaryAxisSizing:"FIXED",counterAxisSizing:"FIXED",itemSpacing:0,counterAxisSpacing:0,paddingTop:0,paddingRight:0,paddingBottom:0,paddingLeft:0,blendMode:"PASS_THROUGH",layoutPositioning:"AUTO",layoutGrow:0,layoutAlignSelf:"AUTO",vectorNetwork:null,handleMirroring:"NONE",fillGeometry:[],strokeGeometry:[],arcData:null,textAlignVertical:"TOP",textAutoResize:"NONE",textCase:"ORIGINAL",textDecoration:"NONE",textDecorationStyle:"SOLID",textDecorationThickness:null,textDecorationFills:[],textDecorationSkipInk:!0,textUnderlineOffset:null,maxLines:null,textParagraphs:[],listSpacing:0,paragraphSpacing:0,paragraphIndent:0,hangingList:!1,styleRuns:[],fontVariations:[],fontFeatures:[],horizontalConstraint:"MIN",verticalConstraint:"MIN",strokeCap:"NONE",strokeJoin:"MITER",dashPattern:[],borderTopWeight:0,borderRightWeight:0,borderBottomWeight:0,borderLeftWeight:0,independentStrokeWeights:!1,strokeWeight:1,strokeAlign:ss(n),strokeMiterLimit:4,minWidth:null,maxWidth:null,minHeight:null,maxHeight:null,targetAspectRatio:null,isMask:!1,maskType:"ALPHA",maskIsOutline:!1,gridTemplateColumns:[],gridTemplateRows:[],gridColumnGap:0,gridRowGap:0,gridPosition:null,counterAxisAlignContent:"AUTO",itemReverseZIndex:!1,strokesIncludedInLayout:!1,expanded:!0,textTruncation:"DISABLED",autoRename:!0,pointCount:5,starInnerRadius:.38,componentId:null,instanceOverrides:Wu(),componentPropertyDefinitions:[],componentPropertyReferences:[],componentPropertyAssignments:{},componentPropertyValues:{},componentKey:null,sourceLibraryKey:null,publishId:null,overrideKey:null,sharedSymbolVersion:null,publishedVersion:null,librarySource:null,isPublishable:!1,isSymbolPublishable:!1,isExposedInstance:!1,symbolDescription:"",symbolLinks:[],variantPropSpecs:[],boundVariables:{},variableBindingScales:{},variableAssignmentScales:{},componentScale:1,variableModes:{},exportSettings:[],pluginData:[],pluginRelaunchData:[],internalOnly:!1,flipX:!1,flipY:!1,textPicture:null,derivedTextGlyphs:null,textPathData:null,textPathBox:null,booleanOperation:void 0,...t}}var as=new Set(["CANVAS","FRAME","GROUP","BOOLEAN_OPERATION","SECTION","COMPONENT","COMPONENT_SET","INSTANCE"]);function ls(e,n){let t=r=>({x:e[0]*r.x+e[1]*r.y,y:e[3]*r.x+e[4]*r.y});return{vertices:n.vertices.map(r=>({...r,x:e[0]*r.x+e[1]*r.y+e[2],y:e[3]*r.x+e[4]*r.y+e[5]})),segments:n.segments.map(r=>({...r,tangentStart:t(r.tangentStart),tangentEnd:t(r.tangentEnd)})),regions:n.regions.map(r=>({windingRule:r.windingRule,loops:r.loops.map(i=>[...i])}))}}function Wt(e){return{vertices:e.vertices.map(n=>({...n})),segments:e.segments.map(n=>({...n,tangentStart:{...n.tangentStart},tangentEnd:{...n.tangentEnd}})),regions:e.regions.map(n=>({windingRule:n.windingRule,loops:n.loops.map(t=>[...t])}))}}function ui(e){let n={x:0,y:0};return{vertices:e.vertices,segments:e.segments.map(t=>({start:t.start,end:t.end,tangentStart:t.tangentStart??{...n},tangentEnd:t.tangentEnd??{...n}})),regions:e.regions??[]}}function pt(e){let n={...e,color:{...e.color}};return e.gradientStops&&(n.gradientStops=e.gradientStops.map(Kh)),e.gradientTransform&&(n.gradientTransform={...e.gradientTransform}),e.imageTransform&&(n.imageTransform={...e.imageTransform}),e.patternSpacing&&(n.patternSpacing={...e.patternSpacing}),e.noiseSize&&(n.noiseSize={...e.noiseSize}),n}function ci(e){let n=pt(e);return e.dashPattern&&(n.dashPattern=[...e.dashPattern]),n}function us(e){return{...e,color:{...e.color},offset:{...e.offset}}}function cs(e){let n={...e,style:{...e.style,fills:e.style.fills?e.style.fills.map(pt):void 0,textDecorationFills:e.style.textDecorationFills?e.style.textDecorationFills.map(pt):void 0,fontVariations:e.style.fontVariations?e.style.fontVariations.map(t=>({...t})):void 0,fontFeatures:e.style.fontFeatures?e.style.fontFeatures.map(t=>({...t})):void 0}};return e.style.hyperlink&&(n.style.hyperlink={...e.style.hyperlink}),e.style.boundVariables&&(n.style.boundVariables={...e.style.boundVariables}),n}var Hu=new WeakMap;function Fn(e,n){return Hu.set(n,Hu.get(e)??e),n}function He(e){return e.map(pt)}function Bn(e){return e.map(ci)}function Xt(e){return e.map(us)}function fs(e){return e.map(n=>({...n,color:n.color?{...n.color}:void 0}))}function jt(e){return e.map(cs)}function Xu(e,n){return{windingRule:e.windingRule,commandsBlob:n,...e.fills?{fills:He(e.fills)}:{}}}function Gn(e){return e.map(n=>Xu(n,n.commandsBlob.slice()))}function fi(e,n,t,r,i,o=0,s=0){let a=e.slice(),l=new DataView(a.buffer,a.byteOffset,a.byteLength),u=0;for(;u<a.length;){let c=a[u++],f=oi(c);if(f==null)break;for(let d=0;d<f&&!(u+8>a.length);d++){let p=l.getFloat32(u,!0),g=l.getFloat32(u+4,!0);l.setFloat32(u,n*p+t*g+o,!0),l.setFloat32(u+4,r*p+i*g+s,!0),u+=8}}return a}function Kt(e,n,t,r,i,o=0,s=0){return e.map(a=>Xu(a,fi(a.commandsBlob,n,t,r,i,o,s)))}function gt(e,n,t){return n===1&&t===1?Gn(e):Kt(e,n,0,0,t)}function De(e,n){if(e!==void 0)return e.length>0?n(e):[]}function Kh(e){return{color:{...e.color},position:e.position}}function xn(e){return e?.map(n=>({...n}))??[]}function Yh(e){return e?.map(n=>({...n,variantOptions:n.variantOptions?[...n.variantOptions]:void 0,preferredValues:n.preferredValues?[...n.preferredValues]:void 0,slotSettings:n.slotSettings?{...n.slotSettings}:void 0}))??[]}function di(e){return e?e.map(n=>({...n,commandsBlob:new Uint8Array(n.commandsBlob)})):null}function $h(e){return{startingAngle:e.startingAngle,endingAngle:e.endingAngle,innerRadius:e.innerRadius}}function ht(e,n,t="deep"){let{id:r,parentId:i,childIds:o,...s}=e;return t==="fig-import"?{...s,...n!==null?{componentId:n}:{},source:Dn(),boundVariables:{...e.boundVariables},variableBindingScales:{...e.variableBindingScales},variableAssignmentScales:{...e.variableAssignmentScales},variableModes:{...e.variableModes},instanceOverrides:is(e.instanceOverrides),componentPropertyAssignments:{...e.componentPropertyAssignments},componentPropertyValues:{...e.componentPropertyValues}}:{...s,...n!==null?{componentId:n}:{},boundVariables:{...e.boundVariables},variableBindingScales:{...e.variableBindingScales},variableAssignmentScales:{...e.variableAssignmentScales},variableModes:{...e.variableModes},instanceOverrides:is(e.instanceOverrides),fills:De(e.fills,a=>Fn(a,He(a))),strokes:De(e.strokes,a=>Fn(a,Bn(a))),effects:De(e.effects,a=>Fn(a,Xt(a))),layoutGrids:De(e.layoutGrids,fs),guides:De(e.guides,a=>a.map(l=>({...l}))),styleRuns:De(e.styleRuns,a=>Fn(a,jt(a))),source:n===null?structuredClone(e.source):Dn(),dashPattern:De(e.dashPattern,a=>[...a]),fontVariations:De(e.fontVariations,a=>a.map(l=>({...l}))),fontFeatures:De(e.fontFeatures,a=>a.map(l=>({...l}))),textParagraphs:De(e.textParagraphs,a=>a.map(l=>({...l}))),textDecorationFills:De(e.textDecorationFills,He),fillGeometry:De(e.fillGeometry,Gn),strokeGeometry:De(e.strokeGeometry,Gn),gridTemplateColumns:xn(e.gridTemplateColumns),gridTemplateRows:xn(e.gridTemplateRows),componentPropertyDefinitions:Yh(e.componentPropertyDefinitions),componentPropertyReferences:xn(e.componentPropertyReferences),componentPropertyAssignments:{...e.componentPropertyAssignments},symbolLinks:xn(e.symbolLinks),variantPropSpecs:xn(e.variantPropSpecs),pluginData:xn(e.pluginData),pluginRelaunchData:xn(e.pluginRelaunchData),exportSettings:xn(e.exportSettings),componentPropertyValues:{...e.componentPropertyValues},derivedLayout:e.derivedLayout?{...e.derivedLayout}:null,arcData:e.arcData?$h(e.arcData):null,vectorNetwork:e.vectorNetwork?Wt(e.vectorNetwork):null,textPicture:e.textPicture?new Uint8Array(e.textPicture):null,derivedTextGlyphs:e.derivedTextGlyphs?Fn(e.derivedTextGlyphs,di(e.derivedTextGlyphs)??[]):null,textPathData:e.textPathData?structuredClone(e.textPathData):null,textPathBox:e.textPathBox?{...e.textPathBox}:null,gridPosition:e.gridPosition?{...e.gridPosition}:null,targetAspectRatio:e.targetAspectRatio?{...e.targetAspectRatio}:null}}var Q2=de("rgb"),eM=de("p3"),nM=de("oklch"),tM=ct("rgb","oklch"),rM=ct("p3","oklch");var iM=de("rgb"),oM=de("p3"),sM=ct("rgb","oklch"),aM=ct("p3","oklch"),lM=ut("rgb"),uM=ut("p3");var cM=de("rgb");var fM=Ot("rgb");function ju(e){if(!Number.isInteger(e)||e<=0)throw new RangeError("length must be a positive integer");let n=4294967296,t=n-n%e,r=new Uint32Array(1);do crypto.getRandomValues(r);while(r[0]>=t);return r[0]%e}var ps=["text","fontSize","fontFamily","fontWeight","italic","letterSpacing","styleRuns","fontVariations","fontFeatures","textParagraphs","listSpacing","paragraphSpacing","paragraphIndent","hangingList"],Yt=[...ps,"lineHeight","textCase","textDirection","textAlignHorizontal","textAlignVertical"],ms=["width","height","textAutoResize","maxLines"];function Qu(e){return e==="VERTICAL"?"VERTICAL":"HORIZONTAL"}function qh(e,n){if(!(!e||e.layoutMode==="NONE"||n.layoutPositioning==="ABSOLUTE"))return e}function Jh(e,n){return n.parentId?e.getNode(n.parentId):void 0}function Zh(e,n,t){return e.layoutMode==="NONE"?!1:t===Qu(e.layoutMode)?n.layoutGrow>0:n.layoutAlignSelf==="STRETCH"?!0:n.layoutAlignSelf==="AUTO"&&e.layoutMode!=="GRID"&&e.counterAxisAlign==="STRETCH"}function Qh(e,n){if(e.layoutMode!=="NONE")return n===Qu(e.layoutMode)?"primaryAxisSizing":"counterAxisSizing"}function ey(e,n){return e==="WIDTH_AND_HEIGHT"?!0:n==="VERTICAL"&&e==="HEIGHT"}function ny(e,n){if(e.type==="TEXT")return ey(e.textAutoResize,n);let t=Qh(e,n);return t!==void 0&&e[t]==="HUG"}function gs(e,n,t){return ec(Jh(e,n),n,t)}function ec(e,n,t){let r=qh(e,n);return r&&Zh(r,n,t)?"FILL":ny(n,t)&&(r||n.layoutMode!=="NONE")?"HUG":"FIXED"}var ty=new Set(ps);function ry(e,n,t,r){let i={...n,...r};if(i.type==="TEXT"){if(Yt.every(a=>he(i[a],t[a])))return{width:!1,height:!1};let s=i.textAutoResize;return{width:s==="WIDTH_AND_HEIGHT",height:s==="WIDTH_AND_HEIGHT"||s==="HEIGHT"}}let o=s=>{let a=gs(e,i,s);return a==="FILL"||a==="HUG"&&i.layoutMode!=="NONE"};return{width:o("HORIZONTAL"),height:o("VERTICAL")}}function nc(e,n,t,r){let i=ry(e,t,r,n);i.width&&Reflect.deleteProperty(n,"width"),i.height&&Reflect.deleteProperty(n,"height")}function iy(e,n){n.type!=="TEXT"||!n.derivedLayout||Object.keys(e).some(t=>ty.has(t))&&(e.derivedLayout=null)}function hs(e,n){let t=new Set,r=n.componentId?e.getNode(n.componentId):void 0;for(;r?.type==="INSTANCE"&&r.componentId&&!t.has(r.id);)t.add(r.id),r=e.getNode(r.componentId);return r?.type==="COMPONENT"?r:void 0}function We(e){return e.componentPropertyReferences.find(n=>n.field==="SLOT_CONTENT")?.propertyId}function $t(e,n,t=We(n)){if(!t)return!1;let r=n.parentId?e.nodes.get(n.parentId):void 0;for(;r&&r.type!=="INSTANCE";)r=r.parentId?e.nodes.get(r.parentId):void 0;return!!r&&Object.hasOwn(r.componentPropertyAssignments,t)}function tc(e,n,t){let r=hs(e,n);return[r,r?.parentId?e.nodes.get(r.parentId):void 0].flatMap(i=>i?.componentPropertyDefinitions??[]).find(i=>i.id===t&&i.type==="SLOT")?.name}function ys(e,n){let t=[],r=i=>{for(let o of i.childIds){let s=e.nodes.get(o);s&&(We(s)?t.push(s):s.type!=="INSTANCE"&&r(s))}};return r(n),t}function rc(e,n){let t=[],r=i=>{for(let o of i.childIds){let s=e.nodes.get(o);!s||We(s)||(s.type==="INSTANCE"?t.push(s):r(s))}};return r(n),t}function oy(e,n,t){let r=n;for(let i of t)r=r&&rc(e,r).find(o=>o.name===i);return r}function ic(e,n){let t={slots:[],propertyIds:[]},r=(i,o)=>{for(let s of rc(e,i))r(s,[...o,s.name]);for(let s of ys(e,i)){let a=We(s);if(!a||!Object.hasOwn(i.componentPropertyAssignments,a))continue;i.id===n.id&&t.propertyIds.push(a);let l=tc(e,i,a),u=[...o,l].join("\0");if(!l||t.slots.some(f=>[...f.path,f.name].join("\0")===u))continue;let c=[...s.childIds];for(let f of c)e.reorderChild(f,n.id,n.childIds.length);t.slots.push({path:o,name:l,content:c})}};return r(n,[]),t}function oc(e,n,t){if(!(t.slots.length===0&&t.propertyIds.length===0)){e.updateNode(n.id,{componentPropertyAssignments:Object.fromEntries(Object.entries(n.componentPropertyAssignments).filter(([r])=>!t.propertyIds.includes(r)))});for(let r of t.slots){let i=oy(e,n,r.path),o=i&&ys(e,i).find(a=>{let l=We(a);return!!l&&tc(e,i,l)===r.name}),s=o&&We(o);if(!i||!o||!s||Object.hasOwn(i.componentPropertyAssignments,s)){for(let a of r.content)e.deleteNode(a);continue}for(let a of Array.from(o.childIds))e.deleteNode(a);for(let[a,l]of r.content.entries())e.reorderChild(l,o.id,a);e.updateNode(i.id,{componentPropertyAssignments:{...i.componentPropertyAssignments,[s]:""}})}}}function sc(e,n){return{instanceId:e,overrides:n,matched:new Set,leftovers:new Set}}function ac(e,n){let t=e.type==="INSTANCE"?Je(n.overrides,n.instanceId,e.id,"sourceComponentId"):void 0;return typeof t=="string"?t:e.componentId??void 0}function sy(e,n,t){if(n.type==="INSTANCE"||ai(t.overrides,t.instanceId,n.id,"componentId"))return!1;let r=n.componentId?e.nodes.get(n.componentId):void 0;return!r||!$t(e,n,We(r))}function lc(e,n){if(n.copies)return n.copies;let t=new Map,r=o=>{for(let s of o.childIds){let a=e.nodes.get(s);if(!a)continue;let l=ac(a,n);l&&t.set(l,[...t.get(l)??[],a]),sy(e,a,n)&&r(a)}},i=e.nodes.get(n.instanceId);return i&&r(i),n.copies=t,t}function ay(e,n,t,r){return lc(e,n).get(t)?.find(i=>!n.matched.has(i.id)&&e.nodes.has(i.id)&&i.id!==r&&!e.isDescendant(r,i.id))}function uc(e,n,t){let r=lc(e,n);return r.size===0?!1:(e.nodes.get(t)?.childIds??[]).some(i=>r.get(i)?.some(o=>!n.matched.has(o.id))||uc(e,n,i))}var Ku=new WeakMap;function Is(e){let n=Ku.get(e);return n||(n={byInstance:new Map,removals:[]},Ku.set(e,n)),n}function ly(e,n){if(n.keys.length===0)return;let t=Is(e);for(t.removals.push(n);t.removals.length>200;){let r=t.removals.shift();for(let[i,o]of r?.keys??[]){let s=t.byInstance.get(i);!s||s.get(o)?.removals!==r||(s.delete(o),s.size===0&&t.byInstance.delete(i))}}}var ds=new WeakMap;function cc(e,n){let t=ds.get(e);if(t)return n(t);let r={keys:[]};ds.set(e,r);try{return n(r)}finally{ds.delete(e),ly(e,r)}}function uy(e,n,t,r){let i=Is(e),o=i.byInstance.get(n.instanceId),s=o?.get(t);if(!o||!s)return;o.delete(t),o.size===0&&i.byInstance.delete(n.instanceId);let a=s.nodes.at(0);if(!(!a||s.nodes.some(l=>e.nodes.has(l.id)))){for(let l of s.nodes){let{id:u,type:c,parentId:f,childIds:d,...p}=structuredClone(l);e.createNodeWithId(u,c,u===a.id?r:f,p)}for(let[l,u]of s.overrides)n.overrides.descendants.set(l,new Map(u));return e.nodes.get(a.id)}}function cy(e,n,t){let r=Is(e);for(let i of n.leftovers){let o=e.nodes.get(i),s=o?ac(o,n):void 0;if(!o||!s||n.matched.has(i))continue;let a=[],l=f=>{a.push(structuredClone(f));for(let d of f.childIds){let p=e.nodes.get(d);p&&l(p)}};l(o);let u=new Map;for(let f of a){let d=n.overrides.descendants.get(f.id);d&&u.set(f.id,new Map(d)),n.overrides.descendants.delete(f.id)}let c=r.byInstance.get(n.instanceId);c||(c=new Map,r.byInstance.set(n.instanceId,c)),c.set(s,{nodes:a,overrides:u,removals:t}),t.keys.push([n.instanceId,s]),e.deleteNode(i)}n.leftovers.clear()}function fy(e,n){let t=new Set;return e.closest(n,r=>{if(r.type==="COMPONENT"&&t.add(r.id),r.type==="INSTANCE"){let i=hs(e,r);i&&t.add(i.id)}return!1}),t}function fc(e,n,t){let r=fy(e,t);if(r.size===0)return!1;let i=new Set;function o(s){if(r.has(s))return!0;if(i.has(s))return!1;i.add(s);let a=e.getNode(s);return a?a.type==="INSTANCE"&&a.componentId&&o(a.componentId)?!0:a.childIds.some(o):!1}return o(n)}function vs(e,n,t){return e.getNode(n)?.type!=="COMPONENT"?!1:!fc(e,n,t)}var dc=["name","text","fontSize","fontWeight","fontFamily","italic","textDirection","letterSpacing","lineHeight","textCase","textDecoration","textDecorationStyle","textDecorationThickness","textUnderlineOffset","textDecorationFills","textDecorationSkipInk","textAlignHorizontal","textAlignVertical","textAutoResize","textTruncation","maxLines","leadingTrim","paragraphSpacing","paragraphIndent","listSpacing","hangingList","fontVariations","fontFeatures","styleRuns","textParagraphs"],dy={styleRuns:"text",textParagraphs:"text"},qt=["width","height","minWidth","maxWidth","minHeight","maxHeight","targetAspectRatio","fills","strokes","effects","opacity","cornerRadius","topLeftRadius","topRightRadius","bottomRightRadius","bottomLeftRadius","independentCorners","layoutMode","layoutDirection","layoutWrap","primaryAxisAlign","counterAxisAlign","primaryAxisSizing","counterAxisSizing","itemSpacing","counterAxisSpacing","paddingTop","paddingRight","paddingBottom","paddingLeft","gridTemplateColumns","gridTemplateRows","gridColumnGap","gridRowGap","gridPosition","clipsContent","itemReverseZIndex","strokesIncludedInLayout","layoutGrids","blendMode","cornerSmoothing","strokeWeight","strokeAlign","strokeCap","strokeJoin","strokeMiterLimit","dashPattern","independentStrokeWeights","borderTopWeight","borderRightWeight","borderBottomWeight","borderLeftWeight","boundVariables","variableModes","fillStyleId","strokeStyleId","textStyleId","effectStyleId","gridStyleId"],py=["layoutGrow","layoutAlignSelf","locked"],pc=["x","y","rotation","flipX","flipY","horizontalConstraint","verticalConstraint","layoutPositioning","counterAxisAlignContent","isMask","maskType","arcData","pointCount","starInnerRadius"],mc=[...qt,...dc,...py,"visible"],pi=[...mc,...pc],my=Object.freeze({listType:"NONE",indentation:0});var Jt=["listSpacing","paragraphSpacing","paragraphIndent"];function gc(e){return Jt.some(n=>e[n]!==void 0)}function Ts(e,n,t){let{[n]:r,...i}=e;return t===void 0?i:{...i,[n]:t}}function Ss(e,n){let t=e.slice(0,n).map(r=>({...r}));for(;t.length>0;){let r=t[t.length-1];if(r.listType!=="NONE"||r.indentation!==0||gc(r))break;t.pop()}return t}function bs(e,n){return e.listType==="NONE"?{...e,indentation:Math.max(0,Math.min(5,Math.round(n)))}:{...e,indentation:gy(n)}}function gy(e){return Math.max(1,Math.min(5,Math.round(e)))}function Qe(e,n){return e==null?null:e*n}function hy(e,n){return e.map(t=>({...structuredClone(t),weight:t.weight*n,dashPattern:t.dashPattern?.map(r=>r*n)}))}function yy(e,n){return e.map(t=>({...structuredClone(t),offset:{x:t.offset.x*n,y:t.offset.y*n},radius:t.radius*n,spread:t.spread*n}))}function Iy(e,n){return e.map(t=>({...structuredClone(t),scale:t.scale==null?void 0:t.scale*n,spacing:t.spacing==null?void 0:t.spacing*n,patternSpacing:t.patternSpacing?{x:t.patternSpacing.x*n,y:t.patternSpacing.y*n}:void 0,noiseSize:t.noiseSize?{x:t.noiseSize.x*n,y:t.noiseSize.y*n}:void 0}))}function vy(e,n){return e.map(t=>({...structuredClone(t),style:{...structuredClone(t.style),fontSize:t.style.fontSize==null?void 0:t.style.fontSize*n,letterSpacing:t.style.letterSpacing==null?void 0:t.style.letterSpacing*n,lineHeight:Qe(t.style.lineHeight??null,n),textDecorationThickness:Qe(t.style.textDecorationThickness??null,n),textUnderlineOffset:Qe(t.style.textUnderlineOffset??null,n)}}))}function Ty(e,n){return e.map(t=>{let r={...t};for(let i of Jt){let o=t[i];o!==void 0&&(r[i]=o*n)}return r})}function Sy(e,n){return e.map(t=>({...structuredClone(t),offset:t.offset==null?void 0:t.offset*n,sectionSize:t.sectionSize==null?void 0:t.sectionSize*n,gutterSize:t.gutterSize==null?void 0:t.gutterSize*n}))}function Yu(e,n){return e.map(t=>({...t,value:t.sizing==="FIXED"?t.value*n:t.value}))}function by(e,n){if(!e.vectorNetwork)return null;let t=Wt(e.vectorNetwork);for(let r of t.vertices)r.x*=n,r.y*=n;for(let r of t.segments)r.tangentStart.x*=n,r.tangentStart.y*=n,r.tangentEnd.x*=n,r.tangentEnd.y*=n;return t}function mi(e,n,t){return{x:t?e.x*n:e.x,y:t?e.y*n:e.y,width:e.width*n,height:e.height*n,minWidth:Qe(e.minWidth,n),maxWidth:Qe(e.maxWidth,n),minHeight:Qe(e.minHeight,n),maxHeight:Qe(e.maxHeight,n),cornerRadius:e.cornerRadius*n,topLeftRadius:e.topLeftRadius*n,topRightRadius:e.topRightRadius*n,bottomRightRadius:e.bottomRightRadius*n,bottomLeftRadius:e.bottomLeftRadius*n,fontSize:e.fontSize*n,letterSpacing:e.letterSpacing*n,lineHeight:Qe(e.lineHeight,n),textDecorationThickness:Qe(e.textDecorationThickness,n),textUnderlineOffset:Qe(e.textUnderlineOffset,n),styleRuns:vy(e.styleRuns,n),listSpacing:e.listSpacing*n,paragraphSpacing:e.paragraphSpacing*n,paragraphIndent:e.paragraphIndent*n,textParagraphs:Ty(e.textParagraphs,n),itemSpacing:e.itemSpacing*n,counterAxisSpacing:e.counterAxisSpacing*n,paddingTop:e.paddingTop*n,paddingRight:e.paddingRight*n,paddingBottom:e.paddingBottom*n,paddingLeft:e.paddingLeft*n,gridColumnGap:e.gridColumnGap*n,gridRowGap:e.gridRowGap*n,gridTemplateColumns:Yu(e.gridTemplateColumns,n),gridTemplateRows:Yu(e.gridTemplateRows,n),strokes:hy(e.strokes,n),strokeWeight:e.strokeWeight*n,dashPattern:e.dashPattern.map(r=>r*n),borderTopWeight:e.borderTopWeight*n,borderRightWeight:e.borderRightWeight*n,borderBottomWeight:e.borderBottomWeight*n,borderLeftWeight:e.borderLeftWeight*n,strokeMiterLimit:e.strokeMiterLimit,effects:yy(e.effects,n),fills:Iy(e.fills,n),layoutGrids:Sy(e.layoutGrids,n),vectorNetwork:by(e,n),fillGeometry:gt(e.fillGeometry,n,n),strokeGeometry:gt(e.strokeGeometry,n,n)}}var Es=new Set(["opacity","width","height","minWidth","maxWidth","minHeight","maxHeight","x","y","rotation","cornerRadius","topLeftRadius","topRightRadius","bottomLeftRadius","bottomRightRadius","strokeWeight","borderTopWeight","borderBottomWeight","borderLeftWeight","borderRightWeight","fontSize","letterSpacing","lineHeight","paddingLeft","paddingRight","paddingTop","paddingBottom","itemSpacing","counterAxisSpacing","gridRowGap","gridColumnGap"]);function mn(e){return Es.has(e)}var As=new Set(["text","fontFamily"]),Ns=new Set(["visible"]);function hc(e,n){let t={...e.variableBindingScales},r={...e.variableAssignmentScales};for(let i of Es)i==="opacity"||i==="rotation"||(i in e.boundVariables&&(t[i]=(t[i]??1)*n),e.type==="INSTANCE"&&(r[i]=(r[i]??1)*n));return{variableBindingScales:t,variableAssignmentScales:r}}function yc(e){let n=e.targetAspectRatio;return!n||!(n.x>0)||!(n.y>0)||e.type==="TEXT"&&e.textAutoResize!=="NONE"?null:n.x/n.y}var $u=new Set(["STRETCH","SCALE"]);function qu(e,n,t){return t==="MAX"?{position:e.position+e.size-n,size:n}:t==="CENTER"?{position:e.position+(e.size-n)/2,size:n}:{position:e.position,size:n}}function Ey(e,n,t,r,i){let o=$u.has(t);return i===null||o===$u.has(r)?{x:e,y:n}:o?{x:e,y:qu(n,e.size/i,r)}:{x:qu(e,n.size*i,t),y:n}}function Ju(e,n,t,r,i){let o=Math.round(r)-Math.round(t);if(i==="MAX")return{position:e+o,size:n};if(i==="CENTER")return{position:e+Math.round(r/2)-Math.round(t/2),size:n};if(i==="STRETCH")return{position:e,size:Math.abs(n+o)};if(i==="SCALE"&&t>0){let s=r/t;return{position:Math.round(e*s*128)/128,size:n*s}}return{position:e,size:n}}function Ay(e,n,t,r,i,o=null){let s=Ey(Ju(e.x,e.width,n.width,t.width,r),Ju(e.y,e.height,n.height,t.height,i),r,i,o);return{x:s.x.position,y:s.y.position,width:s.x.size,height:s.y.size}}var Ny=new Set(["x","y","width","height"]);function Cy(e,n,t,r){let i={width:n.width*r,height:n.height*r};if(i.width===t.width&&i.height===t.height)return e;let o=Ay(e,i,t,e.horizontalConstraint,e.verticalConstraint,yc(e));return{...e,...o}}var Oy=.001,xy=["strokes","strokeWeight","strokeAlign","strokeCap","strokeJoin","strokeMiterLimit","dashPattern"],yt=(e,n)=>Math.abs(e-n)<=Oy;function Dy(e,n){if(!e||!n)return e===n;if(e.vertices.length!==n.vertices.length||e.segments.length!==n.segments.length)return!1;let t=e.vertices.every((i,o)=>{let{x:s,y:a,...l}=i,{x:u,y:c,...f}=n.vertices[o];return yt(s,u)&&yt(a,c)&&he(l,f)}),r=e.segments.every((i,o)=>{let s=n.segments[o];return i.start===s.start&&i.end===s.end&&yt(i.tangentStart.x,s.tangentStart.x)&&yt(i.tangentStart.y,s.tangentStart.y)&&yt(i.tangentEnd.x,s.tangentEnd.x)&&yt(i.tangentEnd.y,s.tangentEnd.y)});return t&&r&&he(e.regions,n.regions)}function Ry(e,n,t){if(t.type!=="VECTOR")return;let r=e.width??n.width,i=e.height??n.height,o=t.width>0?r/t.width:1,s=t.height>0?i/t.height:1,a=o!==1||s!==1,l=d=>a?ls([o,0,0,0,s,0,0,0,1],d):Wt(d),u=t.vectorNetwork?l(t.vectorNetwork):null;if(Dy(n.vectorNetwork,u))return;let c=d=>a?gt(d,o,s):Gn(d),f=xy.every(d=>he(e[d]??n[d],t[d]));e.vectorNetwork=u,e.fillGeometry=c(t.fillGeometry),e.strokeGeometry=f?c(t.strokeGeometry):[]}function Ze(e,n,t){e[n]=t}function gi(e,n,t){if(t==="fills")Ze(e,t,He(n.fills));else if(t==="strokes")Ze(e,t,Bn(n.strokes));else if(t==="effects")Ze(e,t,Xt(n.effects));else if(t==="styleRuns")Ze(e,t,jt(n.styleRuns));else if(t==="boundVariables")Ze(e,t,{...n.boundVariables}),Ze(e,"variableBindingScales",{...n.variableBindingScales});else if(t==="variableModes")Ze(e,t,{...n.variableModes});else if(t==="gridPosition")Ze(e,t,n.gridPosition?{...n.gridPosition}:null);else if(t==="targetAspectRatio")Ze(e,t,n.targetAspectRatio?{...n.targetAspectRatio}:null);else{let r=n[t];Ze(e,t,Array.isArray(r)?structuredClone(r):r)}}function Ic(e){let n=new Set;for(let t of e){let r=[...t].some(i=>i.startsWith("boundVariables/"));for(let i of t)(i!=="boundVariables"||!r)&&n.add(i)}return t=>n.has(t)}function vc(e,n,t,r){if(r("boundVariables"))return;let i={...n.boundVariables},o={...n.variableBindingScales};for(let s of new Set([...Object.keys(n.boundVariables),...Object.keys(e.boundVariables),...Object.keys(e.variableBindingScales)]))r(`boundVariables/${s}`)&&(Object.hasOwn(e.boundVariables,s)?i[s]=e.boundVariables[s]:Reflect.deleteProperty(i,s),e.variableBindingScales[s]===void 0?Reflect.deleteProperty(o,s):o[s]=e.variableBindingScales[s]);t.boundVariables=i,t.variableBindingScales=o}function Tc(e,n,t){return t(n)||n in e.boundVariables&&(t("boundVariables")||t(`boundVariables/${n}`))}function hi(e,n){let t=n/e.componentScale;if(!Number.isFinite(t)||t<=0)throw new Error("Invalid component coordinate scale");return t===1?e:{...e,...mi(e,t,!0),...hc(e,t)}}function My(e,n,t,{compParent:r,instParent:i,factor:o,skip:s}){let a=i.layoutMode!=="NONE"&&t.layoutPositioning!=="ABSOLUTE",l=a?t:Cy(t,r,i,o);for(let u of pi){if(u==="boundVariables"||a&&(u==="x"||u==="y")||s(u))continue;let c=dy[u];if(c&&s(c))continue;let f=Ny.has(u)?l:t;he(n[u],f[u])||gi(e,f,u)}Ry(e,n,t),iy(e,n)}function Sc(e,n,t){let r=Object.fromEntries(Object.entries(t).filter(([i,o])=>!he(n[i],o)));Object.keys(r).length&&e.updateNode(n.id,r)}function bc(e,n,t,r,i="deep"){let o=n.componentScale*r.componentScale/t.componentScale;return e.createNode(n.type,r.id,{...ht(hi(n,o),n.id,i),componentScale:o})}function It(e,n,t,r="deep"){if(n===t||e.isDescendant(t,n))return;let i=e.nodes.get(n),o=e.nodes.get(t);if(!(!i||!o))for(let s of i.childIds){let a=e.nodes.get(s);if(!a)continue;let l=bc(e,a,i,o,r);a.childIds.length>0&&It(e,s,l.id,r)}}function Ec(e,n){let t=[],r=n.parentId?e.nodes.get(n.parentId):void 0;for(;r;)r.type==="INSTANCE"&&t.push(new Set(r.instanceOverrides.descendants.get(n.id)?.keys())),r=r.parentId?e.nodes.get(r.parentId):void 0;return t}var Ac={VISIBLE:"visible",TEXT:"text",INSTANCE_SWAP:"componentId"},Py=16;function wy(e,n,t){let r=n.componentId?e.nodes.get(n.componentId):void 0;for(let s=0;r?.type==="INSTANCE"&&s<Py;s++)r=r.componentId?e.nodes.get(r.componentId):void 0;let i=r?.parentId?e.nodes.get(r.parentId):void 0,o=i?.type==="COMPONENT_SET"?i:void 0;return[r,o].flatMap(s=>s?.componentPropertyDefinitions??[]).some(s=>s.id===t)}function Cs(e,n,t){let r=n;for(;r;){if(r.type==="INSTANCE"){if(Object.hasOwn(r.componentPropertyAssignments,t))return r.componentPropertyAssignments[t];if(wy(e,r,t))return}r=r.parentId?e.nodes.get(r.parentId):void 0}}function ky(e,n,t){return Cs(e,n,t)!==void 0}function Nc(e,n){for(let t of n.componentPropertyReferences){let r=Ac[t.field];if(!r)continue;let i=Cs(e,n,t.propertyId);i!==void 0&&(r==="visible"?e.updateNode(n.id,{visible:i==="true"}):r==="text"?e.updateNode(n.id,{text:i}):r==="componentId"&&n.type==="INSTANCE"&&e.nodes.has(i)&&e.swapInstanceComponent(n.id,i))}for(let t of e.getChildren(n.id))Nc(e,t)}function Ly(e,n,t){let r=new Set;for(let i of t.componentPropertyReferences){let o=Ac[i.field];o&&ky(e,n,i.propertyId)&&r.add(o)}return r}function _y(e,n,t){let r={};for(let i of t.componentPropertyReferences){let o=Cs(e,n,i.propertyId);o!==void 0&&(i.field==="TEXT"&&n.type==="TEXT"?r.text=o:i.field==="VISIBLE"&&(r.visible=o==="true"))}return r}function Vy(e,n,t){let r=Ec(e,n);return r.push(new Set(t.descendants.get(n.id)?.keys())),Ic(r)}function Fy(e,n,t,r){t.type==="INSTANCE"?le(e,n,t.id,"sourceComponentId",r):t.componentId=r}function Gy(e,n,t,r,i,o,s){let a=new Map,l=new Map,u=new Map;for(let c of n.childIds){if(o.has(c))continue;let f=e.nodes.get(c);f&&u.set(f.type,(u.get(f.type)??0)+1)}for(let c of t.childIds){let f=e.nodes.get(c);if(!f||s.has(f.id))continue;l.set(f.type,(l.get(f.type)??0)+1);let d=a.get(f.type);d||(d=new Map,a.set(f.type,d));let p=d.get(f.name);p?p.push(f):d.set(f.name,[f])}for(let c of n.childIds){if(o.has(c))continue;let f=e.nodes.get(c);if(!f)continue;let d=a.get(f.type),p=l.get(f.type)??0;if(p>(u.get(f.type)??0))continue;let g=d?.get(f.name)?.shift();g&&(l.set(f.type,p-1),o.set(c,g),s.add(g.id),Fy(i,r,g,c))}}function By(e,n,t,r,i){let o=new Map;for(let a=0;a<r.length;a++)o.set(r[a],a);let s=new Map;for(let a=0;a<n.childIds.length;a++){let l=n.childIds[a],u=e.nodes.get(l),c=u?Je(i,t,u.id,"sourceComponentId"):void 0,f=typeof c=="string"?c:u?.componentId,d=f?o.get(f):void 0;s.set(l,d??r.length+a)}n.childIds.toSorted((a,l)=>(s.get(a)??0)-(s.get(l)??0)).forEach((a,l)=>{n.childIds[l]!==a&&e.insertChildAt(a,t,l)})}function Uy(e,n,t){return n===t||e.isDescendant(t,n)}function zy(e,n,t,r,i,o,s){for(let a of n.childIds){let l=e.nodes.get(a);if(!l)continue;let u=Je(r,t,l.id,"sourceComponentId"),c=typeof u=="string"?u:l.componentId;c&&i.has(c)&&(o.set(c,l),s.add(l.id))}}function Hy(e,n,t,r,i,o){for(let s of r.values())o.matched.add(s.id);for(let s of n.childIds){if(r.has(s))continue;let a=ay(e,o,s,t.id)??uy(e,o,s,t.id);if(a){e.insertChildAt(a.id,t.id,t.childIds.length),r.set(s,a),i.add(a.id),o.matched.add(a.id);continue}let l=e.nodes.get(s);if(!l)continue;let u=bc(e,l,n,t);l.childIds.length>0&&!uc(e,o,s)&&It(e,s,u.id),Nc(e,u),r.set(s,u),i.add(u.id),o.matched.add(u.id)}for(let s of t.childIds)i.has(s)||o.leftovers.add(s)}function Cc(e,n,t,r,i=sc(t,r)){if(Uy(e,n,t))return;let o=e.nodes.get(n),s=e.nodes.get(t);if(!o||!s)return;let a=new Map,l=new Set;zy(e,s,t,r,new Set(o.childIds),a,l),Gy(e,o,s,t,r,a,l),Hy(e,o,s,a,l,i);for(let u of o.childIds){let c=e.nodes.get(u),f=a.get(u);if(!c||!f)continue;let d=Vy(e,f,r),p=Ly(e,f,c),g=c.componentScale*s.componentScale/o.componentScale,m=hi(c,g),h={componentScale:g,componentPropertyReferences:structuredClone(c.componentPropertyReferences)};vc(f,m,h,d),My(h,f,m,{compParent:o,instParent:s,factor:g/c.componentScale,skip:T=>p.has(T)||Tc(f,T,d)}),Object.assign(h,_y(e,f,c)),nc(e,h,f,m),Sc(e,f,h),c.childIds.length>0&&!ai(r,t,f.id,"componentId")&&!$t(e,f,We(c))&&Cc(e,u,f.id,r,i)}By(e,s,t,o.childIds,r)}function Oc(e){let n={};for(let t of qt)gi(n,e,t);return n}function xc(e,n,t,r={}){let i=e.nodes.get(n);if(i?.type!=="COMPONENT"||!vs(e,n,t))return null;let o={...Oc(i),name:i.name},s=e.createNode("INSTANCE",t,{...o,...r,componentId:n});return It(e,i.id,s.id),s}function Dc(e,n,t,r="deep"){let i=e.nodes.get(n),o=e.nodes.get(t);!i||!o||i.type!=="INSTANCE"||It(e,t,n,r)}function Wy(e,n,t){let r=n.parentId?Zt(e,n.parentId):void 0;r&&(typeof Je(r.instanceOverrides,r.id,n.id,"sourceComponentId")!="string"&&n.componentId&&le(r.instanceOverrides,r.id,n.id,"sourceComponentId",n.componentId),le(r.instanceOverrides,r.id,n.id,"componentId",t),e.updateNode(r.id,{instanceOverrides:r.instanceOverrides}))}function Rc(e,n,t,{keepName:r=!1}={}){let i=e.nodes.get(n),o=e.nodes.get(t);if(!i||o?.type!=="COMPONENT"||i.type!=="INSTANCE"||i.parentId&&!vs(e,t,i.parentId))return;let s=i.componentId?e.nodes.get(i.componentId):void 0;Wy(e,i,t);let a={componentId:t},l=hi(o,i.componentScale);for(let f of qt)ai(i.instanceOverrides,i.id,i.id,f)||gi(a,l,f);!r&&(!s||i.name===s.name)&&(a.name=o.name);let u=Array.from(i.childIds),c=ic(e,i);for(let f of u)e.deleteNode(f);e.updateNode(n,a),It(e,t,n),oc(e,i,c)}var Zu=new WeakMap;function Os(e,n){wc(e,n,xs(e,n))}function Mc(e,n){cc(e,()=>{for(let t of n)Os(e,t)})}function Pc(e,n){let t=e.nodes.get(n);t?.type!=="INSTANCE"||!t.componentId||wc(e,t.componentId,[t])}function wc(e,n,t){let r=e.nodes.get(n);if(r?.type!=="COMPONENT")return;let i=Zu.get(e);if(i||(i=new Set,Zu.set(e,i)),!i.has(n)){i.add(n);try{cc(e,o=>{for(let s of t){let a=Ec(e,s);a.push(new Set(s.instanceOverrides.self.keys()));let l=Ic(a),u=hi(r,s.componentScale),c={};vc(s,u,c,l);for(let d of qt)d!=="boundVariables"&&(Tc(s,d,l)||gi(c,u,d));nc(e,c,s,u),Sc(e,s,c);let f=sc(s.id,s.instanceOverrides);Cc(e,r.id,s.id,s.instanceOverrides,f),cy(e,f,o)}})}finally{i.delete(n)}}}function kc(e,n){let t=e.nodes.get(n);t?.type==="INSTANCE"&&(t.componentId&&e.instanceIndex.get(t.componentId)?.delete(n),t.type="FRAME",t.componentId=null,os(t.instanceOverrides))}function Lc(e,n){let t=e.nodes.get(n);if(t?.componentId)return e.nodes.get(t.componentId)}function xs(e,n){let t=e.instanceIndex.get(n);if(!t)return[];let r=[];for(let i of t){let o=e.nodes.get(i);o&&r.push(o)}return r}function Zt(e,n){let t=e.nodes.get(n);for(;t;){if(t.type==="INSTANCE")return t;t=t.parentId?e.nodes.get(t.parentId):void 0}}var _c=["x","y","rotation","flipX","flipY"],Vc=["width","height"];var Fc=()=>[1,0,0,0,1,0,0,0,1],Xy=(e,n)=>[e[0]*n[0]+e[1]*n[3]+e[2]*n[6],e[0]*n[1]+e[1]*n[4]+e[2]*n[7],e[0]*n[2]+e[1]*n[5]+e[2]*n[8],e[3]*n[0]+e[4]*n[3]+e[5]*n[6],e[3]*n[1]+e[4]*n[4]+e[5]*n[7],e[3]*n[2]+e[4]*n[5]+e[5]*n[8],e[6]*n[0]+e[7]*n[3]+e[8]*n[6],e[6]*n[1]+e[7]*n[4]+e[8]*n[7],e[6]*n[2]+e[7]*n[5]+e[8]*n[8]],jy=(...e)=>{if(e.length===0)return Fc();let n=e[0].slice();for(let t=1;t<e.length;t++)n=Xy(n,e[t]);return n},Ky=(e,n)=>[1,0,e,0,1,n,0,0,1],Yy=(e,n=0,t=0)=>{let r=Math.sin(e),i=Math.cos(e);return[i,-r,r*t+(1-i)*n,r,i,-r*n+(1-i)*t,0,0,1]},$y=(e,n,t=0,r=0)=>[e,0,t-e*t,0,n,r-n*r,0,0,1],qy=e=>{let n=e[0]*e[4]*e[8]+e[1]*e[5]*e[6]+e[2]*e[3]*e[7]-e[2]*e[4]*e[6]-e[1]*e[3]*e[8]-e[0]*e[5]*e[7];return n?[(e[4]*e[8]-e[5]*e[7])/n,(e[2]*e[7]-e[1]*e[8])/n,(e[1]*e[5]-e[2]*e[4])/n,(e[5]*e[6]-e[3]*e[8])/n,(e[0]*e[8]-e[2]*e[6])/n,(e[2]*e[3]-e[0]*e[5])/n,(e[3]*e[7]-e[4]*e[6])/n,(e[1]*e[6]-e[0]*e[7])/n,(e[0]*e[4]-e[1]*e[3])/n]:null},Gc=(e,n)=>{if(n.length%2)throw new Error("mapPoints requires even length [x,y,...].");let t=n.slice();for(let r=0;r<t.length;r+=2){let i=t[r],o=t[r+1],s=e[6]*i+e[7]*o+e[8],a=e[0]*i+e[1]*o+e[2],l=e[3]*i+e[4]*o+e[5];t[r]=a/s,t[r+1]=l/s}return t},Jy=(e,n)=>{let t=Gc(e,[n.x,n.y]);return{x:t[0],y:t[1]}},ve={identity:Fc,multiply:jy,translated:Ky,rotated:Yy,scaled:$y,invert:qy,mapPoints:Gc,mapPoint:Jy};function yi(e,n){let t=[],r=e;for(;r&&(t.unshift(r),!!r.parentId);)r=n.getNode(r.parentId);let i=ve.identity();for(let o of t){let s=Ii(o);i=ve.multiply(i,s)}return i}function Bc(e,n){return!e||e.id===n.rootId?ve.identity():yi(e,n)}function Uc(e,n){let t=yi(e,n),r=ve.mapPoints(t,[0,0]);return{x:r[0],y:r[1]}}function Zy(e){return e.type==="LINE"?{x:0,y:0}:{x:e.width/2,y:e.height/2}}function Ii(e,n=e){let t=ve.translated(n.x,n.y);if((e.flipX||e.flipY)&&(t=ve.multiply(t,ve.scaled(e.flipX?-1:1,e.flipY?-1:1,e.width/2,e.height/2))),e.rotation){let r=Zy(e);t=ve.multiply(t,ve.rotated(e.rotation*Math.PI/180,r.x,r.y))}return t}function zc(e,n,t){let r=ve.invert(t);if(!r)return null;let i=ve.multiply(r,n),[o,s,,a,l]=i,u=e.flipX?-1:1,c=o*l-s*a<0?-u:u,f=Math.atan2(c*a,u*o)*180/Math.PI;Math.abs(f)<1e-9&&(f=0);let d={rotation:f,flipX:u<0,flipY:c<0},p=Ii({...e,...d},{x:0,y:0});return{...d,x:i[2]-p[2],y:i[5]-p[5]}}function Ds(e){return e[0]===1&&e[1]===0&&e[3]===0&&e[4]===1}function Rs(e){let n={},t=Object.keys(e);for(let r=0;r<t.length;r++){let i=t[r],o=e[i];n[o]=i}return n}function Ms(e,n){let t={},r=Object.keys(e);for(let i=0;i<r.length;i++){let o=r[i],s=e[o];t[o]=n(s,o,e)}return t}function ke(e,n){let t={...e};for(let r=0;r<n.length;r++){let i=n[r];delete t[i]}return t}function vi(e,n){let t={},r=Object.keys(e);for(let i=0;i<r.length;i++){let o=r[i],s=o,a=e[s];n(a,o)||(t[s]=a)}return t}function Ps(e,n,t){let r=e[n].length,i=Object.keys(e.boundVariables).filter(o=>{if(o===n)return!0;if(!o.startsWith(`${n}/`))return!1;let s=Number.parseInt(o.split("/")[1]??"",10);return Number.isNaN(s)||s<0||s>=r});i.length!==0&&(e.boundVariables=ke(e.boundVariables,i),t.boundVariables={...e.boundVariables})}var Hc=()=>({emit(e,...n){for(let t=this.events[e]||[],r=0,i=t.length;r<i;r++)t[r](...n)},events:{},on(e,n){return(this.events[e]||=[]).push(n),()=>{this.events[e]=this.events[e]?.filter(t=>n!==t)}}});var Qy=class extends AggregateError{committed=!0;constructor(e){super(e,"Committed graph event delivery failed"),this.name="CommittedGraphEventError"}},Wc=class{delegate=Hc();buffers=[];get events(){return this.delegate.events}set events(e){this.delegate.events=e}on(e,n){return this.delegate.on(e,n)}emit(e,...n){let t=this.buffers.at(-1);t?t.push(()=>this.delegate.emit(e,...n)):this.delegate.emit(e,...n)}batch(e){let n=[];this.buffers.push(n);let t;try{t=e()}catch(i){throw this.buffers.pop(),i}this.buffers.pop();let r=this.buffers.at(-1);if(r)r.push(...n);else{let i=[];for(let o of n)try{o()}catch(s){i.push(s)}if(i.length)throw new Qy(i)}return t}};function Xc(e,n){let t=[n.created?e.on("node:created",n.created):null,n.updated?e.on("node:updated",n.updated):null,n.previewUpdated?e.on("node:previewUpdated",n.previewUpdated):null,n.deleted?e.on("node:deleted",n.deleted):null,n.reparented?e.on("node:reparented",n.reparented):null,n.reordered?e.on("node:reordered",n.reordered):null].filter(r=>!!r);return()=>{for(let r of t)r()}}var e0=new Set(["CANVAS","FRAME","GROUP","SECTION","COMPONENT","COMPONENT_SET","INSTANCE"]),n0=new Set(["COMPONENT","INSTANCE"]);function Kc(e){return e.fills.some(n=>n.visible)||e.strokes.some(n=>n.visible)}function Yc(e,n){let t=n.parentId?e.nodes.get(n.parentId):void 0;return t?.type==="CANVAS"||t?.type==="SECTION"}function Ti(e,n){return n.type==="FRAME"&&n.layoutMode!=="NONE"&&Yc(e,n)}function $c(e,n,t){let r=t.get(e.id);if(r!==void 0)return r;let i=e.parentId?n.getNode(e.parentId):void 0,o=e.rotation!==0||e.flipX||e.flipY||(i?$c(i,n,t):!1);return t.set(e.id,o),o}function en(e,n,t,r,i,o=0){if(!$c(t,r,i)){let c=r.getAbsolutePosition(t.id);return e>=c.x-o&&e<=c.x+t.width+o&&n>=c.y-o&&n<=c.y+t.height+o}let s=yi(t,r),a=ve.invert(s);if(!a)return!1;let[l,u]=ve.mapPoints(a,[e,n]);return l>=-o&&l<=t.width+o&&u>=-o&&u<=t.height+o}function t0(e,n,t,r,i,o,s,a){return en(n,t,r,e,s)&&(Un(e,n,t,i,o,s,a)||Kc(r))?r:null}function r0(e,n,t,r,i,o,s,a){if(r.type==="GROUP"){if(!en(n,t,r,e,s,a))return null;let u=Un(e,n,t,i,o,s,a);return u?o?u:r:en(n,t,r,e,s)?r:null}let l=Un(e,n,t,i,o,s,a);return l?r.locked?r:l:en(n,t,r,e,s)&&(Kc(r)||Ti(e,r))?r:null}function Un(e,n,t,r,i=!1,o=new Map,s=0){let a=e.nodes.get(r);if(!a||a.clipsContent&&!en(n,t,a,e,o))return null;for(let l=a.childIds.length-1;l>=0;l--){let u=a.childIds[l],c=e.nodes.get(u);if(!(!c||c.internalOnly||!c.visible)){if(e0.has(c.type)){if(n0.has(c.type)&&!i){let d=t0(e,n,t,c,u,i,o,s);if(d)return d;continue}let f=r0(e,n,t,c,u,i,o,s);if(f)return f;continue}if(en(n,t,c,e,o,s))return c}}return null}function qc(e,n,t,r){return Un(e,n,t,r??e.rootId,!1)}function Jc(e,n,t,r,i=0){return Un(e,n,t,r??e.rootId,!0,new Map,i)}function Qt(e,n){return n.type==="COMPONENT_SET"?!0:n.childIds.length===0?!1:n.type==="SECTION"?!0:n.type==="FRAME"&&Yc(e,n)}function jc(e,n,t,r){let i=new Map;for(let o=n.childIds.length-1;o>=0;o--){let s=e.nodes.get(n.childIds[o]);if(!(!s||s.internalOnly||!s.visible||s.type!=="FRAME")&&!(Qt(e,s)&&!Ti(e,s))&&en(t,r,s,e,i))return s}return null}function i0(e,n,t){let r=new Set;for(let i of n){let o=e.nodes.get(i);o&&o.childIds.length>0&&o.type!=="GROUP"&&o.type!=="BOOLEAN_OPERATION"&&r.add(i);let s=o?.parentId;for(;s&&s!==t&&!r.has(s);)r.add(s),s=e.nodes.get(s)?.parentId}return r}function Zc(e,n,t,r,i,o=0){let s=Un(e,n,t,r,!0,new Map,o);if(!s){let f=e.nodes.get(r);return f?jc(e,f,n,t):null}let a=[];for(let f=s;f&&f.id!==r;)a.unshift(f),f=f.parentId?e.nodes.get(f.parentId):void 0;let l=i0(e,i,r);for(let f of a)if(f.locked||!l.has(f.id)&&!Qt(e,f))return f;let u=a.at(-1);if(!u)return null;let c=jc(e,u,n,t);return c||(Ti(e,u)||l.has(u.id)&&!Qt(e,u)?u:null)}function Qc(e,n){let t=e.nodes.get(n);return t!==void 0&&Qt(e,t)}function ef(e,n,t,r){let i=Un(e,n,t,r,!0);for(let o=i??void 0;o&&o.id!==r;){if(!Qt(e,o)||Ti(e,o))return null;o=o.parentId?e.nodes.get(o.parentId):void 0}return i}function nf(e,n,t,r){let i=e.nodes.get(n);return i!==void 0&&en(t,r,i,e,new Map)}var o0=new Set(["FRAME","SECTION","COMPONENT","INSTANCE"]),s0=new Set(["FRAME","SECTION","INSTANCE"]);function a0(e){let{componentSetIds:n}=e;return n?{takes:t=>s0.has(t.type)||t.type==="COMPONENT_SET"&&n.has(t.id),passThrough:new Set(["GROUP"])}:{takes:t=>o0.has(t.type),passThrough:new Set(["GROUP","COMPONENT_SET"])}}function tf(e,n,t,r,i,o,s){if(r.type!=="CANVAS"&&r.clipsContent&&!en(n,t,r,e,s))return null;for(let a=r.childIds.length-1;a>=0;a--){let l=r.childIds[a];if(i.has(l))continue;let u=e.nodes.get(l);if(!u||u.internalOnly||!u.visible||u.locked)continue;let c=o.takes(u);if(!c&&!o.passThrough.has(u.type))continue;let f=tf(e,n,t,u,i,o,s);if(f)return f;if(c&&en(n,t,u,e,s))return u}return null}function rf(e,n,t,r,i,o={}){let s=e.nodes.get(i??e.rootId);return s?tf(e,n,t,s,r,a0(o),new Map):null}function ws(e,n){let t={};for(let r=0;r<e.length;r++){let i=e[r],o=n(i,r,e);Object.hasOwn(t,o)||(t[o]=[]),t[o].push(i)}return t}function ks(e,n){let t=[],r=[];for(let i=0;i<e.length;i++){let o=e[i];n(o,i,e)?t.push(o):r.push(o)}return[t,r]}function Ls(e,n){let t=n,r=n;for(;r&&!(r.type==="COMPONENT"||r.type==="COMPONENT_SET");)r.type==="INSTANCE"&&(t=r),r=r.parentId?e.getNode(r.parentId):void 0;return t}function ff(e,n,t){if(!mn(t))return;let r=Ls(e,n);n.variableBindingScales={...n.variableBindingScales,[t]:r.variableAssignmentScales[t]??1}}function _s(e){if(typeof e=="string")return e;if(typeof e=="boolean")return String(e);if(typeof e=="number"&&Number.isFinite(e))return p0(e)}var c0=-2147483648,f0=2147483647,d0=1e-6;function p0(e){let n=Math.round(e);if(Math.abs(e-n)<d0)return String(Math.min(f0,Math.max(c0,n))||0);let t=Math.abs(e)*100,r=Math.floor(t),i=t-r===.5?r+r%2:Math.round(t);return`${e<0?"-":""}${Math.floor(i/100)}.${String(i%100).padStart(2,"0")}`}function of(e,n){e.color={...n,a:1},e.opacity=n.a}function Si(e,n,t="active"){let r={};for(let i in n.boundVariables){if(!i.endsWith("/color"))continue;let o=/^(fills|strokes)\/(\d+)\/color$/.exec(i);if(!o)continue;let s=e.resolveColorVariableForNode(n.id,n.boundVariables[i],t),a=Number(o[2]);if(s)if(o[1]==="fills"){if(!n.fills[a])continue;r.fills??=He(n.fills),of(r.fills[a],s)}else{if(!n.strokes[a])continue;r.strokes??=Bn(n.strokes),of(r.strokes[a],s)}}return r}function df(e,n){e.variables.set(n.id,n);let t=e.variableCollections.get(n.collectionId);t&&!t.variableIds.includes(n.id)&&t.variableIds.push(n.id)}function pf(e,n){let t=e.variables.get(n);if(!t)return;e.variables.delete(n);let r=e.variableCollections.get(t.collectionId);r&&(r.variableIds=r.variableIds.filter(i=>i!==n));for(let i of e.nodes.values())Object.values(i.boundVariables).includes(n)&&(e.willChangeNode(i),i.boundVariables=vi(i.boundVariables,o=>o===n),i.variableBindingScales=vi(i.variableBindingScales,(o,s)=>!(s in i.boundVariables)),e.emitter.emit("node:updated",i.id,{boundVariables:{...i.boundVariables},variableBindingScales:{...i.variableBindingScales}}),Fs(e,i.id))}function mf(e,n){e.variableCollections.set(n.id,n),e.activeMode.has(n.id)||e.activeMode.set(n.id,n.defaultModeId)}function m0(e,n){return n!==void 0?n:e==="COLOR"?{...Cn}:e==="FLOAT"?0:e==="BOOLEAN"?!1:""}function g0(e,n,t,r,i,o){let s=e.variableCollections.get(i);if(!s)throw new Error(`Collection "${i}" not found`);let a=n(),l=m0(r,o),u={};for(let f of s.modes)u[f.modeId]=structuredClone(l);let c={id:a,name:t,type:r,collectionId:i,valuesByMode:u,description:"",hiddenFromPublishing:!1};return df(e,c),c}function h0(e,n,t){let r=n(),i=n(),o={id:r,name:t,modes:[{modeId:i,name:"Mode 1"}],defaultModeId:i,variableIds:[]};return mf(e,o),o}function y0(e,n){let t=e.variableCollections.get(n);if(t)for(let r of Array.from(t.variableIds))pf(e,r);e.variableCollections.delete(n),e.activeMode.delete(n)}function Vs(e,n){let t=e.activeMode.get(n);return t||(e.variableCollections.get(n)?.defaultModeId??"")}function bi(e,n,t,r="active"){let i=e.nodes.get(n);for(;i;){let o=i.variableModes[t];if(o)return o;i=i.parentId?e.nodes.get(i.parentId):void 0}return r==="default"?e.variableCollections.get(t)?.defaultModeId??"":Vs(e,t)}function I0(e,n,t){e.activeMode.set(n,t)}function gf(e,n,t,r,i){let o=e.variableCollections.get(n);if(!o)return;o.modes.push({modeId:t,name:r});let s=i??o.defaultModeId;for(let a of o.variableIds){let l=e.variables.get(a);l&&(l.valuesByMode[t]=structuredClone(l.valuesByMode[s]??Object.values(l.valuesByMode)[0]))}}function v0(e,n,t,r,i){if(!e.variableCollections.has(t))return;let o=n();return gf(e,t,o,r,i),o}function T0(e,n,t){let r=e.variableCollections.get(n);if(!(!r||r.modes.length<=1)){r.modes=r.modes.filter(i=>i.modeId!==t),r.defaultModeId===t&&(r.defaultModeId=r.modes[0].modeId);for(let i of r.variableIds){let o=e.variables.get(i);o&&(o.valuesByMode=ke(o.valuesByMode,[t]))}e.activeMode.get(n)===t&&e.activeMode.set(n,r.defaultModeId)}}function S0(e,n,t,r){let i=e.variableCollections.get(n);if(!i)return;let o=i.modes.find(s=>s.modeId===t);o&&(o.name=r)}function b0(e,n,t){let r=e.variableCollections.get(n);r&&r.modes.some(i=>i.modeId===t)&&(r.defaultModeId=t,r.modes=hf(r))}function hf(e){let[n,t]=ks(e.modes,r=>r.modeId===e.defaultModeId);return[...n,...t]}function zn(e,n,t,r){if(r?.has(n))return;let i=e.variables.get(n);if(!i)return;let o=e.variableCollections.get(i.collectionId),s=t??Vs(e,i.collectionId),a=o?.defaultModeId,l=Object.hasOwn(i.valuesByMode,s)?i.valuesByMode[s]:void 0;if(l===void 0&&a&&Object.hasOwn(i.valuesByMode,a)&&(l=i.valuesByMode[a]),l??=Object.values(i.valuesByMode)[0],l&&typeof l=="object"&&"aliasId"in l){let u=r??new Set;return u.add(n),zn(e,l.aliasId,s,u)}return l}function E0(e,n){let t=zn(e,n);if(t&&typeof t=="object"&&"r"in t)return t}function A0(e,n){let t=zn(e,n);return typeof t=="number"?t:void 0}function N0(e,n,t,r="active"){let i=e.variables.get(t);if(!i)return;let o=zn(e,t,bi(e,n,i.collectionId,r));if(o&&typeof o=="object"&&"r"in o)return o}function C0(e,n,t,r="active"){let i=e.variables.get(t);if(!i)return;let o=zn(e,t,bi(e,n,i.collectionId,r));return typeof o=="number"?o:void 0}function yf(e,n,t,r="active"){let i=e.variables.get(t);if(i)return zn(e,t,bi(e,n,i.collectionId,r))}function O0(e,n,t,r="active"){let i=yf(e,n,t,r);return typeof i=="string"?i:void 0}function x0(e,n){let t=e.variableCollections.get(n);return t?t.variableIds.map(r=>e.variables.get(r)).filter(r=>r!==void 0):[]}function D0(e,n){return[...e.variables.values()].filter(t=>t.type===n)}function R0(e,n,t,r){let i=e.nodes.get(n);if(!i)return;let o=e.variables.get(r);if(!o)throw new Error(`Variable "${r}" not found`);let s=t.match(/^(fills|strokes)\/(\d+)\/color$/);if(s){if(o.type!=="COLOR")throw new Error(`Cannot bind ${o.type} variable to color field "${t}"`);let a=s[1],l=Number.parseInt(s[2],10),u=i[a]?.length??0;if(l>=u)throw new Error(`Index ${l} out of range for ${a} (length ${u})`);let c=s[1];c in i.boundVariables&&(i.boundVariables=ke(i.boundVariables,[c]))}if(mn(t)&&o.type!=="FLOAT")throw new Error(`Cannot bind ${o.type} variable to scalar field "${t}"`);if(As.has(t)&&o.type!=="STRING")throw new Error(`Cannot bind ${o.type} variable to string field "${t}"`);if(Ns.has(t)&&o.type!=="BOOLEAN")throw new Error(`Cannot bind ${o.type} variable to boolean field "${t}"`);if(!(mn(t)||As.has(t)||Ns.has(t)||s))throw new Error(`Unknown binding field "${t}"`);e.willChangeNode(i),i.boundVariables={...i.boundVariables,[t]:r},ff(e,i,t),Fs(e,n,t),e.emitter.emit("node:updated",n,{boundVariables:{...i.boundVariables},variableBindingScales:{...i.variableBindingScales}})}function M0(e,n,t){let r=e.nodes.get(n);r&&t in r.boundVariables&&(e.willChangeNode(r),r.boundVariables=ke(r.boundVariables,[t]),r.variableBindingScales=ke(r.variableBindingScales,[t]),Fs(e,n,t),e.emitter.emit("node:updated",n,{boundVariables:{...r.boundVariables},variableBindingScales:{...r.variableBindingScales}}))}function Fs(e,n,t){let r=e.nodes.get(n);if(!r)return;let i=Ls(e,r);if(i.type!=="INSTANCE")return;let o=Zt(e,n);o&&le(o.instanceOverrides,o.id,n,"boundVariables"),le(i.instanceOverrides,i.id,n,"boundVariables"),t&&le(i.instanceOverrides,i.id,n,`boundVariables/${t}`,r.boundVariables[t]??null)}function Gs(e,n){return e.map(t=>{let{boundVariables:r,textStyleId:i,fillStyleId:o,hyperlink:s}=t.style,a=s?.type==="NODE"&&n.node!==void 0;if(!r&&!i&&!o&&!a)return t;let l={...t.style};return s?.type==="NODE"&&n.node&&(l.hyperlink={type:"NODE",value:n.node(s.value)}),r&&(l.boundVariables=Ms(r,u=>u&&n.variable(u))),i&&(l.textStyleId=n.style(i)),o&&(l.fillStyleId=n.style(o)),{...t,style:l}})}var If=["fontFamily","fontWeight","italic","fontSize","lineHeight","letterSpacing","textDecoration","textCase","fontFeatures"],P0=new Set(If);function vf(e,n){let t={...n};return"fills"in n&&!("fillStyleId"in n)&&e.fillStyleId&&(t.fillStyleId=null),"strokes"in n&&!("strokeStyleId"in n)&&e.strokeStyleId&&(t.strokeStyleId=null),"effects"in n&&!("effectStyleId"in n)&&e.effectStyleId&&(t.effectStyleId=null),"layoutGrids"in n&&!("gridStyleId"in n)&&e.gridStyleId&&(t.gridStyleId=null),Object.keys(n).some(r=>P0.has(r))&&!("textStyleId"in n)&&e.textStyleId&&(t.textStyleId=null),t}var Tf=new Set([...Yt,"textDecoration","fills","width","height"]),Sf=new Set(Yt);function bf(e,n){let t={},r=Object.keys(n).filter(o=>!he(e[o],n[o]));e.textPicture&&r.some(o=>Tf.has(o))&&(t.textPicture=null);let i=r.some(o=>Sf.has(o))||ms.some(o=>r.includes(o));return i&&!("derivedLayout"in n)&&(t.derivedLayout=null),e.derivedTextGlyphs&&i&&!n.derivedTextGlyphs&&(e.textPathData&&r.every(o=>o==="width"||o==="height")||(t.derivedTextGlyphs=null,t.textPathData=null)),t}function w0(e,n){Object.assign(e,bf(e,n))}var k0=new Set(["x","y","width","height","rotation","flipX","flipY","parentId","childIds","layoutMode","layoutDirection","layoutWrap","primaryAxisSizing","counterAxisSizing","itemSpacing","counterAxisSpacing","paddingTop","paddingRight","paddingBottom","paddingLeft","layoutGrow","layoutAlignSelf","layoutPositioning","minWidth","maxWidth","minHeight","maxHeight","visible","text","fontSize","lineHeight","letterSpacing","styleRuns","textAutoResize"]);function L0(e,n,t,r){let i=e.nodes.get(n);if(!i||(t=Object.fromEntries(Object.entries(t).filter(([,s])=>s!==void 0)),Object.keys(t).every(s=>i[s]===t[s])))return null;Object.keys(t).some(s=>k0.has(s))&&e.clearAbsPosCache();let o=t;return i.type==="TEXT"&&(o={...bf(i,t),...t}),t.vectorNetwork&&(o={...o,vectorNetwork:ui(t.vectorNetwork)}),r?.(i,o),e.positionPreviewVersion++,Object.assign(i,o),o}function _0(e,n){if(n.length===0)return;let t=new Set(e.source.editedFields);for(let r of n)t.add(r);e.source.editedFields=[...t]}var V0=2;function F0(){return V0+ju(2147483646)}var G0=F0(),B0=1;function Ei(){return`${G0}:${B0++}`}function sf(e){let n={};for(let t of Object.keys(e)){let r=e[t];r!==void 0&&(n[t]=r)}return n}var Bs=class Ef{idGenerator;nodes=new Map;images=new Map;variables=new Map;variableCollections=new Map;activeMode=new Map;rootId;figKiwiVersion=null;figSchemaDeflated=null;documentColorSpace="srgb";enabledLibraries=new Map;emitter=new Wc;absPosCache=new Map;previewMutationDepth=0;previewObservers=[];changeObservers=new Set;sourceMetadataPreservationDepth=0;importedStateApplicationDepth=0;importedIdGenerator;layoutMutationDepth=0;derivedLayoutDepth=0;positionPreviewVersion=0;instanceIndex=new Map;constructor(n=Ei){this.idGenerator=n;let t=mt(this.idGenerator,"FRAME",{name:"Document",width:0,height:0});this.rootId=t.id,this.nodes.set(t.id,t),this.addPage("Page 1")}addPage(n){return this.createNode("CANVAS",this.rootId,{name:n,width:0,height:0})}getPages(n=!1){return this.getChildren(this.rootId).filter(t=>t.type==="CANVAS"&&(n||!t.internalOnly))}getAllNodes(){return this.nodes.values()}getNode(n){return this.nodes.get(n)}onNodeEvents(n){return Xc(this.emitter,n)}observeNodeChanges(n){return this.changeObservers.add(n),()=>this.changeObservers.delete(n)}willChangeNode(n){if(n)for(let t of this.changeObservers)t.before(n)}countDescendants(n){let t=this.nodes.get(n);if(!t)return 0;let r=0,i=[...t.childIds];for(;i.length>0;){let o=i.pop();if(o===void 0)break;r++;let s=this.nodes.get(o);if(s)for(let a of s.childIds)i.push(a)}return r}addVariable(n){df(this,n)}removeVariable(n){pf(this,n)}addCollection(n){mf(this,n)}createVariable(n,t,r,i){return g0(this,()=>this.generateEntityId(),n,t,r,i)}createCollection(n){let t=new Set;return h0(this,()=>this.generateEntityId(t),n)}createMode(n,t,r){return v0(this,()=>this.generateEntityId(),n,t,r)}removeCollection(n){y0(this,n)}getActiveModeId(n){return Vs(this,n)}getNodeVariableModeId(n,t){return bi(this,n,t)}setActiveMode(n,t){I0(this,n,t)}addMode(n,t,r,i){gf(this,n,t,r,i)}removeMode(n,t){T0(this,n,t)}renameMode(n,t,r){S0(this,n,t,r)}setDefaultMode(n,t){b0(this,n,t)}resolveVariable(n,t,r){return zn(this,n,t,r)}resolveColorVariable(n){return E0(this,n)}resolveNumberVariable(n){return A0(this,n)}resolveColorVariableForNode(n,t,r){return N0(this,n,t,r)}resolveNumberVariableForNode(n,t,r){return C0(this,n,t,r)}resolveVariableForNode(n,t,r){return yf(this,n,t,r)}resolveStringVariableForNode(n,t,r){return O0(this,n,t,r)}getVariablesForCollection(n){return x0(this,n)}getVariablesByType(n){return D0(this,n)}bindVariable(n,t,r){R0(this,n,t,r)}unbindVariable(n,t){M0(this,n,t)}getChildren(n){let t=this.nodes.get(n);return t?t.childIds.map(r=>this.nodes.get(r)).filter(r=>r!==void 0):[]}isContainer(n){let t=this.nodes.get(n);return t?as.has(t.type):!1}isDescendant(n,t){return this.closest(n,r=>r.id===t)!==void 0}closest(n,t){let r=this.nodes.get(n);for(let i=0;r&&i<this.nodes.size;i++){if(t(r))return r;r=r.parentId?this.nodes.get(r.parentId):void 0}}pageOf(n){return this.closest(n,t=>t.type==="CANVAS")?.id??null}clearAbsPosCache(){this.absPosCache.clear()}getAbsolutePosition(n){let t=this.absPosCache.get(n);if(t)return t;let r=this.getNode(n);if(!r)return{x:0,y:0};let i=Uc(r,this);return this.absPosCache.set(n,i),i}getAbsoluteBounds(n){let t=this.getAbsolutePosition(n),r=this.nodes.get(n);return{x:t.x,y:t.y,width:r?.width??0,height:r?.height??0}}generateEntityId(n){let t=1/0;for(let r=0;r<t;r++){let i=(this.importedIdGenerator??this.idGenerator)();if(this.isEntityIdTaken(i)||n?.has(i)){t===1/0&&(t=this.entityIdCount()+(n?.size??0)+1);continue}return n?.add(i),i}throw new Error("The ID generator only returned IDs that are in use")}entityIdCount(){let n=this.nodes.size+this.variables.size+this.variableCollections.size;for(let t of this.variableCollections.values())n+=t.modes.length;return n}isEntityIdTaken(n){if(this.nodes.has(n)||this.variables.has(n)||this.variableCollections.has(n))return!0;for(let t of this.variableCollections.values())for(let r of t.modes)if(r.modeId===n)return!0;return!1}registerNode(n,t){n.parentId=t,this.nodes.set(n.id,n);for(let r of this.changeObservers)r.created(n);if(n.type==="INSTANCE"&&n.componentId){let r=this.instanceIndex.get(n.componentId);r||(r=new Set,this.instanceIndex.set(n.componentId,r)),r.add(n.id)}return this.emitter.emit("node:created",n),n}withBufferedEvents(n){return this.emitter.batch(n)}createNode(n,t,r={}){let i=mt(()=>this.generateEntityId(),n,r),o=this.nodes.get(t);return this.willChangeNode(o),o?.childIds.push(i.id),this.registerNode(i,t)}createNodeWithId(n,t,r,i={}){let o=mt(()=>n,t,i);o.id=n;let s=r?this.nodes.get(r):void 0;return s&&!s.childIds.includes(n)&&(this.willChangeNode(s),s.childIds.push(n)),this.registerNode(o,r)}static TEXT_PICTURE_KEYS=Tf;static GLYPH_AFFECTING_KEYS=Sf;static LAYOUT_AFFECTING_KEYS=new Set([..._c,...Vc,"layoutMode","layoutDirection","itemSpacing","counterAxisSpacing","paddingLeft","paddingRight","paddingTop","paddingBottom","primaryAxisAlign","counterAxisAlign","counterAxisAlignContent","layoutWrap","primaryAxisSizing","counterAxisSizing","layoutPositioning","layoutGrow","layoutAlignSelf","strokesIncludedInLayout","horizontalConstraint","verticalConstraint","gridTemplateColumns","gridTemplateRows","gridColumnGap","gridRowGap","gridPosition","minWidth","maxWidth","minHeight","maxHeight","targetAspectRatio"]);runPreviewUpdates(n,t){this.previewMutationDepth++,t&&this.previewObservers.push(t);try{n()}finally{t&&this.previewObservers.pop(),this.previewMutationDepth--}}preserveSourceMetadataDuring(n){this.sourceMetadataPreservationDepth++;try{return n()}finally{this.sourceMetadataPreservationDepth--}}get isPreservingSourceMetadata(){return this.sourceMetadataPreservationDepth>0}applyImportedStateDuring(n,t){let r=this.importedIdGenerator;this.importedIdGenerator=t??r,this.importedStateApplicationDepth++;try{return this.preserveSourceMetadataDuring(n)}finally{this.importedStateApplicationDepth--,this.importedIdGenerator=r}}get isApplyingImportedState(){return this.importedStateApplicationDepth>0}applyDerivedLayoutDuring(n){this.derivedLayoutDepth++;try{n()}finally{this.derivedLayoutDepth--}}get isApplyingDerivedLayout(){return this.derivedLayoutDepth>0}withLayoutMutations(n){this.layoutMutationDepth++;try{n()}finally{this.layoutMutationDepth--}}get isApplyingLayout(){return this.layoutMutationDepth>0}updateNodePositionPreview(n,t,r){this.updateNodePreview(n,{x:t,y:r})}updateNodePreview(n,t){let r=L0(this,n,t,(i,o)=>{for(let s of this.previewObservers)s(i,o)});r&&this.emitter.emit("node:previewUpdated",n,r)}updateNode(n,t){if(this.previewMutationDepth>0){this.updateNodePreview(n,t);return}let r=this.nodes.get(n);r&&(t=sf(vf(r,sf(t))),this.applyNodeChanges(r,t))}restoreNodeProperties(n,t,r){let i=this.nodes.get(n);i&&this.applyNodeChanges(i,t,r)}applyNodeChanges(n,t,r=[]){let{id:i}=n;if(this.willChangeNode(n),r.length){t={...t};for(let o of r)Reflect.set(t,o,void 0)}if(Object.keys(t).some(o=>Ef.LAYOUT_AFFECTING_KEYS.has(o))&&this.absPosCache.clear(),n.type==="INSTANCE"&&"componentId"in t&&t.componentId!==n.componentId&&(n.componentId&&this.instanceIndex.get(n.componentId)?.delete(i),t.componentId)){let o=this.instanceIndex.get(t.componentId);o||(o=new Set,this.instanceIndex.set(t.componentId,o)),o.add(i)}n.type==="TEXT"&&w0(n,t),this.sourceMetadataPreservationDepth===0&&!this.isApplyingLayout&&_0(n,Object.keys(t)),t.vectorNetwork&&(t={...t,vectorNetwork:ui(t.vectorNetwork)}),Object.assign(n,t),t.fills&&Ps(n,"fills",t),t.strokes&&Ps(n,"strokes",t);for(let o of r)Reflect.deleteProperty(n,o);this.emitter.emit("node:updated",i,t)}reparentNode(n,t){let r=this.nodes.get(n);if(!r||n===this.rootId||this.isDescendant(t,n))return;let i=r.parentId?this.nodes.get(r.parentId):void 0,o=this.nodes.get(t);if(!o||r.parentId===t)return;let s=r.parentId;this.willChangeNode(r),this.willChangeNode(i),this.willChangeNode(o),this.absPosCache.clear();let a=this.parentWorldMatrix(i),l=this.parentWorldMatrix(o);if(i&&(i.childIds=i.childIds.filter(u=>u!==n)),r.parentId=t,o.childIds.push(n),Ds(a)&&Ds(l))r.x+=a[2]-l[2],r.y+=a[5]-l[5];else{let u=ve.multiply(a,Ii(r)),c=zc(r,u,l);c&&Object.assign(r,c)}this.emitter.emit("node:reparented",n,s,t)}parentWorldMatrix(n){return Bc(n,this)}reorderChild(n,t,r){let i=this.nodes.get(n);if(!i)return;let o=i.parentId,s=o?this.nodes.get(o):void 0,a=this.nodes.get(t);if(!a||this.isDescendant(t,n))return;this.willChangeNode(i),this.willChangeNode(s),this.willChangeNode(a),s&&(s.childIds=s.childIds.filter(u=>u!==n));let l=r;s===a&&l>(s.childIds.includes(n)?s.childIds.length:l),i.parentId=t,this.absPosCache.clear(),l=Math.min(l,a.childIds.length),a.childIds.splice(l,0,n),this.emitter.emit("node:reordered",n,t,l,o)}insertChildAt(n,t,r){let i=this.getNode(n),o=this.getNode(t);if(!i||!o||n===t||this.isDescendant(t,n))return;let s=i.parentId,a=s?this.getNode(s):void 0;this.willChangeNode(i),this.willChangeNode(a),this.willChangeNode(o),a&&(a.childIds=a.childIds.filter(l=>l!==n)),o.childIds=o.childIds.filter(l=>l!==n),o.childIds.splice(r,0,n),i.parentId=t,this.clearAbsPosCache(),this.emitter.emit("node:reordered",n,t,r,s)}deleteNode(n){let t=this.nodes.get(n);if(!(!t||n===this.rootId)){if(this.willChangeNode(t),t.parentId){let r=this.nodes.get(t.parentId);this.willChangeNode(r),r&&(r.childIds=r.childIds.filter(i=>i!==n))}for(let r of Array.from(t.childIds))this.deleteNode(r);t.type==="INSTANCE"&&t.componentId&&this.instanceIndex.get(t.componentId)?.delete(n),this.nodes.delete(n),this.emitter.emit("node:deleted",n,t.parentId)}}hitTest(n,t,r){return qc(this,n,t,r)}hitTestDeep(n,t,r,i=0){return Jc(this,n,t,r,i)}hitTestSelectable(n,t,r,i,o=0){return Zc(this,n,t,r,i,o)}hitTestOpenContainer(n,t,r){return ef(this,n,t,r)}isOpenContainer(n){return Qc(this,n)}isPointInNode(n,t,r){return nf(this,n,t,r)}hitTestDropTarget(n,t,r,i,o){return rf(this,n,t,r,i,o)}cloneTree(n,t,r={}){let i=this.nodes.get(n);if(!i)return null;let o=ht(i,null);o.source={...o.source,id:null,orderKey:null};let s=this.createNode(i.type,t,{...o,...r});for(let a of i.childIds)this.cloneTree(a,s.id);return s}createInstance(n,t,r={}){return xc(this,n,t,r)}populateInstanceChildren(n,t,r="deep"){Dc(this,n,t,r)}swapInstanceComponent(n,t,r){Rc(this,n,t,r)}syncInstances(n){Os(this,n)}syncInstancesTogether(n){Mc(this,n)}syncInstance(n){Pc(this,n)}detachInstance(n){kc(this,n)}getMainComponent(n){return Lc(this,n)}getInstances(n){return xs(this,n)}flattenTree(n,t=0){let r=n??this.rootId,i=this.nodes.get(r);if(!i)return[];let o=[];for(let s of i.childIds){let a=this.nodes.get(s);a&&(o.push({node:a,depth:t}),a.childIds.length>0&&o.push(...this.flattenTree(s,t+1)))}return o}};function Ai(e,n,t){return t==null?Math.min(e,n):Math.min(Math.max(e,n),t)}var U0=new Map([{weight:100,names:["thin","hairline","extrathin","ultrathin"]},{weight:200,names:["extralight","ultralight"]},{weight:300,names:["light"]},{weight:400,names:["regular","normal","book","roman","plain"]},{weight:500,names:["medium"]},{weight:600,names:["semibold","demibold"]},{weight:700,names:["bold"]},{weight:800,names:["extrabold","ultrabold"]},{weight:900,names:["black","heavy"]}].flatMap(({names:e,weight:n})=>e.map(t=>[t,n])));function Af(e){return e.toLowerCase().replace(/italic|oblique/u,"").replace(/[^a-z0-9]+/gu,"")}function Nf(e){let n=e??"",t=/(?:italic|oblique)/iu.test(n),r=Af(n),i=r.match(/(?:^|[^0-9])([1-9]00)(?:[^0-9]|$)/u)?.[1];return{weight:i?Number(i):U0.get(r)??400,italic:t}}function Ni(e){return Nf(e).weight}function Cf(e){return{rootId:e.rootId,nodes:[...e.nodes],images:[...e.images],variables:[...e.variables],variableCollections:[...e.variableCollections],activeMode:[...e.activeMode],instanceIndex:[...e.instanceIndex].map(([n,t])=>[n,[...t]]),figKiwiVersion:e.figKiwiVersion,figSchemaDeflated:e.figSchemaDeflated,documentColorSpace:e.documentColorSpace,enabledLibraries:[...e.enabledLibraries]}}var Ci={sessionID:4294967295,localID:4294967295};function Hn(e){return e.sessionID===Ci.sessionID&&e.localID===Ci.localID}function k(e){return`${e.sessionID}:${e.localID}`}function Oi(e){let n=e.match(/^(?:VariableID:|VariableCollectionId:)?(\d+):(\d+)$/);if(n)return{sessionID:Number.parseInt(n[1],10),localID:Number.parseInt(n[2],10)};let[t,r]=e.split(":");return{sessionID:Number.parseInt(t,10),localID:Number.parseInt(r,10)}}var Us={min:3,max:60};function Of(e){let n={};for(let t of e.split(",").map(r=>r.trim())){let r=t.indexOf("=");r!==-1&&(n[t.slice(0,r).trim()]=t.slice(r+1).trim())}return n}var TI=ArrayBuffer,ue=Uint8Array,xi=Uint16Array,SI=Int16Array;var Di=Int32Array,zs=function(e,n,t){if(ue.prototype.slice)return ue.prototype.slice.call(e,n,t);(n==null||n<0)&&(n=0),(t==null||t>e.length)&&(t=e.length);var r=new ue(t-n);return r.set(e.subarray(n,t)),r},nr=function(e,n,t,r){if(ue.prototype.fill)return ue.prototype.fill.call(e,n,t,r);for((t==null||t<0)&&(t=0),(r==null||r>e.length)&&(r=e.length);t<r;++t)e[t]=n;return e},bI=function(e,n,t,r){if(ue.prototype.copyWithin)return ue.prototype.copyWithin.call(e,n,t,r);for((t==null||t<0)&&(t=0),(r==null||r>e.length)&&(r=e.length);t<r;)e[n++]=e[t++]};var EI=["invalid zstd data","window size too large (>2046MB)","invalid block type","FSE accuracy too high","match distance too far back","unexpected EOF"],fe=function(e,n,t){var r=new Error(n||EI[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,fe),!t)throw r;return r},xf=function(e,n,t){for(var r=0,i=0;r<t;++r)i|=e[n++]<<(r<<3);return i},AI=function(e,n){return(e[n]|e[n+1]<<8|e[n+2]<<16|e[n+3]<<24)>>>0},NI=function(e,n){var t=e[0]|e[1]<<8|e[2]<<16;if(t==3126568&&e[3]==253){var r=e[4],i=r>>5&1,o=r>>2&1,s=r&3,a=r>>6;r&8&&fe(0);var l=6-i,u=s==3?4:s,c=xf(e,l,u);l+=u;var f=a?1<<a:i,d=xf(e,l,f)+(a==1&&256),p=d;if(!i){var g=1<<10+(e[5]>>3);p=g+(g>>3)*(e[5]&7)}p>2145386496&&fe(1);var m=new ue((n==1?d||p:n?0:p)+12);return m[0]=1,m[4]=4,m[8]=8,{b:l+f,y:0,l:0,d:c,w:n&&n!=1?n:m.subarray(12),e:p,o:new Di(m.buffer,0,3),u:d,c:o,m:Math.min(131072,p)}}else if((t>>4|e[3]<<20)==25481893)return AI(e,4)+8;fe(0)},Wn=function(e){for(var n=0;1<<n<=e;++n);return n-1},tr=function(e,n,t){var r=(n<<3)+4,i=(e[n]&15)+5;i>t&&fe(3);for(var o=1<<i,s=o,a=-1,l=-1,u=-1,c=o,f=new TI(512+(o<<2)),d=new SI(f,0,256),p=new xi(f,0,256),g=new xi(f,512,o),m=512+(o<<1),h=new ue(f,m,o),T=new ue(f,m+o);a<255&&s>0;){var y=Wn(s+1),C=r>>3,L=(1<<y+1)-1,M=(e[C]|e[C+1]<<8|e[C+2]<<16)>>(r&7)&L,S=(1<<y)-1,x=L-s-1,D=M&S;if(D<x?(r+=y,M=D):(r+=y+1,M>S&&(M-=x)),d[++a]=--M,M==-1?(s+=M,h[--c]=a):s-=M,!M)do{var P=r>>3;l=(e[P]|e[P+1]<<8)>>(r&7)&3,r+=2,a+=l}while(l==3)}(a>255||s)&&fe(0);for(var B=0,H=(o>>1)+(o>>3)+3,K=o-1,v=0;v<=a;++v){var E=d[v];if(E<1){p[v]=-E;continue}for(u=0;u<E;++u){h[B]=v;do B=B+H&K;while(B>=c)}}for(B&&fe(0),u=0;u<o;++u){var I=p[h[u]]++,N=T[u]=i-Wn(I);g[u]=(I<<N)-o}return[r+7>>3,{b:i,s:h,n:T,t:g}]},CI=function(e,n){var t=0,r=-1,i=new ue(292),o=e[n],s=i.subarray(0,256),a=i.subarray(256,268),l=new xi(i.buffer,268);if(o<128){var u=tr(e,n+1,6),c=u[0],f=u[1];n+=o;var d=c<<3,p=e[n];p||fe(0);for(var g=0,m=0,h=f.b,T=h,y=(++n<<3)-8+Wn(p);y-=h,!(y<d);){var C=y>>3;if(g+=(e[C]|e[C+1]<<8)>>(y&7)&(1<<h)-1,s[++r]=f.s[g],y-=T,y<d)break;C=y>>3,m+=(e[C]|e[C+1]<<8)>>(y&7)&(1<<T)-1,s[++r]=f.s[m],h=f.n[g],g=f.t[g],T=f.n[m],m=f.t[m]}++r>255&&fe(0)}else{for(r=o-127;t<r;t+=2){var L=e[++n];s[t]=L>>4,s[t+1]=L&15}++n}var M=0;for(t=0;t<r;++t){var S=s[t];S>11&&fe(0),M+=S&&1<<S-1}var x=Wn(M)+1,D=1<<x,P=D-M;for(P&P-1&&fe(0),s[r++]=Wn(P)+1,t=0;t<r;++t){var S=s[t];++a[s[t]=S&&x+1-S]}var B=new ue(D<<1),H=B.subarray(0,D),K=B.subarray(D);for(l[x]=0,t=x;t>0;--t){var v=l[t];nr(K,t,v,l[t-1]=v+a[t]*(1<<x-t))}for(l[0]!=D&&fe(0),t=0;t<r;++t){var E=s[t];if(E){var I=l[E];nr(H,t,I,l[E]=I+(1<<x-E))}}return[n,{n:K,b:x,s:H}]},OI=tr(new ue([81,16,99,140,49,198,24,99,12,33,196,24,99,102,102,134,70,146,4]),0,6)[1],xI=tr(new ue([33,20,196,24,99,140,33,132,16,66,8,33,132,16,66,8,33,68,68,68,68,68,68,68,68,36,9]),0,6)[1],DI=tr(new ue([32,132,16,66,102,70,68,68,68,68,36,73,2]),0,5)[1],Df=function(e,n){for(var t=e.length,r=new Di(t),i=0;i<t;++i)r[i]=n,n+=1<<e[i];return r},Hs=new ue(new Di([0,0,0,0,16843009,50528770,134678020,202050057,269422093]).buffer,0,36),RI=Df(Hs,0),Ws=new ue(new Di([0,0,0,0,0,0,0,0,16843009,50528770,117769220,185207048,252579084,16]).buffer,0,53),MI=Df(Ws,3),er=function(e,n,t){var r=e.length,i=n.length,o=e[r-1],s=(1<<t.b)-1,a=-t.b;o||fe(0);for(var l=0,u=t.b,c=(r<<3)-8+Wn(o)-u,f=-1;c>a&&f<i;){var d=c>>3,p=(e[d]|e[d+1]<<8|e[d+2]<<16)>>(c&7);l=(l<<u|p)&s,n[++f]=t.s[l],c-=u=t.n[l]}(c!=a||f+1!=i)&&fe(0)},PI=function(e,n,t){var r=6,i=n.length,o=i+3>>2,s=o<<1,a=o+s;er(e.subarray(r,r+=e[0]|e[1]<<8),n.subarray(0,o),t),er(e.subarray(r,r+=e[2]|e[3]<<8),n.subarray(o,s),t),er(e.subarray(r,r+=e[4]|e[5]<<8),n.subarray(s,a),t),er(e.subarray(r),n.subarray(a),t)},wI=function(e,n,t){var r,i=n.b,o=e[i],s=o>>1&3;n.l=o&1;var a=o>>3|e[i+1]<<5|e[i+2]<<13,l=(i+=3)+a;if(s==1)return i>=e.length?void 0:(n.b=i+1,t?(nr(t,e[i],n.y,n.y+=a),t):nr(new ue(a),e[i]));if(!(l>e.length)){if(s==0)return n.b=l,t?(t.set(e.subarray(i,l),n.y),n.y+=a,t):zs(e,i,l);if(s==2){var u=e[i],c=u&3,f=u>>2&3,d=u>>4,p=0,g=0;c<2?f&1?d|=e[++i]<<4|(f&2&&e[++i]<<12):d=u>>3:(g=f,f<2?(d|=(e[++i]&63)<<4,p=e[i]>>6|e[++i]<<2):f==2?(d|=e[++i]<<4|(e[++i]&3)<<12,p=e[i]>>2|e[++i]<<6):(d|=e[++i]<<4|(e[++i]&63)<<12,p=e[i]>>6|e[++i]<<2|e[++i]<<10)),++i;var m=t?t.subarray(n.y,n.y+n.m):new ue(n.m),h=m.length-d;if(c==0)m.set(e.subarray(i,i+=d),h);else if(c==1)nr(m,e[i++],h);else{var T=n.h;if(c==2){var y=CI(e,i);p+=i-(i=y[0]),n.h=T=y[1]}else T||fe(0);(g?PI:er)(e.subarray(i,i+=p),m.subarray(h),T)}var C=e[i++];if(C){C==255?C=(e[i++]|e[i++]<<8)+32512:C>127&&(C=C-128<<8|e[i++]);var L=e[i++];L&3&&fe(0);for(var M=[xI,DI,OI],S=2;S>-1;--S){var x=L>>(S<<1)+2&3;if(x==1){var D=new ue([0,0,e[i++]]);M[S]={s:D.subarray(2,3),n:D.subarray(0,1),t:new xi(D.buffer,0,1),b:0}}else x==2?(r=tr(e,i,9-(S&1)),i=r[0],M[S]=r[1]):x==3&&(n.t||fe(0),M[S]=n.t[S])}var P=n.t=M,B=P[0],H=P[1],K=P[2],v=e[l-1];v||fe(0);var E=(l<<3)-8+Wn(v)-K.b,I=E>>3,N=0,w=(e[I]|e[I+1]<<8)>>(E&7)&(1<<K.b)-1;I=(E-=H.b)>>3;var O=(e[I]|e[I+1]<<8)>>(E&7)&(1<<H.b)-1;I=(E-=B.b)>>3;var R=(e[I]|e[I+1]<<8)>>(E&7)&(1<<B.b)-1;for(++C;--C;){var W=K.s[w],z=K.n[w],U=B.s[R],G=B.n[R],X=H.s[O],_=H.n[O];I=(E-=X)>>3;var Q=1<<X,ne=Q+((e[I]|e[I+1]<<8|e[I+2]<<16|e[I+3]<<24)>>>(E&7)&Q-1);I=(E-=Ws[U])>>3;var Ee=MI[U]+((e[I]|e[I+1]<<8|e[I+2]<<16)>>(E&7)&(1<<Ws[U])-1);I=(E-=Hs[W])>>3;var sn=RI[W]+((e[I]|e[I+1]<<8|e[I+2]<<16)>>(E&7)&(1<<Hs[W])-1);if(I=(E-=z)>>3,w=K.t[w]+((e[I]|e[I+1]<<8)>>(E&7)&(1<<z)-1),I=(E-=G)>>3,R=B.t[R]+((e[I]|e[I+1]<<8)>>(E&7)&(1<<G)-1),I=(E-=_)>>3,O=H.t[O]+((e[I]|e[I+1]<<8)>>(E&7)&(1<<_)-1),ne>3)n.o[2]=n.o[1],n.o[1]=n.o[0],n.o[0]=ne-=3;else{var an=ne-(sn!=0);an?(ne=an==3?n.o[0]-1:n.o[an],an>1&&(n.o[2]=n.o[1]),n.o[1]=n.o[0],n.o[0]=ne):ne=n.o[0]}for(var S=0;S<sn;++S)m[N+S]=m[h+S];N+=sn,h+=sn;var Fe=N-ne;if(Fe<0){var Ge=-Fe,In=n.e+Fe;Ge>Ee&&(Ge=Ee);for(var S=0;S<Ge;++S)m[N+S]=n.w[In+S];N+=Ge,Ee-=Ge,Fe=0}for(var S=0;S<Ee;++S)m[N+S]=m[Fe+S];N+=Ee}if(N!=h)for(;h<m.length;)m[N++]=m[h++];else N=m.length;t?n.y+=N:m=zs(m,0,N)}else if(t){if(n.y+=d,h)for(var S=0;S<d;++S)m[S]=m[h+S]}else h&&(m=zs(m,h));return n.b=l,m}fe(2)}},kI=function(e,n){if(e.length==1)return e[0];for(var t=new ue(n),r=0,i=0;r<e.length;++r){var o=e[r];t.set(o,i),i+=o.length}return t};function Rf(e,n){for(var t=[],r=+!n,i=0,o=0;e.length;){var s=NI(e,r||n);if(typeof s=="object"){for(r?(n=null,s.w.length==s.u&&(t.push(n=s.w),o+=s.u)):(t.push(n),s.e=0);!s.l;){var a=wI(e,s,n);a||fe(5),n?s.e=s.y:(t.push(a),o+=a.length,bI(s.w,0,a.length),s.w.set(a,s.w.length-a.length))}i=s.b+s.c*4}else i=s;e=e.subarray(i)}return kI(t,o)}var js=new Int32Array(1),Mf=new Float32Array(js.buffer),LI=new TextDecoder,Ce=class{_data;_index;length;constructor(e){if(e&&!(e instanceof Uint8Array))throw new Error("Must initialize a ByteBuffer with a Uint8Array");this._data=e||new Uint8Array(256),this._index=0,this.length=e?e.length:0}get offset(){return this._index}set offset(e){this._index=e}get bytes(){return this._data}toUint8Array(){return this._data.subarray(0,this.length)}readByte(){return this._data[this._index++]}readByteArray(){let e=this.readVarUint(),n=this._index;return this._index=n+e,this._data.slice(n,n+e)}skipByteArray(){let e=this.readVarUint();this._index+=e}readVarFloat(){let e=this._index,n=this._data,t=n[e];if(t===0)return this._index=e+1,0;let r=t|n[e+1]<<8|n[e+2]<<16|n[e+3]<<24;return this._index=e+4,r=r<<23|r>>>9,js[0]=r,Mf[0]}readVarUint(){let e=this._data,n=this._index,t=e[n++],r=t&127;return t<128?(this._index=n,r):(t=e[n++],r|=(t&127)<<7,t<128?(this._index=n,r):(t=e[n++],r|=(t&127)<<14,t<128?(this._index=n,r):(t=e[n++],r|=(t&127)<<21,t<128?(this._index=n,r):(t=e[n++],r|=(t&127)<<28,this._index=n,r>>>0))))}readVarInt(){let e=this.readVarUint()|0;return e&1?~(e>>>1):e>>>1}readVarUint64(){let e=BigInt(0),n=BigInt(0),t=BigInt(7),r=this.readByte();for(;r&128&&n<56;)e|=BigInt(r&127)<<n,n+=t,r=this.readByte();return e|=BigInt(r)<<n,e}readVarInt64(){let e=this.readVarUint64(),n=BigInt(1),t=e&n;return e>>=n,t?~e:e}readString(){let e=this._index,n=this.findStringTerminator(e);return this._index=n+1,LI.decode(this._data.subarray(e,n))}skipString(){this._index=this.findStringTerminator(this._index)+1}findStringTerminator(e){let n=this._data,t=e;for(;t<n.length&&n[t]!==0;)t++;if(t>=n.length)throw new Error("Unterminated string in Kiwi message");return t}_growBy(e){if(this.length+e>this._data.length){let n=new Uint8Array(this.length+e<<1);n.set(this._data),this._data=n}this.length+=e}writeByte(e){let n=this.length;this._growBy(1),this._data[n]=e}writeByteArray(e){if(!(e instanceof Uint8Array)&&!Array.isArray(e))throw new Error("Expected byte array");this.writeVarUint(e.length);let n=this.length;this._growBy(e.length),this._data.set(e,n)}writeVarFloat(e){let n=this.length;Mf[0]=e;let t=js[0];if(t=t>>>23|t<<9,(t&255)===0){this.writeByte(0);return}this._growBy(4);let r=this._data;r[n]=t,r[n+1]=t>>8,r[n+2]=t>>16,r[n+3]=t>>24}writeVarUint(e){if(e<0||e>4294967295)throw new Error("Outside uint range: "+e);do{let n=e&127;e>>>=7,this.writeByte(e?n|128:n)}while(e)}writeVarInt(e){if(e<-2147483648||e>2147483647)throw new Error("Outside int range: "+e);this.writeVarUint((e<<1^e>>31)>>>0)}writeVarUint64(e){if(typeof e=="string")e=BigInt(e);else if(typeof e!="bigint")throw new Error(`Expected bigint but got ${typeof e}: ${String(e)}`);if(e<0||e>BigInt("0xFFFFFFFFFFFFFFFF"))throw new Error("Outside uint64 range: "+e);let n=BigInt(127),t=BigInt(7);for(let r=0;e>n&&r<8;r++)this.writeByte(Number(e&n)|128),e>>=t;this.writeByte(Number(e))}writeVarInt64(e){if(typeof e=="string")e=BigInt(e);else if(typeof e!="bigint")throw new Error(`Expected bigint but got ${typeof e}: ${String(e)}`);if(e<-BigInt("0x8000000000000000")||e>BigInt("0x7FFFFFFFFFFFFFFF"))throw new Error("Outside int64 range: "+e);let n=BigInt(1);this.writeVarUint64(e<0?~(e<<n):e<<n)}writeString(e){let n;for(let t=0;t<e.length;t++){let r=e.charCodeAt(t);if(t+1===e.length||r<55296||r>=56320)n=r;else{let i=e.charCodeAt(++t);n=(r<<10)+i+-56613888}if(n===0)throw new Error("Cannot encode a string containing the null character");n<128?this.writeByte(n):(n<2048?this.writeByte(n>>6&31|192):(n<65536?this.writeByte(n>>12&15|224):(this.writeByte(n>>18&7|240),this.writeByte(n>>12&63|128)),this.writeByte(n>>6&63|128)),this.writeByte(n&63|128))}this.writeByte(0)}};function ee(e){return JSON.stringify(e)}function se(e,n,t){var r=new Error(e);throw r.line=n,r.column=t,r}var Ff=["bool","byte","float","int","int64","string","uint","uint64"],_I=["ByteBuffer","package"],VI=/((?:-|\b)\d+\b|[=;{}]|\[\]|\[deprecated\]|\b[A-Za-z_][A-Za-z0-9_]*\b|\/\/.*|\s+)/g,Ri=/^[A-Za-z_][A-Za-z0-9_]*$/,FI=/^\/\/.*|\s+$/,GI=/^=$/,BI=/^$/,Pf=/^;$/,UI=/^-?\d+$/,zI=/^\{$/,HI=/^\}$/,WI=/^\[\]$/,XI=/^enum$/,jI=/^struct$/,KI=/^message$/,YI=/^package$/,$I=/^\[deprecated\]$/;function qI(e){let n=e.split(VI),t=[],r=0,i=0;for(let o=0;o<n.length;o++){let s=n[o];o&1?FI.test(s)||t.push({text:s,line:i+1,column:r+1}):s!==""&&se("Syntax error "+ee(s),i+1,r+1);let a=s.split(`
`);a.length>1&&(r=0),i+=a.length-1,r+=a[a.length-1].length}return t.push({text:"",line:i,column:r}),t}function JI(e){function n(){return e[a]}function t(l){return l.test(n().text)?(a++,!0):!1}function r(l,u){if(!t(l)){let c=n();se("Expected "+u+" but found "+ee(c.text),c.line,c.column)}}function i(){let l=n();se("Unexpected token "+ee(l.text),l.line,l.column)}let o=[],s=null,a=0;for(t(YI)&&(s=n().text,r(Ri,"identifier"),r(Pf,'";"'));a<e.length&&!t(BI);){let l=[],u;t(XI)?u="ENUM":t(jI)?u="STRUCT":t(KI)?u="MESSAGE":i();let c=n();for(r(Ri,"identifier"),r(zI,'"{"');!t(HI);){let f=null,d=!1,p=!1;u!=="ENUM"&&(f=n().text,r(Ri,"identifier"),d=t(WI));let g=n();r(Ri,"identifier");let m=null;u!=="STRUCT"&&(r(GI,'"="'),m=n(),r(UI,"integer"),(+m.text|0)+""!==m.text&&se("Invalid integer "+ee(m.text),m.line,m.column));let h=n();t($I)&&(u!=="MESSAGE"&&se("Cannot deprecate this field",h.line,h.column),p=!0),r(Pf,'";"'),l.push({name:g.text,line:g.line,column:g.column,type:f,isArray:d,isDeprecated:p,value:m!==null?+m.text|0:l.length+1})}o.push({name:c.text,line:c.line,column:c.column,kind:u,fields:l})}return{package:s,definitions:o}}function ZI(e){let n=Ff.slice(),t={};for(let o=0;o<e.definitions.length;o++){let s=e.definitions[o];n.includes(s.name)&&se("The type "+ee(s.name)+" is defined twice",s.line,s.column),_I.includes(s.name)&&se("The type name "+ee(s.name)+" is reserved",s.line,s.column),n.push(s.name),t[s.name]=s}for(let o=0;o<e.definitions.length;o++){let s=e.definitions[o],a=s.fields;if(s.kind==="ENUM"||a.length===0)continue;for(let u=0;u<a.length;u++){let c=a[u];n.includes(c.type)||se("The type "+ee(c.type)+" is not defined for field "+ee(c.name),c.line,c.column)}let l=[];for(let u=0;u<a.length;u++){let c=a[u];l.includes(c.value)&&se("The id for field "+ee(c.name)+" is used twice",c.line,c.column),c.value<=0&&se("The id for field "+ee(c.name)+" must be positive",c.line,c.column),l.push(c.value)}}let r={},i=o=>{let s=t[o];if(s&&s.kind==="STRUCT"&&(r[o]===1&&se("Recursive nesting of "+ee(o)+" is not allowed",s.line,s.column),r[o]!==2&&s)){r[o]=1;let a=s.fields;for(let l=0;l<a.length;l++){let u=a[l];u.isArray||i(u.type)}r[o]=2}return!0};for(let o=0;o<e.definitions.length;o++)i(e.definitions[o].name)}function Gf(e){let n=JI(qI(e));return ZI(n),n}function Pi(e){let n=new Map(e.definitions.map(a=>[a.name,a])),t=new Map,r=a=>{let l=n.get(a);return l||se("Invalid type "+ee(a),0,0),l},i=a=>{let l=t.get(a.name);return l||(l=new Map(a.fields.map(u=>[u.value,u])),t.set(a.name,l)),l},o=(a,l)=>{switch(a){case"bool":case"byte":l.readByte();return;case"int":case"uint":l.readVarUint();return;case"float":l.readVarFloat();return;case"string":l.skipString();return;case"int64":case"uint64":l.readVarUint64();return}let u=r(a);if(u.kind==="ENUM"){l.readVarUint();return}if(u.kind==="STRUCT"){for(let f of u.fields)s(f,l);return}let c=i(u);for(let f=l.readVarUint();f!==0;f=l.readVarUint()){let d=c.get(f);if(!d)throw new Error("Attempted to parse invalid message");s(d,l)}},s=(a,l)=>{let u=a.type;if(u===null&&se("Invalid type null for field "+ee(a.name),a.line,a.column),!a.isArray){o(u,l);return}if(u==="byte"){l.skipByteArray();return}for(let c=l.readVarUint();c>0;c--)o(u,l)};return{definition:r,fieldsById:a=>i(r(a)),skipField:s,skipValue:o}}var Bf=Symbol("header bytes"),Uf=Symbol("header start"),zf=Symbol("header whole decoder"),Ks=0;function Ys(e){let n=Reflect.get(e,Bf),t=Reflect.get(e,Uf),r=Reflect.get(e,zf);if(!(n instanceof Uint8Array)||typeof t!="number"||typeof r!="function")return;let i=new Ce(n);return i.offset=t,r(i)}function Xs(e,n,t){Reflect.defineProperty(e,n,{value:t,enumerable:!1})}function QI(e){return n=>{Ks++;try{return e(n)}finally{Ks--}}}function ev(e,n){return Object.hasOwn(e,n)}function nv(e){let n=Object.values(e);for(let t=0;t<n.length;t++){let r=n[t];if(r.kind!=="ENUM")for(let i=0;i<r.fields.length;i++){let o=r.fields[i],s=o.type;s===null&&se("Invalid type null for field "+ee(o.name),o.line,o.column),!Ff.includes(s)&&!ev(e,s)&&se("Invalid type "+ee(s)+" for field "+ee(o.name),o.line,o.column)}}}function Mi(e,n,t,r){switch(t){case"bool":return!!r.readByte();case"byte":return r.readByte();case"int":return r.readVarInt();case"uint":return r.readVarUint();case"float":return r.readVarFloat();case"string":return r.readString();case"int64":return r.readVarInt64();case"uint64":return r.readVarUint64();default:{let i=n[t];return i||se("Invalid type "+ee(t),0,0),i.kind==="ENUM"?e[i.name][r.readVarUint()]:(0,e["decode"+i.name])(r)}}}function wf(e,n,t,r,i){switch(t){case"bool":case"byte":i.writeByte(r);return;case"int":i.writeVarInt(r);return;case"uint":i.writeVarUint(r);return;case"float":i.writeVarFloat(r);return;case"string":i.writeString(r);return;case"int64":i.writeVarInt64(r);return;case"uint64":i.writeVarUint64(r);return;default:{let o=n[t];if(o||se("Invalid type "+ee(t),0,0),o.kind==="ENUM"){let s=e[o.name][r];if(s===void 0)throw new Error("Invalid value "+JSON.stringify(r)+" for enum "+ee(o.name));i.writeVarUint(s)}else(0,e["encode"+o.name])(r,i)}}}function kf(e,n,t,r,i){let o=t.type;if(o===null&&se("Invalid type null for field "+ee(t.name),t.line,t.column),t.isArray){if(t.isDeprecated){if(o==="byte")r.readByteArray();else{let l=r.readVarUint();for(;l-- >0;)Mi(e,n,o,r)}return}if(o==="byte"){i[t.name]=r.readByteArray();return}let s=r.readVarUint(),a=Array.from({length:s});i[t.name]=a;for(let l=0;l<s;l++)a[l]=Mi(e,n,o,r);return}if(t.isDeprecated){Mi(e,n,o,r);return}i[t.name]=Mi(e,n,o,r)}function tv(e,n,t,r,i){let o=t.type;if(o===null&&se("Invalid type null for field "+ee(t.name),t.line,t.column),t.isArray){if(o==="byte"){i.writeByteArray(r);return}let s=r;i.writeVarUint(s.length);for(let a=0;a<s.length;a++)wf(e,n,o,s[a],i);return}wf(e,n,o,r,i)}function Lf(e,n,t,r){let i=new Map;for(let o=0;o<t.fields.length;o++)i.set(t.fields[o].value,t.fields[o]);return function(o){let s=o instanceof e.ByteBuffer?o:new e.ByteBuffer(o),a={};if(t.kind==="MESSAGE"){let l=r&&Ks===0?r:void 0;for(l&&(Xs(a,Bf,s.bytes),Xs(a,Uf,s.offset),Xs(a,zf,l.whole));;){let u=s.readVarUint();if(u===0)return a;let c=i.get(u);if(!c)throw new Error("Attempted to parse invalid message");l&&!l.keep.has(c.name)?l.skipper.skipField(c,s):kf(e,n,c,s,a)}}else{for(let l=0;l<t.fields.length;l++)kf(e,n,t.fields[l],s,a);return a}}}function rv(e,n,t){return function(r,i){let o=!i,s=i||new e.ByteBuffer;for(let a=0;a<t.fields.length;a++){let l=t.fields[a];if(l.isDeprecated)continue;let u=r[l.name];if(u!=null)t.kind==="MESSAGE"&&s.writeVarUint(l.value),tv(e,n,l,u,s);else if(t.kind==="STRUCT")throw new Error("Missing required field "+ee(l.name))}if(t.kind==="MESSAGE"&&s.writeVarUint(0),o)return s.toUint8Array()}}function rr(e,n){let t=Object.create(null);for(let o=0;o<e.definitions.length;o++)t[e.definitions[o].name]=e.definitions[o];nv(t);let r={ByteBuffer:Ce},i;for(let o=0;o<e.definitions.length;o++){let s=e.definitions[o];switch(s.kind){case"ENUM":{let a={};for(let l=0;l<s.fields.length;l++){let u=s.fields[l];a[u.name]=u.value,a[u.value]=u.name}r[s.name]=a;break}case"STRUCT":case"MESSAGE":{let a=s.kind==="MESSAGE"?n?.[s.name]:void 0,l=a&&{keep:new Set(a),skipper:i??=Pi(e),whole:QI(Lf(r,t,s))};r["decode"+s.name]=Lf(r,t,s,l),r["encode"+s.name]=rv(r,t,s);break}default:se("Invalid definition kind "+ee(s.kind),s.line,s.column)}}return r}var _f=["bool","byte","int","uint","float","string","int64","uint64"],Vf=["ENUM","STRUCT","MESSAGE"];function ir(e){let n=e instanceof Ce?e:new Ce(e),t=n.readVarUint(),r=[];for(let i=0;i<t;i++){let o=n.readString(),s=n.readByte(),a=n.readVarUint(),l=[];for(let u=0;u<a;u++){let c=n.readString(),f=n.readVarInt(),d=!!(n.readByte()&1),p=n.readVarUint();l.push({name:c,line:0,column:0,type:Vf[s]==="ENUM"?null:f,isArray:d,isDeprecated:!1,value:p})}r.push({name:o,line:0,column:0,kind:Vf[s],fields:l})}for(let i=0;i<t;i++){let o=r[i].fields;for(let s=0;s<o.length;s++){let a=o[s],l=a.type;if(l!==null&&l<0){if(~l>=_f.length)throw new Error("Invalid type "+l);a.type=_f[~l]}else{if(l!==null&&l>=r.length)throw new Error("Invalid type "+l);a.type=l===null?null:r[l].name}}}return{package:null,definitions:r}}function Hf(e){for(let n of e.definitions)iv(n),n.kind==="ENUM"&&ov(n)}function iv(e){let n=new Set;for(let t of e.fields)n.has(t.name)&&se(`The field ${ee(t.name)} is defined twice in ${ee(e.name)}`,t.line,t.column),n.add(t.name)}function ov(e){let n=new Set;for(let t of e.fields)n.has(t.value)&&se(`The enum value ${t.value} is used twice in ${ee(e.name)}`,t.line,t.column),n.add(t.value)}var wi=Gf(`enum MessageType {
  JOIN_START = 0;
  NODE_CHANGES = 1;
  USER_CHANGES = 2;
  JOIN_END = 3;
  SIGNAL = 4;
  STYLE = 5;
  STYLE_SET = 6;
  JOIN_START_SKIP_RELOAD = 7;
  NOTIFY_SHOULD_UPGRADE = 8;
  UPGRADE_DONE = 9;
  UPGRADE_REFRESH = 10;
  SCENE_GRAPH_QUERY = 11;
  SCENE_GRAPH_REPLY = 12;
  DIFF = 13;
  CLIENT_BROADCAST = 14;
  JOIN_START_JOURNALED = 15;
  STREAM_START = 16;
  STREAM_END = 17;
  INTERACTIVE_SLIDE_CHANGE = 18;
  RECONNECT_SCENE_GRAPH_QUERY = 19;
  RECONNECT_SCENE_GRAPH_REPLY = 20;
  JOIN_END_INCREMENTAL_RECONNECT = 21;
  NODE_STATUS_CHANGE = 22;
  CLIENT_RENDERED = 23;
  BUZZ_APPROVAL_CHANGE = 24;
}

enum Axis {
  X = 0;
  Y = 1;
}

enum Access {
  READ_ONLY = 0;
  READ_WRITE = 1;
}

enum NodePhase {
  CREATED = 0;
  REMOVED = 1;
}

enum WindingRule {
  NONZERO = 0;
  ODD = 1;
}

enum NodeType {
  NONE = 0;
  DOCUMENT = 1;
  CANVAS = 2;
  GROUP = 3;
  FRAME = 4;
  BOOLEAN_OPERATION = 5;
  VECTOR = 6;
  STAR = 7;
  LINE = 8;
  ELLIPSE = 9;
  RECTANGLE = 10;
  REGULAR_POLYGON = 11;
  ROUNDED_RECTANGLE = 12;
  TEXT = 13;
  SLICE = 14;
  SYMBOL = 15;
  INSTANCE = 16;
  STICKY = 17;
  SHAPE_WITH_TEXT = 18;
  CONNECTOR = 19;
  CODE_BLOCK = 20;
  WIDGET = 21;
  STAMP = 22;
  MEDIA = 23;
  HIGHLIGHT = 24;
  SECTION = 25;
  SECTION_OVERLAY = 26;
  WASHI_TAPE = 27;
  VARIABLE = 28;
  TABLE = 29;
  TABLE_CELL = 30;
  VARIABLE_SET = 31;
  SLIDE = 32;
  ASSISTED_LAYOUT = 33;
  INTERACTIVE_SLIDE_ELEMENT = 34;
  VARIABLE_OVERRIDE = 35;
  MODULE = 36;
  SLIDE_GRID = 37;
  SLIDE_ROW = 38;
  RESPONSIVE_SET = 39;
  CODE_COMPONENT = 40;
  TEXT_PATH = 41;
  CODE_INSTANCE = 42;
  CODE_LIBRARY = 43;
  CODE_FILE = 44;
  CODE_LAYER = 45;
  BRUSH = 46;
  MANAGED_STRING = 47;
  TRANSFORM = 48;
  CMS_RICH_TEXT = 49;
  REPEATER = 50;
  JSX = 51;
  EMBEDDED_PROTOTYPE = 52;
  REACT_FIBER = 53;
  RESPONSIVE_NODE_SET = 54;
  WEBPAGE = 55;
  KEYFRAME = 56;
  KEYFRAME_TRACK = 57;
  ANIMATION_PRESET_INSTANCE = 58;
  CODE_EMBED = 59;
  BINARY_FILE = 60;
  SPEC_BLOCK = 61;
  TOOL_INSTANCE = 62;
  CUSTOM_EFFECT_INSTANCE = 63;
  NATIVE_CODE_LAYER_INSTANCE = 64;
}

enum ShapeWithTextType {
  SQUARE = 0;
  ELLIPSE = 1;
  DIAMOND = 2;
  TRIANGLE_UP = 3;
  TRIANGLE_DOWN = 4;
  ROUNDED_RECTANGLE = 5;
  PARALLELOGRAM_RIGHT = 6;
  PARALLELOGRAM_LEFT = 7;
  ENG_DATABASE = 8;
  ENG_QUEUE = 9;
  ENG_FILE = 10;
  ENG_FOLDER = 11;
  TRAPEZOID = 12;
  PREDEFINED_PROCESS = 13;
  SHIELD = 14;
  DOCUMENT_SINGLE = 15;
  DOCUMENT_MULTIPLE = 16;
  MANUAL_INPUT = 17;
  HEXAGON = 18;
  CHEVRON = 19;
  PENTAGON = 20;
  OCTAGON = 21;
  STAR = 22;
  PLUS = 23;
  ARROW_LEFT = 24;
  ARROW_RIGHT = 25;
  SUMMING_JUNCTION = 26;
  OR = 27;
  SPEECH_BUBBLE = 28;
  INTERNAL_STORAGE = 29;
}

enum BlendMode {
  PASS_THROUGH = 0;
  NORMAL = 1;
  DARKEN = 2;
  MULTIPLY = 3;
  LINEAR_BURN = 4;
  COLOR_BURN = 5;
  LIGHTEN = 6;
  SCREEN = 7;
  LINEAR_DODGE = 8;
  COLOR_DODGE = 9;
  OVERLAY = 10;
  SOFT_LIGHT = 11;
  HARD_LIGHT = 12;
  DIFFERENCE = 13;
  EXCLUSION = 14;
  HUE = 15;
  SATURATION = 16;
  COLOR = 17;
  LUMINOSITY = 18;
}

enum PaintType {
  SOLID = 0;
  GRADIENT_LINEAR = 1;
  GRADIENT_RADIAL = 2;
  GRADIENT_ANGULAR = 3;
  GRADIENT_DIAMOND = 4;
  IMAGE = 5;
  EMOJI = 6;
  VIDEO = 7;
  PATTERN = 8;
  NOISE = 9;
  CUSTOM = 10;
}

enum ImageScaleMode {
  STRETCH = 0;
  FIT = 1;
  FILL = 2;
  TILE = 3;
}

enum EffectType {
  INNER_SHADOW = 0;
  DROP_SHADOW = 1;
  FOREGROUND_BLUR = 2;
  BACKGROUND_BLUR = 3;
  REPEAT = 4;
  SYMMETRY = 5;
  GRAIN = 6;
  NOISE = 7;
  GLASS = 8;
  CUSTOM = 9;
}

enum TextCase {
  ORIGINAL = 0;
  UPPER = 1;
  LOWER = 2;
  TITLE = 3;
  SMALL_CAPS = 4;
  SMALL_CAPS_FORCED = 5;
}

enum TextDecoration {
  NONE = 0;
  UNDERLINE = 1;
  STRIKETHROUGH = 2;
}

enum TextDecorationStyle {
  SOLID = 0;
  DOTTED = 1;
  WAVY = 2;
}

enum LeadingTrim {
  NONE = 0;
  CAP_HEIGHT = 1;
}

enum NumberUnits {
  RAW = 0;
  PIXELS = 1;
  PERCENT = 2;
}

enum ConstraintType {
  MIN = 0;
  CENTER = 1;
  MAX = 2;
  STRETCH = 3;
  SCALE = 4;
  FIXED_MIN = 5;
  FIXED_MAX = 6;
}

enum StrokeAlign {
  CENTER = 0;
  INSIDE = 1;
  OUTSIDE = 2;
  OFFSET = 3;
}

enum StrokeCap {
  NONE = 0;
  ROUND = 1;
  SQUARE = 2;
  ARROW_LINES = 3;
  ARROW_EQUILATERAL = 4;
  DIAMOND_FILLED = 5;
  TRIANGLE_FILLED = 6;
  HIGHLIGHT = 7;
  WASHI_TAPE_1 = 8;
  WASHI_TAPE_2 = 9;
  WASHI_TAPE_3 = 10;
  WASHI_TAPE_4 = 11;
  WASHI_TAPE_5 = 12;
  WASHI_TAPE_6 = 13;
  CIRCLE_FILLED = 14;
  ERD_ZERO_OR_ONE = 15;
  ERD_EXACTLY_ONE = 16;
  ERD_ZERO_OR_MORE = 17;
  ERD_ONE_OR_MORE = 18;
  ERD_ONE = 19;
  ERD_MANY = 20;
}

enum StrokeJoin {
  MITER = 0;
  BEVEL = 1;
  ROUND = 2;
}

enum BooleanOperation {
  UNION = 0;
  INTERSECT = 1;
  SUBTRACT = 2;
  XOR = 3;
}

enum TextAlignHorizontal {
  LEFT = 0;
  CENTER = 1;
  RIGHT = 2;
  JUSTIFIED = 3;
}

enum TextAlignVertical {
  TOP = 0;
  CENTER = 1;
  BOTTOM = 2;
}

enum MouseCursor {
  DEFAULT = 0;
  CROSSHAIR = 1;
  EYEDROPPER = 2;
  HAND = 3;
  PAINT_BUCKET = 4;
  PEN = 5;
  PENCIL = 6;
  MARKER = 7;
  ERASER = 8;
  HIGHLIGHTER = 9;
  LASSO = 10;
}

enum VectorMirror {
  NONE = 0;
  ANGLE = 1;
  ANGLE_AND_LENGTH = 2;
}

enum DashMode {
  CLIP = 0;
  STRETCH = 1;
}

enum ImageType {
  PNG = 0;
  JPEG = 1;
  SVG = 2;
  PDF = 3;
  MP4 = 4;
  GIF = 5;
}

enum ExportConstraintType {
  CONTENT_SCALE = 0;
  CONTENT_WIDTH = 1;
  CONTENT_HEIGHT = 2;
}

enum LayoutGridType {
  MIN = 0;
  CENTER = 1;
  STRETCH = 2;
  MAX = 3;
}

enum LayoutGridPattern {
  STRIPES = 0;
  GRID = 1;
}

enum TextAutoResize {
  NONE = 0;
  WIDTH_AND_HEIGHT = 1;
  HEIGHT = 2;
}

enum TextTruncation {
  DISABLED = 0;
  ENDING = 1;
}

enum StyleSetType {
  PERSONAL = 0;
  TEAM = 1;
  CUSTOM = 2;
  FREQUENCY = 3;
  TEMPORARY = 4;
}

enum StyleSetContentType {
  SOLID = 0;
  GRADIENT = 1;
  IMAGE = 2;
}

enum StackMode {
  NONE = 0;
  HORIZONTAL = 1;
  VERTICAL = 2;
  GRID = 3;
}

enum StackAlign {
  MIN = 0;
  CENTER = 1;
  MAX = 2;
  BASELINE = 3;
}

enum StackCounterAlign {
  MIN = 0;
  CENTER = 1;
  MAX = 2;
  STRETCH = 3;
  AUTO = 4;
  BASELINE = 5;
}

enum StackJustify {
  MIN = 0;
  CENTER = 1;
  MAX = 2;
  SPACE_EVENLY = 3;
  SPACE_BETWEEN = 4;
}

enum GridChildAlign {
  AUTO = 0;
  MIN = 1;
  CENTER = 2;
  MAX = 3;
}

enum GridAutoTracks {
  NONE = 0;
  ROWS = 1;
}

enum StackSize {
  FIXED = 0;
  RESIZE_TO_FIT = 1;
  RESIZE_TO_FIT_WITH_IMPLICIT_SIZE = 2;
}

enum StackPositioning {
  AUTO = 0;
  ABSOLUTE = 1;
}

enum StackWrap {
  NO_WRAP = 0;
  WRAP = 1;
}

enum StackCounterAlignContent {
  AUTO = 0;
  SPACE_BETWEEN = 1;
}

enum ConnectionType {
  NONE = 0;
  INTERNAL_NODE = 1;
  URL = 2;
  BACK = 3;
  CLOSE = 4;
  SET_VARIABLE = 5;
  UPDATE_MEDIA_RUNTIME = 6;
  CONDITIONAL = 7;
  SET_VARIABLE_MODE = 8;
  OBJECT_ANIMATION = 9;
  UPDATE_ANIMATION_TIMELINE_STATE = 10;
}

enum InteractionType {
  ON_CLICK = 0;
  AFTER_TIMEOUT = 1;
  MOUSE_IN = 2;
  MOUSE_OUT = 3;
  ON_HOVER = 4;
  MOUSE_DOWN = 5;
  MOUSE_UP = 6;
  ON_PRESS = 7;
  NONE = 8;
  DRAG = 9;
  ON_KEY_DOWN = 10;
  ON_VOICE = 11;
  ON_MEDIA_HIT = 12;
  ON_MEDIA_END = 13;
  MOUSE_ENTER = 14;
  MOUSE_LEAVE = 15;
}

enum TransitionType {
  INSTANT_TRANSITION = 0;
  DISSOLVE = 1;
  FADE = 2;
  SLIDE_FROM_LEFT = 3;
  SLIDE_FROM_RIGHT = 4;
  SLIDE_FROM_TOP = 5;
  SLIDE_FROM_BOTTOM = 6;
  PUSH_FROM_LEFT = 7;
  PUSH_FROM_RIGHT = 8;
  PUSH_FROM_TOP = 9;
  PUSH_FROM_BOTTOM = 10;
  MOVE_FROM_LEFT = 11;
  MOVE_FROM_RIGHT = 12;
  MOVE_FROM_TOP = 13;
  MOVE_FROM_BOTTOM = 14;
  SLIDE_OUT_TO_LEFT = 15;
  SLIDE_OUT_TO_RIGHT = 16;
  SLIDE_OUT_TO_TOP = 17;
  SLIDE_OUT_TO_BOTTOM = 18;
  MOVE_OUT_TO_LEFT = 19;
  MOVE_OUT_TO_RIGHT = 20;
  MOVE_OUT_TO_TOP = 21;
  MOVE_OUT_TO_BOTTOM = 22;
  MAGIC_MOVE = 23;
  SMART_ANIMATE = 24;
  SCROLL_ANIMATE = 25;
}

enum EasingType {
  IN_CUBIC = 0;
  OUT_CUBIC = 1;
  INOUT_CUBIC = 2;
  LINEAR = 3;
  IN_BACK_CUBIC = 4;
  OUT_BACK_CUBIC = 5;
  INOUT_BACK_CUBIC = 6;
  CUSTOM_CUBIC = 7;
  SPRING = 8;
  GENTLE_SPRING = 9;
  CUSTOM_SPRING = 10;
  SPRING_PRESET_ONE = 11;
  SPRING_PRESET_TWO = 12;
  SPRING_PRESET_THREE = 13;
  HOLD = 14;
}

enum ScrollDirection {
  NONE = 0;
  HORIZONTAL = 1;
  VERTICAL = 2;
  BOTH = 3;
}

enum ScrollContractedState {
  EXPANDED = 0;
  CONTRACTED = 1;
}

struct GUID {
  uint sessionID;
  uint localID;
}

struct Color {
  float r;
  float g;
  float b;
  float a;
}

struct Vector {
  float x;
  float y;
}

struct Rect {
  float x;
  float y;
  float w;
  float h;
}

struct ColorStop {
  Color color;
  float position;
}

message ColorStopVar {
  Color color = 1;
  VariableData colorVar = 2;
  float position = 3;
}

struct Matrix {
  float m00;
  float m01;
  float m02;
  float m10;
  float m11;
  float m12;
}

struct ParentIndex {
  GUID guid;
  string position;
}

struct Number {
  float value;
  NumberUnits units;
}

struct FontName {
  string family;
  string style;
  string postscript;
}

enum FontVariantNumericFigure {
  NORMAL = 0;
  LINING = 1;
  OLDSTYLE = 2;
}

enum FontVariantNumericSpacing {
  NORMAL = 0;
  PROPORTIONAL = 1;
  TABULAR = 2;
}

enum FontVariantNumericFraction {
  NORMAL = 0;
  DIAGONAL = 1;
  STACKED = 2;
}

enum FontVariantCaps {
  NORMAL = 0;
  SMALL = 1;
  ALL_SMALL = 2;
  PETITE = 3;
  ALL_PETITE = 4;
  UNICASE = 5;
  TITLING = 6;
}

enum FontVariantPosition {
  NORMAL = 0;
  SUB = 1;
  SUPER = 2;
}

enum FontStyle {
  NORMAL = 0;
  ITALIC = 1;
}

enum SemanticWeight {
  NORMAL = 0;
  BOLD = 1;
}

enum SemanticItalic {
  NORMAL = 0;
  ITALIC = 1;
}

enum CodeSnapshotState {
  INITIAL = 0;
  SNAPSHOTTING = 1;
  OK = 2;
  SNAPSHOT_ERROR = 3;
  LLM_IN_PROGRESS = 4;
}

enum SnapshotCaptureMode {
  FULL = 0;
  PARTIAL = 1;
}

message CodeSourceInfo {
  string originReferenceId = 1;
  GUID originNodeId = 2;
  GUID linkedSnapshotId = 3;
  SnapshotCaptureMode captureMode = 4;
  string sourceBlobRef = 5;
  string sourceElementId = 6;
}

enum CodeObjectType {
  WEB_LAYER = 0;
  WEB_INTERACTION = 1;
  NATIVE_LAYER = 2;
  ANIMATION_PRESET = 3;
  TOOL = 4;
  CUSTOM_EFFECT = 5;
  PLUGIN = 6;
  WEB_LAYER_GENERIC = 7;
  CUSTOM_FILL = 8;
}

message CustomToolArtifactRef {
  string customToolId = 1;
  string customToolVersion = 2;
  string publishedCustomToolId = 3;
  string publishedCustomToolVersionId = 4;
}

enum LockMode {
  NONE = 0;
  ALL = 1;
  BACKGROUND_ONLY = 2;
}

enum OpenTypeFeature {
  PCAP = 0;
  C2PC = 1;
  CASE = 2;
  CPSP = 3;
  TITL = 4;
  UNIC = 5;
  ZERO = 6;
  SINF = 7;
  ORDN = 8;
  AFRC = 9;
  DNOM = 10;
  NUMR = 11;
  LIGA = 12;
  CLIG = 13;
  DLIG = 14;
  HLIG = 15;
  RLIG = 16;
  AALT = 17;
  CALT = 18;
  RCLT = 19;
  SALT = 20;
  RVRN = 21;
  VERT = 22;
  SWSH = 23;
  CSWH = 24;
  NALT = 25;
  CCMP = 26;
  STCH = 27;
  HIST = 28;
  SIZE = 29;
  ORNM = 30;
  ITAL = 31;
  RAND = 32;
  DTLS = 33;
  FLAC = 34;
  MGRK = 35;
  SSTY = 36;
  KERN = 37;
  FWID = 38;
  HWID = 39;
  HALT = 40;
  TWID = 41;
  QWID = 42;
  PWID = 43;
  JUST = 44;
  LFBD = 45;
  OPBD = 46;
  RTBD = 47;
  PALT = 48;
  PKNA = 49;
  LTRA = 50;
  LTRM = 51;
  RTLA = 52;
  RTLM = 53;
  ABRV = 54;
  ABVM = 55;
  ABVS = 56;
  VALT = 57;
  VHAL = 58;
  BLWF = 59;
  BLWM = 60;
  BLWS = 61;
  AKHN = 62;
  CJCT = 63;
  CFAR = 64;
  CPCT = 65;
  CURS = 66;
  DIST = 67;
  EXPT = 68;
  FALT = 69;
  FINA = 70;
  FIN2 = 71;
  FIN3 = 72;
  HALF = 73;
  HALN = 74;
  HKNA = 75;
  HNGL = 76;
  HOJO = 77;
  INIT = 78;
  ISOL = 79;
  JP78 = 80;
  JP83 = 81;
  JP90 = 82;
  JP04 = 83;
  LJMO = 84;
  LOCL = 85;
  MARK = 86;
  MEDI = 87;
  MED2 = 88;
  MKMK = 89;
  NLCK = 90;
  NUKT = 91;
  PREF = 92;
  PRES = 93;
  VPAL = 94;
  PSTF = 95;
  PSTS = 96;
  RKRF = 97;
  RPHF = 98;
  RUBY = 99;
  SMPL = 100;
  TJMO = 101;
  TNAM = 102;
  TRAD = 103;
  VATU = 104;
  VJMO = 105;
  VKNA = 106;
  VKRN = 107;
  VRTR = 108;
  VRT2 = 109;
  SS01 = 110;
  SS02 = 111;
  SS03 = 112;
  SS04 = 113;
  SS05 = 114;
  SS06 = 115;
  SS07 = 116;
  SS08 = 117;
  SS09 = 118;
  SS10 = 119;
  SS11 = 120;
  SS12 = 121;
  SS13 = 122;
  SS14 = 123;
  SS15 = 124;
  SS16 = 125;
  SS17 = 126;
  SS18 = 127;
  SS19 = 128;
  SS20 = 129;
  CV01 = 130;
  CV02 = 131;
  CV03 = 132;
  CV04 = 133;
  CV05 = 134;
  CV06 = 135;
  CV07 = 136;
  CV08 = 137;
  CV09 = 138;
  CV10 = 139;
  CV11 = 140;
  CV12 = 141;
  CV13 = 142;
  CV14 = 143;
  CV15 = 144;
  CV16 = 145;
  CV17 = 146;
  CV18 = 147;
  CV19 = 148;
  CV20 = 149;
  CV21 = 150;
  CV22 = 151;
  CV23 = 152;
  CV24 = 153;
  CV25 = 154;
  CV26 = 155;
  CV27 = 156;
  CV28 = 157;
  CV29 = 158;
  CV30 = 159;
  CV31 = 160;
  CV32 = 161;
  CV33 = 162;
  CV34 = 163;
  CV35 = 164;
  CV36 = 165;
  CV37 = 166;
  CV38 = 167;
  CV39 = 168;
  CV40 = 169;
  CV41 = 170;
  CV42 = 171;
  CV43 = 172;
  CV44 = 173;
  CV45 = 174;
  CV46 = 175;
  CV47 = 176;
  CV48 = 177;
  CV49 = 178;
  CV50 = 179;
  CV51 = 180;
  CV52 = 181;
  CV53 = 182;
  CV54 = 183;
  CV55 = 184;
  CV56 = 185;
  CV57 = 186;
  CV58 = 187;
  CV59 = 188;
  CV60 = 189;
  CV61 = 190;
  CV62 = 191;
  CV63 = 192;
  CV64 = 193;
  CV65 = 194;
  CV66 = 195;
  CV67 = 196;
  CV68 = 197;
  CV69 = 198;
  CV70 = 199;
  CV71 = 200;
  CV72 = 201;
  CV73 = 202;
  CV74 = 203;
  CV75 = 204;
  CV76 = 205;
  CV77 = 206;
  CV78 = 207;
  CV79 = 208;
  CV80 = 209;
  CV81 = 210;
  CV82 = 211;
  CV83 = 212;
  CV84 = 213;
  CV85 = 214;
  CV86 = 215;
  CV87 = 216;
  CV88 = 217;
  CV89 = 218;
  CV90 = 219;
  CV91 = 220;
  CV92 = 221;
  CV93 = 222;
  CV94 = 223;
  CV95 = 224;
  CV96 = 225;
  CV97 = 226;
  CV98 = 227;
  CV99 = 228;
}

struct ExportConstraint {
  ExportConstraintType type;
  float value;
}

struct GUIDMapping {
  GUID from;
  GUID to;
}

struct Blob {
  byte[] bytes;
}

message Image {
  byte[] hash = 1;
  string name = 2;
  uint dataBlob = 3;
}

message Video {
  byte[] hash = 1;
  string s3Url = 2;
}

message PasteSource {
  string srcFile = 1;
  GUID srcNode = 2;
}

struct FilterColorAdjust {
  float tint;
  float shadows;
  float highlights;
  float detail;
  float exposure;
  float vignette;
  float temperature;
  float vibrance;
}

message PaintFilterMessage {
  float tint = 1;
  float shadows = 2;
  float highlights = 3;
  float detail = 4;
  float exposure = 5;
  float vignette = 6;
  float temperature = 7;
  float vibrance = 8;
  float contrast = 9;
  float brightness = 10;
}

message Paint {
  PaintType type = 1;
  Color color = 2;
  float opacity = 3;
  bool visible = 4;
  BlendMode blendMode = 5;
  ColorStop[] stops = 6;
  Matrix transform = 7;
  Image image = 8;
  Image imageThumbnail = 9;
  Image animatedImage = 16;
  uint animationFrame = 17;
  ImageScaleMode imageScaleMode = 10;
  bool imageShouldColorManage = 22;
  float rotation = 11;
  float scale = 12;
  FilterColorAdjust filterColorAdjust = 13;
  PaintFilterMessage paintFilter = 14;
  uint[] emojiCodePoints = 15;
  Video video = 18;
  uint originalImageWidth = 19;
  uint originalImageHeight = 20;
  VariableData opacityVar = 38;
  VariableData colorVar = 21;
  VariableData imageVar = 31;
  ColorStopVar[] stopsVar = 23;
  string thumbHashBase64 = 24;
  byte[] thumbHash = 25;
  GUID sourceNodeId = 26;
  float spacing = 27;
  Vector patternSpacing = 37;
  PatternTileType patternTileType = 28;
  PatternAlignment verticalAlignment = 29;
  PatternAlignment horizontalAlignment = 30;
  GUID id = 32;
  string altText = 33;
  NoiseType noiseType = 34;
  float density = 35;
  Vector noiseSize = 36;
  CodeComponentId customEffectId = 39;
  ComponentPropAssignment[] componentPropAssignments = 40;
}

enum NoiseType {
  MULTITONE = 0;
  MONOTONE = 1;
  DUOTONE = 2;
}

enum PatternTileType {
  RECTANGULAR = 0;
  HORIZONTAL_HEXAGONAL = 1;
  VERTICAL_HEXAGONAL = 2;
}

enum PatternAlignment {
  START = 0;
  CENTER = 1;
  END = 2;
}

message FontMetaData {
  FontName key = 1;
  float fontLineHeight = 2;
  byte[] fontDigest = 3;
  FontStyle fontStyle = 4;
  int fontWeight = 5;
}

message FontVariation {
  uint axisTag = 1;
  string axisName = 2;
  float value = 3;
}

message TextData {
  string characters = 1;
  uint[] characterStyleIDs = 2;
  NodeChange[] styleOverrideTable = 3;
  TextLineData[] lines = 12;
  uint layoutVersion = 8;
  FontName[] fallbackFonts = 10;
  float minContentHeight = 17;
  Vector layoutSize = 4;
  Baseline[] baselines = 5;
  Glyph[] glyphs = 6;
  Decoration[] decorations = 7;
  Blockquote[] blockquotes = 16;
  FontMetaData[] fontMetaData = 9;
  HyperlinkBox[] hyperlinkBoxes = 11;
  int truncationStartIndex = 13;
  float truncatedHeight = 14;
  float[] logicalIndexToCharacterOffsetMap = 15;
  MentionBox[] mentionBoxes = 18;
  DerivedTextLineData[] derivedLines = 19;
}

message DerivedTextData {
  Vector layoutSize = 1;
  Baseline[] baselines = 2;
  Glyph[] glyphs = 3;
  Decoration[] decorations = 4;
  Blockquote[] blockquotes = 5;
  FontMetaData[] fontMetaData = 6;
  HyperlinkBox[] hyperlinkBoxes = 7;
  int truncationStartIndex = 8;
  float truncatedHeight = 9;
  float[] logicalIndexToCharacterOffsetMap = 10;
  MentionBox[] mentionBoxes = 11;
  DerivedTextLineData[] derivedLines = 12;
}

message HyperlinkBox {
  Rect bounds = 1;
  string url = 2;
  GUID guid = 3;
  CMSItemPageTarget cmsTarget = 5;
  bool openInNewTab = 6;
  int hyperlinkID = 4;
}

message MentionBox {
  Rect bounds = 1;
  uint startIndex = 2;
  uint endIndex = 3;
  bool isValid = 4;
  uint mentionKey = 5;
}

message Baseline {
  Vector position = 1;
  float width = 2;
  float lineY = 3;
  float lineHeight = 4;
  float lineAscent = 7;
  float ignoreLeadingTrim = 8;
  uint firstCharacter = 5;
  uint endCharacter = 6;
}

message Glyph {
  uint commandsBlob = 1;
  Vector position = 2;
  uint styleID = 3;
  float fontSize = 4;
  uint firstCharacter = 5;
  float advance = 6;
  uint[] emojiCodePoints = 7;
  EmojiImageSet emojiImageSet = 8;
  float rotation = 9;
}

message Decoration {
  Rect[] rects = 1;
  uint styleID = 2;
}

message Blockquote {
  Rect verticalBar = 1;
  Rect quoteMarkBounds = 2;
  uint styleID = 3;
}

message VectorData {
  uint vectorNetworkBlob = 1;
  Vector normalizedSize = 2;
  NodeChange[] styleOverrideTable = 3;
}

message TextPathStart {
  float tValue = 1;
  bool forward = 2;
}

message GUIDPath {
  GUID[] guids = 1;
}

message SymbolData {
  GUID symbolID = 1;
  NodeChange[] symbolOverrides = 2;
  float uniformScaleFactor = 3;
}

message GUIDPathMapping {
  GUID id = 1;
  GUIDPath path = 2;
}

message DerivedBreakpointData {
  NodeChange[] overrides = 1;
}

message NodeGenerationData {
  NodeChange[] overrides = 1;
  bool useFineGrainedSyncing = 2;
  NodeChange[] diffOnlyRemovals = 3;
}

message DerivedImmutableFrameData {
  NodeChange[] overrides = 1;
  uint version = 2;
}

message JsxData {
  NodeChange[] overrides = 1;
}

message DerivedJsxData {
  NodeChange[] overrides = 1;
}

message AssetIdMap {
  AssetIdEntry[] entries = 1;
}

message AssetIdEntry {
  string assetKey = 1;
  AssetId assetId = 2;
}

message AssetRef {
  string key = 1;
  string version = 2;
}

message AssetId {
  GUID guid = 1;
  AssetRef assetRef = 2;
  StateGroupId stateGroupId = 3;
  StyleId styleId = 4;
  SymbolId symbolId = 5;
  VariableID variableId = 6;
  VariableSetID variableSetId = 7;
}

message StateGroupId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message StyleId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message SymbolId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message VariableID {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message VariableOverrideId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message VariableSetID {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message ModuleId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message ResponsiveSetId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message WebpageId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message ThemeID {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message CodeLibraryId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message CodeFileId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message CodeComponentId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message CanvasNodeId {
  GUID guid = 1;
  SymbolId symbolId = 2;
  StateGroupId stateGroupId = 3;
}

struct IndexRange {
  uint startIndex;
  uint endIndexExclusive;
}

struct CollaborativeTextOpID {
  uint sessionID;
  uint counterID;
}

enum CollaborativeTextOpType {
  INSERT = 0;
  DELETE = 1;
}

message CollaborativeTextStrippedOpRunWithIDs {
  CollaborativeTextOpID firstId = 1;
  uint runLength = 2;
  CollaborativeTextOpID[] parentIds = 3;
  CollaborativeTextOpID[] rebasedOnOpIds = 4;
}

message CollaborativeTextStrippedOpRunWithLoc {
  CollaborativeTextOpType type = 1;
  IndexRange range = 2;
  bool rangeShouldBeIteratedInReverse = 3;
  IndexRange contentBytesInBuffer = 4;
  IndexRange rebasedRange = 5;
}

message CollaborativeTextOpRun {
  CollaborativeTextOpID id = 1;
  CollaborativeTextOpID[] parentIds = 2;
  CollaborativeTextOpType type = 3;
  IndexRange range = 4;
  bool rangeShouldBeIteratedInReverse = 5;
  string content = 6;
  CollaborativeTextOpID[] rebasedOnOpIds = 7;
  IndexRange rebasedRange = 8;
}

message CollaborativePlainText {
  CollaborativeTextStrippedOpRunWithIDs[] historyOpsWithIds = 1;
  CollaborativeTextStrippedOpRunWithLoc[] historyOpsWithLoc = 2;
  byte[] historyStringContentBuffer = 3;
  CollaborativeTextOpRun[] changesToAppend = 4;
}

message CollaborativeTextSelection {
  GUID node = 1;
  uint field = 2;
  IndexRange selectedRange = 3;
  bool caretAtFront = 4;
  CollaborativeTextOpID[] textVersion = 5;
}

message ResponsiveTextStyleVariant {
  float minWidth = 1;
  NodeChange fields = 2;
  VariableData variableFontSize = 3;
  VariableData variableLineHeight = 4;
  VariableData variableLetterSpacing = 5;
  VariableData variableParagraphSpacing = 6;
  string name = 7;
}

enum FlappType {
  POLL = 0;
  EMBED = 1;
  FACEPILE = 2;
  ALIGNMENT = 3;
  YOUTUBE = 4;
}

message SlideThemeProps {
  string themeVersion = 1;
  VariableSetID variableSetId = 2;
  StyleId[] textStyleIds = 3;
  bool isTextColorManuallySelected = 4;
  bool isBorderColorManuallySelected = 5;
  AssetRef subscribedThemeRef = 6;
  uint schemaVersion = 7;
  bool isGeneratedFromDesign = 8;
}

message SlideThemeMap {
  SlideThemeMapEntry[] entries = 1;
}

message SlideThemeMapEntry {
  ThemeID themeId = 1;
  SlideThemeProps themeProps = 2;
}

message SharedSymbolReference {
  string fileKey = 1;
  GUID symbolID = 2;
  string versionHash = 3;
  GUIDPathMapping[] guidPathMappings = 4;
  byte[] bytes = 5;
  GUIDMapping[] libraryGUIDToSubscribingGUID = 6;
  string componentKey = 7;
  GUIDPathMapping[] unflatteningMappings = 8;
  bool isUnflattened = 9;
}

message SharedComponentMasterData {
  string componentKey = 1;
  GUIDPathMapping[] publishingGUIDPathToTeamLibraryGUID = 2;
  bool isUnflattened = 3;
}

message InstanceOverrideStash {
  GUIDPath overridePathOfSwappedInstance = 1;
  string componentKey = 2;
  NodeChange[] overrides = 3;
}

message InstanceOverrideStashV2 {
  GUIDPath overridePathOfSwappedInstance = 1;
  GUID localSymbolID = 2;
  NodeChange[] overrides = 3;
}

message ImportedCodeFileEntry {
  CodeFileId codeFileId = 1;
}

message ImportedCodeFiles {
  ImportedCodeFileEntry[] entries = 1;
}

enum BlurOpType {
  NORMAL = 0;
  PROGRESSIVE = 1;
}

enum RepeatType {
  LINEAR = 0;
  RADIAL = 1;
}

enum UnitType {
  PIXELS = 0;
  RELATIVE = 1;
}

enum RepeatOrder {
  FORWARD = 0;
  REVERSE = 1;
}

enum EffectAxis {
  X = 0;
  Y = 1;
  X_AND_Y = 2;
}

message Effect {
  EffectType type = 1;
  Vector offset = 3;
  float radius = 4;
  bool visible = 5;
  BlendMode blendMode = 6;
  float spread = 7;
  bool showShadowBehindNode = 8;
  VariableData radiusVar = 9;
  VariableData colorVar = 10;
  VariableData spreadVar = 11;
  VariableData xVar = 12;
  VariableData yVar = 13;
  uint count = 14;
  RepeatType repeatType = 15;
  EffectAxis axis = 16;
  UnitType unitType = 17;
  RepeatOrder order = 18;
  BlurOpType blurOpType = 19;
  Vector startOffset = 20;
  Vector endOffset = 28;
  float startRadius = 21;
  Color color = 2;
  Color secondaryColor = 24;
  Vector noiseSize = 22;
  uint seed = 29;
  bool clipToShape = 23;
  float density = 25;
  NoiseType noiseType = 26;
  float opacity = 27;
  float refractionRadius = 30;
  float specularAngle = 31;
  float specularIntensity = 32;
  float bevelSize = 33;
  float chromaticAberration = 34;
  float reflectionDistance = 35;
  float refractionIntensity = 36;
  VariableData refractionRadiusVar = 37;
  VariableData specularAngleVar = 38;
  VariableData specularIntensityVar = 39;
  VariableData chromaticAberrationVar = 40;
  VariableData splayVar = 41;
  VariableData refractionIntensityVar = 42;
  CodeComponentId customEffectId = 43;
  ComponentPropAssignment[] componentPropAssignments = 44;
  VariableData startRadiusVar = 45;
  VariableData startOffsetXVar = 46;
  VariableData startOffsetYVar = 47;
  VariableData endOffsetXVar = 48;
  VariableData endOffsetYVar = 49;
  VariableData noiseSizeXVar = 50;
  VariableData noiseSizeYVar = 51;
  VariableData densityVar = 52;
  VariableData effectOpacityVar = 53;
  VariableData secondaryColorVar = 54;
  GUID id = 55;
}

enum TransformModifierType {
  REPEAT = 0;
  SYMMETRY = 1;
  SKEW = 2;
}

message TransformModifier {
  TransformModifierType type = 1;
  Vector offset = 2;
  bool visible = 3;
  uint count = 4;
  RepeatType repeatType = 5;
  EffectAxis axis = 6;
  UnitType unitType = 7;
  RepeatOrder order = 8;
  float skewX = 9;
  float skewY = 10;
}

enum TransformSchemaType {
  NONE = 0;
  FIXED_ORDER = 1;
  FREEFORM = 2;
}

struct Matrix4f {
  float m00;
  float m01;
  float m02;
  float m03;
  float m10;
  float m11;
  float m12;
  float m13;
  float m20;
  float m21;
  float m22;
  float m23;
  float m30;
  float m31;
  float m32;
  float m33;
}

message FixedOrderTransform3d {
  float perspective = 1;
  float translateZ = 2;
  float rotateX = 3;
  float rotateY = 4;
  float rotateZ = 5;
}

enum TransformFnType {
  NONE = 0;
  MATRIX_3D = 1;
  PERSPECTIVE = 2;
  TRANSLATE_Z = 3;
  ROTATE_X = 4;
  ROTATE_Y = 5;
  ROTATE_Z = 6;
}

message TransformFnValue {
  Matrix4f matrix3d = 1;
  float perspective = 2;
  float rotateAngle = 3;
  float translateValue = 4;
}

message TransformFn {
  TransformFnType type = 1;
  TransformFnValue value = 2;
}

message TransformSchemaValue {
  FixedOrderTransform3d fixedOrderTransform3d = 1;
  TransformFn[] transformFunctions = 2;
}

message Transform3d {
  TransformSchemaType type = 1;
  TransformSchemaValue value = 2;
  bool backfaceHidden = 3;
}

struct NumberVector2D {
  Number x;
  Number y;
}

message Scene3d {
  float perspective = 1;
  NumberVector2D perspectiveOrigin = 2;
  bool preserve3d = 3;
}

message TransformOrigin {
  Number x = 1;
  Number y = 2;
}

message TransitionInfo {
  TransitionType type = 1;
  float duration = 2;
}

enum PrototypeDeviceType {
  NONE = 0;
  PRESET = 1;
  CUSTOM = 2;
  PRESENTATION = 3;
}

enum DeviceRotation {
  NONE = 0;
  CCW_90 = 1;
}

message PrototypeDevice {
  PrototypeDeviceType type = 1;
  Vector size = 2;
  string presetIdentifier = 3;
  DeviceRotation rotation = 4;
}

enum OverlayPositionType {
  CENTER = 0;
  TOP_LEFT = 1;
  TOP_CENTER = 2;
  TOP_RIGHT = 3;
  BOTTOM_LEFT = 4;
  BOTTOM_CENTER = 5;
  BOTTOM_RIGHT = 6;
  MANUAL = 7;
}

enum OverlayBackgroundInteraction {
  NONE = 0;
  CLOSE_ON_CLICK_OUTSIDE = 1;
}

enum OverlayBackgroundType {
  NONE = 0;
  SOLID_COLOR = 1;
}

message OverlayBackgroundAppearance {
  OverlayBackgroundType backgroundType = 1;
  Color backgroundColor = 2;
}

enum NavigationType {
  NAVIGATE = 0;
  OVERLAY = 1;
  SWAP = 2;
  SWAP_STATE = 3;
  SCROLL_TO = 4;
}

enum ExportColorProfile {
  DOCUMENT = 0;
  SRGB = 1;
  DISPLAY_P3_V4 = 2;
  CMYK = 3;
}

enum ExportBackgroundType {
  SOLID = 0;
  TRANSPARENT = 1;
  GRID = 2;
}

message ExportSettings {
  string suffix = 1;
  ImageType imageType = 2;
  ExportConstraint constraint = 3;
  bool svgDataName = 4;
  ExportSVGIDMode svgIDMode = 5;
  bool svgOutlineText = 6;
  bool contentsOnly = 7;
  bool svgForceStrokeMasks = 8;
  bool useAbsoluteBounds = 9;
  ExportColorProfile colorProfile = 10;
  float quality = 11;
  bool useBicubicSampler = 12;
  int frameRate = 13;
  int loopCount = 14;
  ExportBackgroundType backgroundType = 15;
}

enum ExportSVGIDMode {
  IF_NEEDED = 0;
  ALWAYS = 1;
}

message LayoutGrid {
  LayoutGridType type = 1;
  Axis axis = 2;
  bool visible = 3;
  int numSections = 4;
  float offset = 5;
  float sectionSize = 6;
  float gutterSize = 7;
  Color color = 8;
  LayoutGridPattern pattern = 9;
  VariableData numSectionsVar = 10;
  VariableData offsetVar = 11;
  VariableData sectionSizeVar = 12;
  VariableData gutterSizeVar = 13;
}

message Guide {
  Axis axis = 1;
  float offset = 2;
  GUID guid = 3;
}

message Path {
  WindingRule windingRule = 1;
  uint commandsBlob = 2;
  uint styleID = 3;
}

enum StyleType {
  NONE = 0;
  FILL = 1;
  STROKE = 2;
  TEXT = 3;
  EFFECT = 4;
  EXPORT = 5;
  GRID = 6;
  ANIMATION = 7;
}

enum BrushOrientation {
  FORWARD = 0;
  REVERSE = 1;
}

enum BrushType {
  STRETCH = 0;
  SCATTER = 1;
}

message DynamicStrokeSettings {
  float frequency = 1;
  float wiggle = 2;
  float smoothen = 3;
}

message ScatterStrokeSettings {
  float gap = 1;
  float wiggle = 2;
  float angularJitter = 3;
  float rotation = 4;
  float sizeJitter = 5;
}

message StretchStrokeSettings {
  BrushOrientation orientation = 1;
}

message StrokeData {
  Stroke[] strokes = 1;
  uint version = 2;
}

message Stroke {
  int strokeId = 1;
  float strokeWeight = 2;
  VariableData strokeWeightVar = 3;
  Paint[] strokePaint = 4;
  StyleId styleIdForStrokeFill = 5;
  StrokeAlign strokeAlign = 6;
  StrokeCap strokeCap = 7;
  Number strokeCapSize = 8;
  StrokeJoin strokeJoin = 9;
  float miterLimit = 10;
  float[] dashPattern = 11;
  OptionalVector pathTrim = 12;
  float strokeOffset = 13;
  bool isDeleted = 14;
}

message VariableWidthPoint {
  float position = 1;
  float ascent = 2;
  float descent = 3;
  int segmentId = 4;
}

message SharedStyleReference {
  string styleKey = 1;
  string versionHash = 2;
}

message SharedStyleMasterData {
  string styleKey = 1;
  string sortPosition = 2;
  string fileKey = 3;
}

enum ScrollBehavior {
  SCROLLS = 0;
  FIXED_WHEN_CHILD_OF_SCROLLING_FRAME = 1;
  STICKY_SCROLLS = 2;
}

message ArcData {
  float startingAngle = 1;
  float endingAngle = 2;
  float innerRadius = 3;
}

message SymbolLink {
  string uri = 1;
  string displayName = 2;
  string displayText = 3;
}

message PluginData {
  string pluginID = 1;
  string value = 2;
  string key = 3;
}

message PluginRelaunchData {
  string pluginID = 1;
  string message = 2;
  string command = 3;
  bool isDeleted = 4;
  CodeComponentId customToolId = 5;
}

message MultiplayerFieldVersion {
  uint counter = 1;
  uint sessionID = 2;
}

enum ConnectorMagnet {
  NONE = 0;
  AUTO = 1;
  TOP = 2;
  LEFT = 3;
  BOTTOM = 4;
  RIGHT = 5;
  CENTER = 6;
  AUTO_HORIZONTAL = 7;
  EDGE = 8;
  ABSOLUTE = 9;
}

message ConnectorEndpoint {
  GUID endpointNodeID = 1;
  Vector position = 2;
  ConnectorMagnet magnet = 3;
  Vector relativePosition = 4;
}

message ConnectorControlPoint {
  Vector position = 1;
  Vector axis = 2;
}

enum ConnectorTextSection {
  MIDDLE_TO_START = 0;
  MIDDLE_TO_END = 1;
}

enum ConnectorOffAxisOffset {
  NONE = 0;
  ABOVE = 1;
  BELOW = 2;
}

message ConnectorTextMidpoint {
  ConnectorTextSection section = 1;
  float offset = 2;
  ConnectorOffAxisOffset offAxisOffset = 3;
}

enum ConnectorLineStyle {
  ELBOWED = 0;
  STRAIGHT = 1;
  CURVED = 2;
}

enum ConnectorType {
  MANUAL = 0;
  DIAGRAM = 1;
}

enum AnnotationPropertyType {
  FILL = 0;
  STROKE = 1;
  WIDTH = 2;
  HEIGHT = 3;
  MIN_WIDTH = 4;
  MIN_HEIGHT = 5;
  MAX_WIDTH = 6;
  MAX_HEIGHT = 7;
  STROKE_WIDTH = 8;
  CORNER_RADIUS = 9;
  EFFECT = 10;
  TEXT_STYLE = 11;
  TEXT_ALIGN_HORIZONTAL = 12;
  FONT_FAMILY = 13;
  FONT_SIZE = 14;
  FONT_WEIGHT = 15;
  LINE_HEIGHT = 16;
  LETTER_SPACING = 17;
  STACK_SPACING = 18;
  STACK_PADDING = 19;
  STACK_MODE = 20;
  STACK_ALIGNMENT = 21;
  OPACITY = 22;
  COMPONENT = 23;
  FONT_STYLE = 24;
  GRID_ROW_GAP = 25;
  GRID_COLUMN_GAP = 26;
  GRID_ROW_COUNT = 27;
  GRID_COLUMN_COUNT = 28;
  GRID_ROW_ANCHOR_INDEX = 29;
  GRID_COLUMN_ANCHOR_INDEX = 30;
  GRID_ROW_SPAN = 31;
  GRID_COLUMN_SPAN = 32;
}

message AnnotationProperty {
  AnnotationPropertyType type = 1;
}

enum AnnotationCategoryPreset {
  NONE = 0;
  ACCESSIBILITY = 1;
  BEHAVIOR = 2;
  CONTENT = 3;
  DEVELOPMENT = 4;
  INTERACTION = 5;
}

enum AnnotationCategoryColor {
  YELLOW = 0;
  ORANGE = 1;
  RED = 2;
  PINK = 3;
  VIOLET = 4;
  BLUE = 5;
  TEAL = 6;
  GREEN = 7;
}

message AnnotationCategoryCustom {
  AnnotationCategoryColor color = 1;
  Color customColor = 2;
  string label = 3;
}

message AnnotationCategory {
  GUID id = 1;
  AnnotationCategoryPreset preset = 2;
  AnnotationCategoryCustom custom = 3;
}

message AnnotationCategories {
  uint version = 1;
  AnnotationCategory[] items = 2;
}

message Annotation {
  string label = 1;
  AnnotationProperty[] properties = 2;
  string labelV2 = 3;
  GUID categoryId = 4;
}

enum AnnotationMeasurementNodeSide {
  TOP = 0;
  BOTTOM = 1;
  LEFT = 2;
  RIGHT = 3;
}

message AnnotationMeasurement {
  GUID id = 1;
  GUID fromNode = 2;
  GUID toNode = 3;
  AnnotationMeasurementNodeSide fromNodeSide = 4;
  bool toSameSide = 5;
  float innerOffsetRelative = 6;
  float outerOffsetFixed = 7;
  GUIDPath toNodeStablePath = 8;
  string freeText = 9;
}

message LibraryMoveInfo {
  string oldKey = 1;
  string pasteFileKey = 2;
}

message LibraryMoveHistoryItem {
  GUID sourceNodeId = 1;
  string sourceComponentKey = 2;
}

message DeveloperRelatedLink {
  string nodeId = 1;
  string fileKey = 2;
  string linkName = 3;
  string linkUrl = 4;
}

message WidgetPointer {
  GUID nodeId = 1;
}

message EditInfo {
  string timestampIso8601 = 1;
  string userId = 2;
  uint lastEditedAt = 3;
  uint createdAt = 4;
}

enum EditorType {
  DESIGN = 0;
  WHITEBOARD = 1;
  SLIDES = 2;
  DEV_HANDOFF = 3;
  SITES = 4;
  COOPER = 5;
  ILLUSTRATION = 6;
  FIGMAKE = 7;
  FIGSPEC = 8;
}

enum MaskType {
  ALPHA = 0;
  OUTLINE = 1;
  LUMINANCE = 2;
}

enum ModuleType {
  NONE = 0;
  SINGLE_NODE = 1;
  MULTI_NODE = 2;
}

enum SectionStatus {
  NONE = 0;
  BUILD = 1;
  COMPLETED = 2;
}

message SectionStatusInfo {
  SectionStatus status = 1;
  uint lastUpdateUnixTimestamp = 2;
  string description = 3;
  string userId = 4;
  SectionStatus prevStatus = 5;
}

message BuzzApprovalRequestInfo {
  string requestId = 1;
  string requesterUserId = 2;
  uint requestedAt = 3;
  string[] reviewerUserIds = 4;
  string title = 5;
  string note = 6;
  GUID[] assetsInRequest = 7;
}

message BuzzApprovalRequests {
  BuzzApprovalRequestInfo[] requests = 1;
}

enum BuzzApprovalNodeStatus {
  NONE = 0;
  IN_REVIEW = 1;
  APPROVED = 2;
  CHANGES_REQUESTED = 3;
}

message BuzzApprovalNodeStatusInfo {
  BuzzApprovalNodeStatus currentStatus = 1;
  bool wasPreviouslyApproved = 2;
  uint[] approvalRevokedAtHistory = 3;
}

message CodeEmbedInfo {
  string url = 1;
  string srcUrl = 2;
  string title = 3;
  string thumbnailImageHash = 4;
  bool isPublishedSite = 5;
}

enum VariableTimingDisplayUnit {
  MILLISECONDS = 0;
  SECONDS = 1;
}

message NodeChange {
  GUID guid = 1;
  uint guidTag = 53;
  NodePhase phase = 2;
  uint phaseTag = 54;
  ParentIndex parentIndex = 3;
  uint parentIndexTag = 55;
  NodeType type = 4;
  uint typeTag = 56;
  string name = 5;
  uint nameTag = 57;
  bool isPublishable = 174;
  string description = 318;
  LibraryMoveInfo libraryMoveInfo = 256;
  LibraryMoveHistoryItem[] libraryMoveHistory = 281;
  string key = 319;
  AssetIdMap fileAssetIds = 383;
  uint styleID = 49;
  uint styleIDTag = 101;
  bool isFillStyle = 157;
  bool isStrokeStyle = 161;
  bool isOverrideOverTextStyle = 376;
  StyleType styleType = 163;
  string styleDescription = 191;
  string version = 171;
  string userFacingVersion = 399;
  string sortPosition = 320;
  SharedStyleMasterData ojansSuperSecretNodeField = 345;
  SharedStyleMasterData sevMoonlitLilyData = 348;
  bool isSoftDeletedStyle = 176;
  bool isNonUpdateable = 177;
  SharedStyleMasterData sharedStyleMasterData = 172;
  SharedStyleReference sharedStyleReference = 173;
  GUID inheritFillStyleID = 158;
  GUID inheritStrokeStyleID = 162;
  GUID inheritTextStyleID = 167;
  GUID inheritExportStyleID = 168;
  GUID inheritEffectStyleID = 169;
  GUID inheritGridStyleID = 170;
  GUID inheritFillStyleIDForStroke = 185;
  StyleId styleIdForFill = 332;
  StyleId styleIdForStrokeFill = 333;
  StyleId styleIdForText = 334;
  StyleId styleIdForEffect = 335;
  StyleId styleIdForGrid = 336;
  StyleAnimation[] styleAnimations = 580;
  Paint[] backgroundPaints = 193;
  GUID inheritFillStyleIDForBackground = 194;
  bool isStateGroup = 225;
  StateGroupPropertyValueOrder[] stateGroupPropertyValueOrders = 238;
  PartialPasteAnnotation partialPasteAnnotation = 581;
  SharedSymbolReference sharedSymbolReference = 122;
  bool isSymbolPublishable = 123;
  GUIDPathMapping[] sharedSymbolMappings = 124;
  string sharedSymbolVersion = 126;
  SharedComponentMasterData sharedComponentMasterData = 152;
  string symbolDescription = 144;
  GUIDPathMapping[] unflatteningMappings = 164;
  GUIDPathMapping[] forceUnflatteningMappings = 228;
  string publishFile = 214;
  string sourceLibraryKey = 395;
  GUID publishID = 215;
  string componentKey = 216;
  bool isC2 = 217;
  string publishedVersion = 218;
  string originComponentKey = 252;
  ComponentPropDef[] componentPropDefs = 266;
  ComponentPropRef[] componentPropRefs = 267;
  VariantPropSpec[] variantPropSpecs = 483;
  SymbolData symbolData = 113;
  uint symbolDataTag = 114;
  NodeChange[] derivedSymbolData = 125;
  bool nestedInstanceResizeEnabled = 394;
  GUID overriddenSymbolID = 143;
  ComponentPropAssignment[] componentPropAssignments = 268;
  bool propsAreBubbled = 305;
  InstanceOverrideStash[] overrideStash = 248;
  InstanceOverrideStashV2[] overrideStashV2 = 250;
  GUIDPath guidPath = 111;
  uint guidPathTag = 112;
  int overrideLevel = 321;
  ModuleType moduleType = 382;
  bool isSlot = 463;
  bool isSlotContent = 495;
  float fontSize = 21;
  uint fontSizeTag = 73;
  float paragraphIndent = 22;
  uint paragraphIndentTag = 74;
  float paragraphSpacing = 23;
  uint paragraphSpacingTag = 75;
  TextAlignHorizontal textAlignHorizontal = 32;
  uint textAlignHorizontalTag = 84;
  TextAlignVertical textAlignVertical = 33;
  uint textAlignVerticalTag = 85;
  TextCase textCase = 34;
  uint textCaseTag = 86;
  TextDecoration textDecoration = 35;
  uint textDecorationTag = 87;
  Number lineHeight = 40;
  uint lineHeightTag = 92;
  FontName fontName = 41;
  uint fontNameTag = 93;
  TextData textData = 42;
  uint textDataTag = 94;
  DerivedTextData derivedTextData = 359;
  bool fontVariantCommonLigatures = 127;
  bool fontVariantContextualLigatures = 128;
  bool fontVariantDiscretionaryLigatures = 129;
  bool fontVariantHistoricalLigatures = 130;
  bool fontVariantOrdinal = 131;
  bool fontVariantSlashedZero = 132;
  FontVariantNumericFigure fontVariantNumericFigure = 133;
  FontVariantNumericSpacing fontVariantNumericSpacing = 134;
  FontVariantNumericFraction fontVariantNumericFraction = 135;
  FontVariantCaps fontVariantCaps = 136;
  FontVariantPosition fontVariantPosition = 137;
  Number letterSpacing = 165;
  string fontVersion = 202;
  LeadingTrim leadingTrim = 322;
  bool hangingPunctuation = 337;
  bool hangingList = 339;
  bool fallbackGlyphs = 550;
  int maxLines = 351;
  ResponsiveTextStyleVariant[] responsiveTextStyleVariants = 417;
  SectionStatus sectionStatus = 352;
  SectionStatusInfo sectionStatusInfo = 355;
  uint textUserLayoutVersion = 203;
  uint textExplicitLayoutVersion = 396;
  OpenTypeFeature[] toggledOnOTFeatures = 205;
  OpenTypeFeature[] toggledOffOTFeatures = 206;
  Hyperlink hyperlink = 223;
  Mention mention = 340;
  FontVariation[] fontVariations = 260;
  uint textBidiVersion = 279;
  TextTruncation textTruncation = 280;
  bool hasHadRTLText = 292;
  EmojiImageSet emojiImageSet = 391;
  string slideThumbnailHash = 392;
  bool visible = 6;
  uint visibleTag = 58;
  bool locked = 7;
  uint lockedTag = 59;
  LockMode lockMode = 434;
  float opacity = 8;
  uint opacityTag = 60;
  BlendMode blendMode = 9;
  uint blendModeTag = 61;
  Vector size = 11;
  uint sizeTag = 63;
  Matrix transform = 12;
  uint transformTag = 64;
  float[] dashPattern = 13;
  uint dashPatternTag = 65;
  bool mask = 16;
  uint maskTag = 68;
  Vector rotationOrigin = 424;
  bool maskIsOutline = 18;
  uint maskIsOutlineTag = 70;
  MaskType maskType = 317;
  float backgroundOpacity = 19;
  uint backgroundOpacityTag = 71;
  float cornerRadius = 20;
  uint cornerRadiusTag = 72;
  float strokeWeight = 26;
  uint strokeWeightTag = 78;
  StrokeAlign strokeAlign = 29;
  uint strokeAlignTag = 81;
  StrokeCap strokeCap = 30;
  uint strokeCapTag = 82;
  Number strokeCapSize = 497;
  StrokeJoin strokeJoin = 31;
  uint strokeJoinTag = 83;
  Paint[] fillPaints = 38;
  uint fillPaintsTag = 90;
  Paint[] strokePaints = 39;
  uint strokePaintsTag = 91;
  Effect[] effects = 43;
  uint effectsTag = 95;
  Color backgroundColor = 50;
  uint backgroundColorTag = 102;
  Path[] fillGeometry = 51;
  uint fillGeometryTag = 103;
  Path[] strokeGeometry = 52;
  uint strokeGeometryTag = 104;
  Path[] offsetFillMaskGeometry = 564;
  Paint[] textDecorationFillPaints = 411;
  bool textDecorationSkipInk = 412;
  Number textUnderlineOffset = 413;
  Number textDecorationThickness = 415;
  TextDecorationStyle textDecorationStyle = 416;
  TransformModifier[] transformModifiers = 455;
  Transform3d transform3d = 570;
  StrokeData strokeData = 571;
  Scene3d scene3d = 572;
  TransformOrigin transformOrigin = 587;
  float rectangleTopLeftCornerRadius = 145;
  float rectangleTopRightCornerRadius = 146;
  float rectangleBottomLeftCornerRadius = 147;
  float rectangleBottomRightCornerRadius = 148;
  bool rectangleCornerRadiiIndependent = 149;
  bool rectangleCornerToolIndependent = 150;
  bool proportionsConstrained = 151;
  OptionalVector targetAspectRatio = 423;
  bool useAbsoluteBounds = 258;
  bool borderTopHidden = 287;
  bool borderBottomHidden = 288;
  bool borderLeftHidden = 289;
  bool borderRightHidden = 290;
  bool bordersTakeSpace = 294;
  float borderTopWeight = 295;
  float borderBottomWeight = 296;
  float borderLeftWeight = 297;
  float borderRightWeight = 298;
  bool borderStrokeWeightsIndependent = 299;
  ConstraintType horizontalConstraint = 28;
  uint horizontalConstraintTag = 80;
  StackMode stackMode = 105;
  uint stackModeTag = 106;
  float stackSpacing = 107;
  uint stackSpacingTag = 108;
  float stackPadding = 109;
  uint stackPaddingTag = 110;
  StackCounterAlign stackCounterAlign = 120;
  StackJustify stackJustify = 121;
  StackAlign stackAlign = 208;
  float stackHorizontalPadding = 209;
  float stackVerticalPadding = 210;
  StackSize stackWidth = 211;
  StackSize stackHeight = 212;
  StackSize stackPrimarySizing = 229;
  StackJustify stackPrimaryAlignItems = 230;
  StackAlign stackCounterAlignItems = 231;
  float stackChildPrimaryGrow = 232;
  float stackPaddingRight = 233;
  float stackPaddingBottom = 234;
  StackCounterAlign stackChildAlignSelf = 236;
  StackPositioning stackPositioning = 269;
  bool stackReverseZIndex = 271;
  StackWrap stackWrap = 323;
  float stackCounterSpacing = 324;
  OptionalVector minSize = 325;
  OptionalVector maxSize = 326;
  StackCounterAlignContent stackCounterAlignContent = 343;
  int[] sortedMovingChildIndices = 406;
  uint stackLayoutVersion = 574;
  GUIDPositionMap gridRows = 435;
  GUIDPositionMap gridColumns = 436;
  float gridRowGap = 437;
  float gridColumnGap = 438;
  GUID gridRowAnchor = 439;
  GUID gridColumnAnchor = 440;
  uint gridRowSpan = 441;
  uint gridColumnSpan = 442;
  GUIDGridTrackSizeMap gridColumnsSizing = 474;
  GUIDGridTrackSizeMap gridRowsSizing = 475;
  GridChildAlign gridChildVerticalAlign = 476;
  GridChildAlign gridChildHorizontalAlign = 477;
  GridAutoTracks gridAutoTracks = 555;
  bool gridReflowEnabled = 556;
  bool isSnakeGameBoard = 344;
  GUID transitionNodeID = 139;
  GUID prototypeStartNodeID = 140;
  Color prototypeBackgroundColor = 141;
  TransitionInfo transitionInfo = 153;
  TransitionType transitionType = 154;
  float transitionDuration = 155;
  EasingType easingType = 156;
  bool transitionPreserveScroll = 181;
  ConnectionType connectionType = 182;
  string connectionURL = 183;
  PrototypeDevice prototypeDevice = 184;
  InteractionType interactionType = 187;
  float transitionTimeout = 188;
  bool interactionMaintained = 189;
  float interactionDuration = 190;
  bool destinationIsOverlay = 192;
  bool transitionShouldSmartAnimate = 207;
  PrototypeInteraction[] prototypeInteractions = 226;
  PrototypeInteraction[] objectAnimations = 426;
  PrototypeStartingPoint prototypeStartingPoint = 249;
  PluginData[] pluginData = 204;
  PluginRelaunchData[] pluginRelaunchData = 219;
  ConnectorEndpoint connectorStart = 242;
  ConnectorEndpoint connectorEnd = 243;
  ConnectorLineStyle connectorLineStyle = 244;
  StrokeCap connectorStartCap = 245;
  StrokeCap connectorEndCap = 246;
  ConnectorControlPoint[] connectorControlPoints = 253;
  ConnectorControlPoint[] connectorBezierControlPoints = 479;
  ConnectorTextMidpoint connectorTextMidpoint = 255;
  ConnectorType connectorType = 373;
  int connectorVersion = 533;
  Annotation[] annotations = 369;
  AnnotationMeasurement[] measurements = 384;
  AnnotationCategories annotationCategories = 453;
  ShapeWithTextType shapeWithTextType = 241;
  float shapeUserHeight = 247;
  bool isStrokePaintDerived = 530;
  DerivedImmutableFrameData derivedImmutableFrameData = 254;
  MultiplayerFieldVersion derivedImmutableFrameDataVersion = 338;
  NodeGenerationData nodeGenerationData = 240;
  JsxData jsxData = 491;
  DerivedJsxData derivedJsxData = 492;
  string stableKey = 493;
  CodeBlockLanguage codeBlockLanguage = 259;
  CodeBlockTheme codeBlockTheme = 433;
  LinkPreviewData linkPreviewData = 278;
  bool shapeTruncates = 282;
  bool sectionContentsHidden = 283;
  VideoPlayback videoPlayback = 300;
  StampData stampData = 301;
  SectionPresetInfo sectionPresetInfo = 370;
  PlatformShapeDefinition platformShapeDefinition = 409;
  MultiplayerMap widgetSyncedState = 273;
  uint widgetSyncCursor = 274;
  WidgetDerivedSubtreeCursor widgetDerivedSubtreeCursor = 275;
  WidgetPointer widgetCachedAncestor = 276;
  WidgetInputBehavior widgetInputBehavior = 285;
  string widgetTooltip = 286;
  WidgetHoverStyle widgetHoverStyle = 291;
  bool isWidgetStickable = 293;
  bool shouldHideCursorsOnWidgetHover = 360;
  WidgetMetadata widgetMetadata = 262;
  WidgetEvent[] widgetEvents = 263;
  WidgetPropertyMenuItem[] widgetPropertyMenuItems = 265;
  WidgetInputTextNodeType widgetInputTextNodeType = 401;
  MultiplayerMap jsxProps = 489;
  TableRowColumnPositionMap tableRowPositions = 308;
  TableRowColumnPositionMap tableColumnPositions = 309;
  TableRowColumnSizeMap tableRowHeights = 310;
  TableRowColumnSizeMap tableColumnWidths = 311;
  TableMergedCellMap tableMergedCells = 538;
  MultiplayerMap interactiveSlideConfigData = 371;
  MultiplayerMap interactiveSlideParticipantData = 372;
  FlappType flappType = 402;
  bool isEmbeddedPrototype = 486;
  string slideSpeakerNotes = 389;
  bool isSkippedSlide = 410;
  MultiplayerMap presentationOutlines = 573;
  ThemeID themeID = 379;
  SlideThemeData slideThemeData = 381;
  SlideThemeMap slideThemeMap = 390;
  string slideTemplateFileKey = 393;
  SlideNumber slideNumber = 443;
  string slideNumberSeparator = 456;
  GUID diagramParentId = 363;
  GUID layoutRoot = 362;
  string layoutPosition = 364;
  DiagramLayoutRuleType diagramLayoutRuleType = 366;
  DiagramParentIndex diagramParentIndex = 367;
  DiagramLayoutPaused diagramLayoutPaused = 368;
  bool isPageDivider = 380;
  InternalEnumForTest internalEnumForTest = 251;
  InternalDataForTest internalDataForTest = 257;
  bool autoRename = 14;
  uint autoRenameTag = 66;
  bool backgroundEnabled = 15;
  uint backgroundEnabledTag = 67;
  bool exportContentsOnly = 17;
  uint exportContentsOnlyTag = 69;
  float miterLimit = 25;
  uint miterLimitTag = 77;
  float textTracking = 27;
  uint textTrackingTag = 79;
  ConstraintType verticalConstraint = 37;
  uint verticalConstraintTag = 89;
  ExportSettings[] exportSettings = 45;
  uint exportSettingsTag = 97;
  TextAutoResize textAutoResize = 46;
  uint textAutoResizeTag = 98;
  LayoutGrid[] layoutGrids = 47;
  uint layoutGridsTag = 99;
  bool frameMaskDisabled = 115;
  uint frameMaskDisabledTag = 116;
  bool resizeToFit = 117;
  uint resizeToFitTag = 118;
  BooleanOperation booleanOperation = 36;
  uint booleanOperationTag = 88;
  VectorMirror handleMirroring = 44;
  uint handleMirroringTag = 96;
  uint count = 10;
  uint countTag = 62;
  float starInnerScale = 24;
  uint starInnerScaleTag = 76;
  ArcData arcData = 195;
  VectorData vectorData = 48;
  uint vectorDataTag = 100;
  uint vectorOperationVersion = 425;
  TextPathStart textPathStart = 432;
  bool exportBackgroundDisabled = 119;
  Guide[] guides = 138;
  bool internalOnly = 142;
  ScrollDirection scrollDirection = 159;
  float cornerSmoothing = 160;
  Vector scrollOffset = 166;
  bool exportTextAsSVGText = 175;
  ScrollContractedState scrollContractedState = 178;
  Vector contractedSize = 179;
  string fixedChildrenDivider = 180;
  ScrollBehavior scrollBehavior = 186;
  int derivedSymbolDataLayoutVersion = 196;
  NavigationType navigationType = 197;
  OverlayPositionType overlayPositionType = 198;
  Vector overlayRelativePosition = 199;
  OverlayBackgroundInteraction overlayBackgroundInteraction = 200;
  OverlayBackgroundAppearance overlayBackgroundAppearance = 201;
  GUID overrideKey = 213;
  bool containerSupportsFillStrokeAndCorners = 220;
  StackSize stackCounterSizing = 221;
  bool containersSupportFillStrokeAndCorners = 222;
  KeyTrigger keyTrigger = 224;
  string voiceEventPhrase = 227;
  GUID[] ancestorPathBeforeDeletion = 235;
  SymbolLink[] symbolLinks = 237;
  TextListData textListData = 239;
  bool detachOpticalSizeFromFontSize = 261;
  float listSpacing = 264;
  EmbedData embedData = 270;
  RichMediaData richMediaData = 272;
  MultiplayerMap renderedSyncedState = 277;
  bool simplifyInstancePanels = 284;
  HTMLTag accessibleHTMLTag = 302;
  ARIARole ariaRole = 303;
  ARIAAttributesMap ariaAttributes = 357;
  string accessibleLabel = 304;
  bool isDecorativeImage = 490;
  VariableData variableData = 306;
  VariableDataMap variableConsumptionMap = 307;
  VariableModeBySetMap variableModeBySetMap = 316;
  VariableSetMode[] variableSetModes = 312;
  VariableSetID variableSetID = 313;
  VariableResolvedDataType variableResolvedType = 314;
  VariableDataValues variableDataValues = 315;
  string variableTokenName = 350;
  VariableTimingDisplayUnit timingDisplayUnit = 566;
  VariableScope[] variableScopes = 353;
  VariableDataMap parameterConsumptionMap = 445;
  CodeSyntaxMap codeSyntax = 358;
  PasteSource pasteSource = 388;
  EditorType pageType = 397;
  GUID strokeBrushGuid = 446;
  uint64 strokeSeed = 482;
  VariableWidthPoint[] variableWidthPoints = 447;
  DynamicStrokeSettings dynamicStrokeSettings = 448;
  ScatterStrokeSettings scatterStrokeSettings = 449;
  StretchStrokeSettings stretchStrokeSettings = 450;
  Matrix[] scatterBrushTransforms = 488;
  BrushType brushType = 452;
  OptionalVector pathTrim = 542;
  float strokeOffset = 554;
  VariableSetID backingVariableSetId = 377;
  VariableID overriddenVariableId = 464;
  VariableIdOrVariableOverrideId backingVariableId = 378;
  bool isCollectionExtendable = 385;
  string rootVariableKey = 386;
  InheritedVariablesData inheritedVariableIds = 517;
  HandoffStatusMap handoffStatusMap = 361;
  AgendaPositionMap agendaPositionMap = 327;
  AgendaMetadataMap agendaMetadataMap = 328;
  MigrationStatus migrationStatus = 329;
  bool isSoftDeleted = 330;
  EditInfo editInfo = 331;
  ColorProfile colorProfile = 341;
  SymbolId detachedSymbolId = 342;
  ChildReadingDirection childReadingDirection = 346;
  string readingIndex = 347;
  DocumentColorProfile documentColorProfile = 349;
  DeveloperRelatedLink[] developerRelatedLinks = 354;
  string slideActiveThemeLibKey = 356;
  EditScopeInfo editScopeInfo = 365;
  SemanticWeight semanticWeight = 374;
  SemanticItalic semanticItalic = 375;
  bool areSlidesManuallyIndented = 403;
  bool isResponsiveSet = 387;
  DerivedBreakpointData derivedBreakpointData = 500;
  GUID defaultResponsiveSetId = 398;
  bool isPrimaryBreakpoint = 458;
  GUID primaryResponsiveNodeId = 457;
  GUID multiEditGlueId = 462;
  float breakpointMinWidth = 501;
  bool isBreakpointInFocus = 522;
  ResponsiveSetSettings responsiveSetSettings = 400;
  NodeBehaviors behaviors = 404;
  string sourceCode = 414;
  CollaborativeTextOpID[] sourceCodeCollaborativeTextVersion = 534;
  CollaborativePlainText collaborativeSourceCode = 444;
  CodeLibraryId belongsToCodeLibraryId = 427;
  ImportedCodeFiles importedCodeFiles = 467;
  CanvasNodeId codeFileCanvasNodeId = 468;
  bool isEntrypointCodeFile = 498;
  string componentOrStateGroupKey = 502;
  uint componentOrStateGroupVersion = 503;
  string sourceCodeLibraryKey = 504;
  string[] sourceCodeLibraryKeys = 515;
  UsedMakeLibrary[] usedMakeLibraries = 524;
  string makeLibraryComponentId = 518;
  bool shouldHidePreviewForMakeKitCreation = 520;
  bool isMakeKit = 551;
  PrototypeDevice codePreviewSettings = 531;
  CodeExample[] codeExamples = 525;
  CodeFileId exportedFromCodeFileId = 428;
  string codeExportName = 430;
  string codeComponentDescription = 547;
  CodeComponentId backingCodeComponentId = 429;
  bool isMainCodeComponent = 487;
  CodeSnapshotState codeSnapshotState = 431;
  NodeChatMessage[] chatMessages = 451;
  NodeChatCompressionState chatCompressionState = 485;
  AIChatThread aiChatThread = 496;
  string codeChatMessagesKey = 484;
  CodeSnapshot codeSnapshot = 459;
  CodeSnapshotLayers codeSnapshotLayers = 589;
  uint codeSnapshotInvalidatedAt = 480;
  bool isCodeBehavior = 465;
  bool autoForkCode = 469;
  bool hasBeenManuallyRenamed = 470;
  bool codeCreatedFromDesign = 471;
  CanvasNodeId codeCreatedFromDesignNodeId = 481;
  ImageImportMap imageImports = 473;
  CodeObjectType codeObjectType = 516;
  string codeFilePath = 472;
  CodeBehaviorData codeBehaviorData = 478;
  uint codeLibraryFormat = 519;
  bool isCodePreviewPlayingOnCanvas = 527;
  CodeEmbedInfo codeEmbedInfo = 532;
  bool isEmbedCodeLayer = 546;
  CodeSourceInfo codeSourceInfo = 558;
  string mimeType = 536;
  byte[] blobRef = 537;
  CMSSelector cmsSelector = 419;
  CMSConsumptionMap cmsConsumptionMap = 420;
  CMSRichTextStyleMap cmsRichTextStyleMap = 460;
  SymbolId repeaterSymbolId = 539;
  RepeaterCmsOverrideData repeaterCmsOverrideData = 540;
  RepeaterSymbolOverrideData repeaterSymbolOverrideData = 549;
  RepeaterOverrideData repeaterOverrideData = 541;
  uint[] aiEditedNodeChangeFieldNumbers = 405;
  string aiEditScopeLabel = 408;
  FirstDraftData firstDraftData = 407;
  FirstDraftKitElementData firstDraftKitElementData = 418;
  CooperRevertData cooperRevertData = 421;
  CooperTemplateData cooperTemplateData = 461;
  BuzzApprovalRequests buzzApprovalRequests = 528;
  BuzzApprovalNodeStatusInfo buzzApprovalNodeStatusInfo = 529;
  HubFileAttribution hubFileAttribution = 422;
  ManagedStringData managedStringData = 454;
  ThumbnailInfo thumbnailInfo = 466;
  AiCanvasPrompt aiCanvasPrompt = 494;
  CanvasNodeId backingNodeId = 499;
  string pageStatus = 548;
  TRSSTransform2D motionTransform = 523;
  int64 timelinePosition = 506;
  KeyframeValueData keyframeValue = 507;
  VariableData keyframeValueRef = 586;
  InterpolationType interpolationType = 505;
  BezierHandles bezierHandles = 508;
  EasingData easingData = 535;
  KeyframeOperation keyframeOperation = 509;
  TimelinePositionType timelinePositionType = 510;
  bool isClip = 545;
  GUID clipId = 511;
  uint64 timelineDuration = 512;
  int64 timelineOffset = 513;
  bool timelineDisabled = 543;
  PlaybackStyle playbackStyle = 514;
  TimelineDefinitionsMap timelineDefinitions = 552;
  TimelineAssignmentsMap timelineAssignments = 553;
  AnimationPresets animationPresets = 521;
  StyleIdForAnimation[] styleIdsForAnimation = 582;
  AnimationPresetId backingAnimationPresetId = 583;
  Tools tools = 568;
  CustomEffects customEffects = 569;
  TransitionOverrideData transitionOverrides = 526;
  bool useLegacySmartAnimate = 544;
  SourceControlConfig sourceControlConfig = 557;
  SpecBlockType specBlockType = 559;
  CollaborativePlainText specBlockContent = 560;
  string specCodeBlockLanguage = 561;
  string specBlockTableAlignment = 562;
  int specBlockIndentLevel = 563;
  string specImageHash = 575;
  int specWidth = 576;
  int specHeight = 577;
  TableRowColumnSizeMap specBlockTableRowHeights = 578;
  TableRowColumnSizeMap specBlockTableColumnWidths = 579;
  string specEmbedUrl = 590;
  bool placeholder = 565;
  string placeholderClientLifecycleId = 584;
  int placeholderInvalidateAt = 585;
  bool disableJitDst = 567;
  CustomToolArtifactRef customToolArtifactRef = 588;
}

enum GitRepoRefProvider {
  UGIT = 0;
  GITHUB = 1;
  OTHER = 2;
}

message GitRepoRef {
  GitRepoRefProvider provider = 1;
  string gitRepo = 2;
  string gitRef = 3;
}

message SourceControlConfig {
  GitRepoRef origin = 1;
  GitRepoRef upstream = 2;
}

message CodeSnapshot {
  CodeSnapshotState state = 6;
  uint invalidatedAt = 7;
  Paint[] paints = 1;
  Vector offset = 2;
  Vector layoutSize = 3;
  Vector canvasSize = 5;
  uint devicePixelRatio = 4;
}

message CodeOutputLayer {
  NodeChange node = 1;
}

message CodeSnapshotLayers {
  CodeSnapshotState state = 1;
  uint invalidatedAt = 2;
  CodeOutputLayer[] layers = 3;
}

message CodeBehaviorData {
  string name = 1;
  string icon = 2;
  string[] nodeTypes = 3;
  string category = 4;
  uint apiVersion = 5;
}

message CodeExample {
  string exampleName = 1;
  string codeExportName = 2;
}

message UsedMakeLibrary {
  string makeLibraryId = 1;
}

message CookieBannerText {
  string bannerHeader = 1;
  string bannerDisclaimerExplicit = 2;
  string bannerDisclaimerImplicit = 3;
  string policyLabel = 4;
  string acceptText = 5;
  string acknowledgeText = 6;
  string manageText = 7;
  string rejectText = 8;
  string necessaryText = 9;
  string necessaryDescription = 10;
  string analyticsText = 11;
  string analyticsDescription = 12;
  string preferencesText = 13;
  string preferencesDescription = 14;
  string marketingText = 15;
  string marketingDescription = 16;
  string saveLabel = 17;
  string triggerLabel = 18;
}

message CookieBannerSettings {
  bool enabled = 1;
  CookieBannerComponentType componentType = 2;
  CookieXAlignment xAlignment = 3;
  CookieYAlignment yAlignment = 4;
  CookieXAlignment triggerXAlignment = 5;
  CookieYAlignment triggerYAlignment = 6;
  TriggerComponentType triggerComponentType = 7;
  string policyUrl = 8;
  CookieBannerText text = 9;
  GUID policyLink = 10;
  string locale = 11;
}

enum CookieBannerComponentType {
  BANNER = 0;
  MODAL = 1;
}

enum TriggerComponentType {
  BANNER = 0;
  TAG = 1;
}

enum CookieXAlignment {
  LEFT = 0;
  CENTER = 1;
  RIGHT = 2;
}

enum CookieYAlignment {
  TOP = 0;
  CENTER = 1;
  BOTTOM = 2;
}

message ResponsiveSetSettings {
  string title = 1;
  string description = 2;
  ResponsiveScalingMode scalingMode = 3;
  float scalingMinFontSize = 4;
  float scalingMaxFontSize = 5;
  float scalingMinLayoutWidth = 6;
  float scalingMaxLayoutWidth = 7;
  string lang = 8;
  string faviconHash = 9;
  string socialImageHash = 10;
  string googleAnalyticsID = 11;
  bool blockSearchIndexing = 12;
  string customCodeHeadStart = 13;
  string customCodeHeadEnd = 14;
  string customCodeBodyStart = 15;
  string customCodeBodyEnd = 16;
  GUID faviconID = 17;
  GUID socialImageID = 18;
  bool addBypassLinks = 19;
  bool ignoreReducedMotion = 20;
  CookieBannerSettings cookieBanner = 21;
}

enum ResponsiveScalingMode {
  REFLOW = 0;
  SCALE = 1;
}

message CMSSelector {
  string cmsCollectionId = 1;
  CMSFilterCritera filterCriteria = 2;
  CMSSelectorSort[] sorts = 3;
  uint limit = 4;
}

message CMSFilterCritera {
  CMSFilterCriteriaMatchType matchType = 1;
  CMSSelectorFilter[] filters = 2;
}

enum CMSFilterCriteriaMatchType {
  MATCH_ALL = 0;
  MATCH_ANY = 1;
}

message CMSSelectorFilter {
  string cmsFieldId = 1;
  CMSSelectorFilterOperator op = 2;
  string comparisonValue = 3;
}

enum CMSSelectorFilterOperator {
  EQUALS = 0;
}

message CMSSelectorSort {
  string cmsFieldId = 1;
  CMSFieldOrderBy orderBy = 2;
}

enum CMSFieldOrderBy {
  ASCENDING = 0;
  DESCENDING = 1;
}

message CMSConsumptionMap {
  CMSConsumptionMapEntry[] entries = 1;
}

message CMSConsumptionMapEntry {
  CMSConsumptionField consumptionField = 1;
  string cmsFieldId = 2;
}

enum CMSConsumptionField {
  MISSING = 0;
  TEXT_DATA = 1;
}

message CMSRichTextStyleMap {
  CMSRichTextStyleEntry[] entries = 1;
}

message CMSRichTextStyleEntry {
  CMSRichTextStyleClass styleClass = 1;
  CMSRichTextDescriptor textDescriptor = 2;
}

enum CMSRichTextStyleClass {
  HEADING1 = 0;
  HEADING2 = 1;
  HEADING3 = 2;
  HEADING4 = 3;
  HEADING5 = 4;
  HEADING6 = 5;
  PARAGRAPH = 6;
  LINK = 7;
  BLOCKQUOTE = 8;
}

message CMSRichTextDescriptor {
  StyleId textStyleId = 1;
  FontName[] fontNameVariants = 2;
}

message RepeaterCmsOverrideData {
  NodeChange[] overrides = 1;
}

message RepeaterOverrideData {
  NodeChange[] parentIndexOverrides = 1;
}

message RepeaterSymbolOverrideData {
  RepeaterPositionOverrides[] overridesByPosition = 1;
}

message RepeaterPositionOverrides {
  ParentIndex position = 1;
  NodeChange[] overrides = 2;
}

message InheritedVariablesData {
  InheritedVariableEntry[] variableIds = 1;
}

message InheritedVariableEntry {
  VariableID variableId = 1;
}

message HubFileAttribution {
  string hubFileId = 1;
  string hubFileName = 2;
}

message ManagedStringData {
  string key = 1;
  string context = 2;
  string locale = 3;
  ManagedStringNode content = 4;
  ManagedStringContentSchema contentSchema = 5;
}

enum ManagedStringContentSchema {
  V0 = 0;
}

enum ManagedStringNodeType {
  TEXT = 0;
  CONCATENATE = 1;
  PLURAL = 2;
  PLACEHOLDER = 3;
}

message ManagedStringNode {
  ManagedStringNodeType type = 1;
  ManagedStringTextNodeData textNodeData = 2;
  ManagedStringConcatenateAstNodeData concatenateNodeData = 3;
  ManagedStringPluralAstNodeData pluralNodeData = 4;
  ManagedStringPlaceholderAstNodeData placeholderNodeData = 5;
}

message ManagedStringTextNodeData {
  string value = 1;
}

message ManagedStringConcatenateAstNodeData {
  ManagedStringNode[] values = 1;
}

enum ManagedStringPluralType {
  ZERO = 0;
  ONE = 1;
  TWO = 2;
  FEW = 3;
  MANY = 4;
  OTHER = 5;
}

message ManagedStringPluralAstNodeData {
  string identifier = 1;
  ManagedStringPluralTypeMapEntry[] conditions = 2;
}

message ManagedStringPluralTypeMapEntry {
  ManagedStringPluralType key = 1;
  ManagedStringNode value = 2;
}

enum ManagedStringFormatType {
  TEXT = 0;
  DATE = 1;
  TIME = 2;
  NUMBER = 3;
}

message ManagedStringPlaceholderAstNodeData {
  string identifier = 1;
  ManagedStringFormatType formatType = 2;
  string formatPattern = 3;
}

message CooperRevertData {
  NodeChange originalValues = 1;
}

message VideoPlayback {
  bool autoplay = 1;
  bool mediaLoop = 2;
  bool muted = 3;
  bool showControls = 4;
  uint startTimeMs = 5;
  uint endTimeMs = 6;
}

enum MediaAction {
  PLAY = 0;
  PAUSE = 1;
  TOGGLE_PLAY_PAUSE = 2;
  MUTE = 3;
  UNMUTE = 4;
  TOGGLE_MUTE_UNMUTE = 5;
  SKIP_FORWARD = 6;
  SKIP_BACKWARD = 7;
  SKIP_TO = 8;
  SET_PLAYBACK_RATE = 9;
}

enum AnimationTimelineAction {
  PLAY = 0;
  PAUSE = 1;
  TOGGLE_PLAY_PAUSE = 2;
  SET_PLAYHEAD = 3;
}

message WidgetHoverStyle {
  Paint[] fillPaints = 1;
  Paint[] strokePaints = 2;
  float opacity = 3;
  bool areFillPaintsSet = 4;
  bool areStrokePaintsSet = 5;
  bool isOpacitySet = 6;
}

message WidgetDerivedSubtreeCursor {
  uint sessionID = 1;
  uint counter = 2;
}

message MultiplayerMap {
  MultiplayerMapEntry[] entries = 1;
}

message MultiplayerMapEntry {
  string key = 1;
  string value = 2;
}

message VariableDataMap {
  VariableDataMapEntry[] entries = 1;
}

message VariableDataMapEntry {
  uint nodeField = 1;
  VariableData variableData = 2;
  VariableField variableField = 3;
}

enum VariableField {
  MISSING = 0;
  CORNER_RADIUS = 1;
  PARAGRAPH_SPACING = 2;
  PARAGRAPH_INDENT = 3;
  STROKE_WEIGHT = 4;
  STACK_SPACING = 5;
  STACK_PADDING_LEFT = 6;
  STACK_PADDING_TOP = 7;
  STACK_PADDING_RIGHT = 8;
  STACK_PADDING_BOTTOM = 9;
  VISIBLE = 10;
  TEXT_DATA = 11;
  WIDTH = 12;
  HEIGHT = 13;
  RECTANGLE_TOP_LEFT_CORNER_RADIUS = 14;
  RECTANGLE_TOP_RIGHT_CORNER_RADIUS = 15;
  RECTANGLE_BOTTOM_LEFT_CORNER_RADIUS = 16;
  RECTANGLE_BOTTOM_RIGHT_CORNER_RADIUS = 17;
  BORDER_TOP_WEIGHT = 18;
  BORDER_BOTTOM_WEIGHT = 19;
  BORDER_LEFT_WEIGHT = 20;
  BORDER_RIGHT_WEIGHT = 21;
  VARIANT_PROPERTIES = 22;
  STACK_COUNTER_SPACING = 23;
  MIN_WIDTH = 24;
  MAX_WIDTH = 25;
  MIN_HEIGHT = 26;
  MAX_HEIGHT = 27;
  FONT_FAMILY = 28;
  FONT_STYLE = 29;
  FONT_VARIATIONS = 30;
  OPACITY = 31;
  FONT_SIZE = 32;
  LETTER_SPACING = 34;
  LINE_HEIGHT = 36;
  OVERRIDDEN_SYMBOL_ID = 37;
  HYPERLINK = 38;
  CMS_SERIALIZED_RICH_TEXT_DATA = 39;
  SLOT_CONTENT_ID = 40;
  GRID_ROW_GAP = 41;
  GRID_COLUMN_GAP = 42;
  X_POSITION = 43;
  Y_POSITION = 44;
  ROTATION = 45;
  MOTION_TRANSLATION_X = 46;
  MOTION_TRANSLATION_Y = 47;
  MOTION_ROTATION = 48;
  MOTION_SCALE_X = 49;
  MOTION_SCALE_Y = 50;
  MOTION_SHEAR = 51;
  SCROLL_OFFSET_X = 52;
  SCROLL_OFFSET_Y = 53;
  PATH_TRIM_START = 54;
  PATH_TRIM_END = 55;
  DISSOLVE_PROGRESS = 56;
  EASING_DATA = 57;
  MEDIA_CURRENT_TIME = 58;
  TRANSFORM_3D_PERSPECTIVE = 59;
  TRANSFORM_3D_TRANSLATION_Z = 60;
  TRANSFORM_3D_ROTATION_X = 61;
  TRANSFORM_3D_ROTATION_Y = 62;
  TRANSFORM_3D_ROTATION_Z = 63;
  POLYGON_COUNT = 64;
  ARC_DATA_STARTING_ANGLE = 65;
  ARC_DATA_ENDING_ANGLE = 66;
  ARC_DATA_INNER_RADIUS = 67;
}

message VariableModeBySetMap {
  VariableModeBySetMapEntry[] entries = 1;
}

message VariableModeBySetMapEntry {
  VariableSetID variableSetID = 1;
  GUID variableModeID = 2;
  VariableSetID variableSetExtensionID = 3;
}

message CodeSyntaxMap {
  CodeSyntaxMapEntry[] entries = 1;
}

message CodeSyntaxMapEntry {
  CodeSyntaxPlatform platform = 1;
  string value = 2;
}

message TableMergedCellMap {
  TableMergedCellMapEntry[] entries = 1;
}

message TableMergedCellMapEntry {
  GUID rowId = 1;
  GUID colId = 2;
  int rowSpan = 3;
  int colSpan = 4;
}

message TableRowColumnPositionMap {
  TableRowColumnPositionMapEntry[] entries = 1;
}

message TableRowColumnPositionMapEntry {
  GUID id = 1;
  string position = 2;
}

message GUIDPositionMap {
  GUIDPositionMapEntry[] entries = 1;
}

message GUIDPositionMapEntry {
  GUID id = 1;
  string position = 2;
}

message GUIDGridTrackSizeMap {
  GUIDGridTrackSizeMapEntry[] entries = 1;
}

message GUIDGridTrackSizeMapEntry {
  GUID id = 1;
  GridTrackSize trackSize = 2;
}

message ObjectAnimationList {
  ObjectAnimationListItem[] entries = 1;
}

message ObjectAnimationListItem {
  GUID targetNodeId = 1;
  PrototypeAction animation = 2;
}

message GridTrackSize {
  GridTrackSizingFunction minSizing = 1;
  GridTrackSizingFunction maxSizing = 2;
}

message GridTrackSizingFunction {
  GridTrackSizingType type = 1;
  float value = 2;
}

enum GridTrackSizingType {
  FLEX = 0;
  FIXED = 1;
  HUG = 2;
}

message TableRowColumnSizeMap {
  TableRowColumnSizeMapEntry[] entries = 1;
}

message TableRowColumnSizeMapEntry {
  GUID id = 1;
  float size = 2;
}

message AgendaPositionMap {
  AgendaPositionMapEntry[] entries = 1;
}

message AgendaPositionMapEntry {
  GUID id = 1;
  string position = 2;
}

enum AgendaItemType {
  NODE = 0;
  BLOCK = 1;
}

message AgendaMetadataMap {
  AgendaMetadataMapEntry[] entries = 1;
}

message AgendaMetadataMapEntry {
  GUID id = 1;
  AgendaMetadata data = 2;
}

message AgendaMetadata {
  string name = 1;
  AgendaItemType type = 2;
  GUID targetNodeID = 3;
  AgendaTimerInfo timerInfo = 4;
  AgendaVoteInfo voteInfo = 5;
  AgendaMusicInfo musicInfo = 6;
}

message AgendaTimerInfo {
  uint timerLength = 1;
}

message AgendaVoteInfo {
  uint voteCount = 1;
}

message AgendaMusicInfo {
  string songID = 1;
  uint startTimeMs = 2;
}

enum DiagramLayoutRuleType {
  NONE = 0;
  TREE = 1;
}

struct DiagramParentIndex {
  GUID guid;
  string position;
}

enum DiagramLayoutPaused {
  NO = 0;
  YES = 1;
}

message ComponentPropRef {
  uint nodeField = 1;
  GUID defID = 2;
  string zombieFallbackName = 3;
  ComponentPropNodeField componentPropNodeField = 4;
  bool isDeleted = 5;
}

enum ComponentPropNodeField {
  VISIBLE = 0;
  TEXT_DATA = 1;
  OVERRIDDEN_SYMBOL_ID = 2;
  INHERIT_FILL_STYLE_ID = 3;
  SLOT_CONTENT_ID = 4;
}

message ComponentPropAssignment {
  GUID defID = 1;
  ComponentPropValue value = 2;
  VariableData varValue = 3;
  DerivedTextData legacyDerivedTextData = 4;
}

message ComponentPropDef {
  GUID id = 1;
  string name = 2;
  ComponentPropValue initialValue = 3;
  string sortPosition = 4;
  GUID parentPropDefId = 5;
  ComponentPropType type = 6;
  bool isDeleted = 7;
  ComponentPropPreferredValues preferredValues = 8;
  VariableData varValue = 9;
  ParameterConfig parameterConfig = 10;
  string description = 11;
  SlotPropConfig slotPropConfig = 12;
  ColorArrayConfig colorArrayConfig = 13;
}

message ComponentPropValue {
  bool boolValue = 1;
  TextData textValue = 2;
  GUID guidValue = 3;
  float floatValue = 4;
  EasingData easingData = 5;
  Vector vectorValue = 6;
  Line lineValue = 7;
  Circle circleValue = 8;
  Rotation3D rotation3DValue = 9;
  CirclePoint circlePointValue = 10;
  Gradient gradientValue = 11;
  ColorPoint colorPointValue = 12;
}

message TimelineData {
  uint64 durationUs = 1;
  bool defaultTimeline = 2;
  GUID parentTimelineDefId = 3;
  PlaybackStyle playbackStyle = 4;
}

message TimelineDefinitionsMap {
  TimelineDefinitionsMapEntry[] entries = 1;
}

message TimelineDefinitionsMapEntry {
  GUID id = 1;
  TimelineData data = 2;
}

message TimelineAssignmentKey {
  GUID assignedTimelineId = 1;
  GUID containingTimelineId = 2;
}

message TimelineBindingData {
  int64 offsetUs = 1;
  bool disabled = 2;
}

message TimelineAssignmentsMap {
  TimelineAssignmentsMapEntry[] entries = 1;
}

message TimelineAssignmentsMapEntry {
  TimelineAssignmentKey key = 1;
  TimelineBindingData value = 2;
}

enum ComponentPropType {
  BOOL = 0;
  TEXT = 1;
  COLOR = 2;
  INSTANCE_SWAP = 3;
  VARIANT = 4;
  NUMBER = 5;
  IMAGE = 6;
  SLOT = 7;
  EASING = 8;
  COLOR_ARRAY = 9;
  VECTOR = 10;
  LINE = 11;
  CIRCLE = 12;
  ROTATION_3D = 13;
  CIRCLE_POINT = 14;
  GRADIENT = 15;
  COLOR_POINT = 16;
}

message ComponentPropPreferredValues {
  string[] stringValues = 1;
  InstanceSwapPreferredValue[] instanceSwapValues = 2;
}

message ParameterConfig {
  NumberPropConfig numberPropConfig = 1;
  ParameterConfigControl control = 2;
  SliderConfig sliderConfig = 3;
  VariableData label = 4;
  InputConfig inputConfig = 5;
  SelectConfig selectConfig = 6;
  PointConfig pointConfig = 7;
  LineConfig lineConfig = 8;
  PointRadiusConfig pointRadiusConfig = 9;
  Rotation3DConfig rotation3DConfig = 10;
  CirclePointConfig circlePointConfig = 11;
  ColorPointConfig colorPointConfig = 12;
  bool showDividerAbove = 13;
}

enum ParameterConfigControl {
  DEFAULT = 0;
  SLIDER = 1;
  INPUT = 2;
  SELECT = 3;
}

message InputConfig {
  VariableData unit = 1;
  VariableData min = 2;
  VariableData max = 3;
}

message SliderConfig {
  VariableData min = 1;
  VariableData max = 2;
  VariableData step = 3;
  VariableData unit = 4;
}

enum PointMode {
  CANVAS_AND_UI = 0;
  CANVAS = 1;
  UI = 2;
}

message PointConfig {
  PointMode mode = 1;
  NumberUnits unit = 2;
}

message Line {
  Vector a = 1;
  Vector b = 2;
}

message LineConfig {
  PointMode mode = 1;
  NumberUnits unit = 2;
}

message Circle {
  Vector center = 1;
  float radius = 2;
}

message PointRadiusConfig {
  PointMode mode = 1;
  NumberUnits positionUnit = 2;
  NumberUnits radiusUnit = 3;
  float minRadius = 4;
  float maxRadius = 5;
}

message Rotation3D {
  float x = 1;
  float y = 2;
  float z = 3;
  float translateZ = 4;
}

message Rotation3DConfig {
  PointMode mode = 1;
}

message CirclePoint {
  Vector center = 1;
  float radius = 2;
  float angle = 3;
}

message CirclePointConfig {
  PointMode mode = 1;
  NumberUnits positionUnit = 2;
  NumberUnits radiusUnit = 3;
  float minRadius = 4;
  float maxRadius = 5;
}

message ColorPoint {
  Vector point = 1;
  VariableData color = 2;
}

message ColorPointConfig {
  PointMode mode = 1;
  NumberUnits unit = 2;
}

message Gradient {
  GradientStop[] stops = 1;
}

message GradientStop {
  float position = 1;
  VariableData color = 2;
}

message SelectOption {
  VariableData value = 1;
  string label = 2;
}

message SelectConfig {
  SelectOption[] options = 1;
}

message ColorArrayConfig {
  uint minLength = 1;
  uint maxLength = 2;
}

message SlotPropConfig {
  bool stretchChildOnInsert = 1;
  bool displayByDefault = 2;
  uint minChildren = 3;
  uint maxChildren = 4;
  bool allowPreferredValuesOnly = 5;
}

message NumberPropConfig {
  ParameterConfigControl control = 1;
  VariableData min = 2;
  VariableData max = 3;
  VariableData step = 4;
}

message InstanceSwapPreferredValue {
  InstanceSwapPreferredValueType type = 1;
  string key = 2;
}

enum InstanceSwapPreferredValueType {
  COMPONENT = 0;
  STATE_GROUP = 1;
}

enum WidgetEvent {
  MOUSE_DOWN = 0;
  CLICK = 1;
  TEXT_EDIT_END = 2;
  ATTACHED_STICKABLES_CHANGED = 3;
  STUCK_STATUS_CHANGED = 4;
}

enum WidgetInputBehavior {
  WRAP = 0;
  TRUNCATE = 1;
  MULTILINE = 2;
}

message WidgetMetadata {
  string pluginID = 1;
  string pluginVersionID = 2;
  string widgetName = 3;
  bool isResizable = 4;
  bool isRotatable = 5;
}

enum WidgetPropertyMenuItemType {
  ACTION = 0;
  SEPARATOR = 1;
  COLOR = 2;
  DROPDOWN = 3;
  COLOR_SELECTOR = 4;
  TOGGLE = 5;
  LINK = 6;
}

message WidgetPropertyMenuSelectorOption {
  string option = 1;
  string tooltip = 2;
}

enum WidgetInputTextNodeType {
  WIDGET_CONTROLLED = 0;
  RICH_TEXT = 1;
}

message WidgetPropertyMenuItem {
  string propertyName = 1;
  string tooltip = 2;
  WidgetPropertyMenuItemType itemType = 3;
  string icon = 4;
  WidgetPropertyMenuSelectorOption[] options = 5;
  string selectedOption = 6;
  bool isToggled = 7;
  string href = 8;
  bool allowCustomColor = 9;
}

enum CodeBlockLanguage {
  TYPESCRIPT = 0;
  CPP = 1;
  RUBY = 2;
  CSS = 3;
  JAVASCRIPT = 4;
  HTML = 5;
  JSON = 6;
  GRAPHQL = 7;
  PYTHON = 8;
  GO = 9;
  SQL = 10;
  SWIFT = 11;
  KOTLIN = 12;
  RUST = 13;
  BASH = 14;
  PLAINTEXT = 15;
  MARKDOWN = 16;
}

enum CodeBlockTheme {
  FIGJAM_DARK = 0;
  DRACULA = 1;
  DUOTONE_SEA = 2;
  DUOTONE_SPACE = 3;
  DUOTONE_EARTH = 4;
  DUOTONE_FOREST = 5;
  DUOTONE_LIGHT = 6;
}

enum SpecBlockType {
  DEFAULT = 0;
  PARAGRAPH = 1;
  HEADING_1 = 2;
  HEADING_2 = 3;
  HEADING_3 = 4;
  HEADING_4 = 5;
  HEADING_5 = 6;
  HEADING_6 = 7;
  CODE_BLOCK = 8;
  BLOCK_QUOTE = 9;
  HORIZONTAL_RULE = 10;
  ORDERED_LIST_ITEM = 11;
  UNORDERED_LIST_ITEM = 12;
  DOCUMENT = 13;
  TABLE = 14;
  TABLE_ROW = 15;
  TABLE_CELL = 16;
  TODO_LIST_ITEM_UNCHECKED = 17;
  TODO_LIST_ITEM_CHECKED = 18;
  IMAGE = 19;
  EMBED = 20;
}

enum InternalEnumForTest {
  OLD = 1;
}

message InternalDataForTest {
  int testFieldA = 1;
}

message StateGroupPropertyValueOrder {
  string property = 1;
  string[] values = 2;
}

enum BackfillError {
  NONE = 0;
  TRANSIENT_RETRYING = 1;
  PERMANENTLY_FAILED = 2;
  PASTE_FAILED = 3;
}

message PartialPasteAnnotation {
  bool isPartial = 1;
  uint64 annotatedAt = 2;
  BackfillError errorState = 3;
}

message VariantPropSpec {
  GUID propDefId = 1;
  string value = 2;
}

message TextListData {
  int listID = 1;
  BulletType bulletType = 2;
  int indentationLevel = 3;
  int lineNumber = 4;
}

enum BulletType {
  ORDERED = 0;
  UNORDERED = 1;
  INDENT = 2;
  NO_LIST = 3;
}

message TextLineData {
  LineType lineType = 1;
  int styleId = 10;
  int indentationLevel = 2;
  SourceDirectionality sourceDirectionality = 9;
  Directionality directionality = 3;
  DirectionalityIntent directionalityIntent = 4;
  int downgradeStyleId = 5;
  int consistencyStyleId = 6;
  int listStartOffset = 7;
  bool isFirstLineOfList = 8;
}

message DerivedTextLineData {
  Directionality directionality = 1;
}

enum LineType {
  PLAIN = 0;
  ORDERED_LIST = 1;
  UNORDERED_LIST = 2;
  BLOCKQUOTE = 3;
  HEADER = 4;
}

enum SourceDirectionality {
  AUTO = 0;
  LTR = 1;
  RTL = 2;
}

enum Directionality {
  LTR = 0;
  RTL = 1;
}

enum DirectionalityIntent {
  IMPLICIT = 0;
  EXPLICIT = 1;
}

message PrototypeInteraction {
  GUID id = 1;
  PrototypeEvent event = 2;
  PrototypeAction[] actions = 3;
  bool isDeleted = 4;
  int stateManagementVersion = 5;
}

message PrototypeEvent {
  InteractionType interactionType = 1;
  bool interactionMaintained = 2;
  float interactionDuration = 3;
  KeyTrigger keyTrigger = 4;
  string voiceEventPhrase = 5;
  float transitionTimeout = 6;
  float mediaHitTime = 7;
}

message PrototypeVariableTarget {
  VariableID id = 1;
  NodeFieldAlias nodeFieldAlias = 2;
}

message ConditionalActions {
  PrototypeAction[] actions = 1;
  VariableData condition = 2;
}

message PrototypeAction {
  GUID transitionNodeID = 1;
  TransitionType transitionType = 2;
  float transitionDuration = 3;
  EasingType easingType = 4;
  float transitionTimeout = 5;
  bool transitionShouldSmartAnimate = 6;
  ConnectionType connectionType = 7;
  Vector overlayRelativePosition = 9;
  NavigationType navigationType = 10;
  bool transitionPreserveScroll = 11;
  float[] easingFunction = 12;
  Vector extraScrollOffset = 13;
  bool transitionResetScrollPosition = 25;
  bool transitionResetInteractiveComponents = 26;
  bool transitionOverridesEnabled = 42;
  string connectionURL = 8;
  bool openUrlInNewTab = 18;
  VariableData linkParam = 34;
  CMSItemPageTarget cmsTarget = 35;
  GUID targetVariableID = 14;
  VariableAnyValue targetVariableValue = 15;
  PrototypeVariableTarget targetVariable = 19;
  VariableData targetVariableData = 20;
  MediaAction mediaAction = 16;
  bool transitionResetVideoPosition = 17;
  float mediaSkipToTime = 21;
  float mediaSkipByAmount = 22;
  float mediaPlaybackRate = 36;
  VariableData[] conditions = 23;
  ConditionalActions[] conditionalActions = 24;
  VariableSetID targetVariableSetID = 27;
  GUID targetVariableModeID = 28;
  string targetVariableSetKey = 29;
  VariableSetID variableSetTargetExtensionId = 38;
  AnimationType animationType = 30;
  GUID animationTargetId = 31;
  AnimationPhase animationPhase = 32;
  AnimationState animationState = 33;
  bool simpleLink = 37;
  AnimationTimelineAction animationTimelineAction = 39;
  GUID animationTimelineDefId = 41;
  float animationSkipToTime = 40;
}

enum AnimationPhase {
  IN = 0;
  OUT = 1;
}

enum AnimationType {
  NONE = 0;
  FADE = 1;
  SLIDE_FROM_LEFT = 2;
  SLIDE_FROM_RIGHT = 3;
  SLIDE_FROM_TOP = 4;
  SLIDE_FROM_BOTTOM = 5;
}

message AnimationState {
  float opacity = 1;
  Matrix transform = 2;
}

message PrototypeStartingPoint {
  string name = 1;
  string description = 2;
  string position = 3;
}

enum TriggerDevice {
  KEYBOARD = 0;
  UNKNOWN_CONTROLLER = 1;
  XBOX_ONE = 2;
  PS4 = 3;
  SWITCH_PRO = 4;
}

message KeyTrigger {
  int[] keyCodes = 1;
  TriggerDevice triggerDevice = 2;
}

message Hyperlink {
  string url = 1;
  GUID guid = 2;
  CMSItemPageTarget cmsTarget = 4;
  bool openInNewTab = 3;
}

message CMSItemPageTarget {
  GUID nodeId = 1;
  string cmsItemId = 2;
  string fieldSchemaId = 3;
}

enum MentionSource {
  DEFAULT = 0;
  COPY_DUPLICATE = 1;
  SILENT_INSERT = 2;
}

message Mention {
  GUID id = 1;
  string mentionedUserId = 2;
  string mentionedByUserId = 3;
  string fileKey = 4;
  MentionSource source = 5;
  uint64 mentionedUserIdInt = 6;
  uint64 mentionedByUserIdInt = 7;
  string mentionedUserGroupId = 8;
}

message EmbedData {
  string url = 1;
  string srcUrl = 2;
  string title = 3;
  string thumbnailUrl = 4;
  float width = 5;
  float height = 6;
  string embedType = 7;
  string thumbnailImageHash = 8;
  string faviconImageHash = 9;
  string provider = 10;
  string originalText = 11;
  string description = 12;
  string embedVersionId = 13;
  bool isPublishedSite = 14;
}

message StampData {
  string userId = 1;
  string votingSessionId = 2;
  string stampedByUserId = 3;
}

message LinkPreviewData {
  string url = 1;
  string title = 2;
  string provider = 3;
  string description = 4;
  string thumbnailImageHash = 5;
  string faviconImageHash = 6;
  float thumbnailImageWidth = 7;
  float thumbnailImageHeight = 8;
}

message Viewport {
  Rect canvasSpaceBounds = 1;
  bool pixelPreview = 2;
  float pixelDensity = 3;
  GUID canvasGuid = 4;
}

message Mouse {
  MouseCursor cursor = 1;
  Vector canvasSpaceLocation = 2;
  Rect canvasSpaceSelectionBox = 3;
  GUID canvasGuid = 4;
  uint cursorHiddenReason = 5;
}

struct Click {
  uint id;
  Vector point;
}

struct ScrollPosition {
  GUID node;
  Vector scrollOffset;
}

struct TriggeredOverlay {
  GUID overlayGuid;
  GUID hotspotGuid;
  GUID swapGuid;
}

message TriggeredOverlayData {
  GUID overlayGuid = 1;
  GUID hotspotGuid = 2;
  GUID swapGuid = 3;
  GUID prototypeInteractionGuid = 4;
  GUIDPath hotspotBlueprintId = 5;
}

message TriggeredSetVariableActionData {
  GUID nodeForFindingTopmostScreenId = 1;
  string targetVariableId = 2;
  string targetVariableData = 3;
  string resolvedVariableModes = 4;
}

message TriggeredSetVariableModeActionData {
  GUID nodeForFindingTopmostScreenId = 1;
  string targetVariableSetKey = 2;
  string targetVariableModeId = 3;
  VariableSetID targetVariableSetId = 4;
}

message VideoStateChangeData {
  GUID targetNodeId = 1;
  bool isPlaying = 2;
  bool isPlayingSound = 3;
  uint[] currentTimes = 4;
  uint actionTakenTimestamp = 5;
}

message EmbeddedPrototypeData {
  GUID nodeId = 1;
  uint sessionId = 2;
}

message PresentedState {
  GUID baseScreenID = 1;
  TriggeredOverlayData[] overlays = 2;
}

enum TransitionDirection {
  FORWARD = 0;
  REVERSE = 1;
}

message TopLevelPlaybackChange {
  PresentedState oldState = 1;
  PresentedState newState = 2;
  GUIDPath hotspotBlueprintID = 3;
  GUID interactionID = 4;
  bool isHotspotInNewPresentedState = 5;
  TransitionDirection direction = 6;
  GUIDPath instanceStablePath = 7;
}

message InstanceStateChange {
  GUID stateID = 1;
  GUID interactionID = 2;
  GUIDPath hotspotStablePath = 3;
  GUIDPath instanceStablePath = 4;
  PlaybackChangePhase phase = 5;
}

message TextCursor {
  Rect selectionBox = 1;
  GUID canvasGuid = 2;
  GUID textNodeGuid = 3;
}

message TextSelection {
  Rect[] selectionBoxes = 1;
  GUID canvasGuid = 2;
  GUID textNodeGuid = 3;
  Vector textSelectionRange = 4;
  GUID textNodeOrContainingIfGuid = 5;
  GUID tableCellRowId = 6;
  GUID tableCellColId = 7;
}

enum PlaybackChangePhase {
  INITIATED = 0;
  ABORTED = 1;
  COMMITTED = 2;
}

message PlaybackChangeKeyframe {
  PlaybackChangePhase phase = 1;
  float progress = 2;
  float timestamp = 3;
}

message StateMapping {
  GUIDPath stablePath = 1;
  TopLevelPlaybackChange lastTopLevelChange = 2;
  PlaybackChangeKeyframe lastTopLevelChangeStatus = 3;
  float timestamp = 4;
}

message ScrollMapping {
  GUIDPath blueprintID = 1;
  uint overlayIndex = 2;
  Vector scrollOffset = 3;
}

message PlaybackUpdate {
  TopLevelPlaybackChange lastTopLevelChange = 1;
  PlaybackChangeKeyframe lastTopLevelChangeStatus = 2;
  ScrollMapping[] scrollMappings = 3;
  float timestamp = 4;
  Vector pointerLocation = 5;
  bool isTopLevelFrameChange = 6;
  StateMapping[] stateMappings = 7;
}

message ChatMessage {
  string text = 1;
  string previousText = 2;
}

message VoiceMetadata {
  string connectedCallId = 1;
}

message AprilFunCursor {
  string id = 1;
  bool trailEnabled = 2;
}

message AprilFunFigPal {
  string customization = 1;
  string name = 2;
}

enum Heartbeat {
  FOREGROUND = 0;
  BACKGROUND = 1;
}

enum SitesViewState {
  FILE = 0;
  CODE = 1;
  DAKOTA = 2;
  SETTINGS = 3;
  INSERT = 4;
  VARIABLES = 5;
}

enum DesignFullPageViewState {
  NONE = 0;
  DESIGN_SYSTEM = 1;
  VARIABLES = 2;
}

message AgentInfo {
  string name = 1;
  string logo = 2;
  string oauthClientId = 3;
}

message UserChange {
  uint sessionID = 1;
  string stableSessionID = 44;
  bool connected = 2;
  string name = 3;
  Color color = 4;
  string imageURL = 5;
  Viewport viewport = 6;
  Mouse mouse = 7;
  GUID[] selection = 8;
  uint[] observing = 9;
  string deviceName = 10;
  Click[] recentClicks = 11;
  ScrollPosition[] scrollPositions = 12;
  TriggeredOverlay[] triggeredOverlays = 13;
  string userID = 14;
  GUID lastTriggeredHotspot = 15;
  GUID lastTriggeredPrototypeInteractionID = 16;
  uint lastTriggeredObjectAnimationIndex = 38;
  TriggeredOverlayData[] triggeredOverlaysData = 17;
  PlaybackUpdate[] playbackUpdates = 18;
  ChatMessage chatMessage = 19;
  VoiceMetadata voiceMetadata = 20;
  bool canWrite = 21;
  bool highFiveStatus = 22;
  InstanceStateChange[] instanceStateChanges = 23;
  TextCursor textCursor = 24;
  TextSelection textSelection = 25;
  uint connectedAtTimeS = 26;
  bool focusOnTextCursor = 27;
  Heartbeat heartbeat = 28;
  TriggeredSetVariableActionData[] triggeredSetVariableActionData = 29;
  VideoStateChangeData[] videoStateChangeData = 30;
  string clientID = 31;
  GUID focusedSlideId = 32;
  TriggeredSetVariableModeActionData[] triggeredSetVariableModeActionData = 33;
  AprilFunCursor aprilFunCursor = 34;
  EmbeddedPrototypeData[] embeddedPrototypeData = 35;
  GUID activeSlidesEmbeddablePrototype = 36;
  GUID[] activeEmbeddedPrototypes = 43;
  GUID activeCodeComponentId = 37;
  AprilFunFigPal aprilFunFigPal = 39;
  CollaborativeTextSelection collaborativeTextSelection = 40;
  SitesViewState sitesViewState = 41;
  NodeChatExchange[] nodeChatExchanges = 42;
  DesignFullPageViewState designFullPageViewState = 45;
  AgentInfo agentInfo = 46;
}

message InteractiveSlideElementChange {
  string userID = 1;
  string anonymousUserID = 2;
  GUID nodeID = 3;
  string responseData = 4;
}

message NodeStatusChange {
  GUID[] nodeIds = 1;
  SectionStatusInfo statusInfo = 2;
}

message BuzzApprovalAssetEntry {
  GUID assetNodeId = 1;
  bool approved = 2;
}

message BuzzApprovalChange {
  BuzzApprovalAssetEntry[] assetEntries = 1;
  GUID canvasGridNodeId = 2;
  string requestId = 3;
}

enum SceneGraphQueryBehavior {
  DEFAULT = 0;
  CONTAINING_PAGE = 1;
  PLUGIN = 2;
}

enum SceneGraphQueryMode {
  ADD = 0;
  SET = 1;
}

message SceneGraphQuery {
  GUID startingNode = 1;
  uint depth = 2;
  SceneGraphQueryBehavior behavior = 3;
}

message NodeChangesMetadata {
  uint blobsFieldOffset = 1;
}

message CursorReaction {
  string imageUrl = 1;
}

message TimerInfo {
  bool isPaused = 1;
  uint timeRemainingMs = 2;
  uint totalTimeMs = 3;
  uint timerID = 4;
  string setBy = 5;
  uint songID = 6;
  uint lastReceivedSongTimestampMs = 7;
  string songUUID = 8;
}

message MusicInfo {
  bool isPaused = 1;
  uint messageID = 2;
  string songID = 3;
  uint lastReceivedSongTimestampMs = 4;
  bool isStopped = 5;
}

message PresenterNomination {
  uint sessionID = 1;
  bool isCancelled = 2;
}

message PresenterInfo {
  uint sessionID = 1;
  PresenterNomination nomination = 2;
  bool isReconnected = 3;
}

message ClientBroadcast {
  uint sessionID = 1;
  CursorReaction cursorReaction = 2;
  TimerInfo timer = 3;
  PresenterInfo presenter = 4;
  PresenterInfo prototypePresenter = 5;
  MusicInfo music = 6;
}

enum PasteAssetType {
  UNKNOWN = 0;
  VARIABLE = 1;
}

message Message {
  MessageType type = 1;
  uint sessionID = 2;
  string stableSessionID = 42;
  uint ackID = 3;
  bool isRetransmission = 37;
  NodeChange[] nodeChanges = 4;
  UserChange[] userChanges = 5;
  InteractiveSlideElementChange interactiveSlideElementChange = 32;
  NodeStatusChange nodeStatusChange = 36;
  BuzzApprovalChange buzzApprovalChange = 44;
  Blob[] blobs = 6;
  uint blobBaseIndex = 30;
  string signalName = 7;
  Access access = 8;
  string styleSetName = 9;
  StyleSetType styleSetType = 10;
  StyleSetContentType styleSetContentType = 11;
  int pasteID = 12;
  Vector pasteOffset = 13;
  string pasteFileKey = 14;
  string signalPayload = 15;
  SceneGraphQuery[] sceneGraphQueries = 16;
  NodeChangesMetadata nodeChangesMetadata = 17;
  uint fileVersion = 18;
  bool pasteIsPartiallyOutsideEnclosingFrame = 19;
  GUID pastePageId = 20;
  bool isCut = 21;
  Message[] localUndoStack = 22;
  Message[] localRedoStack = 23;
  ClientBroadcast[] broadcasts = 24;
  uint reconnectSequenceNumber = 25;
  string pasteBranchSourceFileKey = 26;
  EditorType pasteEditorType = 27;
  string postSyncActions = 28;
  GUID[] publishedAssetGuids = 29;
  bool dirtyFromInitialLoad = 31;
  ClipboardSelectionRegion[] clipboardSelectionRegions = 33;
  EncodedOffsetsIndex encodedOffsetsIndex = 34;
  bool hasRepeatingContent = 35;
  uint64 sentTimestamp = 38;
  AnnotationCategory[] annotationCategories = 39;
  ClientRenderedMetadata clientRenderedMetadata = 40;
  PasteAssetType pasteAssetType = 41;
  ObjectAnimationList objectAnimations = 43;
  SceneGraphQueryMode sceneGraphQueryMode = 45;
}

message EncodedOffsetsIndex {
  uint nodeChangesFieldOffset = 1;
  uint nodeChangesFieldLength = 2;
  uint blobsFieldOffset = 3;
  GUIDAndEncodedOffset[] nodeChangeOffsets = 4;
}

struct GUIDAndEncodedOffset {
  GUID guid;
  uint offset;
}

message DiffChunk {
  uint[] nodeChanges = 1;
  NodePhase phase = 2;
  NodeChange displayNode = 3;
  GUID canvasId = 4;
  string canvasName = 5;
  bool canvasIsInternal = 6;
  uint[] chunksAffectingThisChunk = 7;
  NodeChange[] basisParentHierarchy = 8;
  NodeChange[] parentHierarchy = 9;
  GUID[] basisParentHierarchyGuids = 10;
  GUID[] parentHierarchyGuids = 11;
}

enum DiffType {
  BRANCHING = 0;
  NODE_CHANGES_ONLY = 1;
}

message DiffPayload {
  NodeChange[] nodeChanges = 1;
  Blob[] blobs = 2;
  DiffChunk[] diffChunks = 3;
  NodeChange[] diffBasis = 4;
  NodeChange[] basisParentNodeChanges = 5;
  NodeChange[] parentNodeChanges = 6;
  DiffType diffType = 7;
}

enum RichMediaType {
  ANIMATED_IMAGE = 0;
  VIDEO = 1;
}

message RichMediaData {
  string mediaHash = 1;
  RichMediaType richMediaType = 2;
}

enum VariableDataType {
  BOOLEAN = 0;
  FLOAT = 1;
  STRING = 2;
  ALIAS = 3;
  COLOR = 4;
  EXPRESSION = 5;
  MAP = 6;
  SYMBOL_ID = 7;
  FONT_STYLE = 8;
  TEXT_DATA = 9;
  INVALID = 10;
  NODE_FIELD_ALIAS = 11;
  CMS_ALIAS = 12;
  PROP_REF = 13;
  IMAGE = 14;
  MANAGED_STRING_ALIAS = 15;
  LINK = 16;
  JS_RUNTIME_ALIAS = 17;
  SLOT_CONTENT_ID = 18;
  DATE = 19;
  KEYFRAME_TRACK_ID = 20;
  KEYFRAME_TRACK_PARAMETER_DATA = 21;
  EASING = 22;
  TIMING = 23;
  VECTOR = 24;
  COLOR_ARRAY = 25;
  LINE = 26;
  CIRCLE = 27;
  ROTATION_3D = 28;
  CIRCLE_POINT = 29;
  GRADIENT = 30;
  COLOR_POINT = 31;
}

enum VariableResolvedDataType {
  BOOLEAN = 0;
  FLOAT = 1;
  STRING = 2;
  COLOR = 4;
  MAP = 5;
  SYMBOL_ID = 6;
  FONT_STYLE = 7;
  TEXT_DATA = 8;
  IMAGE = 9;
  LINK = 10;
  JS_RUNTIME_ALIAS = 11;
  SLOT_CONTENT_ID = 12;
  KEYFRAME_TRACK_ID = 13;
  KEYFRAME_TRACK_PARAMETER_DATA = 14;
  EASING = 15;
  TIMING = 16;
  VECTOR = 17;
  COLOR_ARRAY = 18;
  LINE = 19;
  CIRCLE = 20;
  ROTATION_3D = 21;
  CIRCLE_POINT = 22;
  GRADIENT = 23;
  COLOR_POINT = 24;
}

message VariableAnyValue {
  bool boolValue = 1;
  string textValue = 2;
  float floatValue = 3;
  VariableID alias = 4;
  Color colorValue = 5;
  Expression expressionValue = 6;
  VariableMap mapValue = 7;
  SymbolId symbolIdValue = 8;
  VariableFontStyle fontStyleValue = 9;
  TextData textDataValue = 10;
  NodeFieldAlias nodeFieldAliasValue = 11;
  CMSAlias cmsAliasValue = 12;
  PropRefValue propRefValue = 13;
  ImageParameterValue imageValue = 14;
  ManagedStringAlias managedStringAliasValue = 15;
  Hyperlink linkValue = 16;
  JsRuntimeAlias jsRuntimeAliasValue = 17;
  SlotContentId slotContentIdValue = 18;
  KeyframeTrackId keyframeTrackIdValue = 19;
  KeyframeTrackParameterValue keyframeTrackParameterValue = 20;
  EasingData easingValue = 21;
  Vector vectorValue = 22;
  ColorArray colorArrayValue = 23;
  Line lineValue = 24;
  Circle circleValue = 25;
  Rotation3D rotation3DValue = 26;
  CirclePoint circlePointValue = 27;
  Gradient gradientValue = 28;
  ColorPoint colorPointValue = 29;
}

enum ExpressionFunction {
  ADDITION = 0;
  SUBTRACTION = 1;
  RESOLVE_VARIANT = 2;
  MULTIPLY = 3;
  DIVIDE = 4;
  EQUALS = 5;
  NOT_EQUAL = 6;
  LESS_THAN = 7;
  LESS_THAN_OR_EQUAL = 8;
  GREATER_THAN = 9;
  GREATER_THAN_OR_EQUAL = 10;
  AND = 11;
  OR = 12;
  NOT = 13;
  STRINGIFY = 14;
  TERNARY = 15;
  VAR_MODE_LOOKUP = 16;
  NEGATE = 17;
  IS_TRUTHY = 18;
  KEYFRAME = 19;
}

message Expression {
  ExpressionFunction expressionFunction = 1;
  VariableData[] expressionArguments = 2;
}

message VariableMapValue {
  string key = 1;
  VariableData value = 2;
  GUID guidKey = 3;
}

message VariableMap {
  VariableMapValue[] values = 1;
}

message ColorArray {
  VariableData[] colors = 1;
}

message VariableFontStyle {
  VariableData asString = 1;
  VariableData asFloat = 2;
  VariableData asVariations = 3;
}

message ImageParameterValue {
  Image image = 1;
  Image imageThumbnail = 2;
  Image animatedImage = 6;
  string altText = 3;
  uint originalImageHeight = 4;
  uint originalImageWidth = 5;
  uint animationFrame = 7;
}

message ThumbnailInfo {
  GUID nodeID = 1;
  string thumbnailVersion = 2;
}

message AiCanvasPrompt {
  string userPrompt = 1;
  string authorId = 2;
  GUID[] parentNodeIds = 3;
}

message NodeFieldAlias {
  GUIDPath stablePathToNode = 1;
  NodeFieldAliasType nodeField = 2;
  string indexOrKey = 3;
}

enum NodeFieldAliasType {
  MISSING = 0;
  COMPONENT_PROP_ASSIGNMENTS = 1;
}

message CMSAlias {
  string collectionId = 1;
  string itemId = 2;
  string fieldId = 3;
  VariableDataType type = 4;
}

message JsRuntimeAlias {
  string lookupKey = 1;
}

message PropRefValue {
  GUID defId = 1;
}

message ManagedStringId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message ManagedStringPlaceholderMapEntry {
  string key = 1;
  string value = 2;
}

message SlotContentId {
  GUID guid = 1;
}

message ManagedStringAlias {
  ManagedStringId managedStringId = 1;
  ManagedStringPlaceholderMapEntry[] placeholderValues = 2;
}

message KeyframeTrackId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message AnimationPresetId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message ToolId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message CustomEffectId {
  GUID guid = 1;
  AssetRef assetRef = 2;
}

message TRSSTransform2D {
  Vector translation = 1;
  float rotation = 2;
  Vector scale = 3;
  float shearX = 4;
}

message VariableData {
  VariableAnyValue value = 1;
  VariableDataType dataType = 2;
  VariableResolvedDataType resolvedDataType = 3;
}

message VariableSetMode {
  GUID id = 1;
  string name = 2;
  string sortPosition = 3;
  VariableSetID parentVariableSetId = 4;
  GUID parentModeId = 5;
}

message VariableDataValues {
  VariableDataValuesEntry[] entries = 1;
}

message VariableDataValuesEntry {
  GUID modeID = 1;
  VariableData variableData = 2;
}

enum VariableScope {
  ALL_SCOPES = 0;
  TEXT_CONTENT = 1;
  CORNER_RADIUS = 2;
  WIDTH_HEIGHT = 3;
  GAP = 4;
  ALL_FILLS = 5;
  FRAME_FILL = 6;
  SHAPE_FILL = 7;
  TEXT_FILL = 8;
  STROKE = 9;
  STROKE_FLOAT = 10;
  EFFECT_FLOAT = 11;
  EFFECT_COLOR = 12;
  OPACITY = 13;
  FONT_STYLE = 14;
  FONT_FAMILY = 15;
  FONT_SIZE = 16;
  LINE_HEIGHT = 17;
  LETTER_SPACING = 18;
  PARAGRAPH_SPACING = 19;
  PARAGRAPH_INDENT = 20;
  FONT_VARIATIONS = 21;
  TRANSFORM = 22;
}

message KeyframeAnyValue {
  float floatValue = 1;
  Color colorValue = 2;
  TextData textDataValue = 3;
  Vector vectorValue = 4;
}

enum KeyframeValueType {
  FLOAT = 0;
  INVALID = 1;
  COLOR = 2;
  TEXT_DATA = 3;
  VECTOR = 4;
}

message KeyframeValueData {
  KeyframeAnyValue value = 1;
  KeyframeValueType valueType = 2;
}

enum KeyframeTrackParameterType {
  INVALID = 0;
  MANUAL = 1;
  ANIMATION_PRESET = 2;
}

message ManualKeyframeTrackParameter {
  KeyframeTrackId keyframeTrackId = 1;
  GUID timelineDefId = 2;
}

message AnimationPresetKeyframeTrackParameter {
  AnimationPresetId animationPresetId = 1;
  KeyframeTrackId keyframeTrackId = 2;
  GUID timelineDefId = 3;
}

message KeyframeTrackAnyParameter {
  ManualKeyframeTrackParameter manual = 1;
  AnimationPresetKeyframeTrackParameter animationPreset = 2;
  GUID animationStyleBindingId = 3;
}

message KeyframeTrackParameter {
  KeyframeTrackAnyParameter value = 1;
  KeyframeTrackParameterType type = 2;
}

message KeyframeTrackParameterValue {
  KeyframeTrackParameter[] parameters = 1;
}

message AnimationPresets {
  AnimationPresetData[] presets = 1;
}

message AnimationPresetData {
  AnimationPresetId animationPresetId = 1;
  GUID timelineDefId = 2;
}

message StyleAnimation {
  AnimationPresetId animationPresetId = 1;
}

message StyleIdForAnimation {
  GUID id = 1;
  GUID timelineDefId = 2;
  StyleId animationStyleId = 3;
  int64 timelineOffset = 4;
}

message Tools {
  ToolData[] tools = 1;
}

message ToolData {
  ToolId toolId = 1;
  CodeComponentId backingCodeComponentId = 2;
  ComponentPropAssignment[] componentPropAssignments = 3;
}

message CustomEffects {
  CustomEffectData[] customEffects = 1;
}

message CustomEffectData {
  CustomEffectId customEffectId = 1;
}

message SpringParams {
  float stiffness = 1;
  float damping = 2;
  float mass = 3;
}

message TransitionEasingAnyValue {
  SpringParams springEasing = 1;
  BezierHandles bezierEasing = 2;
}

message EasingData {
  EasingType easingType = 1;
  TransitionEasingAnyValue easingValue = 2;
}

message TransitionOverride {
  GUID id = 1;
  float duration = 2;
  VariableData durationVar = 3;
  float delay = 4;
  VariableData delayVar = 5;
  EasingData easing = 6;
  VariableData easingVar = 7;
  uint64 createdAtMs = 8;
  GUID[] interactionIDs = 9;
  bool disabled = 10;
}

message TransitionOverrideData {
  TransitionOverride[] all = 1;
  TransitionOverridePropMap propertyOverrides = 2;
}

enum TransitionOverrideProp {
  ALL = 0;
  OPACITY = 1;
  TRANSLATION = 2;
  ROTATION = 3;
  SCALE = 4;
}

enum TransitionOverrideBindingTopLevelField {
  MISSING = 0;
  PARAMETER_CONSUMPTION_MAP = 1;
  EFFECT_DATA = 2;
  FILL_PAINT_DATA = 3;
  STROKE_PAINT_DATA = 4;
}

message TransitionOverrideBindingLocation {
  TransitionOverrideBindingTopLevelField topLevelField = 1;
  int parameterFieldValue = 2;
  int index = 3;
  int effectParametrizedFieldValue = 4;
}

enum KeyframeBindingEffectParametrizedField {
  MISSING = 0;
  OFFSET_X = 1;
  OFFSET_Y = 2;
  RADIUS = 3;
  SPREAD = 4;
  COLOR = 5;
  REFRACTION_RADIUS = 6;
  SPECULAR_ANGLE = 7;
  SPECULAR_INTENSITY = 8;
  CHROMATIC_ABERRATION = 9;
  SPLAY = 10;
  REFRACTION_INTENSITY = 11;
  START_RADIUS = 12;
  START_OFFSET_X = 13;
  START_OFFSET_Y = 14;
  END_OFFSET_X = 15;
  END_OFFSET_Y = 16;
  NOISE_SIZE_X = 17;
  NOISE_SIZE_Y = 18;
  DENSITY = 19;
  EFFECT_OPACITY = 20;
  SECONDARY_COLOR = 21;
}

message NodeContentsKeyframeBindingLocation {
  TransitionOverrideBindingTopLevelField topLevelField = 1;
  VariableField parameterFieldValue = 2;
  int index = 3;
  KeyframeBindingEffectParametrizedField effectParametrizedFieldValue = 4;
}

message TransitionOverridePropMap {
  TransitionOverridePropMapEntry[] entries = 1;
}

message TransitionOverridePropMapEntry {
  TransitionOverrideProp prop = 1;
  TransitionOverride[] overrides = 2;
  TransitionOverrideBindingLocation bindingLocation = 3;
  NodeContentsKeyframeBindingLocation nodeContentsBindingLocation = 4;
}

enum CodeSyntaxPlatform {
  WEB = 0;
  ANDROID = 1;
  iOS = 2;
}

message OptionalVector {
  Vector value = 1;
}

enum HTMLTag {
  AUTO = 0;
  ARTICLE = 1;
  SECTION = 2;
  NAV = 3;
  ASIDE = 4;
  H1 = 5;
  H2 = 6;
  H3 = 7;
  H4 = 8;
  H5 = 9;
  H6 = 10;
  HGROUP = 11;
  HEADER = 12;
  FOOTER = 13;
  ADDRESS = 14;
  P = 15;
  HR = 16;
  PRE = 17;
  BLOCKQUOTE = 18;
  OL = 19;
  UL = 20;
  MENU = 21;
  LI = 22;
  DL = 23;
  DT = 24;
  DD = 25;
  FIGURE = 26;
  FIGCAPTION = 27;
  MAIN = 28;
  DIV = 29;
  A = 30;
  EM = 31;
  STRONG = 32;
  SMALL = 33;
  S = 34;
  CITE = 35;
  Q = 36;
  DFN = 37;
  ABBR = 38;
  RUBY = 39;
  RT = 40;
  RP = 41;
  DATA = 42;
  TIME = 43;
  CODE = 44;
  VAR = 45;
  SAMP = 46;
  KBD = 47;
  SUB = 48;
  SUP = 49;
  I = 50;
  B = 51;
  U = 52;
  MARK = 53;
  BDI = 54;
  BDO = 55;
  SPAN = 56;
  BR = 57;
  WBR = 58;
  PICTURE = 59;
  SOURCE = 60;
  IMG = 61;
  FORM = 62;
  LABEL = 63;
  INPUT = 64;
  BUTTON = 65;
  SELECT = 66;
  DATALIST = 67;
  OPTGROUP = 68;
  OPTION = 69;
  TEXTAREA = 70;
  OUTPUT = 71;
  PROGRESS = 72;
  METER = 73;
  FIELDSET = 74;
  LEGEND = 75;
  VIDEO = 76;
}

enum ARIARole {
  AUTO = 0;
  NONE = 52;
  APPLICATION = 30;
  BANNER = 67;
  COMPLEMENTARY = 68;
  CONTENTINFO = 69;
  FORM = 70;
  MAIN = 71;
  NAVIGATION = 72;
  REGION = 73;
  SEARCH = 74;
  SEPARATOR = 13;
  ARTICLE = 31;
  COLUMNHEADER = 35;
  DEFINITION = 36;
  DIRECTORY = 38;
  DOCUMENT = 39;
  GROUP = 44;
  HEADING = 45;
  IMG = 46;
  LIST = 48;
  LISTITEM = 49;
  MATH = 50;
  NOTE = 53;
  PRESENTATION = 55;
  ROW = 56;
  ROWGROUP = 57;
  ROWHEADER = 58;
  TABLE = 62;
  TOOLBAR = 65;
  BUTTON = 1;
  CHECKBOX = 2;
  GRIDCELL = 3;
  LINK = 4;
  MENUITEM = 5;
  MENUITEMCHECKBOX = 6;
  MENUITEMRADIO = 7;
  OPTION = 8;
  PROGRESSBAR = 9;
  RADIO = 10;
  SCROLLBAR = 11;
  SLIDER = 14;
  SPINBUTTON = 15;
  TAB = 17;
  TABPANEL = 18;
  TEXTBOX = 19;
  TREEITEM = 20;
  COMBOBOX = 21;
  GRID = 22;
  LISTBOX = 23;
  MENU = 24;
  MENUBAR = 25;
  RADIOGROUP = 26;
  TABLIST = 27;
  TREE = 28;
  TREEGRID = 29;
  TOOLTIP = 66;
  ALERT = 75;
  LOG = 76;
  MARQUEE = 77;
  STATUS = 78;
  TIMER = 79;
  ALERTDIALOG = 80;
  DIALOG = 81;
  SEARCHBOX = 12;
  SWITCH = 16;
  BLOCKQUOTE = 32;
  CAPTION = 33;
  CELL = 34;
  DELETION = 37;
  EMPHASIS = 40;
  FEED = 41;
  FIGURE = 42;
  GENERIC = 43;
  INSERTION = 47;
  METER = 51;
  PARAGRAPH = 54;
  STRONG = 59;
  SUBSCRIPT = 60;
  SUPERSCRIPT = 61;
  TERM = 63;
  TIME = 64;
  IMAGE = 82;
  HEADING_1 = 83;
  HEADING_2 = 84;
  HEADING_3 = 85;
  HEADING_4 = 86;
  HEADING_5 = 87;
  HEADING_6 = 88;
  HEADER = 89;
  FOOTER = 90;
  SIDEBAR = 91;
  SECTION = 92;
  MAINCONTENT = 93;
  TABLE_CELL = 94;
  WIDGET = 95;
}

message MigrationStatus {
  bool dsdCleanup = 1;
}

message NodeFieldMap {
  NodeFieldMapEntry[] entries = 1;
}

message NodeFieldMapEntry {
  GUID guid = 1;
  uint field = 2;
  uint lastModifiedSequenceNumber = 3;
}

enum ColorProfile {
  SRGB = 0;
  DISPLAY_P3 = 1;
}

enum DocumentColorProfile {
  LEGACY = 0;
  SRGB = 1;
  DISPLAY_P3 = 2;
}

enum ChildReadingDirection {
  NONE = 0;
  LEFT_TO_RIGHT = 1;
  RIGHT_TO_LEFT = 2;
}

message ARIAAttributeAnyValue {
  bool boolValue = 1;
  string stringValue = 2;
  float floatValue = 3;
  int intValue = 4;
  string[] stringArrayValue = 5;
}

enum ARIAAttributeDataType {
  BOOLEAN = 0;
  STRING = 1;
  FLOAT = 2;
  INT = 3;
  STRING_LIST = 4;
}

message ARIAAttributeData {
  ARIAAttributeDataType type = 1;
  ARIAAttributeAnyValue value = 2;
}

message ARIAAttributesMap {
  ARIAAttributesMapEntry[] entries = 1;
}

message ARIAAttributesMapEntry {
  string attribute = 1;
  ARIAAttributeData value = 2;
}

message HandoffStatusMapEntry {
  GUID guid = 1;
  SectionStatusInfo handoffStatus = 2;
}

message HandoffStatusMap {
  HandoffStatusMapEntry[] entries = 1;
}

message EditScopeInfo {
  EditScopeStack[] editScopeStacks = 1;
  EditScopeSnapshot[] snapshots = 2;
}

message EditScopeSnapshot {
  EditScopeStack[] frames = 1;
  uint[] nodeChangeFieldNumbers = 2;
}

message EditScopeStack {
  EditScope[] stack = 1;
}

message EditScope {
  EditScopeType type = 1;
  string label = 2;
  EditorType editorType = 3;
}

enum EditScopeType {
  INVALID = 0;
  TEST_SETUP = 1;
  USER = 2;
  PLUGIN = 3;
  SYSTEM = 4;
  REST_API = 5;
  ONBOARDING = 6;
  AUTOSAVE = 7;
  AI = 8;
}

enum SectionPresetState {
  INSERTED = 0;
  USER_EDITED = 1;
}

enum EmojiImageSet {
  APPLE = 0;
  NOTO = 1;
}

enum SelectionRegionFocusType {
  NONE = 0;
  PRIMARY = 1;
  SECONDARY = 2;
}

message SectionPresetInfo {
  uint64 shelfId = 1;
  uint64 templateId = 2;
  string templateName = 3;
  SectionPresetState state = 4;
}

message ClipboardSelectionRegion {
  GUID parent = 1;
  GUID[] nodes = 2;
  Vector enclosingFrameOffset = 3;
  bool pasteIsPartiallyOutsideEnclosingFrame = 4;
  SelectionRegionFocusType focusType = 5;
}

enum FirstDraftKitType {
  LOCAL = 0;
  LIBRARY = 1;
  NONE = 2;
}

message FirstDraftKit {
  string key = 1;
  FirstDraftKitType type = 2;
}

message FirstDraftData {
  string generationId = 1;
  FirstDraftKit kit = 2;
}

enum FirstDraftKitElementType {
  NONE = 0;
  BUILDING_BLOCK = 1;
  GROUPED_COMPONENT = 2;
}

message FirstDraftKitElementData {
  FirstDraftKitElementType type = 1;
}

enum PlatformShapeProperty {
  FILL = 0;
  STROKE = 1;
  TEXT = 2;
  STROKE_COLOR = 3;
}

enum PlatformShapeBehaviorType {
  SHAPE = 0;
  CONTAINER = 1;
  ADVANCED_CONTAINER = 2;
}

message PlatformShapePropertyMapEntry {
  PlatformShapeProperty property = 1;
  GUIDPath[] nodePaths = 2;
}

message PlatformShapeDefinition {
  PlatformShapePropertyMapEntry[] propertyMapEntries = 1;
  PlatformShapeBehaviorType behaviorType = 2;
  GUIDPath thumbnailNode = 3;
}

message NodeBehaviors {
  LinkBehavior link = 1;
  AppearBehavior appear = 2;
  HoverBehavior hover = 3;
  PressBehavior press = 4;
  FocusBehavior focus = 5;
  ScrollParallaxBehavior scrollParallax = 6;
  ScrollTransformBehavior scrollTransform = 7;
  CursorBehavior cursor = 8;
  MarqueeBehavior marquee = 9;
  CodeBehavior[] code = 10;
}

message BehaviorTransition {
  EasingType easingType = 1;
  float[] easingFunction = 2;
  float transitionDuration = 3;
  float delay = 4;
  VariableData transitionDurationVar = 5;
  VariableData delayVar = 6;
}

enum AppearBehaviorTrigger {
  PAGE_LOAD = 1;
  THIS_LAYER_IN_VIEW = 2;
  OTHER_LAYER_IN_VIEW = 3;
  SCROLL_DIRECTION = 4;
}

enum RelativeDirection {
  UP = 1;
  DOWN = 2;
  LEFT = 3;
  RIGHT = 4;
}

message AppearBehavior {
  AppearBehaviorTrigger trigger = 1;
  RelativeDirection direction = 2;
  GUID otherLayer = 3;
  BehaviorTransition enterTransition = 4;
  NodeChange enterState = 5;
  BehaviorTransition exitTransition = 6;
  NodeChange exitState = 7;
  bool playsOnce = 8;
  VariableData playsOnceVar = 9;
  bool isDeleted = 10;
}

message HoverBehavior {
  BehaviorTransition transition = 1;
  NodeChange state = 2;
  bool isDeleted = 3;
}

message PressBehavior {
  BehaviorTransition transition = 1;
  NodeChange state = 2;
  bool isDeleted = 3;
}

message FocusBehavior {
  BehaviorTransition transition = 1;
  NodeChange state = 2;
  bool isDeleted = 3;
}

message ScrollParallaxBehavior {
  ScrollDirection axis = 1;
  float speed = 2;
  bool relativeToPage = 3;
  VariableData speedVar = 4;
  bool isDeleted = 5;
}

enum ScrollTransformBehaviorTrigger {
  PAGE_HEIGHT = 1;
  THIS_LAYER_IN_VIEW = 2;
  OTHER_LAYER_IN_VIEW = 3;
}

message ScrollTransformBehavior {
  ScrollTransformBehaviorTrigger trigger = 1;
  GUID otherLayer = 2;
  BehaviorTransition transition = 3;
  NodeChange fromState = 4;
  NodeChange toState = 5;
  bool playsOnce = 6;
  bool playsOnceVar = 7;
  VariableData playsOnceVar2 = 8;
  bool isDeleted = 9;
}

message CursorBehavior {
  float hotspotX = 1;
  float hotspotY = 2;
  GUID cursorGuid = 3;
  bool isDeleted = 4;
}

message MarqueeBehavior {
  RelativeDirection direction = 1;
  float speed = 2;
  bool shouldLoopInfinitely = 3;
  VariableData speedVar = 4;
  VariableData shouldLoopInfinitelyVar = 5;
  VariableData pauseOnHover = 6;
  bool isDeleted = 7;
}

message CodeBehavior {
  CodeComponentId codeComponentId = 1;
  ComponentPropAssignment[] componentPropAssignments = 2;
  bool isDeleted = 3;
}

message ClientRenderedMetadata {
  string loadID = 1;
  string trackingSessionId = 2;
  uint trackingSessionSequenceId = 3;
  string reconnectID = 4;
}

enum LinkBehaviorType {
  URL = 1;
  PAGE = 2;
}

message LinkBehavior {
  LinkBehaviorType type = 1;
  string url = 2;
  GUID page = 3;
  bool openInNewWindow = 4;
}

message VariableIdOrVariableOverrideId {
  VariableID variableId = 1;
  VariableOverrideId variableOverrideId = 2;
}

struct IndexFontVariationAxis {
  string tag;
  string name;
  float min;
  float max;
  float defaultValue;
}

struct IndexFontVariationAxisValue {
  string tag;
  float value;
}

message IndexFontStyle {
  string name = 1;
  string postscript = 2;
  float weight = 3;
  bool italic = 4;
  float stretch = 5;
  IndexFontVariationAxisValue[] variationAxisValues = 6;
}

message IndexFontFile {
  string filename = 1;
  uint version = 2;
  string family = 3;
  IndexFontStyle[] styles = 4;
  IndexFontVariationAxis[] variationAxes = 5;
  bool useFontOpticalSize = 6;
}

struct IndexFamilyRename {
  string oldFamily;
  string newFamily;
}

struct IndexStyleRename {
  string oldStyle;
  string newStyle;
}

struct IndexFamilyStylesRename {
  string familyName;
  IndexStyleRename[] styleRenames;
}

struct IndexRenames {
  IndexFamilyRename[] family;
  IndexFamilyStylesRename[] style;
}

struct IndexEmojiSequence {
  uint[] codepoints;
}

struct IndexEmojis {
  uint revision;
  uint[] sizes;
  IndexEmojiSequence[] sequences;
}

message FontIndex {
  uint schemaVersion = 1;
  IndexFontFile[] files = 2;
  IndexRenames renames = 3;
  IndexEmojis emojis = 4;
}

message SlideThemeData {
  ThemeID themeID = 1;
  string version = 2;
}

enum SlideNumber {
  NONE = 0;
  SLIDE = 1;
  SECTION = 2;
  SUBSECTION = 3;
  TOTAL_WITHIN_DECK = 4;
  TOTAL_WITHIN_SECTION = 5;
}

enum NodeChatMessageType {
  USER_MESSAGE = 0;
  ASSISTANT_MESSAGE = 1;
  TOOL_MESSAGE = 2;
  SYSTEM_MESSAGE = 3;
}

message NodeChatMessage {
  GUID id = 1;
  NodeChatMessageType type = 2;
  string userId = 3;
  string textContent = 4;
  uint sentAt = 5;
  NodeChatToolCall[] toolCalls = 6;
  NodeChatToolResult[] toolResults = 7;
  uint64 sentAt64 = 8;
}

message NodeChatToolCall {
  string toolCallId = 1;
  string toolName = 2;
  string argsJson = 3;
}

message NodeChatToolResult {
  string toolCallId = 1;
  string toolName = 2;
  string resultJson = 3;
}

message NodeChatExchange {
  GUID node = 1;
  NodeChatMessage[] messages = 2;
  bool isTyping = 3;
  FileUpdate[] fileUpdates = 4;
}

message NodeChatCompressionState {
  uint startIndex = 1;
  string summary = 2;
}

message FileUpdate {
  string name = 1;
  string contents = 2;
  bool isDeleted = 3;
}

message AIChatContentPart {
  AIChatContentPartType type = 1;
  AIChatContentPartAnyValue value = 2;
}

enum AIChatContentPartType {
  INVALID = 0;
  TEXT = 1;
  SELECTED_NODE_IDS = 2;
}

message AIChatContentPartAnyValue {
  string textValue = 1;
  string[] selectedNodeIds = 2;
}

enum AIChatMessageRole {
  USER = 0;
  ASSISTANT = 1;
  TOOL = 2;
  SYSTEM = 3;
}

message AIChatMessage {
  uint createdAtMs = 1;
  AIChatMessageRole role = 2;
  AIChatContentPart[] content = 3;
  string clientId = 4;
  uint64 createdAtMs64 = 5;
}

message AIChatThread {
  AIChatMessage[] messages = 1;
}

enum CooperTemplateType {
  CUSTOM = 0;
  TWITTER_POST = 1;
  LINKEDIN_POST = 2;
  INSTA_POST_SQUARE = 3;
  INSTA_POST_PORTRAIT = 4;
  INSTA_STORY = 5;
  INSTA_AD = 6;
  FACEBOOK_POST = 7;
  FACEBOOK_COVER_PHOTO = 8;
  FACEBOOK_EVENT_COVER = 9;
  FACEBOOK_AD_PORTRAIT = 10;
  FACEBOOK_AD_SQUARE = 11;
  PINTEREST_AD_PIN = 12;
  TWITTER_BANNER = 13;
  LINKEDIN_POST_SQUARE = 15;
  LINKEDIN_POST_PORTRAIT = 16;
  LINKEDIN_POST_LANDSCAPE = 17;
  LINKEDIN_PROFILE_BANNER = 18;
  LINKEDIN_ARTICLE_BANNER = 19;
  LINKEDIN_AD_LANDSCAPE = 20;
  LINKEDIN_AD_SQUARE = 21;
  LINKEDIN_AD_VERTICAL = 22;
  YOUTUBE_THUMBNAIL = 23;
  YOUTUBE_BANNER = 24;
  YOUTUBE_AD = 25;
  TWITCH_BANNER = 26;
  GOOGLE_LEADERBOARD_AD = 27;
  GOOGLE_LARGE_AD = 28;
  GOOGLE_MED_AD = 29;
  GOOGLE_MOBILE_BANNER_AD = 30;
  GOOGLE_SKYSCRAPER_AD = 31;
  CARD_HORIZONTAL = 32;
  CARD_VERTICAL = 33;
  PRINT_US_LETTER = 34;
  POSTER = 35;
  BANNER_STANDARD = 36;
  BANNER_WIDE = 37;
  BANNER_ULTRAWIDE = 38;
  NAME_TAG_PORTRAIT = 39;
  NAME_TAG_LANDSCAPE = 40;
  INSTA_REEL_COVER = 41;
  ZOOM_BACKGROUND = 42;
  TIKTOK_POST = 43;
  INSTA_AD_PORTRAIT = 44;
  INSTA_POST_TALL_PORTRAIT = 45;
  TWITTER_POST_SQUARE = 46;
  FACEBOOK_POST_SQUARE = 47;
  FACEBOOK_POST_PORTRAIT = 48;
  FACEBOOK_STORY = 49;
  GOOGLE_SQUARE_AD = 50;
  GOOGLE_SMALL_SQUARE_AD = 51;
  GOOGLE_NARROW_SKYSCRAPER_AD = 52;
  GOOGLE_HALF_PAGE_AD = 53;
  GOOGLE_LARGE_LEADERBOARD_AD = 54;
  GOOGLE_BILLBOARD_AD = 55;
  GOOGLE_BANNER_LEADERBOARD_AD = 56;
  GOOGLE_TOP_BANNER_AD = 57;
  GOOGLE_MOBILE_LEADERBOARD_BANNER_AD = 58;
  GOOGLE_LARGE_MOBILE_BANNER_AD = 59;
  GOOGLE_MOBILE_INTERSTITIAL_AD = 60;
  GOOGLE_MOBILE_MED_RECTANGLE_AD = 61;
  PINTEREST_PIN_STANDARD = 62;
  PINTEREST_PIN_SQUARE = 63;
  PINTEREST_AD_SQUARE = 64;
  PRINT_A4 = 65;
}

message CooperTemplateData {
  CooperTemplateType type = 1;
}

message ImageImportMap {
  ImageImport[] imports = 1;
}

message ImageImport {
  string name = 1;
  Image image = 2;
}

enum InterpolationType {
  HOLD = 0;
  BEZIER = 1;
  SPRING = 2;
}

message BezierHandles {
  float p1x = 1;
  float p1y = 2;
  float p2x = 3;
  float p2y = 4;
}

enum KeyframeOperation {
  SET = 0;
  SCALE = 1;
  OFFSET = 2;
}

enum TimelinePositionType {
  ABSOLUTE = 0;
  RELATIVE = 1;
}

enum PlaybackStyle {
  ONCE = 0;
  LOOP = 1;
  BOOMERANG = 2;
}
`);Hf(wi);var sv=new Uint8Array([40,181,47,253]);function $s(e){return e.length>=4&&e[0]===40&&e[1]===181&&e[2]===47&&e[3]===253}function av(e){return new Map(e.fields.map(n=>[n.value,n]))}function qs(e,n){let t=e.fields.get(n.name);return t||(t=av(n),e.fields.set(n.name,t)),t}function Wf(e,n,t){switch(n.type){case"bool":case"byte":e.readByte();return;case"int":e.readVarInt();return;case"uint":e.readVarUint();return;case"float":e.readVarFloat();return;case"string":e.skipString();return;case"int64":e.readVarInt64();return;case"uint64":e.readVarUint64();return}let r=n.type?t.definitions.get(n.type):void 0;if(!r)throw new Error(`Invalid Kiwi field type: ${String(n.type)}`);if(r.kind==="ENUM"){e.readVarUint();return}lv(e,r,t)}function ki(e,n,t){if(!n.isArray){Wf(e,n,t);return}if(n.type==="byte"){e.skipByteArray();return}let r=e.readVarUint();for(;r-- >0;)Wf(e,n,t)}function lv(e,n,t){if(n.kind==="STRUCT"){for(let i of n.fields)ki(e,i,t);return}let r=qs(t,n);for(;;){let i=e.readVarUint();if(i===0)return;let o=r.get(i);if(!o)throw new Error(`Invalid field ${i} in Kiwi ${n.name}`);ki(e,o,t)}}function Xf(e,n,t){let r=e.readVarUint(),i=n.type?t.definitions.get(n.type):void 0;return i?.kind==="ENUM"?i.fields.find(o=>o.value===r)?.name??null:null}function uv(e,n,t){let r=qs(t,n),i=null,o=null,s=null,a=null,l=null,u=null,c=null,f=null,d=!1;for(;;){let m=e.readVarUint();if(m===0)break;let h=r.get(m);if(!h)throw new Error(`Invalid field ${m} in Kiwi NodeChange`);switch(h.name){case"guid":i=e.readVarUint(),o=e.readVarUint();break;case"parentIndex":s=e.readVarUint(),a=e.readVarUint(),l=e.offset,e.skipString();break;case"phase":u=Xf(e,h,t);break;case"type":c=Xf(e,h,t);break;case"name":c==="DOCUMENT"||c==="CANVAS"?f=e.readString():e.skipString();break;case"internalOnly":d=!!e.readByte();break;default:ki(e,h,t)}}if(c!=="DOCUMENT"&&c!=="CANVAS"||i===null||o===null)return null;let p=null;if(l!==null){let m=e.offset;e.offset=l,p=e.readString(),e.offset=m}let g=s===null||a===null?null:`${s}:${a}`;return{sourceId:`${i}:${o}`,parentId:g,position:p,phase:u,type:c,name:f??"Page",internalOnly:d}}function jf(e,n){let t=new Map(e.definitions.map(c=>[c.name,c])),r={definitions:t,fields:new Map},i=t.get("Message"),o=t.get("NodeChange");if(i?.kind!=="MESSAGE"||o?.kind!=="MESSAGE")return[];let s=new Ce(n),a=qs(r,i),l=[];for(;;){let c=s.readVarUint();if(c===0)break;let f=a.get(c);if(!f)throw new Error(`Invalid field ${c} in Kiwi Message`);if(f.name!=="nodeChanges"||!f.isArray){ki(s,f,r);continue}let d=s.readVarUint();for(;d-- >0;){let p=uv(s,o,r);p&&l.push(p)}break}let u=l.find(c=>c.type==="DOCUMENT"&&c.phase!=="REMOVED")?.sourceId;return l.filter(c=>c.type==="CANVAS"&&c.phase!=="REMOVED"&&(!u||c.parentId===u)).sort((c,f)=>{let d=c.position??"",p=f.position??"";return d<p?-1:d>p?1:0}).map(({sourceId:c,name:f,position:d,internalOnly:p})=>({sourceId:c,name:f,position:d,internalOnly:p}))}function vt(e,n){if(e!==null&&n!==null&&e>=n)return null;let t=e??"",r=n??"",i=0;for(;i<t.length&&i<r.length&&t[i]===r[i];)i++;let o=i<t.length?t.charCodeAt(i):32,s=n!==null&&i<n.length?n.charCodeAt(i):127;if(s-o>1)return t.slice(0,i)+String.fromCharCode(Math.floor((o+s)/2));if(i<t.length)return t.slice(0,i+1)+(vt(t.slice(i+1),null)??"O");let a=n?.slice(i+1)??"";return!n||a===""?null:n.slice(0,i+1)+(vt(null,a)??"")}function cv(e,n,t){for(let r=vt(e,n);r!==null;r=vt(r,n)){if(r+t<n)return r+t;if(!n.startsWith(r))return null}return null}function Kf(e,n,t=""){let r=vt(e,n);return r===null?(vt(e,null)??"O")+t:t?n===null?r+t:cv(e,n,t)??r:r}var ae=Uint8Array,Re=Uint16Array,aa=Int32Array,Li=new ae([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),_i=new ae([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),na=new ae([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),ed=function(e,n){for(var t=new Re(31),r=0;r<31;++r)t[r]=n+=1<<e[r-1];for(var i=new aa(t[30]),r=1;r<30;++r)for(var o=t[r];o<t[r+1];++o)i[o]=o-t[r]<<5|r;return{b:t,r:i}},nd=ed(Li,2),td=nd.b,ta=nd.r;td[28]=258,ta[258]=28;var rd=ed(_i,0),fv=rd.b,Yf=rd.r,ra=new Re(32768);for(q=0;q<32768;++q)gn=(q&43690)>>1|(q&21845)<<1,gn=(gn&52428)>>2|(gn&13107)<<2,gn=(gn&61680)>>4|(gn&3855)<<4,ra[q]=((gn&65280)>>8|(gn&255)<<8)>>1;var gn,q,tn=(function(e,n,t){for(var r=e.length,i=0,o=new Re(n);i<r;++i)e[i]&&++o[e[i]-1];var s=new Re(n);for(i=1;i<n;++i)s[i]=s[i-1]+o[i-1]<<1;var a;if(t){a=new Re(1<<n);var l=15-n;for(i=0;i<r;++i)if(e[i])for(var u=i<<4|e[i],c=n-e[i],f=s[e[i]-1]++<<c,d=f|(1<<c)-1;f<=d;++f)a[ra[f]>>l]=u}else for(a=new Re(r),i=0;i<r;++i)e[i]&&(a[i]=ra[s[e[i]-1]++]>>15-e[i]);return a}),Rn=new ae(288);for(q=0;q<144;++q)Rn[q]=8;var q;for(q=144;q<256;++q)Rn[q]=9;var q;for(q=256;q<280;++q)Rn[q]=7;var q;for(q=280;q<288;++q)Rn[q]=8;var q,ar=new ae(32);for(q=0;q<32;++q)ar[q]=5;var q,dv=tn(Rn,9,0),pv=tn(Rn,9,1),mv=tn(ar,5,0),gv=tn(ar,5,1),Js=function(e){for(var n=e[0],t=1;t<e.length;++t)e[t]>n&&(n=e[t]);return n},Xe=function(e,n,t){var r=n/8|0;return(e[r]|e[r+1]<<8)>>(n&7)&t},Zs=function(e,n){var t=n/8|0;return(e[t]|e[t+1]<<8|e[t+2]<<16)>>(n&7)},la=function(e){return(e+7)/8|0},lr=function(e,n,t){return(n==null||n<0)&&(n=0),(t==null||t>e.length)&&(t=e.length),new ae(e.subarray(n,t))};var hv=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],Te=function(e,n,t){var r=new Error(n||hv[e]);if(r.code=e,Error.captureStackTrace&&Error.captureStackTrace(r,Te),!t)throw r;return r},yv=function(e,n,t,r){var i=e.length,o=r?r.length:0;if(!i||n.f&&!n.l)return t||new ae(0);var s=!t,a=s||n.i!=2,l=n.i;s&&(t=new ae(i*3));var u=function(Fe){var Ge=t.length;if(Fe>Ge){var In=new ae(Math.max(Ge*2,Fe));In.set(t),t=In}},c=n.f||0,f=n.p||0,d=n.b||0,p=n.l,g=n.d,m=n.m,h=n.n,T=i*8;do{if(!p){c=Xe(e,f,1);var y=Xe(e,f+1,3);if(f+=3,y)if(y==1)p=pv,g=gv,m=9,h=5;else if(y==2){var S=Xe(e,f,31)+257,x=Xe(e,f+10,15)+4,D=S+Xe(e,f+5,31)+1;f+=14;for(var P=new ae(D),B=new ae(19),H=0;H<x;++H)B[na[H]]=Xe(e,f+H*3,7);f+=x*3;for(var K=Js(B),v=(1<<K)-1,E=tn(B,K,1),H=0;H<D;){var I=E[Xe(e,f,v)];f+=I&15;var C=I>>4;if(C<16)P[H++]=C;else{var N=0,w=0;for(C==16?(w=3+Xe(e,f,3),f+=2,N=P[H-1]):C==17?(w=3+Xe(e,f,7),f+=3):C==18&&(w=11+Xe(e,f,127),f+=7);w--;)P[H++]=N}}var O=P.subarray(0,S),R=P.subarray(S);m=Js(O),h=Js(R),p=tn(O,m,1),g=tn(R,h,1)}else Te(1);else{var C=la(f)+4,L=e[C-4]|e[C-3]<<8,M=C+L;if(M>i){l&&Te(0);break}a&&u(d+L),t.set(e.subarray(C,M),d),n.b=d+=L,n.p=f=M*8,n.f=c;continue}if(f>T){l&&Te(0);break}}a&&u(d+131072);for(var W=(1<<m)-1,z=(1<<h)-1,U=f;;U=f){var N=p[Zs(e,f)&W],G=N>>4;if(f+=N&15,f>T){l&&Te(0);break}if(N||Te(2),G<256)t[d++]=G;else if(G==256){U=f,p=null;break}else{var X=G-254;if(G>264){var H=G-257,_=Li[H];X=Xe(e,f,(1<<_)-1)+td[H],f+=_}var Q=g[Zs(e,f)&z],ne=Q>>4;Q||Te(3),f+=Q&15;var R=fv[ne];if(ne>3){var _=_i[ne];R+=Zs(e,f)&(1<<_)-1,f+=_}if(f>T){l&&Te(0);break}a&&u(d+131072);var Ee=d+X;if(d<R){var sn=o-R,an=Math.min(R,Ee);for(sn+d<0&&Te(3);d<an;++d)t[d]=r[sn+d]}for(;d<Ee;++d)t[d]=t[d-R]}}n.l=p,n.p=U,n.b=d,n.f=c,p&&(c=1,n.m=m,n.d=g,n.n=h)}while(!c);return d!=t.length&&s?lr(t,0,d):t.subarray(0,d)},hn=function(e,n,t){t<<=n&7;var r=n/8|0;e[r]|=t,e[r+1]|=t>>8},or=function(e,n,t){t<<=n&7;var r=n/8|0;e[r]|=t,e[r+1]|=t>>8,e[r+2]|=t>>16},Qs=function(e,n){for(var t=[],r=0;r<e.length;++r)e[r]&&t.push({s:r,f:e[r]});var i=t.length,o=t.slice();if(!i)return{t:od,l:0};if(i==1){var s=new ae(t[0].s+1);return s[t[0].s]=1,{t:s,l:1}}t.sort(function(M,S){return M.f-S.f}),t.push({s:-1,f:25001});var a=t[0],l=t[1],u=0,c=1,f=2;for(t[0]={s:-1,f:a.f+l.f,l:a,r:l};c!=i-1;)a=t[t[u].f<t[f].f?u++:f++],l=t[u!=c&&t[u].f<t[f].f?u++:f++],t[c++]={s:-1,f:a.f+l.f,l:a,r:l};for(var d=o[0].s,r=1;r<i;++r)o[r].s>d&&(d=o[r].s);var p=new Re(d+1),g=ia(t[c-1],p,0);if(g>n){var r=0,m=0,h=g-n,T=1<<h;for(o.sort(function(S,x){return p[x.s]-p[S.s]||S.f-x.f});r<i;++r){var y=o[r].s;if(p[y]>n)m+=T-(1<<g-p[y]),p[y]=n;else break}for(m>>=h;m>0;){var C=o[r].s;p[C]<n?m-=1<<n-p[C]++-1:++r}for(;r>=0&&m;--r){var L=o[r].s;p[L]==n&&(--p[L],++m)}g=n}return{t:new ae(p),l:g}},ia=function(e,n,t){return e.s==-1?Math.max(ia(e.l,n,t+1),ia(e.r,n,t+1)):n[e.s]=t},$f=function(e){for(var n=e.length;n&&!e[--n];);for(var t=new Re(++n),r=0,i=e[0],o=1,s=function(l){t[r++]=l},a=1;a<=n;++a)if(e[a]==i&&a!=n)++o;else{if(!i&&o>2){for(;o>138;o-=138)s(32754);o>2&&(s(o>10?o-11<<5|28690:o-3<<5|12305),o=0)}else if(o>3){for(s(i),--o;o>6;o-=6)s(8304);o>2&&(s(o-3<<5|8208),o=0)}for(;o--;)s(i);o=1,i=e[a]}return{c:t.subarray(0,r),n}},sr=function(e,n){for(var t=0,r=0;r<n.length;++r)t+=e[r]*n[r];return t},id=function(e,n,t){var r=t.length,i=la(n+2);e[i]=r&255,e[i+1]=r>>8,e[i+2]=e[i]^255,e[i+3]=e[i+1]^255;for(var o=0;o<r;++o)e[i+o+4]=t[o];return(i+4+r)*8},qf=function(e,n,t,r,i,o,s,a,l,u,c){hn(n,c++,t),++i[256];for(var f=Qs(i,15),d=f.t,p=f.l,g=Qs(o,15),m=g.t,h=g.l,T=$f(d),y=T.c,C=T.n,L=$f(m),M=L.c,S=L.n,x=new Re(19),D=0;D<y.length;++D)++x[y[D]&31];for(var D=0;D<M.length;++D)++x[M[D]&31];for(var P=Qs(x,7),B=P.t,H=P.l,K=19;K>4&&!B[na[K-1]];--K);var v=u+5<<3,E=sr(i,Rn)+sr(o,ar)+s,I=sr(i,d)+sr(o,m)+s+14+3*K+sr(x,B)+2*x[16]+3*x[17]+7*x[18];if(l>=0&&v<=E&&v<=I)return id(n,c,e.subarray(l,l+u));var N,w,O,R;if(hn(n,c,1+(I<E)),c+=2,I<E){N=tn(d,p,0),w=d,O=tn(m,h,0),R=m;var W=tn(B,H,0);hn(n,c,C-257),hn(n,c+5,S-1),hn(n,c+10,K-4),c+=14;for(var D=0;D<K;++D)hn(n,c+3*D,B[na[D]]);c+=3*K;for(var z=[y,M],U=0;U<2;++U)for(var G=z[U],D=0;D<G.length;++D){var X=G[D]&31;hn(n,c,W[X]),c+=B[X],X>15&&(hn(n,c,G[D]>>5&127),c+=G[D]>>12)}}else N=dv,w=Rn,O=mv,R=ar;for(var D=0;D<a;++D){var _=r[D];if(_>255){var X=_>>18&31;or(n,c,N[X+257]),c+=w[X+257],X>7&&(hn(n,c,_>>23&31),c+=Li[X]);var Q=_&31;or(n,c,O[Q]),c+=R[Q],Q>3&&(or(n,c,_>>5&8191),c+=_i[Q])}else or(n,c,N[_]),c+=w[_]}return or(n,c,N[256]),c+w[256]},Iv=new aa([65540,131080,131088,131104,262176,1048704,1048832,2114560,2117632]),od=new ae(0),vv=function(e,n,t,r,i,o){var s=o.z||e.length,a=new ae(r+s+5*(1+Math.ceil(s/7e3))+i),l=a.subarray(r,a.length-i),u=o.l,c=(o.r||0)&7;if(n){c&&(l[0]=o.r>>3);for(var f=Iv[n-1],d=f>>13,p=f&8191,g=(1<<t)-1,m=o.p||new Re(32768),h=o.h||new Re(g+1),T=Math.ceil(t/3),y=2*T,C=function(Ji){return(e[Ji]^e[Ji+1]<<T^e[Ji+2]<<y)&g},L=new aa(25e3),M=new Re(288),S=new Re(32),x=0,D=0,P=o.i||0,B=0,H=o.w||0,K=0;P+2<s;++P){var v=C(P),E=P&32767,I=h[v];if(m[E]=I,h[v]=E,H<=P){var N=s-P;if((x>7e3||B>24576)&&(N>423||!u)){c=qf(e,l,0,L,M,S,D,B,K,P-K,c),B=x=D=0,K=P;for(var w=0;w<286;++w)M[w]=0;for(var w=0;w<30;++w)S[w]=0}var O=2,R=0,W=p,z=E-I&32767;if(N>2&&v==C(P-z))for(var U=Math.min(d,N)-1,G=Math.min(32767,P),X=Math.min(258,N);z<=G&&--W&&E!=I;){if(e[P+O]==e[P+O-z]){for(var _=0;_<X&&e[P+_]==e[P+_-z];++_);if(_>O){if(O=_,R=z,_>U)break;for(var Q=Math.min(z,_-2),ne=0,w=0;w<Q;++w){var Ee=P-z+w&32767,sn=m[Ee],an=Ee-sn&32767;an>ne&&(ne=an,I=Ee)}}}E=I,I=m[E],z+=E-I&32767}if(R){L[B++]=268435456|ta[O]<<18|Yf[R];var Fe=ta[O]&31,Ge=Yf[R]&31;D+=Li[Fe]+_i[Ge],++M[257+Fe],++S[Ge],H=P+O,++x}else L[B++]=e[P],++M[e[P]]}}for(P=Math.max(P,H);P<s;++P)L[B++]=e[P],++M[e[P]];c=qf(e,l,u,L,M,S,D,B,K,P-K,c),u||(o.r=c&7|l[c/8|0]<<3,c-=7,o.h=h,o.p=m,o.i=P,o.w=H)}else{for(var P=o.w||0;P<s+u;P+=65535){var In=P+65535;In>=s&&(l[c/8|0]=u,In=s),c=id(l,c+1,e.subarray(P,In))}o.i=s}return lr(a,0,r+la(c)+i)},Tv=(function(){for(var e=new Int32Array(256),n=0;n<256;++n){for(var t=n,r=9;--r;)t=(t&1&&-306674912)^t>>>1;e[n]=t}return e})(),Sv=function(){var e=-1;return{p:function(n){for(var t=e,r=0;r<n.length;++r)t=Tv[t&255^n[r]]^t>>>8;e=t},d:function(){return~e}}};var bv=function(e,n,t,r,i){if(!i&&(i={l:1},n.dictionary)){var o=n.dictionary.subarray(-32768),s=new ae(o.length+e.length);s.set(o),s.set(e,o.length),e=s,i.w=o.length}return vv(e,n.level==null?6:n.level,n.mem==null?i.l?Math.ceil(Math.max(8,Math.min(13,Math.log(e.length)))*1.5):20:12+n.mem,t,r,i)},sd=function(e,n){var t={};for(var r in e)t[r]=e[r];for(var r in n)t[r]=n[r];return t};var nn=function(e,n){return e[n]|e[n+1]<<8},Le=function(e,n){return(e[n]|e[n+1]<<8|e[n+2]<<16|e[n+3]<<24)>>>0},ea=function(e,n){return Le(e,n)+Le(e,n+4)*4294967296},ye=function(e,n,t){for(;t;++n)e[n]=t,t>>>=8};function ua(e,n){return bv(e,n||{},0,0)}function Xn(e,n){return yv(e,{i:2},n&&n.out,n&&n.dictionary)}var ad=function(e,n,t,r){for(var i in e){var o=e[i],s=n+i,a=r;Array.isArray(o)&&(a=sd(r,o[1]),o=o[0]),ArrayBuffer.isView(o)?t[s]=[o,a]:(t[s+="/"]=[new ae(0),a],ad(o,s,t,r))}},Jf=typeof TextEncoder<"u"&&new TextEncoder,oa=typeof TextDecoder<"u"&&new TextDecoder,Ev=0;try{oa.decode(od,{stream:!0}),Ev=1}catch{}var Av=function(e){for(var n="",t=0;;){var r=e[t++],i=(r>127)+(r>223)+(r>239);if(t+i>e.length)return{s:n,r:lr(e,t-1)};i?i==3?(r=((r&15)<<18|(e[t++]&63)<<12|(e[t++]&63)<<6|e[t++]&63)-65536,n+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?n+=String.fromCharCode((r&31)<<6|e[t++]&63):n+=String.fromCharCode((r&15)<<12|(e[t++]&63)<<6|e[t++]&63):n+=String.fromCharCode(r)}};function Zf(e,n){if(n){for(var t=new ae(e.length),r=0;r<e.length;++r)t[r]=e.charCodeAt(r);return t}if(Jf)return Jf.encode(e);for(var i=e.length,o=new ae(e.length+(e.length>>1)),s=0,a=function(c){o[s++]=c},r=0;r<i;++r){if(s+5>o.length){var l=new ae(s+8+(i-r<<1));l.set(o),o=l}var u=e.charCodeAt(r);u<128||n?a(u):u<2048?(a(192|u>>6),a(128|u&63)):u>55295&&u<57344?(u=65536+(u&1047552)|e.charCodeAt(++r)&1023,a(240|u>>18),a(128|u>>12&63),a(128|u>>6&63),a(128|u&63)):(a(224|u>>12),a(128|u>>6&63),a(128|u&63))}return lr(o,0,s)}function Nv(e,n){if(n){for(var t="",r=0;r<e.length;r+=16384)t+=String.fromCharCode.apply(null,e.subarray(r,r+16384));return t}else{if(oa)return oa.decode(e);var i=Av(e),o=i.s,t=i.r;return t.length&&Te(8),o}}var Cv=function(e,n){return n+30+nn(e,n+26)+nn(e,n+28)},Ov=function(e,n,t){var r=nn(e,n+28),i=nn(e,n+30),o=Nv(e.subarray(n+46,n+46+r),!(nn(e,n+8)&2048)),s=n+46+r,a=xv(e,s,i,t,Le(e,n+20),Le(e,n+24),Le(e,n+42)),l=a[0],u=a[1],c=a[2];return[nn(e,n+10),l,u,o,s+i+nn(e,n+32),c]},xv=function(e,n,t,r,i,o,s){var a=i==4294967295,l=o==4294967295,u=s==4294967295,c=n+t,f=a+l+u;if(r&&f){for(;n+4<c;n+=4+nn(e,n+2))if(nn(e,n)==1)return[a?ea(e,n+4+8*l):i,l?ea(e,n+4):o,u?ea(e,n+4+8*(l+a)):s,1];r<2&&Te(13)}return[i,o,s,0]},sa=function(e){var n=0;if(e)for(var t in e){var r=e[t].length;r>65535&&Te(9),n+=r+4}return n},Qf=function(e,n,t,r,i,o,s,a){var l=r.length,u=t.extra,c=a&&a.length,f=sa(u);ye(e,n,s!=null?33639248:67324752),n+=4,s!=null&&(e[n++]=20,e[n++]=t.os),e[n]=20,n+=2,e[n++]=t.flag<<1|(o<0&&8),e[n++]=i&&8,e[n++]=t.compression&255,e[n++]=t.compression>>8;var d=new Date(t.mtime==null?Date.now():t.mtime),p=d.getFullYear()-1980;if((p<0||p>119)&&Te(10),ye(e,n,p<<25|d.getMonth()+1<<21|d.getDate()<<16|d.getHours()<<11|d.getMinutes()<<5|d.getSeconds()>>1),n+=4,o!=-1&&(ye(e,n,t.crc),ye(e,n+4,o<0?-o-2:o),ye(e,n+8,t.size)),ye(e,n+12,l),ye(e,n+14,f),n+=16,s!=null&&(ye(e,n,c),ye(e,n+6,t.attrs),ye(e,n+10,s),n+=14),e.set(r,n),n+=l,f)for(var g in u){var m=u[g],h=m.length;ye(e,n,+g),ye(e,n+2,h),e.set(m,n+4),n+=4+h}return c&&(e.set(a,n),n+=c),n},Dv=function(e,n,t,r,i){ye(e,n,101010256),ye(e,n+8,t),ye(e,n+10,t),ye(e,n+12,r),ye(e,n+16,i)};function ld(e,n){n||(n={});var t={},r=[];ad(e,"",t,n);var i=0,o=0;for(var s in t){var a=t[s],l=a[0],u=a[1],c=u.level==0?0:8,f=Zf(s),d=f.length,p=u.comment,g=p&&Zf(p),m=g&&g.length,h=sa(u.extra);d>65535&&Te(11);var T=c?ua(l,u):l,y=T.length,C=Sv();C.p(l),r.push(sd(u,{size:l.length,crc:C.d(),c:T,f,m:g,u:d!=s.length||g&&p.length!=m,o:i,compression:c})),i+=30+d+h+y,o+=76+2*(d+h)+(m||0)+y}for(var L=new ae(o+22),M=i,S=o-i,x=0;x<r.length;++x){var f=r[x];Qf(L,f.o,f,f.f,f.u,f.c.length);var D=30+f.f.length+sa(f.extra);L.set(f.c,f.o+D),Qf(L,i,f,f.f,f.u,f.c.length,f.o,f.m),i+=16+D+(f.m?f.m.length:0)}return Dv(L,i,r.length,S,M),L}function Tt(e,n){for(var t={},r=e.length-22;Le(e,r)!=101010256;--r)(!r||e.length-r>65558)&&Te(13);var i=nn(e,r+8);if(!i)return{};var o=Le(e,r+16),s=Le(e,r-20)==117853008;if(s){var a=Le(e,r-12);s=Le(e,a)==101075792,s&&(i=Le(e,a+32),o=Le(e,a+48))}for(var l=n&&n.filter,u=0;u<i;++u){var c=Ov(e,o,s),f=c[0],d=c[1],p=c[2],g=c[3],m=c[4],h=c[5],T=Cv(e,h);o=m,(!l||l({name:g,size:d,originalSize:p,compression:f}))&&(f?f==8?t[g]=Xn(e.subarray(T,T+d),{out:new ae(p)}):Te(14,"unknown compression type "+f):t[g]=lr(e,T,T+d))}return t}function ca(e){if(new TextDecoder().decode(e.slice(0,8))!=="fig-kiwi")return null;let n=new DataView(e.buffer,e.byteOffset,e.byteLength),t=12,r=[];for(;t<e.length;){let i=n.getUint32(t,!0);t+=4,r.push(e.slice(t,t+i)),t+=i}return r.length>=2?r:null}function ud(e,n,t=101){let r,i=globalThis.Bun?.zstdCompressSync;i?r=i(n):r=ua(n);let o=16+e.length+4+r.length,s=new Uint8Array(o),a=new DataView(s.buffer);s.set(new TextEncoder().encode("fig-kiwi"),0),a.setUint32(8,t,!0);let l=12;return a.setUint32(l,e.length,!0),l+=4,s.set(e,l),l+=e.length,a.setUint32(l,r.length,!0),l+=4,s.set(r,l),s}function Rv(e){if(!e||typeof e!="object")return!1;let n=e;return Number.isFinite(n.sessionID)&&Number.isFinite(n.localID)}function cd(e,n){return e?`fig-guide:${e.sessionID}:${e.localID}`:`guide:${n}`}function Mv(e){if(!Array.isArray(e))return[];let n=[];for(let[t,r]of e.entries()){if(!r||typeof r!="object")continue;let i=r;if(typeof i.offset!="number"||!Number.isFinite(i.offset))continue;let o=Rv(i.guid)?i.guid:void 0;i.axis==="X"?n.push({id:cd(o,t),axis:"x",position:i.offset,...o?{figGuid:o}:{}}):i.axis==="Y"&&n.push({id:cd(o,t),axis:"y",position:i.offset,...o?{figGuid:o}:{}})}return n}function Pv(e,n){let t=e.baselines??[];if(e.logicalIndexToCharacterOffsetMap?.length!==n.length+1||t.length!==1)return!1;let r=t[0].position.y;return(e.glyphs??[]).every(i=>(i.rotation??0)===0&&i.position.y===r)}function wv(e,n,t){if(!e||Pv(e,t))return[];let r=[],i=e.truncationStartIndex??-1,o=e.glyphs??[];for(let s of i>=0?o.slice(0,i):o){let a=s.commandsBlob===void 0?void 0:n[s.commandsBlob];if(!a)return[];let l=s.advance*s.fontSize;r.push({commandsBlob:a,x:s.position.x,y:s.position.y,fontSize:s.fontSize,firstCharacter:s.firstCharacter,rotation:s.rotation,advance:Number.isFinite(l)?l:void 0})}return r}var CL=new Set((wi.definitions.find(e=>e.name==="OpenTypeFeature")?.fields??[]).map(e=>e.name)),Sd=[["fontVariantCommonLigatures","LIGA"],["fontVariantContextualLigatures","CALT"],["fontVariantDiscretionaryLigatures","DLIG"],["fontVariantHistoricalLigatures","HLIG"],["fontVariantOrdinal","ORDN"],["fontVariantSlashedZero","ZERO"]],kv=[["fontVariantNumericFigure",{LINING:"LNUM",OLDSTYLE:"ONUM"}],["fontVariantNumericSpacing",{PROPORTIONAL:"PNUM",TABULAR:"TNUM"}],["fontVariantNumericFraction",{DIAGONAL:"FRAC",STACKED:"AFRC"}],["fontVariantCaps",{SMALL:"SMCP",PETITE:"PCAP",ALL_SMALL:["SMCP","C2SC"],ALL_PETITE:["PCAP","C2PC"],UNICASE:"UNIC",TITLING:"TITL"}]],OL=Object.fromEntries(Sd.map(([e,n])=>[n,e]));function ur(e,n,t){let r=n.toUpperCase();e.some(i=>i.tag===r)||e.push({tag:r,enabled:t})}function bd(e){let n=[];for(let[t,r]of Sd){let i=e[t];i!==void 0&&ur(n,r,i)}for(let[t,r]of kv){let i=r[String(e[t])];if(Array.isArray(i))for(let o of i)ur(n,o,!0);else i&&ur(n,i,!0)}for(let t of e.toggledOnOTFeatures??[])ur(n,t,!0);for(let t of e.toggledOffOTFeatures??[])ur(n,t,!1);return n}function Lv(e){return String.fromCharCode(e>>24&255,e>>16&255,e>>8&255,e&255)}function Ed(e){let n=[];for(let t of e.fontVariations??[]){if(typeof t.value!="number")continue;let r=typeof t.axisTag=="number"?Lv(t.axisTag):t.axisName||"";r&&n.push({axis:r,value:t.value})}return n}var xL=Array.from({length:256},(e,n)=>n.toString(16).padStart(2,"0"));function ma(e){return e?{r:e.r??0,g:e.g??0,b:e.b??0,a:e.a??1}:{...Cn}}function _v(e){return Object.keys(e).sort((n,t)=>Number(n)-Number(t)).map(n=>e[Number(n)]).map(n=>n.toString(16).padStart(2,"0")).join("")}function Ad(e){if(e)return{m00:e.m00,m01:e.m01,m02:e.m02,m10:e.m10,m11:e.m11,m12:e.m12}}var fd=null;function Vv(e){let n=e.colorVar?.value?.alias;if(!(!n||!fd))return fd(n)??void 0}function Fv(e){let n=Vv(e);return n?{color:{...n,a:e.color?.a??1},opacity:e.opacity??n.a}:{color:ma(e.color),opacity:e.opacity??1}}function Gv(e){let{color:n,opacity:t}=Fv(e);return{type:e.type,color:n,opacity:t,visible:e.visible??!0,blendMode:e.blendMode??"NORMAL"}}function Bv(e,n){!n.type.startsWith("GRADIENT")||!n.stops||(e.gradientStops=n.stops.map(t=>({color:ma(t.color),position:t.position})),n.transform&&(e.gradientTransform=Ad(n.transform)))}function Uv(e,n){if(n.type==="IMAGE"){if(n.image&&typeof n.image=="object"){let t=n.image;typeof t.hash=="object"?e.imageHash=_v(t.hash):typeof t.hash=="string"&&(e.imageHash=t.hash)}e.imageScaleMode=n.imageScaleMode??"FILL",n.transform&&(e.imageTransform=Ad(n.transform))}}function zv(e,n){n.sourceNodeId&&(e.sourceNodeId=k(n.sourceNodeId)),n.scale&&(e.scale=n.scale),n.spacing&&(e.spacing=n.spacing),n.patternSpacing&&(e.patternSpacing=n.patternSpacing),n.patternTileType&&(e.patternTileType=n.patternTileType),n.verticalAlignment&&(e.verticalAlignment=n.verticalAlignment),n.horizontalAlignment&&(e.horizontalAlignment=n.horizontalAlignment),n.noiseType&&(e.noiseType=n.noiseType),n.density!==void 0&&(e.density=n.density),n.noiseSize&&(e.noiseSize=n.noiseSize),n.customEffectId?.guid&&(e.customEffectId=k(n.customEffectId.guid))}function Nd(e){let n=Gv(e);return Bv(n,e),Uv(n,e),zv(n,e),n}function dr(e){return e?e.map(Nd):[]}function Cd(e){return e==="INSIDE"||e==="OUTSIDE"?e:"CENTER"}function Hv(e,n,t,r,i,o){if(!e)return[];let s=Cd(t);return e.map(a=>({...Nd(a),weight:n??1,align:s,cap:r??"NONE",join:i??"MITER",dashPattern:o??[]}))}function Wv(e){return e?e.map(n=>({type:n.type,color:ma(n.color),offset:n.offset??{x:0,y:0},radius:n.radius??0,spread:n.spread??0,visible:n.visible??!0,blendMode:n.blendMode??"NORMAL",showShadowBehindNode:n.showShadowBehindNode??!0})):[]}function dd(e,n,t){return n===0&&t===0?e:Kt(e,1,0,0,1,n,t)}function Xv(e,n,t){let r=[...e.fillGeometry??[],...e.strokeGeometry??[]],i=r.length>0?si(r):null,o=i?.x??0,s=i?.y??0,a=i?i.x+i.width:n,l=i?i.y+i.height:t;for(let c of e.derivedTextGlyphs??[]){let f=c.fontSize||0;o=Math.min(o,c.x-f*.25),s=Math.min(s,c.y-f),a=Math.max(a,c.x+f),l=Math.max(l,c.y+f*.35)}let u=1;return{left:Math.max(0,-o+(o<0?u:0)),top:Math.max(0,-s+(s<0?u:0)),right:Math.max(0,a-n+(a>n?u:0)),bottom:Math.max(0,l-t+(l>t?u:0))}}function jv(e,n,t){e.strokeGeometry&&e.strokeGeometry.length>0&&(e.strokeGeometry=dd(e.strokeGeometry,n,t)),e.fillGeometry&&e.fillGeometry.length>0&&(e.fillGeometry=dd(e.fillGeometry,n,t)),e.derivedTextGlyphs?.length&&(e.derivedTextGlyphs=e.derivedTextGlyphs.map(r=>({...r,x:r.x+n,y:r.y+t})))}function Kv(e,n){if(e.nodeType!=="TEXT"||!n)return;e.textPathData=n;let t=e.width??0,r=e.height??0;e.textPathBox={x:0,y:0,width:t,height:r};let i=Xv(e,t,r);if(i.left===0&&i.top===0&&i.right===0&&i.bottom===0)return;let o=i.left,s=i.top;e.x=(e.x??0)-o,e.y=(e.y??0)-s,e.width=t+i.left+i.right,e.height=r+i.top+i.bottom,(o!==0||s!==0)&&(e.textPathBox={x:o,y:s,width:t,height:r},jv(e,o,s))}var oe=["textData","derivedTextData","textUserLayoutVersion","textExplicitLayoutVersion"],je=["strokeGeometry","vectorData"],DL={fillStyleId:["styleIdForFill"],strokeStyleId:["styleIdForStrokeFill"],textStyleId:["styleIdForText"],effectStyleId:["styleIdForEffect"],gridStyleId:["styleIdForGrid"],fills:["fillPaints","backgroundPaints","backgroundColor"],strokes:["strokePaints"],effects:["effects"],blendMode:["blendMode"],layoutGrids:["layoutGrids"],guides:["guides"],exportSettings:["exportSettings"],cornerRadius:["cornerRadius"],independentCorners:["rectangleCornerRadiiIndependent"],topLeftRadius:["rectangleTopLeftCornerRadius","rectangleCornerRadiiIndependent"],topRightRadius:["rectangleTopRightCornerRadius","rectangleCornerRadiiIndependent"],bottomLeftRadius:["rectangleBottomLeftCornerRadius","rectangleCornerRadiiIndependent"],bottomRightRadius:["rectangleBottomRightCornerRadius","rectangleCornerRadiiIndependent"],cornerSmoothing:["cornerSmoothing"],borderTopWeight:["borderTopWeight",...je],borderRightWeight:["borderRightWeight",...je],borderBottomWeight:["borderBottomWeight",...je],borderLeftWeight:["borderLeftWeight",...je],independentStrokeWeights:["borderStrokeWeightsIndependent","borderTopWeight","borderRightWeight","borderBottomWeight","borderLeftWeight",...je],strokeWeight:["strokeWeight",...je],strokeAlign:["strokeAlign",...je],strokeJoin:["strokeJoin",...je],strokeMiterLimit:["miterLimit",...je],strokeCap:[...je],dashPattern:[...je],text:[...oe],styleRuns:[...oe],fontSize:["fontSize",...oe],fontFamily:["fontName","fontVersion",...oe],fontWeight:["semanticWeight",...oe],italic:["semanticItalic",...oe],textAlignHorizontal:["textAlignHorizontal",...oe],textAlignVertical:["textAlignVertical",...oe],lineHeight:["lineHeight",...oe],letterSpacing:["letterSpacing","textTracking",...oe],textAutoResize:["textAutoResize",...oe],textDecorationStyle:["textDecorationStyle",...oe],textDecorationThickness:["textDecorationThickness",...oe],textDecorationFills:["textDecorationFillPaints",...oe],textUnderlineOffset:["textUnderlineOffset",...oe],leadingTrim:["leadingTrim",...oe],maxLines:["maxLines",...oe],textParagraphs:[...oe],listSpacing:["listSpacing",...oe],paragraphSpacing:["paragraphSpacing",...oe],paragraphIndent:["paragraphIndent",...oe],hangingList:["hangingList",...oe],fontVariations:["fontVariations",...oe],fontFeatures:["fontVariantCommonLigatures","fontVariantContextualLigatures","toggledOnOTFeatures","toggledOffOTFeatures",...oe],minWidth:["minSize"],minHeight:["minSize"],maxWidth:["maxSize"],maxHeight:["maxSize"],vectorNetwork:["vectorData","fillGeometry","strokeGeometry"],fillGeometry:["fillGeometry","vectorData"],strokeGeometry:["strokeGeometry","vectorData"],isMask:["mask"],maskType:["maskType"],maskIsOutline:["maskIsOutline"],componentPropertyDefinitions:["componentPropDefs"],componentPropertyReferences:["componentPropRefs"],componentPropertyAssignments:["componentPropAssignments"],variantPropSpecs:["variantPropSpecs"]};function Yv(e){return Object.getPrototypeOf(e)===Object.prototype}function pa(e){if(e===null||typeof e!="object")return e;if(Array.isArray(e))return e.map(t=>pa(t));if(!Yv(e))return structuredClone(e);let n={};for(let t of Object.keys(e))n[t]=pa(e[t]);return n}function cr(e){return pa(e)}var Od=64;function pr(e,n=0){if(n>Od)throw new Error("Variable expression exceeds maximum depth");let t=e?.value;if(e?.dataType==="EXPRESSION"&&!t?.expressionValue)throw new Error("Missing variable expression value");if(!t)return;if(t.alias)return{multiplier:1,reference:t.alias};if(typeof t.floatValue=="number"&&Number.isFinite(t.floatValue))return{multiplier:t.floatValue};let r=t.expressionValue;if(r){if(r.expressionFunction==="STRINGIFY")return $v(r);if(r.expressionFunction!=="MULTIPLY"||!r.expressionArguments?.length)throw new Error(`Unsupported variable expression ${r.expressionFunction}`);return qv(r.expressionArguments,n)}}function $v(e){let n=e.expressionArguments??[],t=n.length===1?n[0].value?.alias:void 0;if(!t)throw new Error("Variable expression STRINGIFY must wrap one alias");return{multiplier:1,reference:t}}function qv(e,n){let t={multiplier:1};for(let r of e){let i=pr(r,n+1);if(!i||t.reference&&i.reference)throw new Error("Variable expression is not a constant multiplied by one alias");t.multiplier*=i.multiplier,i.reference&&(t.reference=i.reference)}if(!Number.isFinite(t.multiplier))throw new Error("Variable expression has a non-finite multiplier");return t}function ga(e,n,t=0){if(t>Od)throw new Error("Variable expression exceeds maximum depth");e?.value?.alias&&n(e.value.alias);for(let r of e?.value?.expressionValue?.expressionArguments??[])ga(r,n,t+1)}var xd={cornerRadius:"CORNER_RADIUS",topLeftRadius:"RECTANGLE_TOP_LEFT_CORNER_RADIUS",topRightRadius:"RECTANGLE_TOP_RIGHT_CORNER_RADIUS",bottomLeftRadius:"RECTANGLE_BOTTOM_LEFT_CORNER_RADIUS",bottomRightRadius:"RECTANGLE_BOTTOM_RIGHT_CORNER_RADIUS",strokeWeight:"STROKE_WEIGHT",borderTopWeight:"BORDER_TOP_WEIGHT",borderBottomWeight:"BORDER_BOTTOM_WEIGHT",borderLeftWeight:"BORDER_LEFT_WEIGHT",borderRightWeight:"BORDER_RIGHT_WEIGHT",itemSpacing:"STACK_SPACING",paddingLeft:"STACK_PADDING_LEFT",paddingTop:"STACK_PADDING_TOP",paddingRight:"STACK_PADDING_RIGHT",paddingBottom:"STACK_PADDING_BOTTOM",counterAxisSpacing:"STACK_COUNTER_SPACING",gridRowGap:"GRID_ROW_GAP",gridColumnGap:"GRID_COLUMN_GAP",text:"TEXT_DATA",visible:"VISIBLE",opacity:"OPACITY",width:"WIDTH",height:"HEIGHT",minWidth:"MIN_WIDTH",maxWidth:"MAX_WIDTH",minHeight:"MIN_HEIGHT",maxHeight:"MAX_HEIGHT",x:"X_POSITION",y:"Y_POSITION",rotation:"ROTATION",fontSize:"FONT_SIZE",letterSpacing:"LETTER_SPACING",lineHeight:"LINE_HEIGHT",fontFamily:"FONT_FAMILY"},mr=Object.fromEntries(Object.entries(xd).map(([e,n])=>[n,e])),ha=.01;function Jv(e){return e==="ALIAS"||e==="EXPRESSION"}function rn(e){let n=e.parameterConsumptionMap,t=new Map,r=[];for(let i of[...e.variableConsumptionMap?.entries??[],...n?.entries??[]])i.variableField?t.set(i.variableField,i):r.push(i);return[...r,...t.values()]}function ya(e,n){let t=rn(n);if(t.length===0)return{};let r=[];for(let i of[...rn(e),...t]){let o=i.variableField?r.findIndex(s=>s.variableField===i.variableField):-1;o<0?r.push(cr(i)):r[o]=cr(i)}return{parameterConsumptionMap:{entries:r}}}var Zv={fontFamily:"FONT_FAMILY",fontStyle:"FONT_STYLE",fontSize:"FONT_SIZE",letterSpacing:"LETTER_SPACING",lineHeight:"LINE_HEIGHT",paragraphSpacing:"PARAGRAPH_SPACING",paragraphIndent:"PARAGRAPH_INDENT"},Qv=Rs(Zv);function eT(e){let n={};for(let t of rn(e)){let r=t.variableField&&Qv[t.variableField],i=r?pr(t.variableData)?.reference?.guid:void 0;r&&i&&(n[r]=k(i))}return n}function nT(e,n){return e==="opacity"?ha:e==="rotation"?1:n}function Dd(e){let n=e.variableField?mr[e.variableField]:void 0;if(!n)return;let t=pr(e.variableData);if(e.variableData?.value?.expressionValue&&!t?.reference)throw new Error("Variable expression must contain one alias");let r=t?.reference?.guid;return r?{field:n,variableId:k(r),multiplier:t.multiplier}:void 0}function tT(e){let n={};for(let t of rn(e)){let r=Dd(t);r&&mn(r.field)&&(n[r.field]=r.multiplier*(r.field==="opacity"?ha:1))}return n}function Ia(e=1){return e===1?{}:Object.fromEntries(Object.entries(gr(xd,e)).filter(([,n])=>n!==1))}function gr(e,n,t={}){let r={};for(let i of Object.keys(e))mn(i)&&(r[i]=t[i]??nT(i,n));return r}function Rd(e,n){return e==="opacity"?{opacity:Math.max(0,Math.min(1,n*ha))}:mn(e)?{[e]:n}:void 0}var{boundVariables:rT,exportSettings:iT,librarySource:oT,textPathBox:sT}=ze,aT={PNG:"png",JPEG:"jpg",SVG:"svg",PDF:"pdf"};function _e(e,n){return n.decode(e.pluginData?.find(t=>t.pluginID===qo&&t.key===n.key)?.value)}function lT(e){return _e(e,sT)??null}function uT(e){let n=_e(e,rT)??{};for(let t of rn(e)){let r=Dd(t);if(r)n[r.field]=r.variableId;else if(t.variableField&&!Jv(t.variableData?.dataType)){let i=mr[t.variableField];i&&(n=ke(n,[i]))}}return e.fillPaints?.forEach((t,r)=>{let i=t.colorVar?.value?.alias?.guid;i&&(n[`fills/${r}/color`]=k(i))}),e.strokePaints?.forEach((t,r)=>{let i=t.colorVar?.value?.alias?.guid;i&&(n[`strokes/${r}/color`]=k(i))}),n}function cT(e){return typeof e=="string"?aT[e]??null:e===0?"png":e===1?"jpg":e===2?"svg":e===3?"pdf":null}function fT(e){if(!e||typeof e!="object"||Array.isArray(e))return 1;let n=e.type;if(n!=="CONTENT_SCALE"&&n!==0)return 1;let t=e.value;return typeof t=="number"&&Number.isFinite(t)?ti(t):1}function dT(e){let n=_e(e,iT);return n||(e.exportSettings??[]).flatMap(t=>{if(!t||typeof t!="object"||Array.isArray(t))return[];let r=cT(t.imageType);return r?[{scale:fT(t.constraint),format:r}]:[]})}function Fi(e){return(e.pluginData??[]).map(n=>({pluginId:n.pluginID,key:n.key,value:n.value}))}function pT(e){return _e(e,oT)??null}function mT(e){return(e.pluginRelaunchData??[]).map(n=>({pluginId:n.pluginID,command:n.command,message:n.message,isDeleted:n.isDeleted}))}var gT=["fontSize","fontName","lineHeight","letterSpacing","textDecoration","textCase"];function fr(e,n,t){if(n?.guid)return e.get(k(n.guid));if(!n?.assetRef||!t)return;let{key:r,version:i}=n.assetRef,o=(i?t.get(`${r}@${i}`):void 0)??t.get(r);return o?e.get(o):void 0}function hT(e,n,t){let r=fr(e,n.styleIdForFill,t);r?.styleType==="FILL"&&r.fillPaints&&(n.fillPaints=r.fillPaints);let i=fr(e,n.styleIdForStrokeFill,t);i?.styleType==="FILL"&&i.fillPaints&&(n.strokePaints=i.fillPaints)}function yT(e,n,t){let r=fr(e,n.styleIdForEffect,t);r?.styleType==="EFFECT"&&r.effects&&(n.effects=r.effects);let i=fr(e,n.styleIdForGrid,t);i?.styleType==="GRID"&&i.layoutGrids&&(n.layoutGrids=i.layoutGrids)}function IT(e,n,t){let r=fr(e,n.styleIdForText,t);if(!(r?.type!=="TEXT"||r.styleType!=="TEXT"))for(let i of gT)i==="textDecoration"?n.textDecoration=r.textDecoration:r[i]!==void 0&&Object.assign(n,{[i]:r[i]})}function Md(e,n,t){hT(e,n,t),yT(e,n,t),IT(e,n,t)}function jn(e){if(!e||typeof e!="object"||!("guid"in e))return null;let n=e.guid;return!n||typeof n!="object"||Hn(n)?null:k(n)}function Pd(e){switch(e){case"UNDERLINE":return"UNDERLINE";case"STRIKETHROUGH":return"STRIKETHROUGH";default:return"NONE"}}var pd={value:100,units:"PERCENT"};function wd(e){return e?.units===pd.units&&e.value===pd.value}function kd(e,n){return!e||wd(e)?null:e.units==="PIXELS"?e.value:e.units==="PERCENT"?e.value/100*(n??14):e.units==="RAW"?e.value*(n??14):null}function Ld(e,n){return e?e.units==="PIXELS"?e.value:e.units==="PERCENT"?e.value/100*(n??14):e.value:0}var vT=new Set(["ORIGINAL","UPPER","LOWER","TITLE"]);function _d(e){if(!e||typeof e!="object")return;let n=e;if(typeof n.url=="string"&&n.url!=="")return{type:"URL",value:n.url};if(n.guid&&!Hn(n.guid))return{type:"NODE",value:k(n.guid)}}function TT(e,n,t){vT.has(n.textCase)&&(e.textCase=n.textCase);let r=_d(n.hyperlink);r&&(e.hyperlink=r);for(let[o,s]of[["textStyleId","styleIdForText"],["fillStyleId","styleIdForFill"]]){if(n[s]===void 0)continue;let a=jn(n[s]);a!==jn(t[s])&&(e[o]=a)}let i=eT(n);ri(i)||(e.boundVariables=i)}function ST(e,n){let t=n.textDecoration;if(t&&(e.textDecoration=Pd(t)),n.textDecorationStyle&&(e.textDecorationStyle=n.textDecorationStyle),n.textDecorationThickness&&(e.textDecorationThickness=n.textDecorationThickness.value??null),n.textDecorationSkipInk!==void 0&&(e.textDecorationSkipInk=n.textDecorationSkipInk),n.textUnderlineOffset&&(e.textUnderlineOffset=n.textUnderlineOffset.value??null),n.textDecorationFillPaints){let r=dr(n.textDecorationFillPaints);r.length>0&&(e.textDecorationFills=r)}}function bT(e,n){let t=n.fontSize,r={};e.fontName&&(r.fontFamily=e.fontName.family,r.fontWeight=Ni(e.fontName.style),r.italic=e.fontName.style.toLowerCase().includes("italic")),e.fontSize!==void 0&&(r.fontSize=e.fontSize);let i=Ed(e);i.length>0&&(r.fontVariations=i);let o=bd(e);if(o.length>0&&(r.fontFeatures=o),e.letterSpacing&&(r.letterSpacing=Ld(e.letterSpacing,e.fontSize??t)),e.lineHeight&&(r.lineHeight=kd(e.lineHeight,e.fontSize??t)),ST(r,e),e.fillPaints){let s=dr(e.fillPaints);s.length>0&&(r.fills=s)}return TT(r,e,n),r}function ET(e,n){let t=new Map;for(let r of e){let i=r.styleID;if(i===void 0||i===0)continue;let o=bT(r,n);Object.keys(o).length>0&&t.set(i,o)}return t}function AT(e,n){let t=[],r=e[0],i=0;for(let o=1;o<=e.length;o++)if(o===e.length||e[o]!==r){let s=n.get(r);s&&t.push({start:i,length:o-i,style:s}),o<e.length&&(r=e[o],i=o)}return t}function NT(e,n,t,r){for(let i of t.values())i.hyperlink??=r;return t.set(0,{hyperlink:r}),Array.from({length:n},(i,o)=>e[o]??0)}function CT(e){let n=e.textData,t=_d(e.hyperlink),r=n?.characters.length??0,i=ET(n?.styleOverrideTable??[],e),o=t?NT(n?.characterStyleIDs??[],r,i,t):n?.characterStyleIDs??[];return o.length===0||i.size===0?[]:AT(o,i)}function OT(e){return e.lineType==="ORDERED_LIST"?"ORDERED":e.lineType==="UNORDERED_LIST"?"UNORDERED":"NONE"}function xT(e,n=[]){if(!e)return[];let t=new Map(n.map(i=>[i.styleID,i])),r=e.map(i=>{let o={listType:OT(i),indentation:i.indentationLevel??0};o.listType!=="NONE"&&(o=bs(o,o.indentation));let s=i.styleId?t.get(i.styleId):void 0;for(let a of Jt){let l=s?.[a];l!==void 0&&(o=Ts(o,a,l))}return o});return Ss(r,r.length)}function Vd(e,n){let t=new DataView(e.buffer,e.byteOffset,e.byteLength),r=0,i=t.getUint32(r,!0);r+=4;let o=t.getUint32(r,!0);r+=4;let s=t.getUint32(r,!0);r+=4;let a=new Map;for(let f of n??[])a.set(f.styleID,f);let l=[];for(let f=0;f<i;f++){let d=t.getUint32(r,!0);r+=4;let p=t.getFloat32(r,!0);r+=4;let g=t.getFloat32(r,!0);r+=4;let m=a.get(d),h={x:p,y:g,handleMirroring:m?.handleMirroring??"NONE"};m?.strokeCap&&(h.strokeCap=m.strokeCap),m?.strokeJoin&&(h.strokeJoin=m.strokeJoin),m?.cornerRadius!==void 0&&(h.cornerRadius=m.cornerRadius),l.push(h)}let u=[];for(let f=0;f<o;f++){r+=4;let d=t.getUint32(r,!0);r+=4;let p=t.getFloat32(r,!0);r+=4;let g=t.getFloat32(r,!0);r+=4;let m=t.getUint32(r,!0);r+=4;let h=t.getFloat32(r,!0);r+=4;let T=t.getFloat32(r,!0);r+=4,u.push({start:d,end:m,tangentStart:{x:p,y:g},tangentEnd:{x:h,y:T}})}let c=[];for(let f=0;f<s;f++){let d=(t.getUint32(r,!0)&1)===1?"NONZERO":"EVENODD";r+=4;let p=t.getUint32(r,!0);r+=4;let g=[];for(let m=0;m<p;m++){let h=t.getUint32(r,!0);r+=4;let T=[];for(let y=0;y<h;y++)T.push(t.getUint32(r,!0)),r+=4;g.push(T)}c.push({windingRule:d,loops:g})}return{vertices:l,segments:u,regions:c}}function DT(e){return e==="ODD"||e==="EVENODD"?"EVENODD":"NONZERO"}function RT(e,n){let t=n?.regions??[];return e.length===t.length?e.map((r,i)=>({...r,windingRule:t[i].windingRule})):e.length===1&&t.length>0&&t.every(r=>r.windingRule===t[0].windingRule)?[{...e[0],windingRule:t[0].windingRule}]:e}function MT(e,n){let t=e.vectorData;if(t?.vectorNetworkBlob===void 0)return null;let r=t.vectorNetworkBlob;if(r<0||r>=n.length)return null;try{let i=Vd(n[r],t.styleOverrideTable),o=t.normalizedSize,s=e.size?.x??0,a=e.size?.y??0,l=o&&o.x>0&&s>0?s/o.x:1,u=o&&o.y>0&&a>0?a/o.y:1;if(l!==1||u!==1){for(let c of i.vertices)c.x*=l,c.y*=u;for(let c of i.segments)c.tangentStart={x:c.tangentStart.x*l,y:c.tangentStart.y*u},c.tangentEnd={x:c.tangentEnd.x*l,y:c.tangentEnd.y*u}}return i}catch{return null}}function PT(e){let n=new Map;for(let t of e??[])t.fillPaints&&t.fillPaints.length>0&&n.set(t.styleID,dr(t.fillPaints));return n}function wT(e){let n=e.vectorData;return PT(n?.styleOverrideTable)}function md(e,n,t){if(!e||e.length===0)return[];let r=[];for(let i of e){if(i.commandsBlob===void 0||i.commandsBlob<0||i.commandsBlob>=n.length)continue;let o=n[i.commandsBlob];if(o.length===0)continue;let s=i.styleID?t?.get(i.styleID):void 0;r.push({windingRule:DT(i.windingRule),commandsBlob:o,fills:s&&s.length>0?He(s):void 0})}return r}function kT(e){let n={},t=e.variableModeBySetMap;for(let r of t?.entries??[]){let i=r.variableSetID?.guid,o=r.variableModeID;!i||!o||(n[k(i)]=k(o))}return n}var LT={DOCUMENT:"DOCUMENT",VARIABLE:"VARIABLE",CANVAS:"CANVAS",FRAME:"FRAME",RECTANGLE:"RECTANGLE",ROUNDED_RECTANGLE:"ROUNDED_RECTANGLE",ELLIPSE:"ELLIPSE",TEXT:"TEXT",LINE:"LINE",STAR:"STAR",REGULAR_POLYGON:"POLYGON",VECTOR:"VECTOR",BOOLEAN_OPERATION:"BOOLEAN_OPERATION",GROUP:"GROUP",SECTION:"SECTION",COMPONENT:"COMPONENT",COMPONENT_SET:"COMPONENT_SET",INSTANCE:"INSTANCE",SYMBOL:"COMPONENT",CONNECTOR:"CONNECTOR",SHAPE_WITH_TEXT:"SHAPE_WITH_TEXT",TEXT_PATH:"TEXT"};function _T(e){return e?LT[e]??"RECTANGLE":"RECTANGLE"}function VT(e){if(e.type!=="BOOLEAN_OPERATION")return;let n=e.booleanOperation;switch(n){case"SUBTRACT":case"INTERSECT":return n;case"EXCLUDE":case"XOR":return"EXCLUDE";default:return"UNION"}}function FT(e){switch(e){case"HORIZONTAL":return"HORIZONTAL";case"VERTICAL":return"VERTICAL";default:return"NONE"}}function gd(e){switch(e){case"RESIZE_TO_FIT":case"RESIZE_TO_FIT_WITH_IMPLICIT_SIZE":return"HUG";default:return"FIXED"}}function GT(e){switch(e){case"CENTER":return"CENTER";case"MAX":return"MAX";case"SPACE_BETWEEN":case"SPACE_EVENLY":return"SPACE_BETWEEN";default:return"MIN"}}function BT(e){switch(e){case"CENTER":return"CENTER";case"MAX":return"MAX";case"STRETCH":return"STRETCH";case"BASELINE":return"BASELINE";default:return"MIN"}}function UT(e){switch(e){case"MIN":return"MIN";case"CENTER":return"CENTER";case"MAX":return"MAX";case"STRETCH":return"STRETCH";case"BASELINE":return"BASELINE";default:return"AUTO"}}function hd(e){switch(e){case"CENTER":return"CENTER";case"MAX":return"MAX";case"STRETCH":return"STRETCH";case"SCALE":return"SCALE";default:return"MIN"}}function zT(e){return e?{startingAngle:e.startingAngle??0,endingAngle:e.endingAngle??2*Math.PI,innerRadius:e.innerRadius??0}:null}function HT(e){let n=e.size?.x??100,t=e.size?.y??100,r=e.transform?.m02??0,i=e.transform?.m12??0,o=0,s=!1;if(e.transform){let a=e.transform;a.m00*a.m11-a.m01*a.m10<0&&(s=!0),o=Math.atan2(a.m10,s?a.m11:a.m00)*(180/Math.PI);let l=o*Math.PI/180,u=Math.cos(l),c=Math.sin(l),f=n/2,d=t/2,p=s?-u:u,g=s?c:-c,m=c,h=u;r=a.m02-f+p*f+g*d,i=a.m12-d+m*f+h*d}return{x:r,y:i,width:n,height:t,rotation:o,flipX:s,flipY:!1}}function WT(e){return{cornerRadius:e.cornerRadius??0,topLeftRadius:e.rectangleTopLeftCornerRadius??e.cornerRadius??0,topRightRadius:e.rectangleTopRightCornerRadius??e.cornerRadius??0,bottomRightRadius:e.rectangleBottomRightCornerRadius??e.cornerRadius??0,bottomLeftRadius:e.rectangleBottomLeftCornerRadius??e.cornerRadius??0,independentCorners:e.rectangleCornerRadiiIndependent??!1,cornerSmoothing:e.cornerSmoothing??0}}function XT(e){let n={};return e.count!==void 0&&(n.pointCount=Ai(e.count,Us.min,Us.max)),e.starInnerScale!==void 0&&Number.isFinite(e.starInnerScale)&&(n.starInnerRadius=Ai(e.starInnerScale,0,1)),n}function jT(e){if(!e.lineHeight||wd(e.lineHeight))return null;let n=e.derivedTextData?.baselines?.[0]?.lineHeight;return e.lineHeight.units==="PIXELS"&&n!==void 0&&Number.isFinite(n)&&n<e.lineHeight.value?n:kd(e.lineHeight,e.fontSize)}function KT(e){return{textDecoration:Pd(e.textDecoration),textDecorationStyle:e.textDecorationStyle??"SOLID",textDecorationThickness:e.textDecorationThickness?.value??null,textDecorationFills:dr(e.textDecorationFillPaints),textDecorationSkipInk:e.textDecorationSkipInk??!0,textUnderlineOffset:e.textUnderlineOffset?.value??null}}function YT(e){return{textParagraphs:xT(e.textData?.lines,e.textData?.styleOverrideTable),listSpacing:e.listSpacing??0,paragraphSpacing:e.paragraphSpacing??0,paragraphIndent:e.paragraphIndent??0,hangingList:e.hangingList??!1}}function $T(e,n){return{text:e.textData?.characters??"",fontSize:e.fontSize??14,fontFamily:e.fontName?.family??ft,fontWeight:Ni(e.fontName?.style??""),italic:e.fontName?.style.toLowerCase().includes("italic")??!1,textAlignHorizontal:e.textAlignHorizontal??"LEFT",textAlignVertical:e.textAlignVertical??"TOP",textAutoResize:e.textAutoResize??"NONE",textCase:e.textCase??"ORIGINAL",...KT(e),leadingTrim:e.leadingTrim??"NONE",lineHeight:jT(e),letterSpacing:Ld(e.letterSpacing,e.fontSize),maxLines:e.maxLines??null,...YT(e),styleRuns:CT(e),fontVariations:Ed(e),fontFeatures:bd(e),textTruncation:e.textTruncation==="ENDING"?"ENDING":"DISABLED",textDirection:_e(e,ze.textDirection)??"AUTO",...qT(e,n)}}function qT(e,n){let t=e.derivedTextData?.layoutSize;return{derivedLayout:t?{width:t.x,height:t.y}:null,derivedTextGlyphs:wv(e.derivedTextData,n,e.textData?.characters??"")}}function JT(e){let n=e.stackPadding??0;return{paddingTop:e.stackVerticalPadding??n,paddingBottom:e.stackPaddingBottom??n,paddingLeft:e.stackHorizontalPadding??n,paddingRight:e.stackPaddingRight??n}}function ZT(e,n,t,r){let i=t==="HUG"||r==="HUG",o=(e.fillPaints?.some(s=>s.visible!==!1)??!1)||(e.strokePaints?.some(s=>s.visible!==!1)??!1);if(!(n==="NONE"||!i||!o))return{x:e.transform?.m02??0,y:e.transform?.m12??0,width:e.size?.x??100,height:e.size?.y??100}}function yd(e,n){let t=e?.value?.[n];return typeof t=="number"&&Number.isFinite(t)&&t>0?t:null}function Id(e,n){let t=e?.value?.[n];return typeof t=="number"&&Number.isFinite(t)&&t>=0?t:null}function QT(e){let n=e.targetAspectRatio?.value;return!n||!Number.isFinite(n.x)||!Number.isFinite(n.y)?null:{x:n.x,y:n.y}}function eS(e){let n=FT(e.stackMode),t=e.stackPrimarySizing===void 0&&(n==="HORIZONTAL"||n==="VERTICAL")?"HUG":gd(e.stackPrimarySizing),r=gd(e.stackCounterSizing),i=ZT(e,n,t,r);return{layoutMode:n,itemSpacing:e.stackSpacing??0,...JT(e),primaryAxisSizing:t,counterAxisSizing:r,primaryAxisAlign:GT(e.stackPrimaryAlignItems??e.stackJustify),counterAxisAlign:BT(e.stackCounterAlignItems??e.stackCounterAlign),layoutWrap:e.stackWrap==="WRAP"?"WRAP":"NO_WRAP",counterAxisSpacing:e.stackCounterSpacing??0,layoutPositioning:e.stackPositioning==="ABSOLUTE"?"ABSOLUTE":"AUTO",layoutGrow:e.stackChildPrimaryGrow??0,layoutAlignSelf:UT(e.stackChildAlignSelf),counterAxisAlignContent:e.stackCounterAlignContent==="SPACE_BETWEEN"?"SPACE_BETWEEN":"AUTO",itemReverseZIndex:e.stackReverseZIndex??!1,strokesIncludedInLayout:e.strokesIncludedInLayout??!1,layoutDirection:_e(e,ze.layoutDirection)??"AUTO",...i?{derivedLayout:i}:{}}}function nS(e){return e.strokeCap??"NONE"}function tS(e,n){return e.strokeJoin??n?.vertices.find(t=>t.strokeJoin)?.strokeJoin??"MITER"}function vd(e){return e==="FILL"||e==="TEXT"||e==="EFFECT"||e==="GRID"?e:null}function rS(e){return Array.isArray(e)?structuredClone(e):[]}function iS(e,n){if(e.type!=="TEXT_PATH")return null;let t=e.vectorData,r=t?.vectorNetworkBlob,i=t?.normalizedSize;if(typeof r!="number"||!i||i.x<=0||i.y<=0)return null;let o=n[r],s=e.textPathStart;try{return{network:Vd(o,t.styleOverrideTable),normalizedSize:{x:i.x,y:i.y},tValue:s?.tValue??0,forward:s?.forward??!0}}catch{return null}}function oS(e,n){let t=MT(e,n),r=nS(e),i=tS(e,t);return{vectorNetwork:t,fillGeometry:RT(md(e.fillGeometry,n,wT(e)),t),strokeGeometry:md(e.strokeGeometry,n),arcData:zT(e.arcData),strokeCap:r,strokeJoin:i,dashPattern:e.dashPattern??[],borderTopWeight:e.borderTopWeight??0,borderRightWeight:e.borderRightWeight??0,borderBottomWeight:e.borderBottomWeight??0,borderLeftWeight:e.borderLeftWeight??0,independentStrokeWeights:e.borderStrokeWeightsIndependent??!1,strokeMiterLimit:e.miterLimit??Xr}}function sS(e){let n=_T(e.type);return n==="FRAME"&&gS(e)||_e(e,ze.nodeType)==="COMPONENT_SET"?"COMPONENT_SET":n==="FRAME"&&e.resizeToFit===!0&&(e.stackMode===void 0||e.stackMode==="NONE")?"GROUP":n}function Gi(e,n,t="source"){let r=sS(e),i=oS(e,n),o=iS(e,n),s={nodeType:r,name:e.name??r,source:t==="source"?yS(e,n):hS(e),...HT(e),opacity:e.opacity??1,visible:e.visible??!0,locked:e.locked??!1,internalOnly:e.internalOnly===!0||vd(e.styleType)!==null,blendMode:e.blendMode??"PASS_THROUGH",booleanOperation:VT(e),fills:dr(e.fillPaints),strokes:Hv(e.strokePaints,e.strokeWeight,e.strokeAlign,i.strokeCap,i.strokeJoin,e.dashPattern??[]),strokeWeight:e.strokeWeight??jr,strokeAlign:Cd(e.strokeAlign),effects:Wv(e.effects),layoutGrids:rS(e.layoutGrids),guides:Mv(e.guides),fillStyleId:jn(e.styleIdForFill),strokeStyleId:jn(e.styleIdForStrokeFill),textStyleId:jn(e.styleIdForText),effectStyleId:jn(e.styleIdForEffect),gridStyleId:jn(e.styleIdForGrid),sharedStyleType:vd(e.styleType),...WT(e),...XT(e),...$T(e,n),horizontalConstraint:hd(e.horizontalConstraint),verticalConstraint:hd(e.verticalConstraint),...eS(e),...i,minWidth:yd(e.minSize,"x"),maxWidth:Id(e.maxSize,"x"),minHeight:yd(e.minSize,"y"),maxHeight:Id(e.maxSize,"y"),targetAspectRatio:QT(e),isMask:e.mask??!1,maskType:e.maskType??"ALPHA",maskIsOutline:e.maskIsOutline??!1,expanded:!0,autoRename:e.autoRename??!0,boundVariables:uT(e),variableAssignmentScales:Ia(),variableBindingScales:tT(e),variableModes:kT(e),exportSettings:dT(e),pluginData:Fi(e),librarySource:pT(e),pluginRelaunchData:mT(e),clipsContent:e.frameMaskDisabled===!1&&e.resizeToFit!==!0,componentId:SS(e),componentPropertyDefinitions:r==="INSTANCE"?[]:Gd(e),componentPropertyReferences:uS(e),componentPropertyAssignments:fS(e),componentPropertyValues:dS(e),...mS(e)};Kv(s,o);let a=lT(e);return a&&s.textPathBox&&(s.textPathBox={x:a.x+s.textPathBox.x,y:a.y+s.textPathBox.y,width:a.width,height:a.height}),s}var aS={VARIANT:"VARIANT",TEXT:"TEXT",BOOL:"BOOLEAN",BOOLEAN:"BOOLEAN",INSTANCE_SWAP:"INSTANCE_SWAP",SLOT:"SLOT"};function Fd(e){if(!e||typeof e!="object")return"";let n=e;return typeof n.boolValue=="boolean"?String(n.boolValue):typeof n.textValue=="string"?n.textValue:n.textValue&&typeof n.textValue=="object"?n.textValue.characters??"":n.guidValue?k(n.guidValue):""}function lS(e){let n={allowPreferredValuesOnly:e.allowPreferredValuesOnly??!1,displayEmptyByDefault:e.displayByDefault??!1,stretchChildOnInsert:e.stretchChildOnInsert??!1};return e.minChildren!==void 0&&(n.minChildren=e.minChildren),e.maxChildren!==void 0&&(n.maxChildren=e.maxChildren),n}function Gd(e){let n=e.componentPropDefs;if(!n?.length)return[];let t=[];for(let r of n){if(!r.id||!r.name)continue;let i=aS[r.type??""]??"VARIANT",o={id:k(r.id),name:r.name,type:i,defaultValue:Fd(r.initialValue),variantOptions:i==="VARIANT"?r.preferredValues?.stringValues:void 0,preferredValues:i==="INSTANCE_SWAP"||i==="SLOT"?r.preferredValues?.instanceSwapValues?.map(s=>s.key).filter(s=>s!==void 0):void 0};r.description&&(o.description=r.description),i==="SLOT"&&r.slotPropConfig&&(o.slotSettings=lS(r.slotPropConfig)),t.push(o)}return t}function uS(e){let n=e.componentPropRefs;if(!n?.length)return[];let t={0:"VISIBLE",1:"TEXT",2:"INSTANCE_SWAP",4:"SLOT_CONTENT",VISIBLE:"VISIBLE",TEXT_DATA:"TEXT",OVERRIDDEN_SYMBOL_ID:"INSTANCE_SWAP",SLOT_CONTENT_ID:"SLOT_CONTENT"};return n.flatMap(r=>{let i=t[String(r.componentPropNodeField)];return r.defID&&i&&!r.isDeleted?[{propertyId:k(r.defID),field:i}]:[]})}function cS(e){if(e.value&&(e.value.boolValue!==void 0||e.value.textValue!==void 0||e.value.guidValue!==void 0))return Fd(e.value);let n=e.varValue?.value;return n?.symbolIdValue?.guid?k(n.symbolIdValue.guid):n?.boolValue!==void 0?String(n.boolValue):n?.textValue!==void 0?n.textValue:n?.textDataValue?.characters??""}function fS(e){let n=e.componentPropAssignments;return n?.length?Object.fromEntries(n.flatMap(t=>t.defID?[[k(t.defID),cS(t)]]:[])):{}}function Bd(e){let n=e.variantPropSpecs;return n?.length?n.filter(t=>!!t.propDefId).map(t=>({propDefId:k(t.propDefId),value:t.value??""})):[]}function dS(e){let n=Bd(e),t=new Map(Gd(e).map(i=>[i.id,i.name]));if(n.length>0&&t.size>0){let i={};for(let o of n)i[t.get(o.propDefId)??o.propDefId]=o.value;return i}let r=e.name;return r?.includes("=")?Of(r):{}}function Td(e){if(!e||typeof e!="object")return null;let n=e;if(typeof n.sessionID!="number"||typeof n.localID!="number")return null;let t={sessionID:n.sessionID,localID:n.localID};return Hn(t)?null:k(t)}function Vi(e){return typeof e=="string"?e:null}function pS(e){return typeof e=="string"?e:""}function fa(e){return typeof e=="boolean"?e:!1}function mS(e){let n=e.symbolLinks??[];return{componentKey:Vi(e.componentKey),sourceLibraryKey:Vi(e.sourceLibraryKey),publishId:Td(e.publishID),overrideKey:Td(e.overrideKey),sharedSymbolVersion:Vi(e.sharedSymbolVersion),publishedVersion:Vi(e.publishedVersion),isPublishable:fa(e.isPublishable),isSymbolPublishable:fa(e.isSymbolPublishable),isExposedInstance:fa(e.propsAreBubbled),symbolDescription:pS(e.symbolDescription),symbolLinks:n.filter(t=>typeof t.uri=="string").map(t=>({uri:t.uri,displayName:t.displayName,displayText:t.displayText})),variantPropSpecs:Bd(e)}}function gS(e){let n=e.componentPropDefs;return n?.length?n.some(t=>t.type==="VARIANT"):!1}function Ud(e){return{stackMode:e.stackMode,stackSpacing:e.stackSpacing,stackPadding:e.stackPadding,stackPaddingRight:e.stackPaddingRight,stackPaddingBottom:e.stackPaddingBottom,stackCounterAlign:e.stackCounterAlign,stackJustify:e.stackJustify,stackCounterAlignItems:e.stackCounterAlignItems,stackPrimaryAlignItems:e.stackPrimaryAlignItems,stackPrimarySizing:e.stackPrimarySizing,stackCounterSizing:e.stackCounterSizing,stackVerticalPadding:e.stackVerticalPadding,stackHorizontalPadding:e.stackHorizontalPadding,stackWrap:e.stackWrap,stackPositioning:e.stackPositioning,stackChildPrimaryGrow:e.stackChildPrimaryGrow,stackChildAlignSelf:e.stackChildAlignSelf,stackCounterSpacing:e.stackCounterSpacing,bordersTakeSpace:e.bordersTakeSpace,stackReverseZIndex:e.stackReverseZIndex}}function hS(e){let n=Dn();return n.fig.layout=Ud(e),n}function yS(e,n){return{format:"fig",id:e.guid?k(e.guid):null,orderKey:e.parentIndex?.position??null,editedFields:[],fig:{...vS(e,n),...TS(e,n),layout:Ud(e)}}}function St(e,n){if(e instanceof Uint8Array)return e;if(Array.isArray(e))return e.map(r=>St(r,n));if(!e||typeof e!="object")return e;let t={};for(let[r,i]of Object.entries(e))if((r==="commandsBlob"||r==="vectorNetworkBlob")&&typeof i=="number"){let o=n[i];o==null?t[r]=i:t[r]={__openPencilFigmaBlob:o instanceof Uint8Array?o:new Uint8Array(Object.values(o))}}else t[r]=St(i,n);return t}var IS=["styleIdForFill","styleIdForStrokeFill","styleIdForText","styleIdForEffect","styleIdForGrid","styleType","componentPropAssignments","backgroundPaints","layoutGrids","exportSettings","componentPropDefs","componentPropRefs","variantPropSpecs","stateGroupPropertyValueOrders","isStateGroup","version","sourceLibraryKey","userFacingVersion","description","key","sortPosition","detachedSymbolId","documentColorProfile","variableConsumptionMap","variableModeBySetMap","parameterConsumptionMap","editInfo","backgroundColor","blendMode","pageType","isPageDivider","guides","handoffStatusMap","annotationCategories","miterLimit","mask","maskType","maskIsOutline","strokeWeight","strokeJoin","borderStrokeWeightsIndependent","borderTopWeight","borderRightWeight","borderBottomWeight","borderLeftWeight","minSize","maxSize","gridRows","gridColumns","gridRowAnchor","gridColumnAnchor","gridColumnsSizing","gridRowsSizing","gridChildVerticalAlign","gridChildHorizontalAlign","textAutoResize","textAlignHorizontal","textAlignVertical","textData","lineHeight","fontName","fontSize","letterSpacing","textTracking","fontVersion","textUserLayoutVersion","textExplicitLayoutVersion","fontVariations","fontVariantCommonLigatures","fontVariantContextualLigatures","toggledOnOTFeatures","toggledOffOTFeatures","leadingTrim","textDecorationFillPaints","textUnderlineOffset","textDecorationThickness","textDecorationStyle","semanticWeight","semanticItalic","maxLines","textPathStart","derivedTextData","fillPaints","strokePaints","effects","sectionStatusInfo","prototypeStartNodeID","prototypeInteractions","transitionInfo","codeSyntax","lockMode","slideThemeMap","isSoftDeleted","brushType","scatterStrokeSettings","vectorOperationVersion","vectorData","fillGeometry","strokeGeometry"];function vS(e,n){let t={};for(let r of IS){let i=e[r];i!==void 0&&(t[r]=St(i,n))}return{rawSize:e.size?{...e.size}:null,rawTransform:e.transform?{...e.transform}:null,rawNodeFields:t}}function TS(e,n){let t=e.symbolData;return{symbolOverrides:St(t?.symbolOverrides??[],n),componentPropAssignments:St(e.componentPropAssignments??[],n),derivedSymbolData:St(e.derivedSymbolData??[],n),derivedSymbolDataLayoutVersion:typeof e.derivedSymbolDataLayoutVersion=="number"?e.derivedSymbolDataLayoutVersion:null,uniformScaleFactor:typeof t?.uniformScaleFactor=="number"?t.uniformScaleFactor:null}}function SS(e){let n=e.symbolData;return n?.symbolID?k(n.symbolID):""}var da={guid:{...Ci}},hr={name:{scene:["name"],kind:"scalar"},opacity:{scene:["opacity"],kind:"scalar"},fontSize:{scene:["fontSize"],kind:"scalar",length:!0},visible:{scene:["visible"],kind:"visible"},textData:{scene:["text","styleRuns","textParagraphs"],kind:"text"},styleIdForText:{scene:["textStyleId"],kind:"text-style"},fillPaints:{scene:["fills"],kind:"paint"},strokePaints:{scene:["strokes"],kind:"paint"},size:{scene:["width","height"],kind:"size",length:!0},stackSpacing:{scene:["itemSpacing"],kind:"layout-distance",length:!0},stackCounterSpacing:{scene:["counterAxisSpacing"],kind:"layout-distance",length:!0},stackHorizontalPadding:{scene:["paddingLeft"],kind:"layout-distance",length:!0},stackVerticalPadding:{scene:["paddingTop"],kind:"layout-distance",length:!0},stackPaddingRight:{scene:["paddingRight"],kind:"layout-distance",length:!0},stackPaddingBottom:{scene:["paddingBottom"],kind:"layout-distance",length:!0},textAutoResize:{scene:["textAutoResize"],kind:"layout-mode"},stackChildPrimaryGrow:{scene:["layoutGrow"],kind:"layout-mode"},stackPrimarySizing:{scene:["primaryAxisSizing"],kind:"layout-mode"},stackCounterSizing:{scene:["counterAxisSizing"],kind:"layout-mode"},stackChildAlignSelf:{scene:["layoutAlignSelf"],kind:"layout-mode"},cornerRadius:{scene:["cornerRadius"],kind:"node",length:!0,absent:0},rectangleTopLeftCornerRadius:{scene:["topLeftRadius"],kind:"node",length:!0,absent:0},rectangleTopRightCornerRadius:{scene:["topRightRadius"],kind:"node",length:!0,absent:0},rectangleBottomRightCornerRadius:{scene:["bottomRightRadius"],kind:"node",length:!0,absent:0},rectangleBottomLeftCornerRadius:{scene:["bottomLeftRadius"],kind:"node",length:!0,absent:0},rectangleCornerRadiiIndependent:{scene:["independentCorners"],kind:"node",absent:!1},cornerSmoothing:{scene:["cornerSmoothing"],kind:"node",absent:0},strokeWeight:{scene:["strokeWeight"],kind:"node",length:!0},strokeAlign:{scene:["strokeAlign"],kind:"node",absent:"CENTER"},borderTopWeight:{scene:["borderTopWeight"],kind:"node",length:!0},borderRightWeight:{scene:["borderRightWeight"],kind:"node",length:!0},borderBottomWeight:{scene:["borderBottomWeight"],kind:"node",length:!0},borderLeftWeight:{scene:["borderLeftWeight"],kind:"node",length:!0},borderStrokeWeightsIndependent:{scene:["independentStrokeWeights"],kind:"node",absent:!1},strokeCap:{scene:["strokeCap"],kind:"node",absent:"NONE"},strokeJoin:{scene:["strokeJoin"],kind:"node",absent:"MITER"},miterLimit:{scene:["strokeMiterLimit"],kind:"node"},dashPattern:{scene:["dashPattern"],kind:"node",length:!0,absent:[]},blendMode:{scene:["blendMode"],kind:"node",absent:"PASS_THROUGH"},effects:{scene:["effects"],kind:"node",absent:[]},locked:{scene:["locked"],kind:"node",absent:!1},layoutGrids:{scene:["layoutGrids"],kind:"node",absent:[]},styleIdForFill:{scene:["fillStyleId"],kind:"node",absent:da},styleIdForStrokeFill:{scene:["strokeStyleId"],kind:"node",absent:da},styleIdForEffect:{scene:["effectStyleId"],kind:"node",absent:da},stackPrimaryAlignItems:{scene:["primaryAxisAlign"],kind:"node"},stackCounterAlignItems:{scene:["counterAxisAlign"],kind:"node"},stackPositioning:{scene:["layoutPositioning"],kind:"node"},fontName:{scene:["fontFamily","fontWeight","italic"],kind:"node"},fontVariations:{scene:["fontVariations"],kind:"node",absent:[]},lineHeight:{scene:["lineHeight"],kind:"node",absent:{value:100,units:"PERCENT"}},letterSpacing:{scene:["letterSpacing"],kind:"node"},paragraphSpacing:{scene:["paragraphSpacing"],kind:"node",length:!0,absent:0},textCase:{scene:["textCase"],kind:"node",absent:"ORIGINAL"},textDecoration:{scene:["textDecoration"],kind:"node",absent:"NONE"},textAlignHorizontal:{scene:["textAlignHorizontal"],kind:"node"},textAlignVertical:{scene:["textAlignVertical"],kind:"node"},textTruncation:{scene:["textTruncation"],kind:"node",absent:"DISABLED"},maxLines:{scene:["maxLines"],kind:"node"}},zd=Object.entries(hr),RL=new Map(Object.entries(ws(zd.flatMap(([e,n])=>n.scene.map(t=>({scene:t,raw:e,field:n}))),e=>e.scene)).map(([e,n])=>[e,n.map(({raw:t,field:r})=>({raw:t,field:r}))]));function Hd(e){return zd.flatMap(([n,t])=>t.kind===e?[n]:[])}Hd("scalar");var Wd=Object.fromEntries(Hd("layout-distance").map(e=>[hr[e].scene[0],e])),Xd=["componentKey","sourceLibraryKey","publishID","publishedVersion","sharedSymbolVersion","isSymbolPublishable","variantPropSpecs","componentPropDefs","overrideKey"];function Mn(e){return e.symbolData}function Kn(e){return Mn(e)?.symbolOverrides??[]}function jd(e){return e.derivedSymbolData??[]}function Bi(e){return Mn(e)?.uniformScaleFactor??1}function bt(e,n,t){n(e,t);for(let r of Kn(e))bt(r,n,r)}function Ui(e){let n=e?.slotContentIdValue?.guid;if(n)return Hn(n)?void 0:n}var{shader:ML}=ze;var{token:Kd,modeConditions:Yd,modeAttribute:$d}=ze;function va(e){return Jo(e,[Kd,Yd,$d])}function bS(e){return ri(e)?void 0:e}function ES(e,n){return typeof e=="number"&&Math.fround(e)===Math.fround(n)}function qd(e,n){let t=_e(e,Kd)??{},r=Object.entries(t.expressions??{}).filter(([i,o])=>ES(n[i],o.resolved));return{unit:t.unit,expressions:bS(Object.fromEntries(r))}}function Jd(e){return _e(e,Yd)??{}}function Zd(e){return _e(e,$d)}var AS=e=>Zo.includes(e),NS=e=>Qo.includes(e);function CS(e){let n=(e.codeSyntax?.entries??[]).flatMap(({platform:t,value:r})=>NS(t)&&r?[[t,r]]:[]);return n.length>0?Object.fromEntries(n):void 0}function Qd(e){let n=e.variableScopes?.filter(AS),t=va(Fi(e)),r={description:e.description??e.symbolDescription??"",hiddenFromPublishing:e.isPublishable===!1,scopes:n?.length?n:void 0,codeSyntax:CS(e),pluginData:t.length>0?t:void 0};return typeof e.key=="string"&&(r.key=e.key),typeof e.version=="string"&&(r.version=e.version),r}function ip(e){return e.layoutScale??1}function OS(e){return Ia(e.mainComponentId!==null?ip(e):1)}function xS(e,n,t){for(let r of rn(t)){if(r.variableData&&!["ALIAS","EXPRESSION"].includes(r.variableData.dataType??""))continue;let i=r.variableField&&mr[r.variableField];i&&(le(e.instanceOverrides,e.id,n.id,`boundVariables/${i}`,n.boundVariables[i]??null),le(e.instanceOverrides,e.id,n.id,"boundVariables"))}}function DS(e,n){op(e,n,Bi(n))}function op(e,n,t=1){for(let r of rn(n)){let i=r.variableField&&mr[r.variableField];if(!i)continue;e.variableBindingScales??={};let o=pr(r.variableData),s=o?.reference?o.multiplier:1,a=i==="opacity"?.01:1,l=r.variableData?.value?.expressionValue&&i!=="opacity"&&i!=="rotation";e.variableBindingScales[i]=s*a/(l?t:1)}}function sp(e,n,t){let r=[],i=(o,s)=>{if(t(o)){r.push({match:o,top:s});return}if(!n.isInstance(o))for(let a of n.childrenOf(o))i(a,s)};for(let o of e)i(o,o);return r.length===1?{count:1,...r[0]}:{count:r.length}}function*ap(e,n){yield e;for(let t of n(e))yield*ap(t,n)}function Yn(e){return e.guid?k(e.guid):void 0}function $n(e){return e.parentIndex?.guid?k(e.parentIndex.guid):void 0}function Aa(e,n){let t=e.parentIndex?.position??"",r=n.parentIndex?.position??"";return t===r?0:t<r?-1:1}function Hi(e){let n=new Map,t=new Map;for(let r of e){let i=Yn(r);if(i===void 0)continue;if(n.has(i))throw new Error(`Duplicate source node ${i}`);n.set(i,r);let o=$n(r);if(o===void 0)continue;let s=t.get(o);s?s.push(r):t.set(o,[r])}for(let r of t.values())r.sort(Aa);return{sources:n,children:t}}function Ve(e,n){return e?.sessionID===n.sessionID&&e.localID===n.localID}function ba(e){if(!e||typeof e!="object"||!("sessionID"in e)||!("localID"in e)||typeof e.sessionID!="number"||typeof e.localID!="number")return;let n={sessionID:e.sessionID,localID:e.localID};return Hn(n)?void 0:n}function Na(e,n){return Ve(e.guid,n)||Ve(ba(e.overrideKey),n)}function RS({children:e}){return{childrenOf:n=>e.get(Yn(n)??"")??[],isInstance:n=>n.symbolData?.symbolID!==void 0}}function lp(e,n,t){let{count:r,match:i,top:o}=sp(e.children.get(n)??[],RS(e),s=>Na(s,t));return{count:r,record:i,topChild:o}}function ep(e,n,t){let r=k(n);for(let[i,o]of t.entries()){let s=e.sources.get(r);if(!s)return!1;if(i===0&&Na(s,o))continue;let{record:a}=lp(e,r,o);if(!a)return!1;if(i===t.length-1)return!0;if(!a.symbolData?.symbolID)return!1;r=k(a.symbolData.symbolID)}return!1}function MS(e,n){let t=n,r=new Set;for(;!r.has(t);){r.add(t);let i=e.sources.get(t);if(i?.type!=="INSTANCE"||!i.symbolData?.symbolID)return t;t=k(i.symbolData.symbolID)}return t}function PS(e){let n=e.value;if(n&&(n.boolValue!==void 0||n.textValue!==void 0||n.guidValue!==void 0||n.textDataValue!==void 0))return n;let t=e.varValue?.value;if(t?.symbolIdValue?.guid)return{guidValue:t.symbolIdValue.guid};if(t?.boolValue!==void 0)return{boolValue:t.boolValue};if(t?.textValue!==void 0)return{textValue:t.textValue};if(t?.textDataValue!==void 0)return{textDataValue:t.textDataValue};if(t?.slotContentIdValue)return{slotContentIdValue:t.slotContentIdValue}}function wS(e,n,t){let r=structuredClone([...e]);for(let i of n){let o=PS(i);if(!i.defID||!o)continue;let s={id:i.defID,value:structuredClone(o),origin:"assignment",...t===void 0?{}:{rank:t}},a=r.findIndex(u=>Ve(u.id,s.id));if(a===-1){r.push(s);continue}let l=r[a];r[a]={...s,superseded:[...l.superseded??[],structuredClone(l.value)]}}return r}function kS(e){return(e.componentPropDefs??[]).flatMap(n=>n.id&&n.initialValue?[{id:n.id,value:structuredClone(n.initialValue),origin:"default"}]:[])}function LS(e,n,t){let r=cr(e),i=e.componentPropRefs;for(let o of i??[]){if(!o.defID||o.isDeleted)continue;let s=n.find(c=>Ve(c.id,o.defID));if(!s)continue;let{value:a,origin:l}=s,u=c=>{t?.({definitionId:structuredClone(s.id),field:c,origin:l},s)};if(o.componentPropNodeField==="VISIBLE"&&a.boolValue!==void 0)r.visible=a.boolValue,u("visible");else if(o.componentPropNodeField==="TEXT_DATA"){let c=typeof a.textValue=="string"?a.textValue:a.textValue?.characters??a.textDataValue?.characters;c!==void 0&&(c!==r.textData?.characters&&(r.derivedTextData=void 0),r.textData={...r.textData,characters:c},u("textData"))}else o.componentPropNodeField==="OVERRIDDEN_SYMBOL_ID"&&a.guidValue?(r.symbolData={...r.symbolData,symbolID:a.guidValue},u("symbolData")):o.componentPropNodeField==="SLOT_CONTENT_ID"&&a.slotContentIdValue&&u("slotContent")}return r}function _S(e,n){let t=e.properties;n.derivedTextData&&(t.derivedTextData=structuredClone(n.derivedTextData)),n.fontSize!==void 0&&(t.fontSize=n.fontSize),n.lineHeight!==void 0&&(t.lineHeight=structuredClone(n.lineHeight)),n.letterSpacing!==void 0&&(t.letterSpacing=structuredClone(n.letterSpacing)),n.size&&(t.size=structuredClone(n.size),e.derivedSize=structuredClone(n.size)),n.transform&&(t.transform=structuredClone(n.transform));let{fillGeometry:r,strokeGeometry:i,vectorData:o}=n;r&&(t.fillGeometry=structuredClone(r)),i&&(t.strokeGeometry=structuredClone(i)),o&&(t.vectorData=structuredClone(o))}function VS(e,n){let t=[],r=[];for(let i of Kn(e)){let{guidPath:o,overriddenSymbolID:s,componentPropAssignments:a,...l}=i,u=o?.guids??[];if(!u.length)continue;let c=a??[];(s||c.length)&&t.push({owner:n,declaredPath:u,path:u,swap:s,assignments:c}),Object.keys(l).length&&r.push({path:u,props:l})}return{structural:t,claims:r}}var FS={childrenOf:e=>e.children,isInstance:e=>e.mainComponentId!==null};function Wi(e){return ap(e,n=>n.children)}var GS=class extends Error{diagnostic;constructor(e,n){super(n),this.diagnostic=e,this.name="InstancePathError"}},zi=class extends Error{count;constructor(e,n){super(`Expected one instance-path target for ${k(n)}; found ${e}`),this.count=e,this.name="SegmentError"}};function np(e,n,t,r){return new GS({ownerId:e,mainComponentId:n,path:structuredClone(t),reason:r.count===0?"missing-target":"ambiguous-target"},`Override declared by ${e}, path [${t.map(k).join(", ")}]: ${r.message}`)}function up(e,n){let t=k(n),{count:r,match:i}=sp(e.children,FS,o=>Ve(o.overrideKey,n)||o.sourceId===t);if(!i)throw new zi(r,n);return i}function Ea(e,n){return Ve(e.properties.symbolData?.symbolID,n)||Ve(e.mainComponentOverrideKey,n)||Ve(e.sourceComponentOverrideKey,n)||Ve(e.sourceComponentId,n)}function cp(e,n){let t=e;for(let[r,i]of n.entries())r===0&&Ea(e,i)||(t=up(t,i));return t}function BS(e,n,t){if(!n?.properties.size||!t.size)return;let r=Bi(t);fp(e,{x:n.properties.size.x*r,y:n.properties.size.y*r},t.size)}function tp(e,n,t,r,i){let o=r-t;if(i==="SCALE"&&t>0){let s=r/t;return{position:e*s,size:n*s}}return i==="MAX"?{position:e+o,size:n}:i==="CENTER"?{position:e+o/2,size:n}:i==="STRETCH"?{position:e,size:Math.max(0,n+o)}:{position:e,size:n}}function fp(e,n,t){if(n.x===t.x&&n.y===t.y)return;let r=e.properties.stackMode&&e.properties.stackMode!=="NONE";for(let i of e.children){let o=i.properties;if(r&&o.stackPositioning!=="ABSOLUTE"||!o.size)continue;let s=o.transform??{m00:1,m01:0,m02:0,m10:0,m11:1,m12:0},a=tp(s.m02,o.size.x,n.x,t.x,o.horizontalConstraint),l=tp(s.m12,o.size.y,n.y,t.y,o.verticalConstraint),u={x:a.size,y:l.size};fp(i,o.size,u),o.size=u,o.transform={...s,m02:a.position,m12:l.position}}}var Ta=(e,n)=>({x:e.x*n,y:e.y*n});function dp(e,n){e.fontSize!==void 0&&(e.fontSize*=n);for(let r of["lineHeight","letterSpacing"]){let i=e[r];i?.units==="PIXELS"&&(e[r]={...i,value:i.value*n})}if(e.textData?.styleOverrideTable){e.textData=structuredClone(e.textData);for(let r of e.textData.styleOverrideTable??[])dp(r,n)}if(!e.derivedTextData)return;let t=structuredClone(e.derivedTextData);t.layoutSize&&(t.layoutSize=Ta(t.layoutSize,n)),t.truncatedHeight!==void 0&&(t.truncatedHeight*=n);for(let r of t.glyphs??[])r.position=Ta(r.position,n),r.fontSize*=n;for(let r of t.baselines??[])r.position=Ta(r.position,n),r.width*=n,r.lineHeight*=n,r.lineAscent*=n,r.lineY!==void 0&&(r.lineY*=n);e.derivedTextData=t}var pp=["stackPadding",...Object.values(Wd)],mp=["strokeWeight","cornerRadius","rectangleTopLeftCornerRadius","rectangleTopRightCornerRadius","rectangleBottomLeftCornerRadius","rectangleBottomRightCornerRadius"],US=["fontSize","lineHeight","letterSpacing","textData","derivedTextData"],zS=[...pp,...mp,...US,"dashPattern","effects","size","transform"];function HS(e,n){for(let t of mp){let r=e[t];typeof r=="number"&&(e[t]=r*n)}e.dashPattern&&(e.dashPattern=e.dashPattern.map(t=>t*n)),e.effects&&(e.effects=e.effects.map(t=>({...t,offset:t.offset?{x:t.offset.x*n,y:t.offset.y*n}:t.offset,radius:typeof t.radius=="number"?t.radius*n:t.radius,spread:typeof t.spread=="number"?t.spread*n:t.spread})))}function WS(e,n){let t=Bi(n);if(!Number.isFinite(t)||t<=0)throw new Error("Invalid instance uniform scale");if(t!==1){for(let r of Wi(e)){r.layoutScale=(r.layoutScale??1)*t;for(let o of Object.keys(r.variableBindingScales??{}))r.variableBindingScales&&o!=="opacity"&&o!=="rotation"&&(r.variableBindingScales[o]*=t);let i=r.properties;dp(i,t),HS(i,t);for(let o of pp){let s=i[o];typeof s=="number"&&(i[o]=s*t)}i.size&&(i.size={x:i.size.x*t,y:i.size.y*t}),i.transform&&(i.transform={...i.transform,m02:i.transform.m02*t,m12:i.transform.m12*t}),r.derivedSize&&(r.derivedSize={x:r.derivedSize.x*t,y:r.derivedSize.y*t})}for(let r of zS){let i=n[r];i!==void 0&&Object.assign(e.properties,{[r]:structuredClone(i)})}}}var XS=["fontSize","fontName","fontVariations","letterSpacing","lineHeight","textCase","textAlignHorizontal","textAlignVertical","textAutoResize","styleIdForText","fontVariantCommonLigatures","fontVariantContextualLigatures"];function jS(e,n){if("derivedTextData"in n)return;let t=n.textData;(t!==void 0&&Object.entries(t).some(([r,i])=>!he(i,e.textData?.[r]))||XS.some(r=>r in n&&!he(e[r],n[r])))&&(e.derivedTextData=void 0)}function Ca(e){return{instance:(n,t={})=>Sa(e,n,"INSTANCE",t),component:(n,t={})=>Sa(e,n,"SYMBOL",t),page:(n,t={})=>Sa(e,n,"CANVAS",t)}}function Sa(e,n,t,r){let{sources:i,children:o}=e,s=new Set,a=new WeakMap,l=new WeakMap,u=v=>{let E=i.get(v.sourceId);if(E?.type==="INSTANCE")return v.properties.name;let I=E?.parentIndex?.guid,N=I?i.get(k(I)):void 0;return N?.isStateGroup===!0?N.name:v.properties.name},c=v=>{if(!v)return[];let E=ba(i.get(k(v))?.overrideKey);return E?[v,E]:[v]},f=({boundary:v})=>v?.replaced.some(E=>ep(e,E,v.path))??!1,d=(v,E)=>{if(E.count===0&&f(v))return;let I=np(v.owner.id,v.owner.mainComponentId,v.declaredPath,E);if(E.count!==0||!r.onUnresolvedAssignment)throw I;v.owner.unresolved.push({...I.diagnostic,assignments:structuredClone(v.assignments)})},p=(v,E)=>{let I=new Map;for(let N of E){let[w]=N.path,{count:O,topChild:R}=lp(e,v,w);if(!R?.guid){d(N,new zi(O,w));continue}let W=k(R.guid),z=Na(R,w),U={...N,path:z?N.path.slice(1):N.path},G=I.get(W);G?G.push(U):I.set(W,[U])}return I},g=(v,E,I)=>{let N=v.symbolData?.symbolID;return E?[...N?[N]:[],...I].filter(w=>!Ve(w,E)):[]},m=(v,E,I,N,w)=>{let O=E.symbolData?.symbolID,R=g(v,O,I),W=[...c(v.symbolData?.symbolID),...c(O)],z=_=>W.some(Q=>Ve(Q,_)),U=[{assignments:E.componentPropAssignments??[],rank:w}],G=[],X=_=>{if(!O)throw new Error("Swap target is not an instance");Ve(O,_)||R.push(O),O=_;for(let Q of c(O))z(Q)||W.push(Q)};for(let _ of N){let Q=_.path.length===0||z(_.path[0]);if(!Q||_.path.length>1){G.push(Q?{..._,path:_.path.slice(1)}:_);continue}_.swap&&X(_.swap),_.assignments.length&&U.push({assignments:_.assignments,rank:_.owner.rank})}return{effective:O,replaced:R,groups:U,descendant:G}},h=(v,E,I,N)=>{let w=a.get(I),O=Object.fromEntries(Object.entries(N.props).filter(([R])=>{let W=w?.get(R);return W===void 0||W>=E}));Object.keys(O).length!==0&&(op(I,O),jS(I.properties,O),Object.assign(I.properties,cr(O),ya(I.properties,O)),"name"in O&&(I.hasOwnName=!0),v.propertyClaims.push({declaredBy:v.sourceId,path:structuredClone(N.path),properties:structuredClone(O)}))},T=(v,E)=>{let I=v;for(let[N,w]of E.entries()){let O=E.slice(N);if((l.get(I)??[]).some(R=>ep(e,R,O)))return!0;if(!(N===0&&Ea(I,w)))try{I=up(I,w)}catch(R){if(!(R instanceof zi))throw R;return!1}}return!1},y=(v,E)=>{try{return cp(v,E)}catch(I){if(!(I instanceof zi))throw I;let N=np(v.sourceId,v.mainComponentId,E,I);if(N.diagnostic.reason==="missing-target"&&T(v,E))return;if(!r.onUnresolvedProperty)throw N;r.onUnresolvedProperty(N.diagnostic);return}},C=(v,E)=>{if(!r.derivedBounds)return;let I=E.derivedSymbolData;for(let N of I??[]){let w=N.guidPath?.guids;if(!w?.length)continue;let O=y(v,w);!O||O===v||_S(O,N)}},L=(v,E)=>{let I=[],N=new Map,w=[],O,R=LS(v,E,(W,z)=>{if(I.push(W),z.origin==="assignment"&&z.rank!==void 0&&N.set(W.field,z.rank),W.field==="symbolData")for(let U of z.superseded??[])U.guidValue&&w.push(U.guidValue);if(W.field==="slotContent"){let U=Ui(z.value);O=U?k(U):void 0}});if(O&&!i.has(O)){if(!r.onMissingSlotContent)throw new Error(`Missing slot content ${O}`);r.onMissingSlotContent({slotId:Yn(v)??"",slotContentId:O}),O=void 0}return{source:R,claims:I,bound:N,superseded:w,slotContent:O}},M=(v,E,I,N)=>{if(s.has(v))throw new Error(`Cyclic component expansion at ${v}`);let w=i.get(v);if(!w)throw new Error(`Missing source node ${v}`);let O=L(w,E),{source:R}=O;s.add(v);try{let W={id:v,rank:N,mainComponentId:null,unresolved:[]},z=VS(R,W),U=[...z.structural,...I].sort((ne,Ee)=>Ee.owner.rank-ne.owner.rank),G=m(w,R,O.superseded,U,N),X;G.effective?X=S(W,{...G,effective:G.effective},N):O.slotContent?X=D(O.slotContent,G.descendant,N):X=x(v,R,E,G.groups,G.descendant,N);let _=H(v,w,R,G,X,O.claims);O.slotContent&&(_.slotContentId=O.slotContent),a.set(_,O.bound),X.base&&G.replaced.length&&l.set(_,G.replaced),DS(_,R);let Q=X.dangling?z.claims.filter(({path:ne})=>ne.length===1&&Ea(_,ne[0])):z.claims;K(_,X.base,R,Q,N,!X.dangling);for(let ne of W.unresolved)r.onUnresolvedAssignment?.({...ne,mainComponentId:_.mainComponentId});return _}finally{s.delete(v)}},S=(v,{effective:E,replaced:I,groups:N,descendant:w},O)=>{let R=k(E);if(!i.has(R)){if(!r.onMissingComponent)throw new Error(`Missing source node ${R}`);return r.onMissingComponent({ownerId:v.id,componentId:R}),{base:null,children:[],dangling:!0}}v.mainComponentId=MS(e,R);let W=w.map(G=>I.length?{...G,boundary:{replaced:I,path:G.path}}:G),z=N.filter(G=>G.assignments.length).map(G=>({owner:{...v,rank:G.rank},declaredPath:[],path:[],assignments:G.assignments})),U=M(k(E),[],[...z,...W],O+1);return{base:U,children:U.children}},x=(v,E,I,N,w,O)=>{let R=E.type==="SYMBOL"?N.reduce((z,U)=>wS(z,U.assignments,U.rank),kS(E)):I,W=p(v,w);return{base:null,children:(o.get(v)??[]).map(z=>{if(!z.guid)throw new Error("Indexed child has no GUID");let U=k(z.guid);return M(U,R,W.get(U)??[],O+1)})}},D=(v,E,I)=>{let N=p(v,E);return{base:null,children:(o.get(v)??[]).map(w=>{if(!w.guid)throw new Error("Indexed child has no GUID");let O=k(w.guid);return M(O,[],N.get(O)??[],I+1)})}},P=v=>{let E=Ui(v.varValue?.value);return!!E&&!i.has(k(E))},B=v=>v?{mainComponentId:v.mainComponentId??v.sourceId,mainComponentOverrideKey:v.mainComponentOverrideKey??v.overrideKey,propertyClaims:structuredClone(v.propertyClaims),variableBindingScales:{...v.variableBindingScales},hasOwnName:i.get(v.sourceId)?.type==="INSTANCE"&&v.hasOwnName}:{mainComponentId:null,mainComponentOverrideKey:void 0,propertyClaims:[],variableBindingScales:{},hasOwnName:!1},H=(v,E,I,{effective:N,replaced:w,groups:O},{base:R,children:W},z)=>{let U=E.symbolData?.symbolID,[,G]=c(U),X={sourceId:v,sourceComponentId:U,sourceComponentOverrideKey:G,...B(R),bindingClaims:z,overrideKey:ba(I.overrideKey),properties:{...R&&ke(R.properties,Xd),...I,...N&&I.symbolData?{symbolData:{...I.symbolData,symbolID:N}}:{},...ya(R?.properties??{},I)},children:W};return I.type==="INSTANCE"&&(X.properties.componentPropAssignments=O.flatMap(_=>_.assignments).filter(_=>!P(_))),R&&w.length&&!X.hasOwnName&&(X.properties.name=R.defaultInstanceName??R.properties.name),X.defaultInstanceName=u(X),X},K=(v,E,I,N,w,O)=>{for(let R of N){let W=y(v,R.path);W&&h(v,w,W,R)}WS(v,I),BS(v,E,I),I.type==="INSTANCE"&&I.size&&(v.properties.size=structuredClone(I.size),v.derivedSize=structuredClone(I.size)),O&&C(v,I)};if(i.get(n)?.type!==t){let v={INSTANCE:"an instance",SYMBOL:"a component",CANVAS:"a page"}[t];throw new Error(`Expected ${v} source`)}return M(n,[],[],0)}function KS(e,n){let t=Dn();return t.orderKey=e.properties.parentIndex?.position??null,t.fig.layout=n.source?.fig.layout??null,t.fig.uniformScaleFactor=Mn(e.properties)?.uniformScaleFactor??null,t}var YS=new Set(["childIds","source","instanceOverrides"]);function gp(e){return e instanceof Map||e instanceof Set?!0:e===null||typeof e!="object"||ArrayBuffer.isView(e)?!1:Object.values(e).some(gp)}function $S(e,n){for(let t of Object.keys(e)){if(YS.has(t))continue;let r=Reflect.get(e,t),i=Reflect.get(n,t);r===i||r===null||typeof r!="object"||gp(r)||!he(r,i)||Reflect.set(e,t,i)}}function rp(e){if(e==="DOCUMENT"||e==="VARIABLE")throw new Error(`Cannot materialize ${e} as an instance descendant`)}function Oa(e,n,t,r,i={}){let{blobs:o=[],sourceChildren:s=new Map,existingNodes:a=new Map}=i;if(!e.getNode(n))throw new Error("Missing materialization parent");let l=new Map,u=g=>{if(l.has(g))throw new Error("Repeated or cyclic instance occurrence");let m=Gi(g.properties,o,"occurrence");m.nodeType==="TEXT"&&g.derivedSize&&(m.derivedLayout={width:g.derivedSize.x,height:g.derivedSize.y}),rp(m.nodeType);let h=a.get(g);if(h&&(e.getNode(h.id)!==h||h.type!==m.nodeType))throw new Error(`Invalid preallocated occurrence ${g.sourceId}`);l.set(g,m);let T=s.get(g);if(T&&e.getNode(T)?.type!==m.nodeType)throw new Error(`Invalid source child for ${g.sourceId}`);if(g.mainComponentId!==null){let y=r.get(g.mainComponentId);if(!y||e.getNode(y)?.type!=="COMPONENT")throw new Error(`Missing materialized component ${g.mainComponentId}`)}for(let y of g.children)u(y)};u(t);let c=new Map(a),f=(g,m,h)=>{if(h)for(let T of g.bindingClaims)T.origin==="assignment"&&T.field==="visible"&&le(h.instanceOverrides,h.id,m.id,"visible",m.visible)},d=(g,m,h)=>{let T=l.get(g);if(!T)throw new Error("Missing prepared occurrence");let{nodeType:y,...C}=T;rp(y);let L=KS(g,T),M={...C,variableAssignmentScales:OS(g),componentScale:ip(g),variableBindingScales:gr(C.boundVariables??{},g.layoutScale??1,g.variableBindingScales),componentId:g.mainComponentId===null?s.get(g)??null:r.get(g.mainComponentId),source:L},S=a.get(g);if(S&&S.parentId!==m)throw new Error(`Preallocated occurrence has wrong parent ${g.sourceId}`);let x=S??e.createNode(y,m,M);S&&e.updateNode(S.id,M);let D=e.getNode(s.get(g)??"");if(D&&$S(x,D),c.set(g,x),S&&g!==t&&x.type==="COMPONENT")return x;f(g,x,h);let P=s.get(g);return h&&g.mainComponentId!==null&&P&&(le(h.instanceOverrides,h.id,x.id,"sourceComponentId",P),e.getNode(P)?.componentId!==x.componentId&&le(h.instanceOverrides,h.id,x.id,"componentId",x.componentId)),x.childIds=g.children.map(B=>d(B,x.id,x.type==="INSTANCE"?x:h).id),x},p=d(t,n);return ZS(c),{root:p,nodes:c}}function qS(e,n,t){return e.kind==="text"?typeof n=="object"&&n!==null&&"characters"in n:e.kind==="text-style"?!!t.textStyleId:!0}function JS(e,n,t,r){if(!Array.isArray(r))return;let i=!1;for(let[o,s]of r.entries()){if(!s.colorVar?.value?.alias)continue;let a=`boundVariables/${t}/${o}/color`;le(e.instanceOverrides,e.id,n.id,a,n.boundVariables[`${t}/${o}/color`]??null),i=!0}i&&le(e.instanceOverrides,e.id,n.id,"boundVariables")}function ZS(e){for(let[n,t]of e)if(t.type==="INSTANCE")for(let r of n.propertyClaims){let i=cp(n,r.path),o=e.get(i);if(!o)throw new Error("Unmaterialized property claim target");for(let s of Object.keys(hr)){if(!(s in r.properties))continue;let a=hr[s];if(qS(a,r.properties[s],o)){for(let l of a.scene){let u=o[l];le(t.instanceOverrides,t.id,o.id,l,structuredClone(u))}a.kind==="paint"&&JS(t,o,a.scene[0],r.properties[s])}}xS(t,o,r.properties)}}function xa(e,n,t){if(e.mainComponentId!==null){let r=t.get(e.mainComponentId);if(!r)throw new Error(`Missing component occurrence ${e.mainComponentId}`);let i=new Map(n.getChildren(r.materialized.root.id).map((s,a)=>[s.id,a])),o=new Map(r.occurrence.children.map(s=>[s.sourceId,s]));e.children=e.children.filter(s=>{let a=o.get(s.sourceId),l=a&&r.materialized.nodes.get(a);return!!l&&i.has(l.id)}).toSorted((s,a)=>{let l=o.get(s.sourceId),u=o.get(a.sourceId),c=l&&r.materialized.nodes.get(l),f=u&&r.materialized.nodes.get(u);return(c?i.get(c.id)??0:0)-(f?i.get(f.id)??0:0)})}for(let r of e.children)xa(r,n,t)}function*hp(e,n){let t=new Map;for(let r of n.children){if(t.has(r.sourceId))throw new Error(`Ambiguous source child ${r.sourceId}`);t.set(r.sourceId,r)}for(let r of e.children){let i=t.get(r.sourceId);if(!i)throw new Error(`Missing source child ${r.sourceId}`);yield[r,i]}}function Da(e,n,t){let r=[],i=(o,s,a,l)=>{for(let[u,c]of hp(o,s)){let f=n.nodes.get(u),d=l.get(c);if(!f||!d)throw new Error(`Missing materialized correspondence for ${u.sourceId}`);r.push({owner:a,target:f,source:d}),!u.slotContentId&&u.mainComponentId===c.mainComponentId&&i(u,c,a,l)}};for(let o of Wi(e)){if(o.mainComponentId===null)continue;let s=t.get(o.mainComponentId),a=n.nodes.get(o);if(!s||!a)throw new Error(`Missing component ${o.mainComponentId}`);i(o,s.occurrence,a,s.materialized.nodes)}for(let{owner:o,target:s,source:a}of r)le(o.instanceOverrides,o.id,s.id,"sourceComponentId",a.id),s.type==="INSTANCE"&&s.componentId!==a.componentId&&le(o.instanceOverrides,o.id,s.id,"componentId",s.componentId)}function Ra(e,n){let t=new Map,r=(s,a,l)=>{for(let[u,c]of hp(s,a)){let f=l.get(c);if(!f)throw new Error(`Unmaterialized source child ${c.sourceId}`);if(t.set(u,f.id),u.mainComponentId!==null)i(u);else if(u.slotContentId)for(let d of u.children)o(d);else r(u,c,l)}},i=s=>{if(s.mainComponentId===null)throw new Error("Expected instance occurrence");let a=n.get(s.mainComponentId);if(!a)throw new Error(`Missing component occurrence ${s.mainComponentId}`);r(s,a.occurrence,a.materialized.nodes)},o=s=>{if(s.mainComponentId!==null)i(s);else for(let a of s.children)o(a)};return o(e),t}function yp(e,n,t,r){let i=r??new Map;if(!r)for(let o of e.getAllNodes())for(let s of o.componentPropertyDefinitions)i.set(s.id,s.type);for(let o of t){let s;o.componentPropertyDefinitions.forEach((a,l)=>{if(i.set(a.id,a.type),a.type!=="INSTANCE_SWAP")return;let u=n.get(a.defaultValue);u&&(s??=[...o.componentPropertyDefinitions],s[l]={...a,defaultValue:u})}),s&&(o.componentPropertyDefinitions=s)}for(let o of t){let s;for(let a in o.componentPropertyAssignments){if(i.get(a)!=="INSTANCE_SWAP")continue;let l=n.get(o.componentPropertyAssignments[a]);l&&(s??={...o.componentPropertyAssignments},s[a]=l)}s&&(o.componentPropertyAssignments=s)}}function Ip(e,n){for(let t of n){if(t.type!=="COMPONENT"||!t.parentId||t.variantPropSpecs.length===0)continue;let r=e.getNode(t.parentId);if(r?.type!=="COMPONENT_SET")continue;let i=new Map(r.componentPropertyDefinitions.map(s=>[s.id,s.name])),o={};for(let s of t.variantPropSpecs)o[i.get(s.propDefId)??s.propDefId]=s.value;e.updateNode(t.id,{componentPropertyValues:o})}}function Xi(e){let n=new Map;for(let t of e){if(!t.guid||typeof t.key!="string")continue;let r=n.get(t.key)??new Map,i=typeof t.version=="string"?t.version:"",o=k(t.guid);if(r.has(i)&&r.get(i)!==o)throw new Error(`Ambiguous resource ${t.key} version ${i}`);r.set(i,o),n.set(t.key,r)}return t=>{if(t?.guid)return k(t.guid);let r=t?.assetRef;if(!r)return;let i=n.get(r.key);return r.version?i?.get(r.version):i?.has("")?i.get(""):i?.size===1?i.values().next().value:void 0}}function vp(e,n,t){let r=new Set,i=s=>{s&&r.add(k(s))},o=s=>{i(s.value?.guidValue),i(s.varValue?.value?.symbolIdValue?.guid)};return bt(e,(s,a)=>{i(Mn(s)?.symbolID),i(a?.overriddenSymbolID);for(let l of s.componentPropDefs??[])if(l.type==="INSTANCE_SWAP"&&o({value:l.initialValue,varValue:l.varValue}),l.type==="INSTANCE_SWAP"||l.type==="SLOT")for(let u of l.preferredValues?.instanceSwapValues??[]){if(!u.key)continue;let c=n?.({assetRef:{key:u.key,version:u.version}});if(!c){if(!t)throw new Error(`Unresolved preferred component ${u.key}`);t(u.key);continue}r.add(c)}for(let l of s.componentPropAssignments??[])o(l)}),r}function Tp(e){let n=new Set;return bt(e,t=>{for(let r of t.componentPropAssignments??[]){let i=Ui(r.varValue?.value);i&&n.add(k(i))}}),n}function Ma(e){for(let n of e){if(n.pluginData&&n.pluginData.length>1){let t=new Map;for(let r of n.pluginData)t.set(`${r.pluginID}\0${r.key}\0${r.value}`,r);t.size<n.pluginData.length&&(n.pluginData=[...t.values()])}if(n.pluginRelaunchData&&n.pluginRelaunchData.length>1){let t=new Map;for(let r of n.pluginRelaunchData)t.set(`${r.pluginID}\0${r.command}\0${r.message}\0${r.isDeleted}`,r);t.size<n.pluginRelaunchData.length&&(n.pluginRelaunchData=[...t.values()])}}}function Pa(e){if(new TextDecoder().decode(e.slice(0,8))!=="fig-kiwi")return null;let n=new DataView(e.buffer,e.byteOffset,e.byteLength),t=n.getUint32(8,!0),r=12,i=[];for(;r<e.length&&!(r+4>e.length);){let a=n.getUint32(r,!0);if(r+=4,r+a>e.length)throw new Error(`Corrupted .fig file: chunk at offset ${r-4} declares length ${a} but only ${e.length-r} bytes remain`);i.push(e.slice(r,r+a)),r+=a}if(i.length<2)return null;let o=i[1],s;if($s(o))s=Rf(o);else try{s=Xn(o)}catch{throw new Error("Failed to decompress fig-kiwi data chunk")}return{schemaDeflated:i[0],dataRaw:s,version:t}}function ji(e,n,t){let r=Pa(e);if(!r)throw new Error("Invalid fig-kiwi container");let i=Xn(r.schemaDeflated),o=ir(new Ce(i));if(n)try{let l=jf(o,r.dataRaw);l.length>0&&n(l)}catch(l){console.warn("Failed to scan FIG page manifest; continuing with full decode:",l)}let s=rr(o,t).decodeMessage(r.dataRaw),a=s.nodeChanges;if(!a||a.length===0)throw new Error("No nodes found in .fig file");return Ma(a),{nodeChanges:a,blobs:(s.blobs??[]).map(l=>l.bytes instanceof Uint8Array?l.bytes:new Uint8Array(Object.values(l.bytes))),figKiwiVersion:r.version,figSchemaDeflated:r.schemaDeflated}}function Cp(e,n){let t=[],r=n.parentId?e.getNode(n.parentId):void 0;for(;r;)r.type==="INSTANCE"&&t.push(r),r=r.parentId?e.getNode(r.parentId):void 0;return n.type==="INSTANCE"&&t.unshift(n),t}function Op(e,n){let t=[];for(let r of Cp(e,n)){let i=Je(r.instanceOverrides,r.id,n.id,"sourceComponentId"),o=typeof i=="string"?i:n.componentId,s=o?e.getNode(o):void 0;s&&t.push(s)}return t}function QS(e,n){e.preserveSourceMetadataDuring(()=>{for(let t of n.nodes.values()){let r=Cp(e,t),i=new Set;for(let s of r){let a=s.id===t.id?s.instanceOverrides.self:s.instanceOverrides.descendants.get(t.id);for(let l of a?.keys()??[])i.add(l)}let o={};for(let s of Op(e,t))for(let a of pi)!s.source.editedFields.includes(a)||i.has(a)||Object.assign(o,{[a]:structuredClone(s[a])});Object.keys(o).length&&e.updateNode(t.id,o)}})}var eb=new Uint8Array([137,80,78,71,13,10,26,10]);function xp(e){return eb.every((n,t)=>e[t]===n)}function nb(e){let n=e.toLowerCase();return n.endsWith(".png")||n.endsWith(".jpg")||n.endsWith(".json")}function $i(e){let n=e["canvas.fig"]??e.canvas;if(n)return n;let t=null;for(let[r,i]of Object.entries(e))!i||nb(r)||(!t||i.byteLength>t.byteLength)&&(t=i);return t}function qi(e){return e==="canvas.fig"||e==="canvas"}function tb(e,n,t){let r=ca(e);if(!r)return null;let i=ji(e,n,t),o=r.slice(2).find(xp)??null;return{...i,images:[],thumbnailPNG:o,metaJSON:null}}function rb(e,n,t){let r=new Uint8Array(e),i=tb(r,n,t);if(i)return i;let o=$i(Tt(r,{filter:({name:c})=>qi(c)})),s,a;if(o)a=ji(o,n,t),s=Tt(r,{filter:({name:c})=>!qi(c)});else{if(s=Tt(r),o=$i(s),!o)throw new Error(`No canvas data found in .fig file. Entries: ${Object.keys(s).join(", ")}`);a=ji(o,n,t)}let l=s["meta.json"],u=Object.entries(s).filter(([c])=>c.startsWith("images/")&&c!=="images/").map(([c,f])=>[c.slice(7),f]);return{...a,images:u,thumbnailPNG:s["thumbnail.png"]??null,metaJSON:Object.hasOwn(s,"meta.json")?new TextDecoder().decode(l):null}}function Sp(e){let n=Pa(e);if(!n)throw new Error("Invalid fig-kiwi container");return{schemaDeflated:n.schemaDeflated,dataRaw:n.dataRaw,figKiwiVersion:n.version}}function Dp(e){let n=new Uint8Array(e),t=ca(n);if(t){let a=t.slice(2).find(xp)??null;return{...Sp(n),images:[],thumbnailPNG:a,metaJSON:null}}let r=$i(Tt(n,{filter:({name:a})=>qi(a)})),i=Tt(n,r?{filter:({name:a})=>!qi(a)}:void 0),o=r??$i(i);if(!o)throw new Error(`No canvas data found in .fig file. Entries: ${Object.keys(i).join(", ")}`);let s=Object.entries(i).filter(([a])=>a.startsWith("images/")&&a!=="images/").map(([a,l])=>[a.slice(7),l]);return{...Sp(o),images:s,thumbnailPNG:i["thumbnail.png"]??null,metaJSON:Object.hasOwn(i,"meta.json")?new TextDecoder().decode(i["meta.json"]):null}}function ib(e){let n={"canvas.fig":[ud(e.schemaDeflated,e.kiwiData,e.figKiwiVersion),{level:0}],"thumbnail.png":[e.thumbnailPNG,{level:0}],"meta.json":new TextEncoder().encode(e.metaJSON)};for(let t of e.images??[])n[t.name]=[t.data,{level:0}];return ld(n)}function Ki(e){return(e??[]).map(k).join("/")}function bp(e,n){let t=new Set(n.removed.map(Ki)),r=e.filter(o=>!t.has(Ki(o.guidPath?.guids))),i=new Map(r.map((o,s)=>[Ki(o.guidPath?.guids),s]));for(let o of n.entries){let s=Ki(o.path),a=i.get(s),l={...a===void 0?{guidPath:{guids:o.path}}:r[a],...structuredClone(o.set)};for(let u of o.unset)Reflect.deleteProperty(l,u);a===void 0?(i.set(s,r.length),r.push(l)):r[a]=l}return r}function ob(e,n){let t={...e,...structuredClone(n.set)};for(let i of n.unset)Reflect.deleteProperty(t,i);let r=Mn(t);return n.symbolOverrides&&r&&(t.symbolData={...r,symbolOverrides:bp(r.symbolOverrides??[],n.symbolOverrides)}),n.derivedSymbolData&&(t.derivedSymbolData=bp(jd(t),n.derivedSymbolData)),t}var sb=new Set(["VARIABLE","VARIABLE_SET"]);function on(e){return e?k(e):void 0}function ab(e){return"sessionID"in e&&"localID"in e&&typeof e.sessionID=="number"&&typeof e.localID=="number"}function lb(e){let n=0,t=r=>{if(!(!r||typeof r!="object"||ArrayBuffer.isView(r))){if(Array.isArray(r)){for(let i of r)t(i);return}ab(r)&&(r.sessionID===0||r.sessionID===1)&&(n=Math.max(n,r.localID));for(let i of Object.values(r))t(i)}};return t(e),n}function ub(e){return{recordIds:e.records.flatMap(n=>n.guid?[k(n.guid)]:[]),blobCount:e.blobCount,nextLocalId:lb(e.records)+1,imageHashes:[...e.imageHashes],documentId:on(e.records.find(n=>n.type==="DOCUMENT")?.guid)??null}}function Rp(e){return{id:on(e.guid),parent:on(e.parentIndex?.guid),type:e.type,parentIndex:e.parentIndex,value:e}}var _a=e=>!!e.type&&sb.has(e.type);function cb(e,n,t){let r=new Map;for(let s of e){if(!s.id||!s.parent)continue;let a=r.get(s.parent)??[];a.push(s.id),r.set(s.parent,a)}let i=new Set,o=n.map(k);for(let s=o.pop();s!==void 0;s=o.pop())if(!(i.has(s)||t.has(s))){i.add(s);for(let a of r.get(s)??[])o.push(a)}return i}function fb(e,n){let t=[],r=new Set,i=new Map,o=a=>!!a&&!r.has(a)&&e.has(a)&&!n.has(a),s=a=>{if(o(a.parent)){i.set(a.parent,[...i.get(a.parent)??[],a]);return}if(t.push(a),!a.id)return;r.add(a.id);let l=i.get(a.id)??[];i.delete(a.id);for(let u of l)s(u)};return{emit:s,emitted:a=>r.has(a),finish(){for(let a of i.values())for(let l of a)t.push(l);return t}}}function db(e,n){let t=new Map;for(let r of e){let i=r.parentIndex?.position,o=_a(r)&&!(r.id&&n.has(r.id));!r.parent||!i||o||i>(t.get(r.parent)??"")&&t.set(r.parent,i)}return t}function pb(e,n){let t=db(e,n);for(let r of e){if(!_a(r)||r.value instanceof Uint8Array)continue;let i=r.value,o=r.id?n.get(r.id):void 0;if(o)i.parentIndex=structuredClone(o);else if(r.parent&&i.parentIndex){let s=Kf(t.get(r.parent)??null,null);i.parentIndex={...i.parentIndex,position:s},t.set(r.parent,s)}}}function mb(e,n,t,r){let i=new Map((n.fields??[]).map(a=>[k(a.guid),a])),o=[...i].flatMap(([a,l])=>"parentIndex"in l.set?[a]:[]),s=cb(e,n.removed,new Set([...t.keys(),...o]));for(let a of e){if(!a.id||t.has(a.id)||s.has(a.id))continue;let l=i.get(a.id);l&&t.set(a.id,Rp(ob(r(a.value),l)))}return s}function gb(e,n,t){let r=new Map;for(let u of n.records){let c=Rp(u);c.id&&r.set(c.id,c)}let i=mb(e,n,r,t),o=new Set(e.flatMap(u=>u.id??[])),s=new Map,a=fb(r,o);for(let u of e){if(u.id&&i.has(u.id))continue;let c=u.id?r.get(u.id):void 0;if(n.replaceVariables&&_a(u)){u.id&&s.set(u.id,u.parentIndex),c&&a.emit(c);continue}a.emit(c??u)}for(let u of r.values())u.id&&!a.emitted(u.id)&&!o.has(u.id)&&a.emit(u);let l=a.finish();return n.replaceVariables&&pb(l,s),l}function Et(e){if(e===null)throw new Error("Kiwi field without a type");return e}function Yi(e,n){let t=e[`decode${n}`];if(typeof t!="function")throw new Error(`No Kiwi decoder for ${n}`);return t}function hb(e,n,t,r,i){let o=n.fieldsById(t),s={id:void 0,parent:void 0,type:void 0,parentIndex:void 0};for(let a=r.readVarUint();a!==0;a=r.readVarUint()){let l=o.get(a);if(!l)throw new Error("Attempted to parse invalid message");let u=l.isArray?"":l.name;if(u==="guid")s.guid=Yi(e,Et(l.type))(r),s.id=on(s.guid);else if(u==="parentIndex"){let c=Yi(e,Et(l.type))(r);s.parentIndex=c,s.parent=on(c?.guid)}else u==="type"?s.type=e[Et(l.type)]?.[r.readVarUint()]:u==="symbolData"&&i?s.symbolData=Yi(e,Et(l.type))(r):n.skipField(l,r)}return s}function Mp(e,n,t,r=!1){let i=n.fieldsById("Message"),o=new Ce(t),s={parts:[],records:[],blobs:[],hasBlobs:!1};for(;;){let a=o.offset,l=o.readVarUint();if(l===0)break;let u=i.get(l);if(!u)throw new Error("Attempted to parse invalid message");let c=Et(u.type),f=u.name==="nodeChanges"&&u.isArray,d=u.name==="blobs"&&u.isArray;if(!f&&!d){n.skipField(u,o),s.parts.push({kind:"bytes",bytes:t.subarray(a,o.offset)});continue}for(let p=o.readVarUint();p>0;p--){let g=o.offset;if(f){let m=hb(e,n,c,o,r);s.records.push({...m,value:t.subarray(g,o.offset)})}else n.skipValue(c,o),s.blobs.push(t.subarray(g,o.offset))}s.hasBlobs||=d,s.parts.push({kind:f?"records":"blobs",fieldId:l,type:c})}if(s.records.length===0)throw new Error("No nodes found in .fig file");return s}function Pp(e){let n=ir(new Ce(Xn(e)));return{codec:rr(n),skipper:Pi(n)}}function wa(e){let n=new Ce;return n.writeVarUint(e),n.toUint8Array().slice()}function Ep(e,n,t){let r=e[`encode${n}`];if(typeof r!="function")throw new Error(`No Kiwi encoder for ${n}`);let i=r(t);if(!i)throw new Error(`Encoding ${n} produced nothing`);return i.slice()}function yb(e){let n=0;for(let i of e)n+=i.byteLength;let t=new Uint8Array(n),r=0;for(let i of e)t.set(i,r),r+=i.byteLength;return t}function Ib(e,n,t){let{codec:r,skipper:i}=Pp(e),o=Mp(r,i,n),s=o.parts.find(d=>d.kind==="records"),a=d=>{if(s?.kind!=="records")throw new Error("The archive has no records");return Yi(r,s.type)(new Ce(d))},l=gb(o.records,t,a),u=d=>[...o.blobs,...t.blobs.map(p=>Ep(r,d,{bytes:p}))],c=[],f=(d,p)=>{c.push(wa(d),wa(p.length));for(let g of p)c.push(g)};for(let d of o.parts)d.kind==="bytes"?c.push(d.bytes):d.kind==="blobs"?f(d.fieldId,u(d.type)):f(d.fieldId,l.map(p=>p.value instanceof Uint8Array?p.value:Ep(r,d.type,p.value)));if(!o.hasBlobs&&t.blobs.length>0){let d=i.definition("Message").fields.find(p=>p.name==="blobs");if(!d)throw new Error("The archive schema has no blobs");f(d.value,u(Et(d.type)))}return c.push(wa(0)),yb(c)}function wp(e,n,t){let r=Dp(e),i=Ib(r.schemaDeflated,r.dataRaw,n),o=new Set(r.images.map(([s])=>s));return ib({schemaDeflated:r.schemaDeflated,kiwiData:i,thumbnailPNG:t.thumbnailPNG,metaJSON:t.metaJSON,images:[...r.images.map(([s,a])=>({name:`images/${s}`,data:a})),...t.images.filter(s=>!o.has(s.name.replace(/^images\//,"")))],figKiwiVersion:r.figKiwiVersion})}function vb(e,n){let t=new Map,r=new Map,i=(u,c)=>{if(!u)return;let f=r.get(u)??[];f.push(c),r.set(u,f)};for(let u of e){let c=on(u.guid);if(c&&(t.set(c,u),u.type==="INSTANCE")){i(on(Mn(u)?.symbolID),c);for(let f of Kn(u))i(on(f.overriddenSymbolID),c)}}let o=(u,c)=>{let f=new Set;for(let d=t.get(u);d;){let p=on(d.guid);if(!p||f.has(p))return;if(f.add(p),d.type===c)return p;let g=on(d.parentIndex?.guid);d=g?t.get(g):void 0}},s=new Set,a=new Set,l=[...n];for(let u=l.pop();u!==void 0;u=l.pop())if(!a.has(u)){a.add(u);for(let c of r.get(u)??[]){let f=o(c,"CANVAS");f&&s.add(f);let d=o(c,"SYMBOL");d&&l.push(d)}}return[...s]}function kp(e,n){let t=Dp(e),{codec:r,skipper:i}=Pp(t.schemaDeflated);return vb(Mp(r,i,t.dataRaw,!0).records.map(o=>({guid:o.guid,parentIndex:o.parentIndex,type:o.type,symbolData:o.symbolData})),n)}function Tb(e,n,t,r=new Map){let i=new Map;for(let o of t)o.type==="INSTANCE"&&li(o.instanceOverrides,(s,a)=>{if(a!=="width"&&a!=="height")return;let l=s||o.id,u=i.get(l)??new Set;u.add(a),i.set(l,u)});for(let o of t){let s=gr(o.boundVariables,r.get(o.id)??1,o.variableBindingScales);e.updateNode(o.id,{variableBindingScales:s});for(let a in o.boundVariables){if((a==="width"||a==="height")&&n.has(o.id)||i.get(o.id)?.has(a))continue;let l=o.boundVariables[a],u=e.variables.get(l);if(!u)continue;let c=e.getNodeVariableModeId(o.id,u.collectionId),f=e.resolveVariable(l,c);if(typeof f!="number")continue;let d=a==="opacity"?f:f*(s[a]??1),p=Rd(a,d);p&&e.updateNode(o.id,p)}}}function Sb(e,n){for(let t of n){let r=Si(e,t);(r.fills||r.strokes)&&e.updateNode(t.id,r)}}function bb(e,n){for(let t of n){if(t.type!=="TEXT")continue;let r=t.boundVariables.text;if(!r)continue;let i=_s(e.resolveVariableForNode(t.id,r));i===void 0||i===t.text||e.updateNode(t.id,{text:i})}}function Eb(e){let n=[],t=(r,i)=>{let o=e.materialized.nodes.get(r);if(!o)throw new Error("Missing checkpoint occurrence");n.push({path:i,nodeId:o.id,mainComponentId:r.mainComponentId});let s=new Set;for(let a of r.children){if(s.has(a.sourceId))throw new Error(`Ambiguous checkpoint child ${a.sourceId}`);s.add(a.sourceId),t(a,[...i,a.sourceId])}};return t(e.occurrence,[]),{rootId:e.materialized.root.id,nodes:n}}function Ab(e,n,t){let r=e.getNode(t.rootId);if(!r)throw new Error(`Missing resumed component ${t.rootId}`);let i=new Map,o=(l,u)=>{i.set(u.join("/"),l);for(let c of e.getChildren(l.id)){let f=c.source.id;f&&o(c,[...u,f])}};o(r,[]);let s=new Map;for(let l of t.nodes){let u=n;for(let f of l.path){let d=u.children.filter(p=>p.sourceId===f);if(d.length!==1)throw new Error(`Invalid checkpoint source path ${f}`);u=d[0]}let c=e.getNode(l.nodeId)??i.get(l.path.join("/"));if(c){if(s.has(u)||u.mainComponentId!==l.mainComponentId)throw new Error(`Invalid checkpoint occurrence ${l.nodeId}`);s.set(u,c)}}let a=l=>{if(s.has(l))for(let u of l.children)a(u)};if(a(n),s.get(n)!==r)throw new Error("Invalid checkpoint root");return{occurrence:n,materialized:{root:r,nodes:s}}}function Nb(e,n,t){let{graph:r}=e,i=new Set(r.nodes.keys()),o=new Map,s=new Set([r.rootId,...r.getPages(!0).map(d=>d.id)]);for(let d of[...n.contentIds,...n.ancestorIds]){let p=e.sources.get(d);p&&s.add(p)}for(let d of s){let p=r.getNode(d);p&&o.set(p,structuredClone(p))}let a=new Map(e.sources),l=new Map(e.components),u=new Map(e.componentIds),c=new Set(e.savedSizeNodes),f=e.nextImportedId;r.withBufferedEvents(()=>{try{t()}catch(d){for(let[p,g]of r.nodes)i.has(p)||(g.componentId&&r.instanceIndex.get(g.componentId)?.delete(p),r.nodes.delete(p));for(let[p,g]of o)if(p.componentId&&r.instanceIndex.get(p.componentId)?.delete(p.id),Object.assign(p,g),p.type==="INSTANCE"&&p.componentId){let m=r.instanceIndex.get(p.componentId)??new Set;m.add(p.id),r.instanceIndex.set(p.componentId,m)}e.sources=a,e.components=l,e.componentIds=u,e.savedSizeNodes=c,e.nextImportedId=f;for(let[p,g]of r.instanceIndex)g.size||r.instanceIndex.delete(p);throw r.clearAbsPosCache(),d}})}function Cb(e,n){let t=e.getNode(e.rootId);if(!t||!n)return;t.source.format="fig",t.pluginData=n.pluginData?.map(i=>({pluginId:i.pluginID,key:i.key,value:i.value}))??[],t.source.fig.rawNodeFields.strokeJoin=n.strokeJoin,t.source.fig.rawNodeFields.strokeWeight=n.strokeWeight;let r=_e(n,ze.enabledLibraries);for(let i of r??[])e.enabledLibraries.set(i.libraryId,i)}var Ob=new Set(["VISIBLE","TEXT_DATA","OVERRIDDEN_SYMBOL_ID","SLOT_CONTENT_ID"]);function xb(e){for(let n of e.componentPropDefs??[]){let t=n.varValue?.value;n.initialValue||!t||(n.initialValue=t.symbolIdValue?.guid?{guidValue:structuredClone(t.symbolIdValue.guid)}:structuredClone(t))}}function Db(e){xb(e);let n=e.parameterConsumptionMap,t=structuredClone(e.componentPropRefs??[]);for(let r of n?.entries??[]){let i=r.variableData?.value?.propRefValue?.defId;if(r.variableData?.dataType!=="PROP_REF"||!i||!r.variableField||!Ob.has(r.variableField))continue;let o={defID:structuredClone(i),componentPropNodeField:r.variableField},s=t.findIndex(a=>a.componentPropNodeField===r.variableField);s===-1?t.push(o):t[s]=o}t.length&&(e.componentPropRefs=t)}var Lp=["styleIdForFill","styleIdForStrokeFill","styleIdForText","styleIdForEffect","styleIdForGrid"];function Rb(e,n,t){let r=new Set;return bt(e,i=>{for(let o of[i,...i.textData?.styleOverrideTable??[]])for(let s of Lp){let a=o[s];if(!a)continue;let l=a.guid?k(a.guid):n(a);l&&t.has(l)&&r.add(l)}}),r}function Mb(e,n,t){for(let r of Kn(e))t(r,[...n,...r.guidPath?.guids??[]]);for(let r of e.derivedSymbolData??[])t(r,[...n,...r.guidPath?.guids??[]])}function Pb(e){return(n,t,r)=>{let i=(s,a,l)=>{if(!s?.assetRef||s.guid)return;let u=e(s);if(!u){r?.({sourceId:t,field:a,key:s.assetRef.key,path:structuredClone(l)});return}s.guid=Oi(u)},o=(s,a)=>{Db(s);for(let u of rn(s))ga(u.variableData,c=>i(c,u.variableField??"unknown",a));for(let[u,c]of[["fillPaints",s.fillPaints],["strokePaints",s.strokePaints]])for(let f of c??[])i(f.colorVar?.value?.alias,u,a);let l=s.variableModeBySetMap;for(let u of l?.entries??[])i(u.variableSetID,"variableModeBySetMap",a);for(let u of Lp)i(s[u],u,a);for(let u of s.textData?.styleOverrideTable??[])o(u,a);Mb(s,a,o)};o(n,[])}}function wb(e){let n=Pb(Xi(e));return(t,r)=>n(t,t.guid?k(t.guid):"unknown",r)}function kb(e,n,t,r=()=>!1){let i=t,o=new Map,s=p=>{if(p.mainComponentId===null){p.properties.type==="SYMBOL"&&o.set(p.sourceId,p);for(let g of p.children)s(g)}};for(let p of e)s(p);let a=[],l=new Set,u=new Set,c=p=>{let g=new Set,m=p;for(;m;){if(g.has(m))throw new Error(`Cyclic source hierarchy at ${m}`);g.add(m);let h=i.get(m);if(!h)throw new Error(`Missing source ancestor ${m}`);if(h.type==="CANVAS")return m;m=$n(h)}throw new Error(`Component ${p} has no source page`)},f=p=>{for(let g of Wi(p))g.mainComponentId!==null&&d(g.mainComponentId),g.properties.type==="SYMBOL"&&d(g.sourceId)},d=p=>{if(l.has(p))return;if(r(p)){l.add(p);return}if(u.has(p))throw new Error(`Cyclic component dependency ${p}`);u.add(p);let g=i.get(p);if(!g?.parentIndex?.guid)throw new Error(`Missing component parent ${p}`);let m=c(p),h=o.get(p)??n(p);for(let T of h.children)f(T);a.push({sourceId:p,parentSourceId:k(g.parentIndex.guid),pageSourceId:m,occurrence:h}),l.add(p),u.delete(p)};for(let p of e)f(p);return a}var ka=class{source;decode;constructor(e,n){this.source=e,this.decode=n}get size(){return this.source.size}get(e){let n=this.source.get(e);return n===void 0?void 0:this.decode(n)}has(e){return this.source.has(e)}keys(){return this.source.keys()}*values(){for(let e of this.source.values())yield this.decode(e)}*entries(){for(let[e,n]of this.source)yield[e,this.decode(n)]}forEach(e){for(let[n,t]of this.entries())e(t,n,this)}[Symbol.iterator](){return this.entries()}};function Lb(e,n){if(n){for(let t of n)if(e.get(t)?.type!=="CANVAS")throw new Error(`Unknown page ${t}`)}}function _b(e,n,t,r){for(let i of n){let o=new Set([i]),s=e.get(i),a=s?$n(s):void 0;for(;a!==void 0;){if(o.has(a))throw new Error(`Cyclic source hierarchy at ${a}`);if(o.add(a),t.has(a))break;if(t.add(a),s=e.get(a),!s){r.add(a);break}a=$n(s)}}}function Vb(e,n,t,r=i=>i){let i=Xi(e),{sources:o,children:s}=t,a=new Set(o.keys()),l=new Set,u=new Set,c=new Set,f=new Set,d=new Set,p=new Set,g=new Set,m=new Set;Lb(o,n);let h=e.filter(T=>T.type==="CANVAS"&&(n?n.has(Yn(T)??""):T.internalOnly!==!0)).flatMap(T=>Yn(T)??[]);for(;h.length;){let T=h.pop();if(!T||l.has(T))continue;let y=o.get(T);if(!y){p.has(T)?d.add(T):g.has(T)?m.add(T):f.add(T);continue}l.add(T);let C=r(y),L=vp(C,i,S=>c.add(S));for(let S of L)p.add(S);let M=Tp(C);for(let S of M)g.add(S);h.push(...(s.get(T)??[]).flatMap(S=>Yn(S)??[]),...Rb(C,i,a),...L,...M)}return _b(o,l,u,f),{contentIds:l,ancestorIds:u,missingIds:f,missingComponentIds:d,missingSlotContentIds:m,externalPreferredKeys:c}}function Fb(e,n){let t=e.componentPropDefs;t&&(e.componentPropDefs=t.map(r=>{if(!r.parentPropDefId)return r;let i=k(r.parentPropDefId);for(let o of n){let s=(o.componentPropDefs??[]).filter(a=>a.id&&k(a.id)===i);if(s.length>1)throw new Error(`Ambiguous parent property ${i}`);if(s.length===1)return{...structuredClone(s[0]),...r}}throw new Error(`Missing parent property ${i}`)}))}var Gb=["guid","parentIndex","type","phase","name","internalOnly","key","version","styleType","overrideKey"];function Bb(e,n){let t=rb(e,void 0,{NodeChange:Gb});return{figKiwiVersion:t.figKiwiVersion,figSchemaDeflated:t.figSchemaDeflated,reader:_p(zb(t.nodeChanges),n),blobs:t.blobs,images:t.images,records:t.nodeChanges}}function Ub(e){let n=new Map;for(let t of e)if(t.guid&&typeof t.key=="string"){let r=k(t.guid);n.set(t.key,r),typeof t.version=="string"&&n.set(`${t.key}@${t.version}`,r)}return n}function La(e){return e.type==="VARIABLE"||e.type==="VARIABLE_SET"}function Ap(e){let n=Ys(e);if(!n)throw new Error("Record header has no archive bytes to read it whole");return Ma([n]),n}function zb(e){let n=e.filter(d=>d.phase!=="REMOVED"),t=Hi(n),r=wb(n),i=Ub(n),o=[];for(let d of n)r(Ap(d),p=>o.push(p));let s=new Map,a=new ka(t.sources,d=>d.styleType?c(d):d),l=new Set,u=(d,p)=>{if(l.has(d))throw new Error("Cyclic component-property ancestry");l.add(d);try{let g=Ap(d);r(g);let m=[];for(let T=t.sources.get($n(d)??"");T;T=t.sources.get($n(T)??""))m.push(p(T));Fb(g,m);let h=T=>{Md(a,T,i);for(let y of Kn(T))h(y)};return h(g),g}finally{l.delete(d)}},c=d=>{let p=s.get(d);return p||(p=u(d,c),s.set(d,p)),p};return{records:n,index:t,bindingDiagnostics:o,scope:()=>{let d=new Map,p=g=>{let m=s.get(g)??d.get(g);if(m)return m;let h=u(g,p);return d.set(g,h),h};return p},shared:c,interpreterIndex:()=>{let{sources:d,children:p}=Hi(n.filter(m=>!La(m))),g=new WeakMap;return{sources:new ka(d,c),children:new ka(p,m=>{let h=g.get(m);return h||(h=m.map(c),g.set(m,h)),h})}}}}function Hb(e){let n;return{records:e,get sourceInterpreter(){return n??=Ca(e.interpreterIndex()),n}}}function _p(e,n){let t="sourceInterpreter"in e?e:Hb(e),{records:r,index:i,bindingDiagnostics:o}=t.records,s=r,a=t.records.scope(),l=s.filter(La),u=Vb(s,n,i,a);if(u.missingIds.size)throw new Error(`Missing reachable sources: ${[...u.missingIds].join(", ")}`);let c=s.filter(m=>!La(m)&&(m.type==="CANVAS"||m.guid&&(u.contentIds.has(k(m.guid))||u.ancestorIds.has(k(m.guid))))).map(a),f=t.sourceInterpreter,d=Ca(Hi(c)),p=s.filter(m=>m.type==="CANVAS").toSorted(Aa).map(m=>{if(!m.guid)throw new Error("Page has no GUID");return{id:k(m.guid),name:m.name??"",position:m.parentIndex?.position??null,internalOnly:m.internalOnly===!0}}),g=new Set(p.map(m=>m.id));return{selectPages(m){return _p(t,m)},get sourceRecords(){return structuredClone(s.map(a))},get documentRecord(){let m=s.find(h=>h.type==="DOCUMENT");return structuredClone(m&&a(m))},dependencyClosure:u,pages:p,get resources(){return structuredClone(l.map(a))},bindingDiagnostics:o,readPage(m,h={}){if(!g.has(m))throw new Error(`Unknown page ${m}`);let T=d.page(m,h);return T.children=T.children.filter(y=>y.properties.isSlotContent!==!0),T},planComponents(m,h={},T){return kb(m,y=>f.component(y,h),i.sources,T)},readComponent:f.component}}function Wb(e,n){let{value:t,dataType:r,resolvedDataType:i}=e.variableData;if(!t)throw new Error("Missing variable value");let o=r??i;if(o==="ALIAS"){let s=n(t.alias);if(!s)throw new Error("Unresolved variable alias");return{aliasId:s}}if(o==="COLOR"&&t.colorValue)return structuredClone(t.colorValue);if(o==="BOOLEAN"&&t.boolValue!==void 0)return t.boolValue;if(o==="STRING"&&t.textValue!==void 0)return t.textValue;if(o==="FLOAT"&&t.floatValue!==void 0)return t.floatValue;throw new Error(`Unsupported variable value ${o}`)}function Xb(e,n,t){let r=e.variableDataValues?.entries??[];if(!r.length)throw new Error("Missing mode values");let i={};for(let o of r){let s=k(o.modeID);if(!n.includes(s))throw new Error("Unknown mode");i[s]=Wb(o,t)}return i}function jb(e,n,t){let r=(i,o)=>{if(!t)throw new Error(`Unsupported document resource ${i.type}: ${o}`);t(structuredClone(i))};for(let i of n){if(i.type!=="VARIABLE_SET")continue;let o=i.variableSetModes??[];if(!i.guid||o.length===0){r(i,"missing collection identity or modes");continue}let s=va(Fi(i)),a=Jd(i);e.addCollection({id:k(i.guid),name:i.name??"Variables",modes:o.map(l=>{let u=k(l.id);return{modeId:u,name:l.name,condition:a[u],...l.sortPosition?{sortPosition:l.sortPosition}:{}}}),defaultModeId:k(o[0].id),variableIds:[],modeAttribute:Zd(i),pluginData:s.length>0?s:void 0,key:typeof i.key=="string"?i.key:void 0,version:typeof i.version=="string"?i.version:void 0})}Kb(e,n,r)}function Kb(e,n,t){let r=Xi(n);for(let i of n){if(i.type!=="VARIABLE")continue;let o=i.variableResolvedType,s=i.variableSetID?r(i.variableSetID):i.parentIndex?.guid&&k(i.parentIndex.guid),a=s&&e.variableCollections.get(s);if(!i.guid||!a||!s||o!=="COLOR"&&o!=="BOOLEAN"&&o!=="STRING"&&o!=="FLOAT"){t(i,"unresolved collection, identity or type");continue}let l={};try{Object.assign(l,Xb(i,a.modes.map(c=>c.modeId),r))}catch(c){t(i,c instanceof Error?c.message:"Invalid mode value");continue}let u=Qd(i);e.addVariable({id:k(i.guid),name:i.name??"Variable",type:o,collectionId:s,valuesByMode:l,...u,...qd(i,l)})}}function Yb(e,n,t){let{graph:r,checkpoint:i}=e,o=new Map;for(let[s,a]of i.components)o.set(s,Ab(r,n.readComponent(s,t),a));return{graph:r,nextImportedId:i.nextImportedId??Jb(r),components:o,sources:new Map(i.sources),componentIds:new Map(i.componentIds),savedSizeNodes:new Set(i.savedSizeNodeIds)}}function Vp(e,n={},t){let r=Bb(e,new Set),i={...n,images:n.images??new Map(r.images)},o=t?Yb(t,r.reader,i):Np(r.reader,r.blobs,i);o.graph.figKiwiVersion=r.figKiwiVersion,o.graph.figSchemaDeflated=r.figSchemaDeflated;let s=new Set(t?.checkpoint.loadedPageIds),a;return{checkpoint(){return structuredClone({nextImportedId:o.nextImportedId,sources:[...o.sources],componentIds:[...o.componentIds],savedSizeNodeIds:[...o.savedSizeNodes],loadedPageIds:[...s],components:[...o.components].map(([l,u])=>[l,Eb(u)])})},graph:o.graph,graphPageId(l){return r.reader.pages.some(u=>u.id===l)?o.sources.get(l):void 0},pages:r.reader.pages,archiveRecordInfo(){return a??=ub({records:r.records,blobCount:r.blobs.length,imageHashes:r.images.map(([l])=>l)}),a},loadPage(l){if(s.has(l))return;let u=r.reader.selectPages(new Set([l]));Nb(o,u.dependencyClosure,()=>{Np(u,r.blobs,i,o),s.add(l)})},get loadedPageIds(){return new Set(s)}}}function $b(e){let n=new Map;for(let t of e.getAllNodes())for(let r of t.componentPropertyDefinitions)n.set(r.id,r.type);return n}function qb(e,n){let t=!0,r=1,i=new Bs(()=>t?`0:${r++}`:Ei());t=!1,Cb(i,e.documentRecord);for(let[o,s]of n.images??[])i.images.set(o,s.slice());i.applyImportedStateDuring(()=>jb(i,e.resources,n.onUnsupportedResource),()=>`0:${r++}`);for(let o of i.getPages())i.deleteNode(o.id);return{graph:i,nextImportedId:r,sources:new Map,components:new Map,componentIds:new Map,savedSizeNodes:new Set}}function Jb(e){let n=3,t=[...e.nodes.keys(),...e.variables.keys(),...e.variableCollections.keys(),...[...e.variableCollections.values()].flatMap(r=>r.modes.map(i=>i.modeId))];for(let r of t)/^0:\d+$/.test(r)&&(n=Math.max(n,Number(r.slice(2))+1));return n}function Zb(e,n){e.preserveSourceMetadataDuring(()=>{for(let[t,r]of n){let i=e.getNode(t);if(!i)continue;let o=new Set(Op(e,i).flatMap(a=>a.source.editedFields)),s={};i.width!==r.width&&!o.has("width")&&(s.width=r.width),i.height!==r.height&&!o.has("height")&&(s.height=r.height),Object.keys(s).length>0&&e.updateNode(t,s)}})}function Np(e,n,t,r){for(let a of e.bindingDiagnostics){if(!t.onUnresolvedBinding)throw new Error(`Unresolved binding ${a.sourceId}: ${a.field}`);t.onUnresolvedBinding(a)}let i=e.pages.map(a=>e.readPage(a.id,t)),o=r??qb(e,t),s=e.planComponents(i,t,a=>o.components.has(a));return o.graph.applyImportedStateDuring(()=>Qb(i,s,n,o,r!==void 0),()=>`0:${o.nextImportedId++}`)}function Qb(e,n,t,r,i){let{graph:o,sources:s,components:a,savedSizeNodes:l,componentIds:u}=r,c=new Set(o.nodes.keys()),f=new Map,d=new Map,p=y=>{for(let[C,L]of y)C.derivedSize&&(l.add(L.id),d.set(L.id,{width:L.width,height:L.height})),C.layoutScale!==void 0&&f.set(L.id,C.layoutScale)},g=(y,C)=>{if(y.mainComponentId!==null)return;let L=s.get(y.sourceId);if(L){for(let D of y.children)g(D,L);return}let{nodeType:M,...S}=Gi(y.properties,t);if(M==="DOCUMENT"||M==="VARIABLE")throw new Error(`Unsupported scene type ${M}`);let x=o.createNode(M,C,S);s.set(y.sourceId,x.id),x.type==="COMPONENT"&&u.set(y.sourceId,x.id);for(let D of y.children)g(D,x.id)};for(let y of e)g(y,o.rootId);for(let y of n){if(a.has(y.sourceId))continue;let C=s.get(y.parentSourceId);if(!C)throw new Error(`Unmaterialized component parent ${y.parentSourceId}`);let L=new Map,M=x=>{let D=s.get(x.sourceId),P=D?o.getNode(D):void 0;P&&L.set(x,P),x.mainComponentId===null&&x.children.forEach(M)};M(y.occurrence);let S=Oa(o,C,y.occurrence,u,{blobs:t,sourceChildren:Ra(y.occurrence,a),existingNodes:L});p(S.nodes),Da(y.occurrence,S,a),a.set(y.sourceId,{occurrence:y.occurrence,materialized:S}),u.set(y.sourceId,S.root.id),s.set(y.sourceId,S.root.id)}let m=new Set,h=y=>{if(y.properties.type==="SYMBOL")return;let C=s.get(y.sourceId);if(!C)throw new Error(`Missing source container ${y.sourceId}`);let L=[];for(let S of y.children){if(i&&xa(S,o,a),S.mainComponentId!==null&&!s.has(S.sourceId)){let D=Oa(o,C,S,u,{blobs:t,sourceChildren:Ra(S,a)});p(D.nodes),Da(S,D,a),i&&(QS(o,D),D.root.componentId&&m.add(D.root.id)),s.set(S.sourceId,D.root.id)}else S.mainComponentId===null&&S.properties.type!=="SYMBOL"&&h(S);let x=s.get(S.sourceId);if(!x)throw new Error(`Missing assembled child ${S.sourceId}`);L.push(x)}let M=o.getNode(C);M&&(M.childIds=[...L,...M.childIds.filter(S=>!L.includes(S))])};for(let y of e)h(y);for(let y of m)o.syncInstance(y);m.size>0&&Zb(o,d);for(let y of o.getAllNodes())c.has(y.id)||y.styleRuns.length===0||(y.styleRuns=Gs(y.styleRuns,{variable:C=>C,style:C=>C,node:C=>s.get(C)??C}));let T=[...o.nodes.values()].filter(y=>!c.has(y.id));return r.definitionTypes??=$b(o),yp(o,s,T,r.definitionTypes),o.preserveSourceMetadataDuring(()=>{Ip(o,T),Tb(o,l,T,f),Sb(o,T),bb(o,T)}),r}function Fp(e,n){return{original:()=>new Uint8Array(e.slice(0)),info:n,componentPages:t=>kp(e,t),patch:(t,r)=>wp(e,t,r)}}var Gp=new WeakMap;function yr(e,n){let t=Gp.get(e);t||(t=new Set(e.map(i=>JSON.stringify(i))),Gp.set(e,t));let r=JSON.stringify(n);t.has(r)||(t.add(r),e.push(n))}function Bp(e){return{derivedBounds:!0,onUnresolvedProperty:n=>yr(e,{kind:"property",diagnostic:n}),onUnresolvedAssignment:n=>yr(e,{kind:"assignment",diagnostic:n}),onUnresolvedBinding:n=>yr(e,{kind:"binding",diagnostic:n}),onMissingComponent:n=>yr(e,{kind:"component",diagnostic:n}),onMissingSlotContent:n=>yr(e,{kind:"slot-content",diagnostic:n})}}function Up(e){let n=new Set(e.nodes.keys()),t=new Map,r=new Set,i=new Set,o={createNode:e.createNode.bind(e),createNodeWithId:e.createNodeWithId.bind(e),updateNode:e.updateNode.bind(e),deleteNode:e.deleteNode.bind(e)};function s(a,l){if(!a||r.has(a))return;let u=e.getNode(a);if(!u)return;let c=t.get(a)??{};t.set(a,c);for(let f of l)f in c||Object.assign(c,{[f]:structuredClone(u[f])})}return e.createNode=((a,l,u)=>{s(l,["childIds"]);let c=o.createNode(a,l,u);return r.add(c.id),c}),e.createNodeWithId=((a,l,u,c)=>{s(u,["childIds"]);let f=o.createNodeWithId(a,l,u,c);return r.add(f.id),f}),e.updateNode=((a,l)=>{let u=e.getNode(a);if(u){let c=Object.keys(l).filter(f=>!he(u[f],l[f]));c.length>0&&c.push("source"),"componentId"in l&&c.push("componentId"),("fills"in l||"strokes"in l)&&c.push("boundVariables"),s(a,c)}o.updateNode(a,l)}),e.deleteNode=(a=>{let l=e.getNode(a);s(l?.parentId,["childIds"]);let u=l?[a]:[];for(;u.length>0;){let c=u.pop();if(!c)continue;let f=e.getNode(c);f&&u.push(...f.childIds),n.has(c)?i.add(c):(r.delete(c),t.delete(c))}o.deleteNode(a)}),{before:t,created:r,deleted:i,stop(){e.createNode=o.createNode,e.createNodeWithId=o.createNodeWithId,e.updateNode=o.updateNode,e.deleteNode=o.deleteNode}}}function zp(e,n,t){let r=[];for(let[i,o]of n.before){let s=e.getNode(i);if(!s||n.deleted.has(i))continue;let a={};for(let l of Object.keys(o))he(o[l],s[l])||Object.assign(a,{[l]:structuredClone(s[l])});Object.keys(a).length>0&&r.push([i,a])}return{created:[...n.created].map(i=>e.getNode(i)).filter(i=>i!==void 0).map(i=>[i.id,structuredClone(i)]),updated:r,deleted:[...n.deleted],instanceIndex:[...e.instanceIndex].map(([i,o])=>[i,[...o]]),populatedRootIds:[...t]}}function Hp(e,n="all"){let t=[],r=Vp(e,Bp(t)),i=r.pages.map(a=>({sourceId:a.id,name:a.name,position:a.position,internalOnly:a.internalOnly})),o=new Map;for(let a of r.pages){let l=r.graphPageId(a.id);l&&o.set(l,a.id)}let s=()=>[...r.loadedPageIds].flatMap(a=>{let l=r.graphPageId(a);return l?[l]:[]});if(n==="all")for(let a of i)a.internalOnly||r.loadPage(a.sourceId);else if(n==="first-page"){let a=i.find(l=>!l.internalOnly);a&&r.loadPage(a.sourceId)}return{session:r,diagnostics:t,checkpoint:()=>r.checkpoint(),graph:r.graph,pages:i,populate(a){let l=o.get(a);if(!l)throw new Error(`Unknown graph page ${a}`);let u=!r.loadedPageIds.has(l),c=Up(r.graph);try{return r.loadPage(l),{checkpoint:r.checkpoint(),populated:u,delta:zp(r.graph,c,s())}}finally{c.stop()}}}}var Ir,qn,Pn;function yn(e){Pn?.postMessage(e)}function eE(e){if(!Ir)throw new Error("FIG session has no retained reader");let n=Ir.populate(e.pageId);yn({type:"population-result",requestId:e.requestId,baseRevision:e.baseRevision,...n})}function nE(e){let{requestId:n}=e;try{if(!qn)throw new Error("FIG session has no original archive");if(e.type==="original-archive"){let t=qn.original();Pn?.postMessage({type:"original-archive-result",requestId:n,bytes:t},[t.buffer])}else if(e.type==="archive-info")yn({type:"archive-info-result",requestId:n,info:qn.info()});else if(e.type==="component-pages")yn({type:"component-pages-result",requestId:n,pageIds:qn.componentPages(e.componentIds)});else{let t=qn.patch(e.patch,e.input);Pn?.postMessage({type:"patch-archive-result",requestId:n,bytes:t},[t.buffer])}}catch(t){yn({type:"archive-error",requestId:n,error:t instanceof Error?t.message:String(t)})}}function tE(e){try{if(e.type==="original-archive"||e.type==="archive-info"||e.type==="component-pages"||e.type==="patch-archive"){nE(e);return}if(e.type==="dispose"){Ir=void 0,qn=void 0,yn({type:"disposed"}),Pn?.close(),Pn=void 0,self.close();return}if(e.type==="cancel")return;if(e.type==="retire"){Ir=void 0;return}eE(e)}catch(n){yn({type:"population-error",requestId:e.type==="populate"?e.requestId:void 0,error:n instanceof Error?n.message:String(n)})}}self.onmessage=e=>{let n=e.data;Pn=n.port,Pn.onmessage=r=>tE(r.data),Pn.start();let t=n.buffer.slice(0);try{let r=Hp(n.buffer,n.options?.populate),i=r.session.archiveRecordInfo();qn=Fp(t,()=>i),yn({type:"page-manifest",pages:r.pages}),Ir=n.options?.populate==="first-page"||n.options?.populate==="none"?r:void 0,yn({type:"graph",graph:Cf(r.graph),checkpoint:r.checkpoint(),archiveInfo:i})}catch(r){yn({type:"graph",error:r instanceof Error?r.message:String(r)})}};
