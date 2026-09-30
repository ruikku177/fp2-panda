// 入力式の採点設定。問題文・登録解答の正本は data.js / 問題バンク側に残す。
// 第1章問30は登録解答の一部が未確定のため、入力のみで自動採点しない。
(() => {
  const number = (label, answer, unit) => ({label, answer, unit, kind:'number'});
  const decimal = (label, answer, unit) => ({label, answer, unit, kind:'decimal'});
  const letter = (label, answer) => ({label, answer, kind:'letters'});
  const specs = {
    'supplement:1:5': {fields:[number('（ア）純資産',14690,'万円')]},
    'supplement:1:6': {fields:[number('（1）基本生活費',202,'万円'),number('（2）金融資産残高',878,'万円')]},
    'supplement:1:12': {fields:[
      number('（1）',3219400,'円'),number('（2）',14365000,'円'),number('（3）',4525000,'円'),
      number('（4）',975000,'円'),number('（5）',477000,'円')
    ]},
    'supplement:1:30': {pending:true,fields:[
      {label:'（ア）',kind:'text'},{label:'（イ）',kind:'text'},{label:'（ウ）',kind:'text'}
    ]},
    'supplement:1:33': {fields:[
      {label:'（ア）支給開始日',answer:'1月21日',kind:'date'},
      number('（イ）支給額',9000,'円'),
      {label:'（ウ）支給期間',answer:'1年6か月',kind:'duration'}
    ]},
    'supplement:1:36': {fields:[number('（ア）',3,''),number('（イ）',5,''),number('（ウ）',9,'')]},
    'supplement:1:41': {fields:[letter('適切な記述', 'ウ')]},
    'supplement:1:61': {fields:[number('（ア）',4,''),number('（イ）',1,''),number('（ウ）',8,''),number('（エ）',10,'')]},
    'supplement:2:13': {fields:[number('適切な図の番号',3,'')]},
    'supplement:2:29': {fields:[number('入院給付金の対象日数',138,'日')]},
    'supplement:2:35': {fields:[number('年間の地震保険料',5110,'円')]},
    'supplement:2:40': {fields:[letter('適切な記述（複数）','イエ')]},
    'supplement:3:2': {fields:[number('（ア）',2,''),number('（イ）',5,''),number('（ウ）',7,''),number('（エ）',10,'')]},
    'supplement:3:18': {fields:[decimal('最終利回り',0.148,'%')]},
    'supplement:3:19': {fields:[decimal('所有期間利回り',0.95,'%')]},
    'supplement:3:23': {fields:[letter('適切な記述','イ')]},
    'supplement:3:65': {fields:[number('（ア）隆雄さん',940,'万円'),number('（イ）美也子さん',390,'万円')]}
  };

  const cleaned = value => String(value ?? '').normalize('NFKC').replace(/[\s\u3000]/g,'').trim();
  function normalized(value, field) {
    let text=cleaned(value);
    if(field.kind==='number'){
      if(field.unit && text.endsWith(field.unit)) text=text.slice(0,-field.unit.length);
      text=text.replace(/[,，]/g,'');
      return /^\d+$/.test(text) ? String(Number(text)) : null;
    }
    if(field.kind==='decimal'){
      if(field.unit && text.endsWith(field.unit)) text=text.slice(0,-field.unit.length);
      return /^\d+(?:\.\d+)?$/.test(text) ? String(Number(text)) : null;
    }
    if(field.kind==='letters'){
      text=text.replace(/[（()）\[\]、,，・/]/g,'');
      return /^[アイウエ]+$/.test(text) ? [...text].sort().join('') : null;
    }
    if(field.kind==='date'){
      text=text.replace(/[／/-]/g,'月').replace(/日$/,'');
      return text;
    }
    if(field.kind==='duration') return text.replace(/[ヶケ箇個カ]/g,'か');
    return text;
  }
  function expected(field){
    if(field.kind==='number'||field.kind==='decimal') return `${Number(field.answer).toLocaleString('ja-JP')}${field.unit || ''}`;
    if(field.kind==='letters') return [...field.answer].map(x=>`（${x}）`).join('');
    return field.answer;
  }
  function grade(id, values){
    const spec=specs[id];
    if(!spec) return null;
    const fields=spec.fields.map((field,index) => ({
      label:field.label,
      entered:String(values[index] ?? '').trim(),
      expected:spec.pending ? null : expected(field),
      correct:spec.pending ? null : normalized(values[index],field)===normalized(field.answer,field)
    }));
    return {pending:Boolean(spec.pending),correct:spec.pending ? null : fields.every(field=>field.correct),fields};
  }
  window.FP_WRITTEN={specs,grade};
})();
