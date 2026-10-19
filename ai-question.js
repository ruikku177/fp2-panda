// 解説から、任意のAIへ貼り付ける質問文をコピーする。
(() => {
 function plain(html){
  const box=document.createElement('div');box.innerHTML=html||'';
  box.querySelectorAll('script,style').forEach(el=>el.remove());
  box.querySelectorAll('img').forEach(el=>el.replaceWith(document.createTextNode(`\n［図：${el.alt||'問題の図'}］\n`)));
  box.querySelectorAll('br').forEach(el=>el.replaceWith(document.createTextNode('\n')));
  box.querySelectorAll('th,td').forEach(el=>el.append(document.createTextNode(' ｜ ')));
  box.querySelectorAll('p,div,li,tr,h1,h2,h3,h4').forEach(el=>el.append(document.createTextNode('\n')));
  return box.textContent.replace(/[ \t]+\n/g,'\n').replace(/\n{3,}/g,'\n\n').trim();
 }
 function text(q,response){
  const lines=['FP2級の勉強中です。以下の問題について、なぜこの答えになるのか、初学者にも分かるように説明してください。計算問題は途中式も示してください。問題の出題時点・条件を尊重し、不明な点は推測せず教えてください。','',`【問題】第${q.chapter}章 ${q.chapterName} 問${q.number}`,plain(q.body)];
  if(q.options?.length)lines.push('','【選択肢】',...q.options.map((option,i)=>`${i+1}. ${plain(typeof option==='string'?option:option.text)}`));
  if(response?.selected?.type==='written')lines.push('','【自分の回答】',...response.selected.fields.map(f=>`${f.label}: ${f.entered||'（空欄）'}`));
  else if(response?.selected!=null)lines.push('','【自分の回答】',Array.isArray(response.selected)?response.selected.join('、'):String(response.selected));
  lines.push('',`【${response?.pending?'登録済み解答（判定保留）':'問題集の正解'}】${q.answer}`,'','【問題集の解説】',plain(q.explanation));
  if(q.hasFigure||/<(?:img|svg)\b/i.test(q.body))lines.push('','【図について】この問題には図があります。コピー文には画像自体は含まれていません。図の情報が必要な場合は、問題画面のスクリーンショットの添付を求めてください。');
  return lines.join('\n');
 }
 function manual(value,button){
  const dialog=document.createElement('dialog');dialog.className='ai-copy-dialog';dialog.setAttribute('aria-label','AIに質問する文章');
  const info=document.createElement('p');info.textContent='自動コピーできませんでした。下の文章を選択してコピーしてください。';
  const area=document.createElement('textarea');area.value=value;area.readOnly=true;area.setAttribute('aria-label','コピーする質問文');
  const close=document.createElement('button');close.type='button';close.textContent='閉じる';close.onclick=()=>dialog.close();
  dialog.append(info,area,close);document.body.append(dialog);dialog.addEventListener('close',()=>{dialog.remove();button.focus({preventScroll:true});},{once:true});dialog.showModal();area.focus();area.select();
 }
 function append(container,q,response){
  const section=document.createElement('div');section.className='ai-question-actions';
  const button=document.createElement('button');button.type='button';button.className='copy-ai-question';button.textContent='AIに質問（コピー）';
  const note=document.createElement('p');note.setAttribute('role','status');note.textContent='問題・自分の回答・解説をコピーして、使いたいAIに貼り付けられます。';
  button.onclick=async()=>{
   const value=text(q,response);let copied=false;
   try{await navigator.clipboard.writeText(value);copied=true;}catch{
    const area=document.createElement('textarea');area.value=value;area.style.cssText='position:fixed;left:-9999px;top:0';document.body.append(area);area.select();
    try{copied=document.execCommand('copy');}catch{}finally{area.remove();button.focus({preventScroll:true});}
   }
   if(copied)note.textContent='コピーしました。使いたいAIに貼り付けて質問してください。';else manual(value,button);
  };
  section.append(button);
  if(window.FP_QUESTION_IMAGE?.needsImage(q)){
   const imageButton=document.createElement('button');imageButton.type='button';imageButton.className='save-question-image';imageButton.textContent='問題を画像で保存';imageButton.onclick=()=>window.FP_QUESTION_IMAGE.open(q,imageButton);section.append(imageButton);
   note.textContent='文章をコピーし、図・表は「問題を画像で保存」からAIに添付できます。';
  }
  section.append(note);container.append(section);
 }
 window.FP_AI_QUESTION={text,append};
})();
