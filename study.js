// 学習ページの入口。教材本文はまだ未作成なので、進捗や学習済み状態は付けない。
const studyThemes = [
  'FPの仕事とルール',
  '家計の現在と将来',
  'お金の計算を身につける',
  '人生の大きな支出に備える',
  '病気や介護に備える',
  '働く人を支える制度',
  '公的年金を理解する',
  '老後資金を自分で準備する',
  '企業のお金と信用取引の基礎'
];

$('#study-domain-grid').innerHTML = chapters.map(chapter =>
  `<button type="button" class="study-domain" data-study-chapter="${chapter.n}" style="--study-icon:${chapter.color};--study-tint:${chapter.tint}">
    <span class="study-domain-top"><span class="study-domain-icon"><svg><use href="#${chapter.icon}"/></svg></span><span class="study-domain-no">CHAPTER 0${chapter.n}</span></span>
    <strong>${chapter.name}</strong>
    <span class="study-domain-bottom"><span>教材作成中</span><span aria-hidden="true">→</span></span>
    <span class="study-domain-track" aria-hidden="true"></span>
  </button>`
).join('');

function showStudyDomains(){
  $('#study-domains').hidden = false;
  $('#study-themes').hidden = true;
  $('.breadcrumb').textContent = 'パンダと勉強';
  window.scrollTo(0,0);
}

function showStudyChapter(number){
  const chapter = chapters.find(item => item.n === number);
  if(!chapter) return;
  $('#study-domains').hidden = true;
  $('#study-themes').hidden = false;
  $('#study-chapter-no').textContent = `CHAPTER 0${number}`;
  $('#study-chapter-title').textContent = chapter.name;
  $('#study-chapter-desc').textContent = number === 1
    ? '身近なお金から、人生設計のしくみをつかもう。'
    : 'この分野の学習テーマは、教材を作りながら追加します。';
  $('#study-topic-list').innerHTML = number === 1
    ? studyThemes.map((theme,index) => `<div class="study-topic"><button type="button" data-study-topic="${index}" aria-expanded="false"><span class="study-topic-no">${String(index+1).padStart(2,'0')}</span><span class="study-topic-title">${theme}</span><span class="study-topic-status">教材作成中</span><span class="study-topic-arrow" aria-hidden="true">›</span></button><div class="study-topic-detail" hidden><p>このテーマのレッスンは、参考書を学びながら一緒に作っていきます。</p></div></div>`).join('')
    : '<div class="study-empty"><span>🐼</span><strong>教材を作成中です</strong><p>学習テーマが決まり次第、ここに並べていきます。</p></div>';
  $('.breadcrumb').textContent = `パンダと勉強 / 第${number}章`;
  window.scrollTo(0,0);
}

$('#study-domain-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-study-chapter]');
  if(button) showStudyChapter(Number(button.dataset.studyChapter));
});
$('#study-back').addEventListener('click', showStudyDomains);
$('#study-topic-list').addEventListener('click', event => {
  const button = event.target.closest('[data-study-topic]');
  if(!button) return;
  const detail = button.nextElementSibling;
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  detail.hidden = expanded;
});

const studyParams = new URLSearchParams(window.location.search);
if(studyParams.get('tab') === 'study'){
  showStudy();
  const chapter = Number(studyParams.get('chapter'));
  if(Number.isInteger(chapter) && chapter >= 1 && chapter <= 6) showStudyChapter(chapter);
}
