(() => {
  const dialog = document.querySelector('#dash-dialog');
  const canvas = document.querySelector('#dash-canvas');
  const ctx = canvas.getContext('2d');
  const entry = document.querySelector('#game-entry');
  const invite = document.querySelector('#dash-invite');
  const inviteButton = document.querySelector('#dash-invite-open');
  const speech = document.querySelector('#panda-speech');
  const overlay = document.querySelector('#dash-overlay');
  const start = document.querySelector('#dash-start');
  const jumpButton = document.querySelector('#dash-jump');
  const scoreLabel = document.querySelector('#dash-score');
  const bestLabel = document.querySelector('#dash-best');
  const keys = { unlock:'fp-panda-dash-unlocked-v1', taps:'fp-panda-dash-taps-v1', best:'fp-panda-dash-best-v1', introSeen:'fp-panda-dash-intro-seen-v1' };
  const C = { speed:225, acceleration:3.2, maxSpeed:450, jump:-670, jumpRelease:-440, gravity:1450, size:94,
    reaction:.7, recovery:.25, runFrame:.1, playerHit:[22,20,30,7] };
  // Hit insets: left, right, top, bottom. Decorative leaves and stones do not collide.
  const kinds = {
    bamboo_small:  {w:56,h:49,hit:[10,8,15,3],unlock:0,weight:3},
    bamboo_medium: {w:68,h:66,hit:[9,9,17,3],unlock:0,weight:5},
    rock:          {w:68,h:54,hit:[10,9,10,3],unlock:0,weight:3},
    bamboo_large:  {w:79,h:93,hit:[10,10,20,3],unlock:20,weight:2},
    fallen_bamboo: {w:112,h:40,hit:[8,8,16,3],unlock:20,weight:2},
    puddle:        {w:126,h:40,hit:[8,8,27,2],unlock:60,weight:2},
  };
  const names = ['idle','run_01','run_02','run_03','run_04','jump_start','jump_air','jump_land','hit','fall','down','gameover'];
  const pandaImages = {}, obstacleImages = {};
  for (const name of names) {
    const image = new Image(); image.src = 'assets/game/panda/' + name + '.png?v=2'; image.onload = draw;
    pandaImages[name] = image;
  }
  for (const name of Object.keys(kinds)) {
    const image = new Image(); image.src = 'assets/game/obstacles/' + name + '.png'; image.onload = draw;
    obstacleImages[name] = image;
  }
  const oldPanda = new Image(); oldPanda.src = 'assets/panda.png'; oldPanda.onload = draw;
  const read = key => { try { return Math.max(0, Number(localStorage.getItem(key)) || 0); } catch { return 0; } };
  const save = (key,value) => { try { localStorage.setItem(key,String(value)); } catch {} };
  const digits = value => String(Math.floor(value)).padStart(5,'0');
  let unlocked = read(keys.unlock) === 1, taps = read(keys.taps), best = read(keys.best), introSeen = read(keys.introSeen) === 1;
  let W=800,H=300,ground=251,state='START',frame=0,lastTime=0,elapsed=0,distance=0,spawnIn=1,deathTime=0,runTime=0;
  let obstacles=[];
  const player={x:105,y:ground-C.size,w:C.size,h:C.size,vy:0,jumpTime:0,landTime:0,peak:0};
  entry.hidden=!unlocked;
  invite.hidden=!unlocked||introSeen;
  if(unlocked&&!introSeen){speech.textContent='……見つかっちゃった！\nひみつの特訓へ行く？';speech.classList.add('dash-discovered')}
  scoreLabel.textContent=digits(0); bestLabel.textContent=digits(best);

  function fit() {
    const rect=canvas.getBoundingClientRect();
    if(!rect.width||!rect.height)return;
    const oldW=W,above=ground-player.y-player.h;
    W=Math.round(rect.width); H=Math.round(rect.height); ground=H-49;
    const dpr=Math.min(window.devicePixelRatio||1,3);
    canvas.width=Math.round(W*dpr); canvas.height=Math.round(H*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    player.x=Math.max(28,Math.min(105,W*.14));
    player.y=ground-player.h-above;
    obstacles.forEach(o=>o.x+=W-oldW);
    draw();
  }
  window.addEventListener('resize',()=>{if(dialog.open)fit()});
  function open(found=false) {
    if(dialog.open)return;
    if(unlocked&&!introSeen){introSeen=true;save(keys.introSeen,1);invite.hidden=true;speech.classList.remove('dash-discovered')}
    state='START'; canvas.dataset.state=state;
    overlay.textContent=found?'ひみつの特訓、見つかっちゃった！\nスタートを押してね':'スタートを押してね';
    overlay.hidden=false; dialog.showModal(); fit(); start.focus();
  }
  window.pandaDashTap=()=>{
    if(unlocked)return;
    taps=Math.min(15,taps+1); save(keys.taps,taps);
    if(taps<15)return;
    unlocked=true; save(keys.unlock,1); entry.hidden=false;
    speech.textContent='……見つかっちゃった！\nひみつの特訓へ行く？';
    speech.classList.add('dash-discovered');
    invite.hidden=false;
  };
  entry.onclick=()=>open();
  inviteButton.onclick=()=>open(true);
  function speed() {
    const visible=W-(player.x+player.w-C.playerHit[1]);
    return Math.min(C.maxSpeed,C.speed+elapsed*C.acceleration,Math.max(125,visible/C.reaction));
  }
  function choose() {
    const pool=Object.entries(kinds).filter(([,k])=>elapsed>=k.unlock);
    let r=Math.random()*pool.reduce((sum,[,k])=>sum+k.weight,0);
    for(const [name,k] of pool){r-=k.weight;if(r<=0)return name}
    return pool.at(-1)[0];
  }
  function delayAfter(name) {
    const r=Math.random();
    const extra=r<.3?.05+Math.random()*.16:r<.78?.28+Math.random()*.28:.65+Math.random()*.38;
    // A complete jump and grounded recovery after the preceding obstacle.
    return -2*C.jump/C.gravity+C.recovery+extra+kinds[name].w/speed();
  }
  function begin() {
    cancelAnimationFrame(frame); fit();
    state='PLAYING'; canvas.dataset.state=state;
    lastTime=0;elapsed=0;distance=0;runTime=0;deathTime=0;spawnIn=.9+Math.random()*.45;obstacles=[];
    player.y=ground-player.h;player.vy=0;player.jumpTime=0;player.landTime=0;player.peak=0;
    scoreLabel.textContent=digits(0);overlay.hidden=true;
    start.disabled=true;start.textContent='走行中';jumpButton.disabled=false;
    canvas.focus();frame=requestAnimationFrame(tick);
  }
  function jump(){
    if(state!=='PLAYING'||player.y<ground-player.h-.5||player.vy!==0)return;
    player.vy=C.jump;player.jumpTime=0;player.landTime=0;player.peak=0;
  }
  function releaseJump(){
    // Letting go while rising cuts the remaining upward speed. A tap makes a low jump;
    // holding until near the apex keeps the original full-height trajectory.
    if(state==='PLAYING'&&player.vy<C.jumpRelease)player.vy=C.jumpRelease;
  }
  function finish(message) {
    const score=Math.floor(distance/10);
    if(score>best){best=score;save(keys.best,best);bestLabel.textContent=digits(best)}
    state='GAME_OVER';canvas.dataset.state=state;
    overlay.textContent=message+'\n距離 '+digits(score)+' m　ベスト '+digits(best)+' m';
    overlay.hidden=false;start.disabled=false;start.textContent='もう一度';jumpButton.disabled=true;draw();
  }
  function collision(o) {
    const k=kinds[o.name], [pl,pr,pt,pb]=C.playerHit, [ol,or,ot,ob]=k.hit;
    const ax=player.x+pl,ay=player.y+pt,aw=player.w-pl-pr,ah=player.h-pt-pb;
    const bx=o.x+ol,by=ground-k.h+ot,bw=k.w-ol-or,bh=k.h-ot-ob;
    return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by;
  }
  function tick(now) {
    if(state!=='PLAYING'&&state!=='GAME_OVER_ANIMATION')return;
    const dt=lastTime?Math.min((now-lastTime)/1000,.035):0;lastTime=now;
    if(state==='GAME_OVER_ANIMATION'){
      deathTime+=dt;
      if(deathTime>=.84){finish('あっ！ ぶつかっちゃった！');return}
      draw();frame=requestAnimationFrame(tick);return;
    }
    elapsed+=dt;runTime+=dt;const v=speed();distance+=v*dt;scoreLabel.textContent=digits(distance/10);
    if(player.vy!==0||player.y<ground-player.h){
      player.vy+=C.gravity*dt;player.y=Math.min(ground-player.h,player.y+player.vy*dt);player.jumpTime+=dt;
      player.peak=Math.max(player.peak,ground-player.y-player.h);
      if(player.y>=ground-player.h){player.y=ground-player.h;player.vy=0;player.landTime=.12}
    }else if(player.landTime>0)player.landTime=Math.max(0,player.landTime-dt);
    spawnIn-=dt;
    if(spawnIn<=0){const name=choose();obstacles.push({name,x:W+5});spawnIn=delayAfter(name)}
    obstacles.forEach(o=>o.x-=v*dt);
    obstacles=obstacles.filter(o=>o.x+kinds[o.name].w>-5);
    if(obstacles.some(collision)){state='GAME_OVER_ANIMATION';canvas.dataset.state=state;deathTime=0;jumpButton.disabled=true}
    draw();frame=requestAnimationFrame(tick);
  }
  function background() {
    const sky=ctx.createLinearGradient(0,0,0,H);sky.addColorStop(0,'#eef6e7');sky.addColorStop(1,'#dcebd0');
    ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff8d5';ctx.beginPath();ctx.arc(W-65,Math.min(75,H*.18),31,0,Math.PI*2);ctx.fill();
    const offset=distance*.18%120;
    for(let x=-120-offset;x<W+120;x+=120){
      ctx.fillStyle='#c0d9ae';ctx.fillRect(x+27,72,12,ground-72);
      ctx.fillStyle='#a9cc96';ctx.fillRect(x+26,112,14,4);ctx.fillRect(x+26,166,14,4);
      ctx.beginPath();ctx.ellipse(x+10,117,24,7,-.4,0,Math.PI*2);ctx.ellipse(x+57,170,25,7,.4,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle='#c0d9a4';ctx.fillRect(0,ground,W,H-ground);
    ctx.fillStyle='#85a76f';ctx.fillRect(0,ground,W,5);
    ctx.fillStyle='#9fbc88';for(let x=-(distance%48);x<W;x+=48)ctx.fillRect(x,ground+25,25,3);
  }
  function sprite() {
    if(state==='GAME_OVER_ANIMATION')return deathTime<.16?'hit':deathTime<.34?'fall':deathTime<.57?'down':'gameover';
    if(state==='GAME_OVER')return 'gameover';
    if(state==='START')return 'idle';
    if(player.y<ground-player.h-.5)return player.jumpTime<.1?'jump_start':'jump_air';
    if(player.landTime>0)return 'jump_land';
    return 'run_0'+(Math.floor(runTime/C.runFrame)%4+1);
  }
  function draw() {
    if(!ctx)return;
    background();
    for(const o of obstacles){
      const k=kinds[o.name],image=obstacleImages[o.name];
      const visualY=ground-k.h+(o.name==='puddle'?9:0);
      if(image.complete&&image.naturalWidth)ctx.drawImage(image,o.x,visualY,k.w,k.h);
      else{ctx.fillStyle=o.name==='puddle'?'#66bce1':o.name==='rock'?'#857e6d':'#4d8e56';
        ctx.beginPath();ctx.roundRect(o.x+5,visualY+8,k.w-10,k.h-8,9);ctx.fill()}
    }
    const name=sprite(),image=pandaImages[name];canvas.dataset.sprite=name;canvas.dataset.jumpPeak=String(Math.round(player.peak));
    if(image.complete&&image.naturalWidth)ctx.drawImage(image,player.x,player.y,player.w,player.h);
    else if(oldPanda.complete&&oldPanda.naturalWidth)ctx.drawImage(oldPanda,player.x,player.y,player.w,player.h);
    else{ctx.fillStyle='#fffefa';ctx.beginPath();ctx.arc(player.x+45,player.y+45,34,0,Math.PI*2);ctx.fill()}
  }
  start.onclick=begin;jumpButton.onclick=jump;
  canvas.onpointerdown=e=>{e.preventDefault();jump()};
  jumpButton.onpointerdown=e=>{e.preventDefault();jump()};
  window.addEventListener('pointerup',releaseJump);
  window.addEventListener('pointercancel',releaseJump);
  window.addEventListener('keyup',e=>{if(e.code==='Space'||e.code==='ArrowUp')releaseJump()});
  window.addEventListener('blur',releaseJump);
  dialog.addEventListener('keydown',e=>{
    if((e.code==='Space'||e.code==='ArrowUp')&&state==='PLAYING'){e.preventDefault();if(!e.repeat)jump()}
    else if((e.code==='Space'||e.code==='Enter')&&(state==='START'||state==='GAME_OVER')){e.preventDefault();if(!e.repeat)begin()}
  });
  document.querySelector('#dash-close').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{cancelAnimationFrame(frame);state='START';canvas.dataset.state=state;
    start.disabled=false;start.textContent='スタート';jumpButton.disabled=true});
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&dialog.open&&(state==='PLAYING'||state==='GAME_OVER_ANIMATION')){cancelAnimationFrame(frame);finish('ちょっと休憩！')}
  });
  canvas.dataset.state=state;draw();
})();
