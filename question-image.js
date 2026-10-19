// AIへの添付用。原本画像ではなく、アプリの問題データから端末内でPNGを作る。
(() => {
 let renderer;
 function loadRenderer(){
  if(window.html2canvas)return Promise.resolve(window.html2canvas);
  if(!renderer)renderer=new Promise((resolve,reject)=>{
   const script=document.createElement('script');script.src='vendor/html2canvas-1.4.1.min.js';
   script.onload=()=>resolve(window.html2canvas);script.onerror=()=>{renderer=null;script.remove();reject(Error('画像作成機能を読み込めませんでした。通信状態を確認して再度お試しください。'));};document.head.append(script);
  });return renderer;
 }
 const needsImage=q=>q.hasFigure||/<(?:img|svg|table)\b/i.test(q.body+' '+q.explanation);
 async function create(q){
  const render=await loadRenderer(),sheet=document.createElement('article');sheet.className='question-image-sheet';sheet.setAttribute('aria-hidden','true');
  const title=document.createElement('h1');title.textContent=`FP2級・第${q.chapter}章 ${q.chapterName}／問${q.number}`;
  const body=document.createElement('section');body.innerHTML=q.body;sheet.append(title,body);
  if(q.format==='choice'){
   const choices=document.createElement('ol');choices.className='question-image-options';
   q.options.forEach(option=>{const li=document.createElement('li');li.textContent=option;choices.append(li);});sheet.append(choices);
  }
  // 解説だけに図表がある場合も、添付画像に残す。
  if(/<(?:img|svg|table)\b/i.test(q.explanation)){
   const heading=document.createElement('h2');heading.textContent='参考：問題集の解説';const explanation=document.createElement('section');explanation.innerHTML=q.explanation;sheet.append(heading,explanation);
  }
  const footer=document.createElement('p');footer.textContent='FPパンダ｜質問文・自分の回答・正解・解説は「AIに質問（コピー）」から添付してください。';footer.className='question-image-footer';sheet.append(footer);
  sheet.querySelectorAll('script,style,button').forEach(el=>el.remove());
  document.body.append(sheet);
  try{
   await document.fonts.ready;
   await Promise.all([...sheet.querySelectorAll('img')].map(async img=>{
    const response=await fetch(img.src);if(!response.ok)throw Error('図を読み込めませんでした。再度お試しください。');
    let blob=await response.blob();
    if(blob.type.includes('svg')||/\.svg(?:[?#]|$)/i.test(img.src)){
     const doc=new DOMParser().parseFromString(await blob.text(),'image/svg+xml');const svg=doc.documentElement;
     const box=svg.getAttribute('viewBox')?.trim().split(/[\s,]+/).map(Number);
     if(box?.length===4){svg.setAttribute('width',String(box[2]));svg.setAttribute('height',String(box[3]));}
     blob=new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'});
    }
    img.src=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(blob);});
    await img.decode();
    const raster=document.createElement('canvas');raster.width=img.naturalWidth;raster.height=img.naturalHeight;
    raster.getContext('2d').drawImage(img,0,0);img.src=raster.toDataURL('image/png');await img.decode();
   }));
   // 横スクロール表も全列を収める。画像の欠落は成功として扱わない。
   sheet.style.width=Math.max(760,sheet.scrollWidth)+'px';
   const width=sheet.scrollWidth,height=sheet.scrollHeight;
   const scale=Math.min(2,Math.sqrt(3000000/(width*height)),8192/height,8192/width);
   const canvas=await render(sheet,{backgroundColor:'#fffdf7',scale,width,height,windowWidth:Math.max(1000,width),windowHeight:height,logging:false});
   return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(Error('画像を作成できませんでした。')),'image/png'));
  }finally{sheet.remove();}
 }
 function open(q,trigger){
  const dialog=document.createElement('dialog');dialog.className='question-image-dialog';dialog.setAttribute('aria-label','問題を画像で保存');
  const header=document.createElement('div');header.className='question-image-header';
  const title=document.createElement('h2');title.textContent=`問${q.number}を画像で保存`;
  const close=document.createElement('button');close.type='button';close.textContent='閉じる';close.onclick=()=>dialog.close();header.append(title,close);
  const status=document.createElement('p');status.setAttribute('role','status');status.textContent='問題文・図・表を画像にしています…';
  const actions=document.createElement('div');actions.className='question-image-buttons';
  const preview=document.createElement('img');preview.alt=`第${q.chapter}章 問${q.number}の添付用画像`;preview.hidden=true;
  dialog.append(header,status,actions,preview);document.body.append(dialog);let url;
  dialog.addEventListener('close',()=>{if(url)URL.revokeObjectURL(url);dialog.remove();if(trigger.isConnected)trigger.focus({preventScroll:true});},{once:true});dialog.showModal();
  create(q).then(blob=>{
   if(!dialog.isConnected)return;
   url=URL.createObjectURL(blob);preview.src=url;preview.hidden=false;
   const filename=`FPパンダ_第${q.chapter}章_問${q.number}.png`;
   const save=document.createElement('a');save.href=url;save.download=filename;save.textContent='画像を保存';actions.append(save);
   status.textContent='画像を保存してAIに添付してください。文章は「AIに質問（コピー）」から貼り付けられます。画像を長押しして保存することもできます。';
   if(window.ClipboardItem&&navigator.clipboard?.write){
    const copy=document.createElement('button');copy.type='button';copy.textContent='画像をコピー';copy.onclick=async()=>{
     try{await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]);status.textContent='画像をコピーしました。AIの入力欄へ貼り付けてください。';}
     catch{status.textContent='この環境では画像をコピーできませんでした。「画像を保存」から添付してください。';}
    };actions.append(copy);
   }
   const file=new File([blob],filename,{type:'image/png'});
   if(navigator.canShare?.({files:[file]})){
    const share=document.createElement('button');share.type='button';share.textContent='画像を共有';share.onclick=async()=>{try{await navigator.share({files:[file]});}catch(error){if(error.name!=='AbortError')status.textContent='共有できませんでした。「画像を保存」をお試しください。';}};actions.append(share);
   }
  }).catch(error=>{if(dialog.isConnected)status.textContent=error.message||'画像を作成できませんでした。閉じて再度お試しください。';});
 }
 window.FP_QUESTION_IMAGE={needsImage,create,open};
})();
