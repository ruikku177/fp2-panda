// Home presentation only. Saved progress and quiz sessions are owned by app.js.
function homeRemainingIds(){
 return session?.ids.filter(id=>!session.responses?.[id])||[];
}
function renderHomeContinue(){
 const remaining=homeRemainingIds(),card=$('#continue-card');
 card.disabled=!remaining.length;
 if(remaining.length){
  const q=byId.get(remaining[0]);
  const scope=[...new Set(remaining.map(id=>byId.get(id).chapter))];
  const scopeLabel=scope.length>1?scope.map(n=>`第${n}章`).join('・'):q.chapterName;
  $('#continue-title').textContent=scopeLabel;
  $('#continue-detail').innerHTML=`あと <b>${remaining.length}</b><small>問</small>`;
  card.setAttribute('aria-label',`前回の続き。${scopeLabel}。あと${remaining.length}問`);
  $('#home-start-detail').textContent=`前回の続き・あと${remaining.length}問`;
 }else{
  $('#continue-title').textContent='まだありません';
  $('#continue-detail').textContent='—';
  card.setAttribute('aria-label','前回の続きはありません');
  $('#home-start-detail').textContent='分野を選んで、自分のペースで';
 }
 const review=questions.filter(q=>stateOf(q)==='review');
 const favorites=questions.filter(q=>Boolean(progress.favorites[q.id]));
 const target=new Set([...remaining,...review.map(q=>q.id),...favorites.map(q=>q.id)]);
 $('#home-todo-total').textContent=`対象 ${target.size}問`;
 $('#home-todo-total').title='3つのカードの対象問題数（重複を除く）';
}
function renderHomeOverview(){
 const review=questions.filter(q=>stateOf(q)==='review').length;
 const favorites=questions.filter(q=>Boolean(progress.favorites[q.id])).length;
 const solved=questions.filter(q=>stateOf(q)==='solved').length;
 const unseen=questions.length-review-solved;
 $('#home-favorite-count').textContent=favorites;
 $('#home-review').disabled=!review;$('#home-favorites').disabled=!favorites;
 $('#home-summary').innerHTML=`<div class="home-summary-counts"><div><strong>${unseen}<small>問</small></strong><span>未着手</span></div><div><strong>${review}<small>問</small></strong><span>要復習</span></div><div><strong>${solved}<small>問</small></strong><span>解けた</span></div></div><div class="home-summary-track" aria-hidden="true"><i style="width:${questions.length?solved/questions.length*100:0}%"></i><i style="width:${questions.length?review/questions.length*100:0}%"></i></div><p class="home-summary-note">補助問題 全${questions.length}問のうち、${solved+review}問を学習済み。<br>未収録の分野は集計に含みません。</p><button class="home-summary-link" data-home-record>学習記録を詳しく見る →</button>`;
 renderHomeDate();renderWeekRecords();
}
function renderHomeDate(){
 const today=new Date(),days=['日','月','火','水','木','金','土'];
 $('#home-year').textContent=`${today.getFullYear()}年`;
 $('#home-date').dateTime=localDate(today);
 $('#home-date').innerHTML=`${today.getMonth()+1}<small>月</small>${today.getDate()}<small>日</small><span class="home-weekday">（${days[today.getDay()]}）</span>`;
 $('#home-date').setAttribute('aria-label',`${today.getFullYear()}年${today.getMonth()+1}月${today.getDate()}日 ${days[today.getDay()]}曜日`);
}
function renderWeekRecords(){
 const today=new Date();today.setHours(12,0,0,0);
 const monday=new Date(today);monday.setDate(today.getDate()-(today.getDay()+6)%7);
 const home=$('#home-week-days'),record=$('#week');home.innerHTML='';record.innerHTML='';
 let weekCount=0,activeDays=0;
 ['月','火','水','木','金','土','日'].forEach((day,index)=>{
  const date=new Date(monday);date.setDate(monday.getDate()+index);
  const key=localDate(date),count=progress.daily[key]||0,active=count>0,future=date>today,isToday=key===localDate(today);
  if(!future){weekCount+=count;if(active)activeDays++;}
  const label=`${date.getMonth()+1}月${date.getDate()}日 ${day}曜日 ${future?'これから':count+'問'}`;
  const item=document.createElement('span');item.className=`home-week-day${active?' done':''}${future?' future':''}${isToday?' is-today':''}`;item.setAttribute('aria-label',label);
  item.innerHTML=`<b aria-hidden="true">${active?'✓':''}</b><span aria-hidden="true">${day}</span>`;home.append(item);
  const old=document.createElement('span');old.setAttribute('aria-label',label);old.innerHTML=`${day}<b class="${active?(isToday?'today':'done'):''}" aria-hidden="true">${active?'✓':'·'}</b><small class="week-count">${count?`${count}問`:''}</small>`;record.append(old);
 });
 $('#home-week-count').textContent=weekCount;
 $('#home-week-message').textContent=activeDays?`今週は${activeDays}日学習。いいペースやね！`:'今日の一歩を、ここから。';
}
function setHomePanel(panel){
 document.querySelectorAll('[data-home-panel]').forEach(button=>{const selected=button.dataset.homePanel===panel;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;});
 $('#home-fields').hidden=panel!=='fields';$('#home-summary').hidden=panel!=='summary';
}
document.querySelectorAll('[data-home-panel]').forEach(button=>{
 button.onclick=()=>setHomePanel(button.dataset.homePanel);
 button.onkeydown=event=>{
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  const panel=event.key==='Home'?'fields':event.key==='End'?'summary':button.dataset.homePanel==='fields'?'summary':'fields';
  setHomePanel(panel);document.querySelector(`[data-home-panel="${panel}"]`).focus();
 };
});
document.querySelector('#home-summary').onclick=event=>{if(event.target.closest('[data-home-record]'))showRecord();};
document.addEventListener('visibilitychange',()=>{if(!document.hidden){renderHomeDate();renderWeekRecords();}});
setInterval(()=>{if(!document.hidden){renderHomeDate();renderWeekRecords();}},60000);
