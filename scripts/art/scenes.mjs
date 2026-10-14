// Placeholder artwork drawn with CSS. Replaced by real photography/footage later.
// Each entry: [name, width, height, html-body]. Shared helpers inject bokeh + emoji props.

const bokeh = (seed, n, hues, area = 'top:0;left:0;right:0;height:55%') => `
<div class="bokeh" style="position:absolute;${area}" data-seed="${seed}" data-n="${n}" data-hues="${hues}"></div>`

const base = (bg, inner) => `
<div style="position:absolute;inset:0;background:${bg};overflow:hidden">${inner}</div>`

const emoji = (ch, x, y, size, extra = '') =>
  `<span style="position:absolute;left:${x}%;top:${y}%;font-size:${size}px;line-height:1;transform:translate(-50%,-50%);filter:drop-shadow(0 18px 24px rgba(40,20,5,.45)) ${extra}">${ch}</span>`

export const heroScenes = [
  [
    'scene-shopfront',
    base(
      'linear-gradient(180deg,#2b1a10 0%,#5a3519 38%,#a8692f 70%,#d9a463 100%)',
      `
      ${bokeh(1, 38, '38,45,30')}
      <div style="position:absolute;left:28%;right:4%;top:22%;height:10px;background:#3b2414;filter:blur(1px)"></div>
      <div style="position:absolute;left:28%;right:4%;top:44%;height:10px;background:#3b2414;filter:blur(1px)"></div>
      <div style="position:absolute;left:30%;right:6%;top:9%;height:13%;display:flex;gap:1.6%;align-items:flex-end;filter:blur(2.5px)">
        ${Array.from({ length: 12 }, (_, i) => `<i style="flex:1;height:${60 + ((i * 37) % 35)}%;border-radius:50% 50% 30% 30%;background:radial-gradient(circle at 40% 30%,#f1b56c,#a5602b)"></i>`).join('')}
      </div>
      <div style="position:absolute;left:30%;right:6%;top:31%;height:13%;display:flex;gap:2%;align-items:flex-end;filter:blur(2.5px)">
        ${Array.from({ length: 10 }, (_, i) => `<i style="flex:1;height:${55 + ((i * 53) % 40)}%;border-radius:45%;background:radial-gradient(circle at 40% 30%,#f6c27f,#9c5526)"></i>`).join('')}
      </div>
      <div style="position:absolute;left:18%;right:-2%;bottom:0;height:40%;background:linear-gradient(180deg,rgba(255,240,215,.35),rgba(120,70,30,.85));border-top:6px solid rgba(255,235,200,.55);box-shadow:0 -30px 60px rgba(255,190,110,.25)"></div>
      ${emoji('🎂', 40, 73, 170)}${emoji('🧁', 54, 76, 120)}${emoji('🍩', 66, 77, 120)}${emoji('🥐', 79, 75, 135)}${emoji('🍪', 91, 78, 110)}
      `,
    ),
  ],
  [
    'scene-kitchen',
    base(
      'linear-gradient(180deg,#1d1410 0%,#3d271a 45%,#6e4526 100%)',
      `
      <div style="position:absolute;left:34%;top:20%;width:40%;height:52%;border-radius:22px;background:linear-gradient(180deg,#8d8c88,#4b4a47);box-shadow:inset 0 0 0 10px #a9a7a2,0 40px 80px rgba(0,0,0,.5)"></div>
      <div style="position:absolute;left:39%;top:30%;width:30%;height:28%;border-radius:12px;background:radial-gradient(ellipse at 50% 60%,#ffd27a 0%,#ff9a3c 35%,#a3410f 80%);box-shadow:0 0 120px 40px rgba(255,140,50,.45)"></div>
      ${emoji('🍞', 47, 49, 110)}${emoji('🥖', 60, 48, 110)}
      <div style="position:absolute;right:3%;top:8%;width:18%;height:84%;background:repeating-linear-gradient(180deg,transparent 0 38px,rgba(210,200,190,.55) 38px 44px);border-left:8px solid #b9b3ab;border-right:8px solid #b9b3ab;filter:blur(1px)"></div>
      ${Array.from({ length: 9 }, (_, i) => `<div style="position:absolute;left:${36 + (i * 7) % 34}%;top:${8 + (i * 11) % 22}%;width:${180 + (i * 40) % 160}px;height:${180 + (i * 40) % 160}px;border-radius:50%;background:rgba(255,245,235,.16);filter:blur(38px)"></div>`).join('')}
      ${bokeh(2, 14, '28,35', 'top:0;left:20%;right:0;height:30%')}
      `,
    ),
  ],
  [
    'scene-window',
    base(
      'linear-gradient(180deg,#f3d29c 0%,#e2a361 42%,#9a5a2c 70%,#5b3219 100%)',
      `
      <div style="position:absolute;right:6%;top:-12%;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(255,250,225,.95),rgba(255,214,140,.35) 45%,transparent 70%)"></div>
      <div style="position:absolute;left:24%;right:2%;top:18%;height:46%;filter:blur(6px);background:linear-gradient(90deg,#6b3d1e 0 8%,transparent 8% 46%,#6b3d1e 46% 50%,transparent 50% 92%,#6b3d1e 92%)"></div>
      ${bokeh(3, 34, '35,42,45', 'top:10%;left:20%;right:0;height:50%')}
      <div style="position:absolute;left:0;right:0;bottom:0;height:30%;background:repeating-linear-gradient(90deg,#8a5328 0 120px,#7a4721 120px 124px);box-shadow:0 -10px 40px rgba(60,30,10,.4)"></div>
      <div style="position:absolute;left:52%;bottom:9%;width:250px;height:40px;border-radius:50%;background:#efe7dc;box-shadow:0 10px 20px rgba(0,0,0,.35)"></div>
      ${emoji('☕', 58, 76, 200)}${emoji('🥐', 81, 80, 220)}
      `,
    ),
  ],
]

const macaron = (x, y, s, c) => `
<div style="position:absolute;left:${x}%;top:${y}%;width:${s}px;transform:translate(-50%,-50%);filter:drop-shadow(0 14px 16px rgba(60,30,20,.35))">
  <div style="height:${s * 0.36}px;border-radius:50% 50% 38% 38%;background:radial-gradient(circle at 35% 30%,#fff8,transparent 40%),${c}"></div>
  <div style="height:${s * 0.13}px;margin:-2px 6%;border-radius:8px;background:#fbf3e6;box-shadow:inset 0 0 0 3px ${c}55"></div>
  <div style="height:${s * 0.32}px;border-radius:38% 38% 50% 50%;background:${c}"></div>
</div>`

export const categoryScenes = [
  ['cat-cakes', base('radial-gradient(circle at 30% 20%,#fde6d6,#e9b99a 70%)', `${emoji('🎂', 50, 56, 230)}${emoji('🍓', 22, 74, 70)}${emoji('🍓', 80, 30, 56)}`)],
  ['cat-cookies', base('radial-gradient(circle at 70% 30%,#cde7e4,#3f8b86 75%)', `${emoji('🍪', 38, 58, 170)}${emoji('🍪', 62, 46, 170)}${emoji('🍪', 50, 70, 120)}`)],
  ['cat-macarons', base('radial-gradient(circle at 40% 30%,#f8ece6,#d9b6a8 75%)', `${macaron(30, 60, 150, '#f2a8a0')}${macaron(52, 46, 150, '#c9de9a')}${macaron(74, 62, 150, '#f6dc8a')}${macaron(52, 76, 120, '#d9b8e8')}`)],
  ['cat-pastries', base('radial-gradient(circle at 60% 30%,#f9e1e4,#d99aa6 75%)', `${emoji('🍰', 50, 56, 210)}${emoji('🍫', 20, 76, 64)}${emoji('🍒', 82, 28, 60)}`)],
]

/** Product shot. variant 1 = full composition; variant 2 = closer crop on the hero prop with soft light. */
export function productScene(bg, props, variant) {
  const [light, dark] = bg.split(',')
  const draw = ([what, x, y, size]) =>
    what.startsWith('#') ? macaron(x, y, size, what) : emoji(what, x, y, size)
  if (variant === 1) {
    return base(`radial-gradient(circle at 35% 25%,${light},${dark} 80%)`, props.map(draw).join(''))
  }
  const [main, ...rest] = props
  return base(
    `radial-gradient(circle at 70% 70%,${light},${dark} 90%)`,
    `<div style="position:absolute;inset:0;transform:scale(1.55) translate(4%,-6%)">${draw(main)}${rest.map(draw).join('')}</div>
     <div style="position:absolute;inset:0;background:radial-gradient(circle at 20% 15%,rgba(255,255,255,.45),transparent 45%)"></div>`,
  )
}
