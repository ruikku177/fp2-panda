(() => {
  const dialog=document.querySelector('#dash-dialog');
  const canvas=document.querySelector('#dash-canvas');
  const ctx=canvas.getContext('2d');
  const entry=document.querySelector('#game-entry');
  const overlay=document.querySelector('#dash-overlay');
  const startButton=document.querySelector('#dash-start');
  const jumpButton=document.querySelector('#dash-jump');
  const scoreLabel=document.querySelector('#dash-score');
  const bestLabel=document.querySelector('#dash-best');
  const unlockKey='fp-panda-dash-unlocked-v1';
  const tapsKey='fp-panda-dash-taps-v1';
  const bestKey='fp-panda-dash-best-v1';
  let W=800,H=300,ground=250;
  const panda=new Image();panda.src='assets/panda.png';panda.onload=draw;
  const readNumber=key=>{try{return Math.max(0,Number(localStorage.getItem(key))||0);}catch{return 0;}};
  const save=(key,value)=>{try{localStorage.setItem(key,String(value));}catch{}};
  let unlocked=readNumber(unlockKey)===1;
  let taps=readNumber(tapsKey);
  let best=readNumber(bestKey);
  let running=false,frameId=0,lastTime=0,distance=0,spawnIn=1.1;
  let obstacles=[];
  const player={x:105,y:ground-76,w:76,h:76,velocity:0};
  entry.hidden=!unlocked;
  bestLabel.textContent=best;

  function fitCanvas(){
    const bounds=canvas.getBoundingClientRect();
    if(!bounds.width||!bounds.height)return;
    const oldW=W,oldGround=ground,feetAboveGround=oldGround-player.y-player.h;
    W=Math.round(bounds.width);H=Math.round(bounds.height);ground=H-49;
    const ratio=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.round(W*ratio);canvas.height=Math.round(H*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
    player.x=Math.max(47,Math.min(105,W*.16));
    player.y=ground-player.h-feetAboveGround;
    obstacles.forEach(obstacle=>obstacle.x+=W-oldW);
    draw();
  }
  window.addEventListener('resize',()=>{if(dialog.open)fitCanvas();});
  const nextSpawnDelay=()=>Math.random()<.38?1.05+Math.random()*.38:1.65+Math.random()*.95;

  function openGame(found=false){
    if(dialog.open)return;
    overlay.textContent=found?'ひみつの特訓、見つかっちゃった！\nスタートを押してね':'スタートを押してね';
    overlay.hidden=false;
    dialog.showModal();
    fitCanvas();
    startButton.focus();
  }
  window.pandaDashTap=()=>{
    if(unlocked)return;
    taps=Math.min(15,taps+1);save(tapsKey,taps);
    if(taps<15)return;
    unlocked=true;save(unlockKey,1);entry.hidden=false;
    document.querySelector('#panda-speech').textContent='……見つかっちゃった！\nひみつの特訓へ！';
    openGame(true);
  };
  entry.onclick=()=>openGame();

  function startGame(){
    cancelAnimationFrame(frameId);
    fitCanvas();
    running=true;lastTime=0;distance=0;spawnIn=.7+Math.random()*.7;obstacles=[];
    player.y=ground-player.h;player.velocity=0;
    scoreLabel.textContent='0';overlay.hidden=true;
    startButton.disabled=true;startButton.textContent='走行中';jumpButton.disabled=false;
    frameId=requestAnimationFrame(tick);
  }
  function jump(){
    if(!running)return;
    if(player.y>=ground-player.h-1)player.velocity=-610;
  }
  function endGame(message){
    if(!running)return;
    running=false;cancelAnimationFrame(frameId);
    const score=Math.floor(distance/10);
    if(score>best){best=score;save(bestKey,best);bestLabel.textContent=best;}
    overlay.textContent=`${message}\n距離 ${score} m　ベスト ${best} m`;
    overlay.hidden=false;
    startButton.disabled=false;startButton.textContent='もう一度';jumpButton.disabled=true;
    draw();
  }
  function tick(now){
    if(!running)return;
    const dt=lastTime?Math.min((now-lastTime)/1000,.035):0;lastTime=now;
    const speed=Math.min(460,230+distance/120);
    distance+=speed*dt;
    scoreLabel.textContent=Math.floor(distance/10);
    player.velocity+=1450*dt;player.y=Math.min(ground-player.h,player.y+player.velocity*dt);
    if(player.y===ground-player.h)player.velocity=0;
    spawnIn-=dt;
    if(spawnIn<=0){
      const rock=Math.random()<.5;
      obstacles.push({x:W+10,w:rock?42:59,h:rock?36:28,type:rock?'rock':'bamboo'});
      spawnIn=nextSpawnDelay();
    }
    obstacles.forEach(obstacle=>obstacle.x-=speed*dt);
    obstacles=obstacles.filter(obstacle=>obstacle.x+obstacle.w>0);
    if(obstacles.some(obstacle=>player.x+15<obstacle.x+obstacle.w-6&&player.x+player.w-15>obstacle.x+6&&player.y+player.h-7>ground-obstacle.h+5&&player.y+18<ground-5)){
      endGame('あっ！ ぶつかっちゃった！');return;
    }
    draw();frameId=requestAnimationFrame(tick);
  }
  function draw(){
    const sky=ctx.createLinearGradient(0,0,0,H);
    sky.addColorStop(0,'#eef6e7');sky.addColorStop(1,'#dcebd0');
    ctx.fillStyle=sky;ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#fff8d5';ctx.beginPath();ctx.arc(W-65,Math.min(75,H*.18),31,0,Math.PI*2);ctx.fill();
    const offset=(distance*.18)%120;
    for(let x=-120-offset;x<W+120;x+=120){
      ctx.fillStyle='#c0d9ae';ctx.fillRect(x+27,72,12,ground-72);
      ctx.fillStyle='#a9cc96';ctx.fillRect(x+26,112,14,4);ctx.fillRect(x+26,166,14,4);
      ctx.beginPath();ctx.ellipse(x+10,117,24,7,-.4,0,Math.PI*2);ctx.ellipse(x+57,170,25,7,.4,0,Math.PI*2);ctx.fill();
    }
    ctx.fillStyle='#c0d9a4';ctx.fillRect(0,ground,W,H-ground);
    ctx.fillStyle='#85a76f';ctx.fillRect(0,ground,W,5);
    const groundOffset=distance%48;
    ctx.fillStyle='#9fbc88';for(let x=-groundOffset;x<W;x+=48)ctx.fillRect(x,ground+25,25,3);
    obstacles.forEach(obstacle=>{
      if(obstacle.type==='rock'){
        ctx.fillStyle='#857e6d';ctx.beginPath();ctx.moveTo(obstacle.x,ground);ctx.lineTo(obstacle.x+6,ground-20);ctx.lineTo(obstacle.x+20,ground-obstacle.h);ctx.lineTo(obstacle.x+35,ground-28);ctx.lineTo(obstacle.x+obstacle.w,ground);ctx.closePath();ctx.fill();
        ctx.fillStyle='#aba694';ctx.fillRect(obstacle.x+15,ground-24,9,3);
      }else{
        ctx.fillStyle='#5b8e59';ctx.fillRect(obstacle.x,ground-obstacle.h,obstacle.w,obstacle.h-3);
        ctx.fillStyle='#8fba79';ctx.fillRect(obstacle.x+5,ground-obstacle.h+5,obstacle.w-10,4);
        ctx.fillStyle='#3f7148';ctx.fillRect(obstacle.x+17,ground-obstacle.h,4,obstacle.h-3);ctx.fillRect(obstacle.x+39,ground-obstacle.h,4,obstacle.h-3);
      }
    });
    if(panda.complete&&panda.naturalWidth)ctx.drawImage(panda,player.x,player.y,player.w,player.h);
    else{ctx.fillStyle='#fffefa';ctx.beginPath();ctx.arc(player.x+38,player.y+38,30,0,Math.PI*2);ctx.fill();ctx.fillStyle='#263c32';ctx.fillRect(player.x+25,player.y+30,7,7);ctx.fillRect(player.x+45,player.y+30,7,7);}
  }
  startButton.onclick=startGame;
  jumpButton.onclick=jump;
  canvas.onpointerdown=event=>{event.preventDefault();jump();};
  dialog.addEventListener('keydown',event=>{
    if(running&&(event.code==='Space'||event.code==='ArrowUp')){event.preventDefault();if(!event.repeat)jump();}
  });
  document.querySelector('#dash-close').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>{running=false;cancelAnimationFrame(frameId);startButton.disabled=false;startButton.textContent='スタート';jumpButton.disabled=true;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)endGame('ちょっと休憩！');});
  draw();
})();
