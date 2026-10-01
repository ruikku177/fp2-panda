// 第1章の学習目次。本文がないレッスンには学習済み状態を付けない。
const studyThemes = [
  {
    title: 'FPの仕事とルール',
    lessons: [
      'FPはどんな順番で相談に乗る？',
      'FPができること・資格が必要なこと',
      'お客さんの情報と著作物を守る'
    ]
  },
  {
    title: '家計の現在と将来',
    lessons: [
      '収入と「自由に使えるお金」は違う',
      '家族の予定をお金の表にする',
      '将来の生活費と貯蓄残高を計算する',
      'わが家の本当の財産はいくら？'
    ]
  },
  {
    title: 'お金の計算を身につける',
    lessons: [
      '利息にも利息が付く「複利」',
      '今のお金と将来のお金を行き来する',
      '毎年積み立てて、目標額をつくる',
      'お金を取り崩す・ローンを返す',
      '文章から使う係数を選ぼう'
    ]
  },
  {
    title: '人生の大きな支出に備える',
    lessons: [
      '給与から積み立てる財形貯蓄',
      '進学を支える奨学金',
      '奨学金と教育ローンは何が違う？',
      '住宅ローンの金利と返し方',
      'フラット35の仕組み',
      '繰上返済と借換えで何が変わる？'
    ]
  },
  {
    title: '病気や介護に備える',
    lessons: [
      '自分はどの医療保険に入る？',
      '家族の扶養に入る・退職後も加入する',
      '健康保険料はどう決まる？',
      '病気で働けないときの傷病手当金',
      '出産で休むときのお金と保険料',
      '医療費が高くなったときの高額療養費',
      '介護保険は誰が使える？',
      '介護サービスの自己負担を計算する'
    ]
  },
  {
    title: '働く人を支える制度',
    lessons: [
      '仕事中・通勤中のけがを支える労災保険',
      '雇用保険の全体像をつかむ',
      '失業したときの基本手当',
      '年齢を重ねて働く・離職する',
      '育児や介護で仕事を休む',
      'こんなとき、どの制度を使う？'
    ]
  },
  {
    title: '公的年金を理解する',
    lessons: [
      '年金は「老後」だけの制度じゃない',
      '第1号・第2号・第3号って誰のこと？',
      '保険料を払えないとき・免除されるとき',
      '老齢年金はいつから、いくら受け取れる？',
      '付加年金と加給年金を区別する',
      '早く受け取る？ 遅く受け取る？',
      '働きながら年金を受け取る',
      '障害が残ったときの年金',
      '家族が亡くなったときの年金',
      '家族の年齢で遺族給付はどう変わる？'
    ]
  },
  {
    title: '老後資金と退職金に備える',
    lessons: [
      '公的年金に上乗せする制度を知る',
      '企業型DCとiDeCoの仕組み',
      'DCのお金を受け取る・転職時に移す',
      '国民年金基金で年金を上乗せする',
      '経営者のための小規模企業共済',
      '従業員のための中小企業退職金共済'
    ]
  },
  {
    title: '企業のお金とクレジットの基礎',
    lessons: [
      '企業のお金を3つの決算書で見る',
      '売上から利益ができるまで',
      'カードの支払い方法を見分ける',
      'カードの利用ルールと信用情報'
    ]
  }
];
const studyLessonCount = studyThemes.reduce((total, theme) => total + theme.lessons.length, 0);

$('#study-domain-grid').innerHTML = chapters.map(chapter =>
  `<button type="button" class="study-domain" data-study-chapter="${chapter.n}" style="--study-icon:${chapter.color};--study-tint:${chapter.tint}">
    <span class="study-domain-no">${String(chapter.n).padStart(2,'0')}</span>
    <span class="study-domain-icon"><svg aria-hidden="true"><use href="#${chapter.icon}"/></svg></span>
    <span class="study-domain-copy"><strong>${chapter.name}</strong><small>${chapter.n === 1 ? `9テーマ・${studyLessonCount}レッスン` : '教材作成中'}</small></span>
    <span class="study-domain-arrow" aria-hidden="true">›</span>
  </button>`
).join('');

function showStudyDomains(){
  $('#study-domains').hidden = false;
  $('#study-themes').hidden = true;
  $('#study-lesson-view').hidden = true;
  $('#study-back').hidden = true;
  $('.breadcrumb').textContent = 'パンダと勉強';
  window.scrollTo(0,0);
}

function showStudyChapter(number){
  const chapter = chapters.find(item => item.n === number);
  if(!chapter) return;
  $('#study-domains').hidden = true;
  $('#study-themes').hidden = false;
  $('#study-lesson-view').hidden = true;
  $('#study-back').hidden = false;
  $('.study-chapter-intro').classList.toggle('is-pending', number !== 1);
  $('#study-chapter-no').textContent = `CHAPTER 0${number}`;
  $('#study-chapter-title').textContent = chapter.name;
  $('#study-chapter-desc').textContent = number === 1
    ? '身近なお金から、人生設計のしくみをつかもう。'
    : 'この分野の学習テーマは、教材を作りながら追加します。';
  $('#study-summary-detail').textContent = number === 1
    ? `9テーマ・${studyLessonCount}レッスン`
    : '教材作成中';
  $('#study-summary-status').textContent = '教材作成中';
  $('#study-topics-heading').textContent = number === 1 ? `テーマ一覧（全${studyThemes.length}テーマ）` : 'この分野の教材';
  $('#study-topic-list').innerHTML = number === 1
    ? studyThemes.map((theme,index) => `<div class="study-topic"><button type="button" data-study-topic="${index}" aria-expanded="false" aria-controls="study-lessons-${index}"><span class="study-topic-no">${String(index+1).padStart(2,'0')}</span><span class="study-topic-title">${theme.title}</span><span class="study-topic-status">${theme.lessons.length}レッスン${index===0?' · 公開中':''}</span><span class="study-topic-arrow" aria-hidden="true">›</span></button><div class="study-topic-detail" id="study-lessons-${index}" hidden>${index===0?'':'<div class="study-topic-pending"><span aria-hidden="true">ⓘ</span><p>このテーマの教材は現在準備中です。<br>レッスン内容は順次追加していきます。</p></div>'}<h3>レッスン一覧</h3><ol class="study-lesson-list">${theme.lessons.map((lesson, lessonIndex) => `<li class="study-lesson">${index===0?`<button type="button" data-study-lesson="${lessonIndex}"><span class="study-lesson-no">${String(lessonIndex+1).padStart(2,'0')}</span><span class="study-lesson-title">${lesson}</span><span aria-hidden="true">›</span></button>`:`<span class="study-lesson-no">${String(lessonIndex+1).padStart(2,'0')}</span><span class="study-lesson-title">${lesson}</span>`}</li>`).join('')}</ol></div></div>`).join('')
    : '<div class="study-empty"><img src="assets/fp-panda-v3/normal.png" alt="勉強中のFPパンダ" width="128" height="121"><strong>教材を準備中です</strong><p>この分野も順次追加していきます。</p></div>';
  $('.breadcrumb').textContent = `パンダと勉強 / 第${number}章`;
  window.scrollTo(0,0);
}

$('#study-domain-grid').addEventListener('click', event => {
  const button = event.target.closest('[data-study-chapter]');
  if(button) showStudyChapter(Number(button.dataset.studyChapter));
});
let activeStudyLesson = 0;
function showStudyLesson(index){
  const lesson = studyLessonContent[index];
  if(!lesson) return;
  activeStudyLesson = index;
  $('#study-domains').hidden = true;
  $('#study-themes').hidden = true;
  $('#study-lesson-view').hidden = false;
  $('#study-back').hidden = false;
  $('#study-back').setAttribute('aria-label','テーマ一覧に戻る');
  $('#study-lesson-index').textContent = `レッスン ${String(index+1).padStart(2,'0')} / ${studyLessonContent.length}`;
  $('#study-lesson-heading').textContent = studyThemes[0].lessons[index];
  $('#study-lesson-panda').textContent = `🐼「${lesson.panda}」`;
  $('#study-lesson-body').innerHTML = lesson.html;
  $('#study-related-questions').textContent = `関連する補助問題（問${lesson.questionNumbers.join('・')}）を解く`;
  $('#study-next-lesson').hidden = index === studyLessonContent.length-1;
  $('.breadcrumb').textContent = `パンダと勉強 / 第1章 / ${studyThemes[0].title}`;
  window.scrollTo(0,0);
}
$('#study-back').addEventListener('click', () => {
  if(!$('#study-lesson-view').hidden){
    showStudyChapter(1);
    const topic = $('#study-topic-list [data-study-topic="0"]');
    topic.setAttribute('aria-expanded','true');
    topic.nextElementSibling.hidden = false;
    $('#study-back').setAttribute('aria-label','6分野に戻る');
  }else showStudyDomains();
});
$('#study-topic-list').addEventListener('click', event => {
  const lessonButton = event.target.closest('[data-study-lesson]');
  if(lessonButton){showStudyLesson(Number(lessonButton.dataset.studyLesson));return;}
  const button = event.target.closest('[data-study-topic]');
  if(!button) return;
  const detail = button.nextElementSibling;
  const expanded = button.getAttribute('aria-expanded') === 'true';
  button.setAttribute('aria-expanded', String(!expanded));
  detail.hidden = expanded;
});
$('#study-next-lesson').addEventListener('click', () => showStudyLesson(activeStudyLesson+1));
$('#study-related-questions').addEventListener('click', () => {
  const ids = studyLessonContent[activeStudyLesson].questionNumbers.map(number => `supplement:1:${number}`).filter(id => byId.has(id));
  if(!ids.length) return;
  if(session && Object.keys(session.responses||{}).length && !window.confirm('進行中の問題演習があります。新しい演習を始めますか？')) return;
  session = {ids,index:0,responses:{},createdAt:Date.now(),activeMs:0,scope:[1],target:'all',order:'sequential',count:String(ids.length)};
  saveSession();
  showQuestion();
});

const studyParams = new URLSearchParams(window.location.search);
if(studyParams.get('tab') === 'study'){
  showStudy();
  const chapter = Number(studyParams.get('chapter'));
  if(Number.isInteger(chapter) && chapter >= 1 && chapter <= 6) showStudyChapter(chapter);
}
