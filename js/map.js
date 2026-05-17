export function drawMap(canvas, scenario, band) {
  console.log('drawMap invoked', {band, scenarioId: scenario.id});
  try {
  const ctx = canvas.getContext('2d')
  const W = canvas.width  = canvas.clientWidth  || 600
  const H = canvas.height = canvas.clientHeight || 400
  ctx.fillStyle = '#060e1c'
  ctx.fillRect(0,0,W,H)

  // India outline
  ctx.fillStyle = 'rgba(20,60,20,.45)'
  ctx.strokeStyle = 'rgba(56,189,248,.2)'
  ctx.lineWidth = 1
  ctx.beginPath()
  const pts = [[.28,.02],[.72,.02],[.76,.12],[.80,.28],
               [.78,.48],[.72,.62],[.68,.75],[.60,.88],
               [.50,.98],[.44,.88],[.38,.75],[.30,.60],
               [.24,.45],[.22,.28],[.26,.12]]
  pts.forEach(([x,y],i) =>
    i ? ctx.lineTo(x*W,y*H) : ctx.moveTo(x*W,y*H))
  ctx.closePath()
  ctx.fill()
  ctx.stroke()

  // PRNG seed based on scenario ID and band
  const seed = [...scenario.id].reduce(
    (a,c)=>a+c.charCodeAt(0)*31,0) +
    band.charCodeAt(0)*7
  const rng = mulberry32(seed)

  const COV = {
    convective_burst:.82, active_monsoon:.86,
    stratiform:.79, shallow_warm:.50, orographic:.80,
    fy4a:.84, btd_challenge:.80, gpm_radar:.74,
    kalpana:.72, coast_storm:.78,
    conv_vs_strat:.78, geo_diag:.74
  }
  const cov = COV[scenario.mapType] ?? .75
  const threshold = 1 - cov

  const n1 = makeNoiseGrid( 6, 5,W,H,rng)
  const n2 = makeNoiseGrid(12,10,W,H,rng)
  const n3 = makeNoiseGrid(24,20,W,H,rng)
  const env = makeEnvelope(scenario.mapType,W,H,rng)

  const img = ctx.createImageData(W,H)
  const d = img.data
  for(let y=0;y<H;y++){
    for(let x=0;x<W;x++){
      const v = bilerp(n1,x,y,W,H)*.50 +
                bilerp(n2,x,y,W,H)*.35 +
                bilerp(n3,x,y,W,H)*.15
      const ev = v * env(x,y)
      const i = (y*W+x)*4
      if(ev < threshold){
        d[i]=9;d[i+1]=20;d[i+2]=40;d[i+3]=255
        continue
      }
      const t = Math.min((ev-threshold)/(1-threshold),1)
      const [r,g,b] = toRGB(t,band)
      d[i]=r;d[i+1]=g;d[i+2]=b;d[i+3]=255
    }
  }
  ctx.putImageData(img,0,0)

  // Grid lines
  ctx.strokeStyle='rgba(56,189,248,.06)'
  ctx.lineWidth=1
  for(let x=0;x<=W;x+=W/7){
    ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H)
    ctx.stroke()
  }
  for(let y=0;y<=H;y+=H/5){
    ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y)
    ctx.stroke()
  }

  // Colorbar
  const bw=12,bh=90,bx=W-38,by=H-110
  const gr=ctx.createLinearGradient(0,by,0,by+bh)
  if(band==='IR'){
    gr.addColorStop(0,'#ffffff')
    gr.addColorStop(.35,'#b4dcff')
    gr.addColorStop(.65,'#50c8b4')
    gr.addColorStop(1,'#dcb43c')
  } else if(band==='WV'){
    gr.addColorStop(0,'#f5f5ff')
    gr.addColorStop(.5,'#a078ff')
    gr.addColorStop(1,'#322882')
  } else {
    gr.addColorStop(0,'#f05050')
    gr.addColorStop(.45,'#fada50')
    gr.addColorStop(1,'#3cb4dc')
  }
  ctx.fillStyle=gr
  ctx.fillRect(bx,by,bw,bh)
  ctx.strokeStyle='rgba(255,255,255,.25)'
  ctx.lineWidth=.5
  ctx.strokeRect(bx,by,bw,bh)
  ctx.fillStyle='rgba(255,255,255,.6)'
  ctx.font='8px monospace'
  const tl=band==='IR'?'200K':band==='WV'?'DRY':'+'
  const bl=band==='IR'?'275K':band==='WV'?'WET':'−'
  ctx.fillText(tl,bx+bw+3,by+8)
  ctx.fillText(bl,bx+bw+3,by+bh)
  } catch (e) {
    console.error('drawMap error:', e);
    // Fallback placeholder rendering
    if (canvas) {
      const ctx = canvas.getContext('2d');
      const W = canvas.width = canvas.clientWidth || 600;
      const H = canvas.height = canvas.clientHeight || 400;
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#fff';
      ctx.font = '14px var(--fm)';
      ctx.textAlign = 'center';
      ctx.fillText('Map unavailable', W / 2, H / 2);
    }
  }
}

function mulberry32(a){
  return()=>{
    let t=a+=0x6D2B79F5
    t=Math.imul(t^t>>>15,1|t)
    t=(t+Math.imul(t^t>>>7,61|t))^t
    return((t^t>>>14)>>>0)/4294967296
  }
}

function makeNoiseGrid(gx,gy,W,H,rng){
  const g=new Float32Array((gx+1)*(gy+1))
  for(let i=0;i<g.length;i++) g[i]=rng()
  return {g,gx,gy}
}

function bilerp({g,gx,gy},x,y,W,H){
  const fx=x/W*gx, fy=y/H*gy
  const ix=Math.min(Math.floor(fx),gx-1)
  const iy=Math.min(Math.floor(fy),gy-1)
  const tx=fx-ix, ty=fy-iy
  const sx=tx*tx*(3-2*tx), sy=ty*ty*(3-2*ty)
  const get=(a,b)=>g[Math.min(b,gy)*(gx+1)+Math.min(a,gx)]
  return get(ix,iy)*(1-sx)*(1-sy)+
         get(ix+1,iy)*sx*(1-sy)+
         get(ix,iy+1)*(1-sx)*sy +
         get(ix+1,iy+1)*sx*sy
}

function makeEnvelope(type,W,H,rng){
  const cx=W/2,cy=H/2
  if(['convective_burst','coast_storm','fy4a','btd_challenge'].includes(type)){
    const ex=W*(.35+rng()*.3),ey=H*(.35+rng()*.3)
    const rx=W*.42,ry=H*.44
    return(x,y)=>Math.max(0,1-Math.sqrt(((x-ex)/rx)**2+((y-ey)/ry)**2)*.85)
  }
  if(['active_monsoon','conv_vs_strat'].includes(type)){
    return(x,y)=>{
      const t=(y-H*.1)/(H*.85)
      if(t<0||t>1) return .25
      return Math.sin(t*Math.PI*2.5+x/W*1.5)*.2+.8
    }
  }
  if(type==='orographic'){
    const rx=W*.28
    return(x,y)=>Math.max(.2,1-Math.abs(x-rx)/(W*.26)*.9)
  }
  if(['stratiform','gpm_radar','geo_diag','kalpana'].includes(type)){
    return(x,y)=>{
      const d=Math.sqrt(((x-cx)/W)**2+((y-cy)/H)**2)
      return Math.max(.55,1-d*.35)
    }
  }
  return()=>1
}

function toRGB(t,band){
  const L=(a,b,f)=>Math.round(a+(b-a)*Math.max(0,Math.min(1,f)))
  if(band==='IR'){
    if(t<.2) return[255,255,255]
    if(t<.45){const f=(t-.2)/.25;return[L(255,180,f),L(255,220,f),255]}
    if(t<.70){const f=(t-.45)/.25;return[L(180,80,f),L(220,200,f),L(255,180,f)]}
    const f=(t-.70)/.30;return[L(80,220,f),L(200,180,f),L(180,55,f)]
  }
  if(band==='WV'){
    if(t<.33) return[245,245,255]
    if(t<.66){const f=(t-.33)/.33;return[L(245,160,f),L(245,120,f),255]}
    const f=(t-.66)/.34;return[L(160,50,f),L(120,40,f),L(255,130,f)]
  }
  // BTD
  if(t<.33) return[240,80,80]
  if(t<.66){const f=(t-.33)/.33;return[L(240,250,f),L(80,220,f),L(80,50,f)]}
  const f=(t-.66)/.34;return[L(250,55,f),L(220,178,f),L(50,218,f)]
}
