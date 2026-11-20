// 基本の理解を本文へ、細部を開閉可能な補足へ追加する。問題・学習履歴は変更しない。
window.FP_STUDY_DEPTH=[];
function extendStudyLessons(chapter,theme,rows){
  for(const [index,paragraphs,reading,steps,extra] of rows){
    const lesson=chapter===1?(theme===0?studyLessonContent[index]:studyExtraLessons[theme]?.[index]):studyLectureChapters[chapter]?.themes[theme]?.lessons[index];
    if(!lesson)throw new Error(`Missing lesson depth ${chapter}:${theme}:${index}`);
    const template=document.createElement('template');template.innerHTML=lesson.html;
    const root=template.content;
    const block=(tag,cls,html)=>{const e=document.createElement(tag);e.className=cls;e.innerHTML=html;return e;};
    const firstVisual=[...root.querySelectorAll('figure,table,.study-formula,.study-equation,.study-balance,.study-rule-grid,.study-coefficients,.study-steps')].find(e=>!e.closest('details'));
    const intro=block('section','study-depth-intro',`<h3>仕組みをつかもう</h3>${paragraphs.map(p=>`<p>${p}</p>`).join('')}`);
    if(firstVisual){
      firstVisual.before(intro);
      if(reading)firstVisual.after(block('section','study-reading-guide',`<h3>${firstVisual.matches('.study-formula,.study-equation')?'式の見方':'図・表の見方'}</h3><p>${reading}</p>`));
    }else root.prepend(intro);
    if(steps?.length){
      const walkthrough=block('section','study-walkthrough',`<h3>一つずつ考えてみよう</h3><ol>${steps.map(p=>`<li>${p}</li>`).join('')}</ol>`);
      const example=root.querySelector('.study-example');
      if(example)example.after(walkthrough);
      else {const anchor=root.querySelector('.study-tip,.study-check');if(anchor)anchor.before(walkthrough);else root.append(walkthrough);}
    }
    if(extra){
      const more=block('details','study-depth-more',`<summary>もう少し詳しく</summary>${(Array.isArray(extra)?extra:[extra]).map(p=>`<p>${p}</p>`).join('')}`);
      const check=root.querySelector('.study-check');if(check)check.before(more);else root.append(more);
    }
    lesson.html=template.innerHTML;
    FP_STUDY_DEPTH.push({chapter,theme,lesson:index,paragraphs:paragraphs.length,hasReading:Boolean(reading&&firstVisual),steps:steps?.length||0,hasMore:Boolean(extra)});
  }
}
