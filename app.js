const allQuestions = window.FP_QUESTIONS || [];
const questions = allQuestions.filter(q => !q.held);
const chapters = [
  {n:1,name:'ライフプランニングと資金計画',icon:'heart',color:'#72936a',tint:'#edf3e4'},
  {n:2,name:'リスク管理',icon:'shield',color:'#ac975d',tint:'#f6f0df'},
  {n:3,name:'金融資産運用',icon:'coin',color:'#748d9a',tint:'#eaf0f3'},
  {n:4,name:'タックスプランニング',icon:'receipt',color:'#9b837c',tint:'#f2ebe6'},
  {n:5,name:'不動産',icon:'home',color:'#899367',tint:'#eef0e3'},
  {n:6,name:'相続・事業承継',icon:'leaf',color:'#8c839a',tint:'#f0ebf3'}
];
const $ = selector => document.querySelector(selector);
const pandaMoods=[
 {name:'通常',image:'assets/fp-panda-v3/normal.png',speech:'今日もいっしょに\nがんばろう！'},
 {name:'喜び',image:'assets/fp-panda-v3/happy.png',speech:'やったパンダ！\nその調子！'},
 {name:'考える',image:'assets/fp-panda-v3/thinking.png',speech:'うーん…\n考え中！'},
 {name:'応援',image:'assets/fp-panda-v3/cheering.png',speech:'いっしょに\nがんばろう！'},
 {name:'驚き',image:'assets/fp-panda-v3/surprised.png',speech:'えっ！？\nびっくり！'},
 {name:'リラックス',image:'assets/fp-panda-v3/relaxed.png',speech:'ちょっと\nひと休み〜'}
];
let pandaMoodIndex=0;
const pandaImageCache=new Map();
function preloadPandaMood(index){
 if(!pandaImageCache.has(index)){const image=new Image();image.src=pandaMoods[index].image;pandaImageCache.set(index,image);}
 return pandaImageCache.get(index);
}
preloadPandaMood(1);
$('#panda-button').onclick=async()=>{
 const button=$('#panda-button'),next=(pandaMoodIndex+1)%pandaMoods.length,mood=pandaMoods[next];
 button.disabled=true;
 try{
  const image=preloadPandaMood(next);await image.decode();
  pandaMoodIndex=next;$('#panda-image').src=image.src;$('#panda-image').alt=`${mood.name}の表情のファイナンシャルパンダ`;
  $('#panda-speech').textContent=mood.speech;
  button.setAttribute('aria-label',`パンダの表情を変える（現在: ${mood.name}）`);
  preloadPandaMood((next+1)%pandaMoods.length);
  window.pandaDashTap?.();
 }catch{button.title='画像を読み込めませんでした。もう一度タップしてください';}
 finally{button.disabled=false;}
};
const dialog = $('#study-dialog');
const content = $('#dialog-content');
const progressKey = 'fp2-app-progress-v1';
const sessionKey = 'fp2-app-session-v1';
const defaultProgress = () => ({results:{},favorites:{},daily:{},choiceCorrect:0,choiceTotal:0});
function load(key, fallback){try{return JSON.parse(localStorage.getItem(key)) || fallback;}catch{return fallback;}}
let progress = load(progressKey,defaultProgress());
if(!progress.results || !progress.favorites || !progress.daily)progress=defaultProgress();
let session = load(sessionKey,null);
if(session && (!Array.isArray(session.ids) || !session.ids.every(id=>questions.some(q=>q.id===id))))session=null;
let multiMode = false;
const selectedChapters = new Set();
try{const saved=JSON.parse(localStorage.getItem('fp-panda-multi-chapters'));if(Array.isArray(saved))saved.filter(n=>questions.some(q=>q.chapter===n)).forEach(n=>selectedChapters.add(n));}catch{}
let material='supplement';
let calendarMonth=new Date(new Date().getFullYear(),new Date().getMonth(),1);
const targetNames={all:'すべて',unseen:'未着手',review:'要復習',favorite:'お気に入り',solved:'解けた'};
const byId = new Map(questions.map(q=>[q.id,q]));
function saveProgress(){localStorage.setItem(progressKey,JSON.stringify(progress));renderHome();if(!$('#record-view').hidden)renderRecord();}
function saveSession(){if(session)localStorage.setItem(sessionKey,JSON.stringify(session));else localStorage.removeItem(sessionKey);renderContinue();}
function stateOf(q){return progress.results[q.id]?.state || 'unseen';}
function localDate(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
function showDialog(heading,html){$('#dialog-title').textContent=heading;content.innerHTML=html;dialog.showModal();}
function shuffle(items){for(let i=items.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[items[i],items[j]]=[items[j],items[i]];}return items;}
function availableCount(n){return questions.filter(q=>q.chapter===n).length;}

$('#chapter-grid').innerHTML=chapters.map(c=>{
 const count=availableCount(c.n),seen=questions.filter(q=>q.chapter===c.n&&stateOf(q)!=='unseen').length;
 const colors=['#4aa881','#3e9ed5','#9284bd','#bc916e','#b7a34c','#a18966'],tints=['#e7f5e9','#e9f3fb','#f0ecf9','#fbefdf','#fbf3d9','#f5eddf'];
 return `<button class="chapter ${count?'':'pending'}" style="--icon:${colors[c.n-1]};--tint:${tints[c.n-1]}" data-chapter="${c.n}"><span class="home-chapter-no">${String(c.n).padStart(2,'0')}</span><span class="home-chapter-name">${c.name}</span>${count?`<span class="track" aria-hidden="true"><i data-track="${c.n}" style="width:${seen/count*100}%"></i></span><span class="home-chapter-progress" data-seen="${c.n}" aria-label="学習済み${seen}問、収録${count}問">${seen} / ${count}</span>`:'<span class="home-chapter-unavailable"><svg aria-hidden="true"><use href="#lock"/></svg>未収録</span>'}<span class="home-chapter-arrow" aria-hidden="true">›</span><span class="selection-check" aria-hidden="true">✓</span></button>`;
}).join('');

function renderSelection(){
 const grid=$('#chapter-grid');grid.classList.toggle('multi-mode',multiMode);
 $('#multi-toggle').textContent=multiMode?'選択を終了':'複数選択';
 $('#multi-toggle').setAttribute('aria-pressed',String(multiMode));
 $('#multi-bar').hidden=!multiMode||material!=='supplement';
 grid.querySelectorAll('[data-chapter]').forEach(button=>{
  const n=Number(button.dataset.chapter),available=availableCount(n)>0;
  button.disabled=multiMode&&!available;
  button.classList.toggle('selected',multiMode&&selectedChapters.has(n));
  if(multiMode&&available)button.setAttribute('aria-pressed',String(selectedChapters.has(n)));else button.removeAttribute('aria-pressed');
 });
 $('#multi-summary').textContent=selectedChapters.size?[...selectedChapters].sort().map(n=>`第${n}章`).join('・'):'解きたい章を選ぼう';
 $('#multi-start').disabled=!selectedChapters.size;
 $('#multi-start').textContent=selectedChapters.size?`選択した${selectedChapters.size}章から解く →`:'章を選んでください';
}
$('#multi-toggle').onclick=()=>{multiMode=!multiMode;renderSelection();};
$('#multi-start').onclick=()=>{if(selectedChapters.size)openSettings([...selectedChapters]);};
$('#chapter-grid').onclick=event=>{
 const button=event.target.closest('[data-chapter]');if(!button)return;
 const n=Number(button.dataset.chapter),count=availableCount(n);
 if(!multiMode){if(count)openSettings([n]);else showDialog(`第${n}章 ${chapters[n-1].name}`,'<p class="dialog-note">この章は教材の追加後に学習できます。</p><button class="dialog-primary" data-close>ホームに戻る</button>');return;}
 if(!count)return;
 selectedChapters.has(n)?selectedChapters.delete(n):selectedChapters.add(n);
 localStorage.setItem('fp-panda-multi-chapters',JSON.stringify([...selectedChapters]));
 renderSelection();
};

function renderMaterial(){
 document.querySelectorAll('[data-material]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.material===material)));
 const supplement=material==='supplement',mock=material==='mock';
 $('#chapter-grid').hidden=!supplement;$('#multi-toggle').hidden=!supplement;
 $('#material-placeholder').hidden=supplement;
 $('#material-heading').textContent=supplement?'分野を選ぶ':mock?'受験回から選ぶ':'実施回から選ぶ';
 $('#home-progress-note').hidden=!supplement;
 if(!supplement){
  $('#material-placeholder').innerHTML=`<p class="material-note">${mock?'模擬試験':'過去問'}はまだ未収録です。</p><div class="material-card" aria-label="未収録の教材"><span class="chapter-icon"><svg><use href="#book"/></svg></span><span class="example-label">追加予定</span><h3>${mock?'模擬試験':'過去問'}</h3><p>教材を受け取った後に表示します</p><span class="material-badge">未収録</span></div>`;
 }
 renderSelection();
}
document.querySelectorAll('[data-material]').forEach(button=>button.onclick=()=>{material=button.dataset.material;renderMaterial();});

function openSettings(chapterNumbers,target='all'){
 const scope=new Set(chapterNumbers);
 showDialog('学習の準備',`<p class="selected-scope">補助問題 <span>／ ${[...scope].sort().map(n=>`第${n}章`).join('・')}</span></p><fieldset class="target-fields"><legend>対象の問題</legend><div class="target-choices">${Object.entries(targetNames).map(([key,name])=>`<button data-target="${key}" aria-pressed="false">${name}<span data-total="${key}"></span></button>`).join('')}</div></fieldset><div class="filter-settings"><label>出題順<select id="filter-order"><option value="random">ランダム</option><option value="sequential">問題番号順</option></select></label><label>問題数<select id="filter-count"><option value="5">5問</option><option value="10" selected>10問</option><option value="20">20問</option><option value="50">50問</option><option value="all">すべて</option></select></label></div><p id="filter-summary" role="status"></p><button class="dialog-primary" id="filter-start">学習を始める</button>`);
 const matches=(q,t)=>t==='all'||(t==='favorite'?Boolean(progress.favorites[q.id]):stateOf(q)===t);
 const pool=()=>questions.filter(q=>scope.has(q.chapter)&&matches(q,target));
 function refresh(){
  const inScope=questions.filter(q=>scope.has(q.chapter));
  content.querySelectorAll('[data-target]').forEach(button=>{button.setAttribute('aria-pressed',String(button.dataset.target===target));button.querySelector('span').textContent=`${inScope.filter(q=>matches(q,button.dataset.target)).length}問`;});
  const count=$('#filter-count').value,n=count==='all'?pool().length:Math.min(Number(count),pool().length);
  $('#filter-summary').textContent=n?`${[...scope].sort().map(x=>`第${x}章`).join('・')} / ${targetNames[target]} / ${n}問`:'この条件に合う問題はありません';
  $('#filter-start').disabled=!n;$('#filter-start').textContent=n?`${n}問を始める`:'条件を変更してください';
 }
 content.querySelectorAll('[data-target]').forEach(button=>button.onclick=()=>{target=button.dataset.target;refresh();});
 $('#filter-count').onchange=refresh;
 $('#filter-start').onclick=()=>{
  const selected=pool(),count=$('#filter-count').value,order=$('#filter-order').value;
  if(order==='random')shuffle(selected);
  session={ids:selected.slice(0,count==='all'?selected.length:Number(count)).map(q=>q.id),index:0,responses:{},createdAt:Date.now(),scope:[...scope],target,order};
  saveSession();dialog.close();showQuestion();
 };
 refresh();
}

function renderHome(){
 for(const c of chapters){const count=availableCount(c.n);if(!count)continue;const seen=questions.filter(q=>q.chapter===c.n&&stateOf(q)!=='unseen').length;const label=$(`[data-seen="${c.n}"]`),track=$(`[data-track="${c.n}"]`);if(label){label.textContent=`${seen} / ${count}`;label.setAttribute('aria-label',`学習済み${seen}問、収録${count}問`);}if(track)track.style.width=`${seen/count*100}%`;}
 const review=questions.filter(q=>stateOf(q)==='review').length;
 $('#review-count').textContent=review;$('.nav-count').textContent=review;
 const today=localDate();$('#today-count').innerHTML=`${progress.daily[today]||0}<small>問</small>`;
 const total=progress.choiceTotal||0;$('#accuracy-count').innerHTML=`${total?Math.round((progress.choiceCorrect||0)/total*100):'—'}<small>${total?'%':''}</small>`;

 let streak=0;for(let offset=0;offset<365;offset++){const date=new Date();date.setHours(12,0,0,0);date.setDate(date.getDate()-offset);if(!progress.daily[localDate(date)]){if(offset===0)continue;break;}streak++;}$('#streak-count').textContent=streak;
 renderHomeOverview();
 renderContinue();
}
function renderContinue(){renderHomeContinue();}
function placeWeekCard(){
 const card=$('.record-card'),destination=$('#record-week-slot');
 if(card.parentElement!==destination)destination.prepend(card);
}
placeWeekCard();
function setActiveNav(action){
 document.body.classList.toggle('home-screen',action==='home'||action==='questions');
 document.querySelectorAll('.nav-item,.mobile-nav button').forEach(button=>{
  const active=button.dataset.action===action;button.classList.toggle('active',active);
  if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current');
 });
}

function renderCalendar(){
 const year=calendarMonth.getFullYear(),month=calendarMonth.getMonth();
 $('#calendar-month').textContent=`${year}年${month+1}月`;
 $('#calendar-next').disabled=year===new Date().getFullYear()&&month===new Date().getMonth();
 const first=new Date(year,month,1),days=new Date(year,month+1,0).getDate();
 let html='<div class="calendar-grid" role="grid" aria-label="月ごとの学習日">';
 for(const day of ['日','月','火','水','木','金','土'])html+=`<span class="calendar-day-name">${day}</span>`;
 for(let i=0;i<first.getDay();i++)html+='<span class="calendar-empty"></span>';
 for(let day=1;day<=days;day++){
  const key=localDate(new Date(year,month,day)),count=progress.daily[key]||0;
  const level=count>=20?3:count>=5?2:count>0?1:0;
  html+=`<span class="calendar-day level-${level}${key===localDate()?' is-today':''}" role="gridcell" aria-label="${month+1}月${day}日 ${count}問"><b>${day}</b>${count?`<small>${count}問</small>`:''}</span>`;
 }
 $('#record-calendar').innerHTML=html+'</div><p class="calendar-note">色が濃いほど、たくさん解いた日です。</p>';
}
function renderRecord(){
 const solved=questions.filter(q=>stateOf(q)==='solved').length;
 const review=questions.filter(q=>stateOf(q)==='review');
 const recovered=questions.filter(q=>(progress.results[q.id]?.recovered||0)>0).length;
 $('#record-overview').innerHTML=`<div><strong>${solved+review.length}<small>問</small></strong><span>学習済み</span></div><div><strong>${review.length}<small>問</small></strong><span>要復習</span></div><div><strong>${recovered}<small>問</small></strong><span>解き直して正解</span></div>`;
 $('#record-chapters').innerHTML=chapters.map(c=>{
  const pool=questions.filter(q=>q.chapter===c.n);
  if(!pool.length)return `<div class="record-chapter pending"><div class="record-chapter-label"><span>第${c.n}章 ${c.name}</span><small>未収録</small></div></div>`;
  const done=pool.filter(q=>stateOf(q)==='solved').length,needs=pool.filter(q=>stateOf(q)==='review').length,unseen=pool.length-done-needs;
  return `<button class="record-chapter" data-record-chapter="${c.n}" aria-label="第${c.n}章 ${c.name}。解けた${done}問、要復習${needs}問、未着手${unseen}問。問題を選ぶ"><div class="record-chapter-label"><span>第${c.n}章 ${c.name}</span><small>${done+needs} / ${pool.length}問</small></div><div class="record-segments"><i class="segment-solved" style="width:${done/pool.length*100}%"></i><i class="segment-review" style="width:${needs/pool.length*100}%"></i></div><div class="record-chapter-counts"><span>解けた ${done}</span><span>要復習 ${needs}</span><span>未着手 ${unseen}</span></div></button>`;
 }).join('');
 const focus=review.sort((a,b)=>(progress.results[b.id]?.wrongCount||0)-(progress.results[a.id]?.wrongCount||0)||(progress.results[b.id]?.updatedAt||0)-(progress.results[a.id]?.updatedAt||0));
 $('#record-focus').innerHTML=focus.length?`<p class="focus-summary">要復習の問題が${focus.length}問あります。</p><div class="focus-list">${focus.slice(0,5).map(q=>`<button data-focus-chapter="${q.chapter}"><span>第${q.chapter}章 · 問${q.number}</span><small>${q.chapterName}</small><span aria-hidden="true">→</span></button>`).join('')}</div><button class="focus-all" id="record-review-all">まとめて復習する →</button>`:'<p class="focus-empty">いま要復習の問題はありません。今日もパンダと一歩ずつ。</p>';
 renderCalendar();
}
function showHome(){ document.body.classList.remove('quiz-reading-mode');$('#quiz-view').hidden=true;$('#record-view').hidden=true;$('#study-view').hidden=true;$('#home-view').hidden=false;$('.mobile-nav').hidden=false;$('.breadcrumb').textContent='ホーム';setActiveNav('home');renderHome();window.scrollTo(0,0);}
function showRecord(){ document.body.classList.remove('quiz-reading-mode');$('#quiz-view').hidden=true;$('#home-view').hidden=true;$('#study-view').hidden=true;$('#record-view').hidden=false;$('.mobile-nav').hidden=false;$('.breadcrumb').textContent='学習の記録';setActiveNav('record');renderHome();renderRecord();window.scrollTo(0,0);}
function showStudy(){ document.body.classList.remove('quiz-reading-mode');$('#quiz-view').hidden=true;$('#home-view').hidden=true;$('#record-view').hidden=true;$('#study-view').hidden=false;$('.mobile-nav').hidden=false;$('.breadcrumb').textContent='パンダと勉強';setActiveNav('study');showStudyDomains();window.scrollTo(0,0);}
$('#calendar-prev').onclick=()=>{calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1);renderCalendar();};
$('#calendar-next').onclick=()=>{if(!$('#calendar-next').disabled){calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);renderCalendar();}};
$('#record-chapters').onclick=event=>{const button=event.target.closest('[data-record-chapter]');if(button)openSettings([Number(button.dataset.recordChapter)]);};
$('#record-focus').onclick=event=>{const button=event.target.closest('[data-focus-chapter]');if(button)openSettings([Number(button.dataset.focusChapter)],'review');else if(event.target.closest('#record-review-all'))openSettings([...new Set(questions.map(q=>q.chapter))],'review');};
function currentQuestion(){return session&&byId.get(session.ids[session.index]);}
function showQuestion(){
 document.body.classList.remove('home-screen');
 const q=currentQuestion();if(!q){finishSession();return;}
 const readingLayout=q.format==='choice'||q.format==='multi-select'||Boolean(window.FP_WRITTEN?.specs[q.id]);
 document.body.classList.toggle('quiz-reading-mode',readingLayout);
 $('#quiz-view').classList.toggle('quiz-reading-layout',readingLayout);
 $('#home-view').hidden=true;$('#record-view').hidden=true;$('#study-view').hidden=true;$('#quiz-view').hidden=false;$('.mobile-nav').hidden=true;$('.breadcrumb').textContent='問題を解く';
 $('#quiz-progress').textContent=`${session.index+1} / ${session.ids.length}${readingLayout?'':'問'}`;
 $('#quiz-track-fill').style.width=`${(session.index+1)/session.ids.length*100}%`;
 const paws=$('#quiz-paws');paws.replaceChildren();
 if(readingLayout){
  const count=Math.min(session.ids.length,10),filled=Math.ceil((session.index+1)/session.ids.length*count);
  paws.style.setProperty('--paw-count',String(count));
  for(let index=0;index<count;index++){
   const paw=document.createElement('span');paw.className=`quiz-paw${index<filled?' is-complete':''}`;
   paw.innerHTML='<svg viewBox="0 0 32 32" aria-hidden="true"><use href="#paw"></use></svg>';
   paws.append(paw);
  }
 }
 $('#quiz-source').textContent=`補助問題 · 第${q.chapter}章 ${q.chapterName}`;
 $('#quiz-title').textContent=`問${q.number}`;
 $('#quiz-question').innerHTML=q.body;
 $('#quiz-favorite').setAttribute('aria-pressed',String(Boolean(progress.favorites[q.id])));
 $('#quiz-favorite').setAttribute('aria-label',progress.favorites[q.id]?'お気に入りを解除':'お気に入りに追加');
 const answerArea=$('#quiz-answer-area');answerArea.innerHTML='';
 const response=session.responses[q.id];
 if(q.format==='choice'){
  const group=document.createElement('div');group.className='answer-choices';group.setAttribute('role','group');group.setAttribute('aria-label','選択肢');
  q.options.forEach((option,index)=>{const button=document.createElement('button');button.className='answer-choice';button.dataset.option=String(index+1);const number=document.createElement('span');number.textContent=String(index+1);const label=document.createElement('span');label.textContent=option;button.append(number,label);button.onclick=()=>answerChoice(q,index+1);group.append(button);});
  answerArea.append(group);
 }else if(q.format==='multi-select'){
  const group=document.createElement('div');group.className='multi-answer';group.setAttribute('role','group');group.setAttribute('aria-label','適切な記述をすべて選択');
  const selected=new Set(Array.isArray(response?.selected)?response.selected:[]);
  const prompt=document.createElement('p');prompt.textContent='適切な記述をすべて選んでください';group.append(prompt);
  q.options.forEach(label=>{const button=document.createElement('button');button.className='multi-answer-choice';button.dataset.label=label;button.textContent=`（${label}）`;button.setAttribute('aria-pressed',String(selected.has(label)));button.onclick=()=>{selected.has(label)?selected.delete(label):selected.add(label);button.setAttribute('aria-pressed',String(selected.has(label)));group.querySelector('.multi-answer-submit').disabled=!selected.size;};group.append(button);});
  const submit=document.createElement('button');submit.className='multi-answer-submit';submit.textContent='解答する';submit.disabled=!selected.size;submit.onclick=()=>{if(session.responses[q.id])return;const picked=[...selected].sort(),expected=[...q.answerKeys].sort();recordResult(q,JSON.stringify(picked)===JSON.stringify(expected),picked);};group.append(submit);answerArea.append(group);
 }else if(window.FP_WRITTEN?.specs[q.id]){
  answerArea.append(createWrittenForm(q));
 }else{
  const button=document.createElement('button');button.className='reveal-button';button.textContent='答えと解説を見る';button.onclick=()=>revealSelfCheck(q);answerArea.append(button);
 }
 $('#quiz-result').hidden=true;
 $('#quiz-result').classList.remove('is-correct','is-review','is-pending');
 if(response)displayResult(q,response);
 $('#quiz-prev').disabled=session.index===0;
 $('#quiz-next').disabled=!response;
 $('#quiz-next').textContent=session.index===session.ids.length-1?'結果を見る →':'次の問題 →';
 window.scrollTo(0,0);
}
function createWrittenForm(q){
 const spec=window.FP_WRITTEN.specs[q.id],form=document.createElement('form');form.className='written-answer-form';form.noValidate=true;
 const heading=document.createElement('p');heading.className='written-intro';heading.textContent='答えを入力してから確認しましょう。空欄のままでも提出できます。';form.append(heading);
 if(spec.pending){const note=document.createElement('p');note.className='written-pending-note';note.textContent='この問題は解答の一部が要確認のため、入力後も自動採点しません。';form.append(note);}
 const grid=document.createElement('div');grid.className='written-field-grid';
 spec.fields.forEach((field,index)=>{
  const label=document.createElement('label');label.className='written-field';
  const title=document.createElement('span');title.textContent=field.label;label.append(title);
  const row=document.createElement('span');row.className='written-input-row';
  const input=document.createElement('input');input.type='text';input.autocomplete='off';input.inputMode=field.kind==='number'?'numeric':'text';input.dataset.writtenIndex=String(index);input.setAttribute('aria-label',field.label);
  if(field.kind==='number')input.placeholder='数字を入力';else if(field.kind==='letters')input.placeholder='記号を入力';else input.placeholder='答えを入力';
  row.append(input);
  if(field.unit){const unit=document.createElement('span');unit.className='written-unit';unit.textContent=field.unit;row.append(unit);}
  label.append(row);grid.append(label);
 });
 form.append(grid);
 const submit=document.createElement('button');submit.type='submit';submit.className='written-submit';submit.textContent=spec.pending?'入力した答えを確認する':'解答する';form.append(submit);
 form.onsubmit=event=>{
  event.preventDefault();if(session.responses[q.id])return;
  const values=[...form.querySelectorAll('[data-written-index]')].map(input=>input.value);
  const outcome=window.FP_WRITTEN.grade(q.id,values);
  recordResult(q,outcome.correct,{type:'written',values,fields:outcome.fields},outcome.pending);
 };
 return form;
}
function recordResult(q,correct,selected=null,pending=false){
 const previous=session.responses[q.id];if(previous)return;
 const response={correct,selected,pending};session.responses[q.id]=response;
 if(!pending){
  const old=progress.results[q.id]||{};
  progress.results[q.id]={state:correct?'solved':'review',updatedAt:Date.now(),attempts:(old.attempts||0)+1,wrongCount:(old.wrongCount||0)+(correct?0:1),recovered:(old.recovered||0)+(correct&&old.state==='review'?1:0)};
  const today=localDate();progress.daily[today]=(progress.daily[today]||0)+1;
  if(q.format==='choice'||q.format==='multi-select'){progress.choiceTotal=(progress.choiceTotal||0)+1;if(correct)progress.choiceCorrect=(progress.choiceCorrect||0)+1;}
  saveProgress();
 }
 saveSession();displayResult(q,response);$('#quiz-next').disabled=false;
}
function answerChoice(q,number){if(session.responses[q.id])return;recordResult(q,String(number)===q.answer,number);}
function revealSelfCheck(q){
 if(session.responses[q.id])return;
 const result=$('#quiz-result');result.hidden=false;result.innerHTML=`<p class="result-label">正解・解説</p><p class="official-answer"></p><div class="rich-content explanation"></div><div class="self-actions"><button data-self="correct">自分で解けた</button><button data-self="review">要復習にする</button></div>`;
 result.querySelector('.official-answer').textContent=q.answer;
 result.querySelector('.explanation').innerHTML=q.explanation;
 result.querySelectorAll('[data-self]').forEach(button=>button.onclick=()=>recordResult(q,button.dataset.self==='correct'));
 answerAreaHide();
}
function answerAreaHide(){const button=$('#quiz-answer-area .reveal-button');if(button)button.hidden=true;}
function displayResult(q,response){
 const result=$('#quiz-result');result.hidden=false;
 const status=response.pending?'pending':response.correct?'correct':'review';
 result.classList.remove('is-correct','is-review','is-pending');result.classList.add(`is-${status}`);
 const mood=status==='correct'?'happy':status==='review'?'thinking':null;
 result.innerHTML=`<div class="result-head"><p class="result-label"></p>${mood?`<img class="result-panda" src="assets/fp-panda-v3/${mood}.png" alt="">`:''}</div><p class="official-answer"></p><div class="rich-content explanation"></div>`;
 result.querySelector('.result-label').textContent=response.pending?'判定保留':response.correct?'正解！':'要復習';
 result.querySelector('.official-answer').textContent=`${response.pending?'登録済み解答（要確認）':'正解'}: ${q.answer}`;
 result.querySelector('.explanation').innerHTML=q.explanation;
 if(response.selected?.type==='written'){
  const grid=document.createElement('div');grid.className='written-breakdown';
  response.selected.fields.forEach(field=>{
   const row=document.createElement('div');row.className=`written-breakdown-row ${field.correct===true?'is-correct':field.correct===false?'is-wrong':'is-pending'}`;
   const title=document.createElement('strong');title.textContent=field.label;
   const entered=document.createElement('span');entered.textContent=`入力: ${field.entered||'（空欄）'}`;
   row.append(title,entered);
   if(field.expected){const expected=document.createElement('small');expected.textContent=`答え: ${field.expected}`;row.append(expected);}
   grid.append(row);
  });
  result.insertBefore(grid,result.querySelector('.explanation'));
  if(response.pending){const note=document.createElement('p');note.className='written-pending-note';note.textContent='第1章・問30（ウ）は正解未確定です。登録済み解答を参考表示していますが、正誤・学習記録・結果の得点には反映しません。';result.insertBefore(note,result.querySelector('.explanation'));}
  $('#quiz-answer-area').querySelectorAll('input,.written-submit').forEach(control=>control.disabled=true);
  $('#quiz-answer-area').querySelectorAll('input').forEach((input,index)=>{input.value=response.selected.values[index]||'';});
 }
 if(q.format==='self-check' && window.FP_WRITTEN?.specs[q.id] && response.selected?.type!=='written'){
  $('#quiz-answer-area').querySelectorAll('input,.written-submit').forEach(control=>control.disabled=true);
 }
 if(q.format==='choice'){
  document.querySelectorAll('.answer-choice').forEach(button=>{const n=button.dataset.option;button.disabled=true;if(n===q.answer)button.classList.add('correct');if(response.selected===Number(n)&&!response.correct)button.classList.add('incorrect');});
 }else if(q.format==='multi-select'){
  document.querySelectorAll('.multi-answer-choice').forEach(button=>{const label=button.dataset.label;button.disabled=true;button.setAttribute('aria-pressed',String(response.selected.includes(label)));if(q.answerKeys.includes(label))button.classList.add('correct');else if(response.selected.includes(label))button.classList.add('incorrect');});
  const submit=$('.multi-answer-submit');if(submit)submit.hidden=true;
 }else answerAreaHide();
}
function finishSession(){
 document.body.classList.remove('quiz-reading-mode');$('#quiz-view').classList.remove('quiz-reading-layout');
 $('#quiz-result').classList.remove('is-correct','is-review','is-pending');
 const answered=Object.values(session?.responses||{}),correct=answered.filter(r=>r.correct===true).length,total=session?.ids.length||0,pending=answered.filter(r=>r.pending).length,graded=total-pending;
 $('#quiz-view').hidden=false;$('#quiz-source').textContent='学習のまとめ';$('#quiz-title').textContent='おつかれさま！';
 $('#quiz-question').innerHTML=`<p class="summary-score">${correct} / ${graded}<small>問 正解・自己判定${pending?`（全${total}問中）`:''}</small></p>${pending?`<p class="summary-pending">判定保留 ${pending}問は採点対象に含めていません。</p>`:''}`;
 $('#quiz-answer-area').innerHTML='';$('#quiz-result').hidden=false;
 $('#quiz-result').innerHTML='<p class="dialog-note">間違えた問題はホームの「復習する」から解き直せます。</p><button class="dialog-primary" id="finish-home">ホームへ戻る</button>';
 $('#finish-home').onclick=()=>{session=null;saveSession();showHome();};
 $('#quiz-prev').disabled=true;$('#quiz-next').disabled=true;
}
$('#quiz-favorite').onclick=()=>{const q=currentQuestion();if(!q)return;if(progress.favorites[q.id])delete progress.favorites[q.id];else progress.favorites[q.id]=true;saveProgress();$('#quiz-favorite').setAttribute('aria-pressed',String(Boolean(progress.favorites[q.id])));$('#quiz-favorite').setAttribute('aria-label',progress.favorites[q.id]?'お気に入りを解除':'お気に入りに追加');};
$('#quiz-back').onclick=showHome;
$('#quiz-prev').onclick=()=>{if(session.index>0){session.index--;saveSession();showQuestion();}};
$('#quiz-next').onclick=()=>{if(!session.responses[currentQuestion().id])return;if(session.index<session.ids.length-1){session.index++;saveSession();showQuestion();}else finishSession();};
$('#quiz-question').onclick=event=>{const image=event.target.closest('img');if(!image)return;const zoom=$('#figure-dialog');zoom.querySelector('img').src=image.src;zoom.querySelector('img').alt=image.alt;zoom.showModal();};
$('#figure-dialog .close').onclick=()=>$('#figure-dialog').close();
document.querySelectorAll('[data-action]').forEach(button=>button.onclick=()=>{
 const action=button.dataset.action;
 if(action==='home'){showHome();return;}
 if(action==='study'){showStudy();return;}
 if(action==='continue'){
  const remaining=homeRemainingIds();
  if(remaining.length){session.index=session.ids.indexOf(remaining[0]);saveSession();showQuestion();}
  else{showHome();setHomePanel('fields');$('.chapters').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
  return;
 }
 if(action==='questions'){showHome();setHomePanel('fields');setActiveNav('questions');$('.chapters').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});return;}
 if(action==='record'){
  showRecord();return;
 }
 if(action==='review'||action==='favorites'){
  const target=action==='review'?'review':'favorite';
  if(!questions.some(q=>target==='review'?stateOf(q)==='review':progress.favorites[q.id])){
   showDialog(action==='review'?'要復習の問題はありません':'お気に入りはまだありません','<p class="dialog-note">'+(action==='review'?'間違えた問題がここに集まります。':'問題の星マークを押すと、ここから解き直せます。')+'</p><button class="dialog-primary" data-close>閉じる</button>');return;
  }
  openSettings([...new Set(questions.map(q=>q.chapter))],target);
 }
});
dialog.querySelector('.close').onclick=()=>dialog.close();
dialog.onclick=event=>{if(event.target.closest('[data-close]'))dialog.close();};
setActiveNav('home');renderMaterial();renderHome();
