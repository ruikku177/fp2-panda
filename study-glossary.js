// 用語集は閲覧専用。学習履歴・問題データ・セッションには書き込まない。
function studyGlossaryNames(chapter,theme,lesson=null){
  if(lesson!==null) return studyGlossaryLessons[`${chapter}:${theme}:${lesson}`] || [];
  const prefix=`${chapter}:${theme}:`;
  return [...new Set(Object.entries(studyGlossaryLessons).filter(([key])=>key.startsWith(prefix)).flatMap(([,names])=>names))];
}
function studyGlossaryThemeButton(chapter,theme){
  const count=studyGlossaryNames(chapter,theme).length;
  return count ? `<button type="button" class="study-glossary-entry" data-glossary-chapter="${chapter}" data-glossary-theme="${theme}" aria-haspopup="dialog">このテーマの必須用語 <span>${count}語 ›</span></button>` : '';
}
function updateStudyGlossaryLessonButton(chapter,theme,lesson){
  const button=document.getElementById('study-glossary-lesson');
  const count=studyGlossaryNames(chapter,theme,lesson).length;
  button.hidden=!count;
  button.dataset.glossaryChapter=chapter;
  button.dataset.glossaryTheme=theme;
  button.dataset.glossaryLesson=lesson;
  button.textContent=`このレッスンの必須用語（${count}語）`;
}
const studyGlossaryDialog=document.createElement('dialog');
studyGlossaryDialog.id='study-glossary-dialog';
studyGlossaryDialog.setAttribute('aria-labelledby','study-glossary-heading');
studyGlossaryDialog.innerHTML=`<div class="study-glossary-head"><div><h2 id="study-glossary-heading"></h2><p id="study-glossary-context"></p></div><button type="button" class="study-glossary-close" aria-label="用語集を閉じる" autofocus>×</button></div><div class="study-glossary-tools"><label for="study-glossary-search">用語を探す</label><div class="study-glossary-search-row"><input id="study-glossary-search" type="search" placeholder="用語・略称・説明から検索" autocomplete="off"><button type="button" id="study-glossary-clear">クリア</button></div><p id="study-glossary-count" role="status" aria-live="polite"></p><button type="button" id="study-glossary-all"></button></div><div class="study-glossary-scroll" tabindex="0" aria-label="必須用語の一覧"><dl id="study-glossary-list"></dl><p id="study-glossary-empty" hidden>該当する用語はありません。検索する言葉を変えてみてください。</p></div>`;
document.body.append(studyGlossaryDialog);
let studyGlossaryContext=null;
let studyGlossaryOpener=null;
const glossaryQuery=studyGlossaryDialog.querySelector('#study-glossary-search');
function renderStudyGlossary(){
  const {chapter,theme,lesson}=studyGlossaryContext;
  const catalog=studyChapterCatalog[chapter];
  const themeData=catalog.themes[theme];
  const names=studyGlossaryNames(chapter,theme,lesson);
  const normalize=text=>text.normalize('NFKC').toLocaleLowerCase('ja');
  const query=normalize(glossaryQuery.value.trim());
  const rows=names.map(name=>studyGlossaryTerms[name]).filter(term=>!query || normalize([term.name,...term.aliases,term.meaning,term.example,term.contrast].join(' ')).includes(query));
  document.getElementById('study-glossary-heading').textContent=lesson===null?'このテーマの必須用語':'このレッスンの必須用語';
  document.getElementById('study-glossary-context').textContent=`第${chapter}章 · ${themeData.title}${lesson===null?'':` / ${themeData.lessons[lesson]}`}`;
  const list=document.getElementById('study-glossary-list');
  list.replaceChildren();
  for(const term of rows){
    const dt=document.createElement('dt');dt.textContent=term.name;
    const dd=document.createElement('dd');
    const meaning=document.createElement('p');meaning.textContent=term.meaning;dd.append(meaning);
    for(const [label,value] of [['たとえば',term.example],['ここを区別',term.contrast]]){
      if(!value)continue;
      const p=document.createElement('p');p.className='study-glossary-note';
      const strong=document.createElement('strong');strong.textContent=label;
      p.append(strong,document.createTextNode(value));dd.append(p);
    }
    list.append(dt,dd);
  }
  document.getElementById('study-glossary-count').textContent=`${rows.length} / ${names.length}語`;
  document.getElementById('study-glossary-empty').hidden=rows.length!==0;
  const all=document.getElementById('study-glossary-all');all.hidden=lesson===null;
  all.textContent=`このテーマ全体の用語を見る（${studyGlossaryNames(chapter,theme).length}語）`;
}
function openStudyGlossary(chapter,theme,lesson=null,opener=null){
  if(!studyGlossaryNames(chapter,theme,lesson).length)return;
  studyGlossaryContext={chapter,theme,lesson};
  studyGlossaryOpener=opener || document.activeElement;
  glossaryQuery.value='';renderStudyGlossary();
  studyGlossaryDialog.showModal();
  studyGlossaryDialog.querySelector('.study-glossary-scroll').scrollTop=0;
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button[data-glossary-chapter]');
  if(!button)return;
  openStudyGlossary(Number(button.dataset.glossaryChapter),Number(button.dataset.glossaryTheme),button.hasAttribute('data-glossary-lesson')?Number(button.dataset.glossaryLesson):null,button);
});
studyGlossaryDialog.querySelector('.study-glossary-close').addEventListener('click',()=>studyGlossaryDialog.close());
studyGlossaryDialog.addEventListener('close',()=>{
  if(studyGlossaryOpener?.isConnected)studyGlossaryOpener.focus({preventScroll:true});
});
studyGlossaryDialog.addEventListener('click',event=>{
  if(event.target!==studyGlossaryDialog)return;
  const rect=studyGlossaryDialog.getBoundingClientRect();
  if(event.clientX<rect.left || event.clientX>rect.right || event.clientY<rect.top || event.clientY>rect.bottom)studyGlossaryDialog.close();
});
glossaryQuery.addEventListener('input',renderStudyGlossary);
document.getElementById('study-glossary-clear').addEventListener('click',()=>{glossaryQuery.value='';renderStudyGlossary();glossaryQuery.focus();});
document.getElementById('study-glossary-all').addEventListener('click',()=>{
  studyGlossaryContext.lesson=null;glossaryQuery.value='';renderStudyGlossary();
  studyGlossaryDialog.querySelector('.study-glossary-scroll').scrollTop=0;
});
