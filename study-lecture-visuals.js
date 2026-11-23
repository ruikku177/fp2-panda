// レジュメ原画像の「関係・時間・面積」を確認し、独自の図へ再構成。
// 原本写真やページ番号は配信しない。照合先は教材下書き/レジュメ図解_照合記録.md。
(() => {
  const C={ink:'#123d36',green:'#24745a',mint:'#dfefe4',gold:'#f8e9c9',amber:'#946522',rose:'#fae5df',red:'#a34e49',line:'#bccfc1',paper:'#fffefa',blue:'#e3edf2',slate:'#476777'};
  const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
  const rect=(x,y,w,h,fill=C.mint,stroke='none')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill}" stroke="${stroke}"/>`;
  const text=(x,y,lines,size=16,anchor='start',fill=C.ink,bold=false)=>`<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" font-size="${size}" font-weight="${bold?700:400}">${(Array.isArray(lines)?lines:[lines]).map((line,i)=>`<tspan x="${x}" dy="${i?size*1.45:0}">${esc(line)}</tspan>`).join('')}</text>`;
  const box=(x,y,w,h,lines,fill=C.mint)=>rect(x,y,w,h,fill)+text(x+w/2,y+h/2-((Array.isArray(lines)?lines.length:1)-1)*11+6,lines,16,'middle',C.ink,true);
  const line=(x1,y1,x2,y2,color=C.line,dash='')=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="2"${dash?` stroke-dasharray="${dash}"`:''}/>`;
  const arrow=(x1,y1,x2,y2,color=C.green)=>{
    const a=Math.atan2(y2-y1,x2-x1),s=8;
    return line(x1,y1,x2,y2,color)+`<path d="M${x2} ${y2}L${x2-s*Math.cos(a-.5)} ${y2-s*Math.sin(a-.5)}L${x2-s*Math.cos(a+.5)} ${y2-s*Math.sin(a+.5)}Z" fill="${color}"/>`;
  };
  const person=(x,y,label,color=C.green)=>`<circle cx="${x}" cy="${y+12}" r="11" fill="${color}"/><path d="M${x-20} ${y+48}V${y+38}Q${x-20} ${y+24} ${x} ${y+24}Q${x+20} ${y+24} ${x+20} ${y+38}V${y+48}Z" fill="${color}"/>`+text(x,y+71,label,16,'middle',C.ink,true);
  const house=(x,y,w,label,fill=C.mint)=>`<path d="M${x} ${y+30}L${x+w/2} ${y}L${x+w} ${y+30}V${y+100}H${x}Z" fill="${fill}" stroke="${C.green}" stroke-width="2"/>`+rect(x+w/2-10,y+61,20,39,C.paper)+text(x+w/2,y+126,label,16,'middle',C.ink,true);
  const car=(x,y,label,color=C.green)=>`<path d="M${x} ${y+19}H${x+12}L${x+23} ${y}H${x+60}L${x+73} ${y+19}H${x+85}V${y+44}H${x}Z" fill="${C.blue}" stroke="${color}" stroke-width="2"/><circle cx="${x+18}" cy="${y+44}" r="8" fill="${color}"/><circle cx="${x+67}" cy="${y+44}" r="8" fill="${color}"/>`+text(x+42,y+78,label,16,'middle',C.ink,true);
  const axis=(x,y,w,label)=>arrow(x,y,x+w,y,C.slate)+text(x+w,y+26,label,15,'end');
  const D={};
  function define(id,title,height,description,draw){D[id]={id,title,height,description,draw};}

  define('financial-layers','生活を支えるお金を積み重ねる',340,'生活に必要な資金を、公的保障・企業保障・貯蓄で支え、不足分を民間保険などで補う。',()=>{
    let s=box(8,28,108,256,['必要な','生活資金'],C.blue);
    const rows=[['民間保険など',55,C.rose],['貯蓄など',62,C.gold],['企業の保障',62,C.mint],['公的保障',77,C.mint]];let y=28;
    for(const [label,h,c] of rows){s+=box(170,y,180,h,label,c);y+=h;}
    return s+arrow(126,55,163,55,C.red)+text(130,20,'不足分',16,'middle',C.red,true)+text(180,319,'先に、既にある備えを確認',16,'middle');
  });
  define('medical-people','患者・病院・保険者の間で動くお金',380,'医療費1万円、自己負担3割と仮定。患者は3千円を病院へ払い、残る7千円は保険者が負担する。',()=>
    person(66,26,'患者')+box(217,36,130,65,'病院',C.blue)+box(105,247,150,66,'保険者')+
    arrow(104,58,207,58)+text(156,35,['窓口負担','3,000円'],16,'middle')+
    arrow(213,233,258,113)+text(300,167,['残り','7,000円'],16,'middle')+
    arrow(64,116,102,244)+text(59,181,['保険料'],16,'middle')+text(180,356,'合計1万円 ＝ 3割 ＋ 7割',18,'middle',C.green,true));
  define('sickness-days','「連続3日」がそろう場所を探す',340,'途中に出勤があれば待期は成立しない。連続した3日の休業の後、4日目以降に支給条件を満たす休業日が対象。',()=>{
    let s=text(12,26,'休・出勤・休・休・休・休 の例',17,'start',C.ink,true);
    ['休','出勤','休','休','休','休'].forEach((v,i)=>{const x=8+i*58;s+=rect(x,59,52,68,i===1?C.blue:i===5?C.mint:C.gold)+text(x+26,83,`${i+1}日目`,15,'middle')+text(x+26,111,v,17,'middle',C.ink,true);});
    s+=line(135,144,295,144,C.amber)+text(215,174,'ここで連続3日の待期',16,'middle',C.amber,true);
    s+=arrow(323,137,323,204)+box(191,215,157,60,['6日目から','支給対象を判定']);
    s+=box(9,215,158,60,['1日目の休みは','今回の待期に足さない'],C.rose);
    return s+text(180,316,'土日・有給でも、休業が連続すれば算入',15,'middle');
  });
  define('birth-days','産前・遅れた日数・産後を分ける',344,'単胎出産の基本。産前42日、出産が予定日を過ぎた日数、出産翌日から56日を分けて数える。',()=>{
    let s=text(12,24,'予定日に出産した場合',17,'start',C.ink,true);
    s+=box(12,52,140,65,['産前42日','出産日を含む'],C.blue)+box(168,52,179,65,['産後56日','翌日から数える']);
    s+=line(160,39,160,137,C.red)+text(160,159,'出産日',16,'middle',C.red,true);
    s+=text(12,201,'予定日より5日遅れた例',17,'start',C.ink,true);
    s+=box(12,222,111,63,'産前42日',C.blue)+box(128,222,80,63,['遅れ','5日'],C.gold)+box(213,222,134,63,'産後56日');
    return s+text(180,321,'42 ＋ 5 ＋ 56 ＝ 103日（条件を満たす日）',15,'middle');
  });
  define('childcare-lanes','出産手当金から育児休業給付へ',358,'産休中の出産手当金は健康保険、育児休業中の給付は雇用保険。給付率の区切りと制度の切替えを別々に見る。',()=>{
    let s=axis(18,56,322,'出産から育児へ →');
    s+=text(78,33,'出産',16,'middle',C.red,true)+line(78,41,78,72,C.red);
    s+=box(12,96,144,92,['出産手当金','原則 2/3','健康保険'],C.blue)+box(166,96,181,92,['育児休業給付金','雇用保険']);
    s+=arrow(157,140,164,140);
    s+=box(166,202,86,75,['180日','まで','67％'],C.mint)+box(259,202,88,75,['181日','以後','50％'],C.gold);
    return s+text(180,317,['休業開始からの日数で給付率を判定','上乗せ給付・賃金による調整は別に確認'],15,'middle');
  });
  define('care-area','限度内の1割と、超えた分の全額',340,'利用25万円、支給限度20万円、自己負担1割の架空例。限度内は2万円、超過分は5万円、合わせて7万円。',()=>{
    let s=text(180,28,'利用額25万円の内訳',18,'middle',C.ink,true);
    s+=rect(18,56,256,140,C.mint)+rect(18,182,256,14,C.green)+rect(274,56,64,140,C.rose);
    s+=text(146,104,['保険給付','18万円'],18,'middle',C.green,true)+text(306,109,['全額','負担','5万円'],16,'middle',C.red,true);
    s+=text(146,220,'限度内20万円 × 1割 ＝ 2万円',16,'middle');
    s+=arrow(160,239,160,264)+box(28,274,302,48,'自己負担 2 ＋ 5 ＝ 7万円',C.gold);
    return s;
  });
  define('pension-building','年金の2階建てと加入者の3区分',370,'1階は共通の基礎年金。会社員等は厚生年金に加入する第2号で、扶養配偶者の第3号とは区分が違う。',()=>{
    let s=box(12,207,336,56,'1階：国民年金（基礎年金）',C.mint)+box(126,127,110,72,['2階','厚生年金'],C.blue);
    s+=person(67,15,'第1号',C.amber)+person(183,15,'第2号')+person(298,15,'第3号',C.slate);
    s+=text(67,112,'自営業等',16,'middle')+text(183,112,'会社員等',16,'middle')+text(298,112,'扶養配偶者',15,'middle');
    s+=line(120,124,120,207)+line(237,124,237,207);
    s+=text(66,154,['自分で','保険料を納付'],15,'middle')+text(294,147,['個別に','保険料を','払わない'],15,'middle');
    return s+text(180,307,['第3号は第2号に扶養される配偶者','子や親は、第3号にはならない'],16,'middle');
  });
  define('pension-rate','65歳を100％として受給率を見る',348,'1962年4月2日以後生まれの0.4％減額の基本例。60歳開始76％、65歳100％、70歳142％、75歳184％。生年月日等による例外は別に確認。',()=>{
    const rows=[['60歳',76,C.rose],['65歳',100,C.mint],['70歳',142,C.mint],['75歳',184,C.blue]];let s='';
    rows.forEach(([age,rate,color],i)=>{const y=36+i*58;s+=text(12,y+24,age,17,'start',C.ink,true)+rect(79,y,rate,35,color)+text(84+rate,y+24,`${rate}％`,17,'start',C.ink,true);});
    s+=line(179,20,179,257,C.green,'4 4');
    return s+text(180,291,['繰上げ：月0.4％減（対象者の条件あり）','繰下げ：月0.7％増。その率が原則生涯続く'],15,'middle');
  });
  define('survivor-age','子と配偶者の年齢で、給付が切り替わる',376,'条件を満たす妻と子の概念例。子の対象年齢終了、妻65歳を境に確認する年金や加算が変わる。',()=>{
    let s=axis(16,47,325,'家族の年齢が進む →');
    s+=text(18,26,'夫の死亡',16)+text(177,91,['子の対象','年齢終了'],16,'middle')+text(299,91,'妻65歳',16,'middle');
    s+=line(190,55,190,317,C.amber,'4 4')+line(297,55,297,317,C.slate,'4 4');
    s+=box(12,123,172,49,'遺族基礎年金');
    s+=box(12,187,335,49,'遺族厚生年金（調整あり）',C.blue);
    s+=box(192,250,100,68,['寡婦加算','条件あり'],C.gold)+box(300,250,48,68,['老齢','基礎'],C.mint);
    return s+text(180,355,'対象となる遺族・年齢・生計維持等を先に確認',15,'middle');
  });
  define('dc-flow','掛金・運用・受取りの3つの場所',350,'企業型DCは主に事業主、iDeCoは本人が掛金を出し、加入者が運用商品を選ぶ。受取額は運用結果等で変わる。',()=>{
    let s=person(75,12,'事業主')+person(278,12,'本人');
    s+=arrow(77,95,151,137)+arrow(278,95,215,137)+text(47,122,'企業型',16)+text(286,122,'iDeCo',16);
    s+=box(71,149,218,72,['自分のDC口座','運用商品を選ぶ'],C.blue)+arrow(180,225,180,254)+box(36,267,288,59,'老後に一時金・年金等で受取り');
    return s;
  });
  define('three-roles','負担する人・保障される人・受取る人',362,'保険料負担者、被保険者、受取人を別の役割として確認する。死亡保険金の税区分は3人の組合せで変わる。',()=>{
    let s=person(70,20,['保険料','負担者'])+person(286,20,['被保険者']);
    s+=arrow(100,60,244,60)+text(178,39,'誰の保障？',16,'middle');
    s+=person(180,183,'受取人',C.amber)+arrow(282,111,205,184)+text(287,165,'保険金',16,'middle');
    return s+text(180,296,['負担者＝被保険者 → 相続税','負担者＝受取人 → 所得税','3人とも別 → 贈与税'],16,'middle');
  });
  define('contract-date','承諾日より前に、責任が始まる例',354,'責任開始特約なしの通常の取扱いの概念例。申込み・告知・初回保険料がそろった日へ、承諾後にさかのぼる。',()=>{
    let s=axis(18,74,321,'日付 →');
    const rows=[{x:36,date:'4/3',body:['申込','告知'],c:C.blue},{x:164,date:'4/5',body:['初回保険料','払込み'],c:C.mint},{x:300,date:'4/9',body:['保険会社','承諾'],c:C.gold}];
    rows.forEach(r=>{s+=text(r.x,49,r.date,18,'middle',C.ink,true)+line(r.x,63,r.x,89,C.green)+box(Math.max(8,r.x-52),103,104,70,r.body,r.c);});
    s+=arrow(300,215,164,215,C.amber)+text(233,247,'承諾後にさかのぼる',16,'middle',C.amber,true);
    return s+box(13,276,334,56,'この例の責任開始日：4月5日',C.mint);
  });
  define('paidup-extension','払済・延長で、保障額と保険期間はどう変わる？',454,'同じ解約返戻金を使う変更でも、払済は期間を原則維持して保障額を減らし、延長定期は死亡保障額を原則維持して期間を変更する。',()=>{
    let s='';
    [['払済保険',32],['延長定期保険',253]].forEach(([label,y],i)=>{
      s+=text(12,y,label,19,'start',C.ink,true)+rect(24,y+26,306,107,C.paper,C.line);
      s+=rect(24,y+26,82,107,C.blue)+rect(106,y+(i?26:81),i?127:224,i?107:52,C.mint);
      s+=line(106,y+10,106,y+144,C.slate,'4 4')+axis(24,y+139,306,'期間 →');
      s+=text(65,y+85,'変更前',15,'middle');
      s+=text(i?170:219,y+(i?77:63),i?'金額を保つ':'金額を小さく',16,'middle',C.green,true);
      s+=text(110,y+171,'変更時点',15,'middle');
      if(!i)s+=text(232,y+117,'元の満了まで続く',15,'middle');
      else s+=text(271,y+87,['期間を','変更'],15,'middle',C.amber,true);
    });return s;
  });
  define('coverage-shapes','同じ「死亡保障」でも、形が違う',532,'定期は一定期間、終身は一生涯、養老は死亡保障と満期金、収入保障は残り期間に応じた受取総額という違いを形で比べる。',()=>{
    let s='';
    ['定期保険','終身保険','養老保険','収入保障'].forEach((name,i)=>{const y=25+i*125;s+=text(12,y,name,18,'start',C.ink,true)+axis(99,y+85,239,'期間');
      if(i<3)s+=rect(99,y+20,i===1?239:194,57,i===2?C.gold:C.mint);
      if(i===1)s+=arrow(305,y+47,340,y+47)+text(207,y+58,'一生涯',17,'middle');
      if(i===0)s+=text(196,y+58,'一定期間',17,'middle');
      if(i===2)s+=text(192,y+58,'死亡保険金',17,'middle')+line(295,y+16,295,y+77,C.amber)+text(307,y+40,['満期','金'],15,'middle',C.amber,true);
      if(i===3)s+=`<path d="M99 ${y+20}L293 ${y+77}H99Z" fill="${C.mint}"/>`+text(209,y+110,'死亡時点が遅いほど総額が減る',14,'middle');
    });return s;
  });
  define('annuity-life','死亡した後も受け取れる期間はどこ？',428,'確定年金は所定期間の生死を問わず、有期年金は生存が条件。保証期間付き終身年金では保証期間内とその後を分ける。',()=>{
    let s='';
    [['確定年金','死亡後も所定期間の受取り'],['有期年金','死亡で支給終了'],['保証期間付終身','保証期間後は生存中のみ']].forEach(([label,note],i)=>{
      const y=26+i*130;s+=text(12,y,label,18,'start',C.ink,true)+axis(20,y+80,321,'年齢 →');
      s+=rect(20,y+23,i===1?180:320,44,C.mint)+text(180,y+115,note,16,'middle');
      if(i===0)s+=line(203,y+14,203,y+77,C.red,'4 4')+text(207,y+15,'死亡しても',14);
      if(i===1)s+=line(200,y+13,200,y+72,C.red)+text(205,y+43,'死亡',16,'start',C.red,true);
      if(i===2)s+=rect(20,y+23,180,44,C.blue)+text(110,y+52,'保証期間',16,'middle')+text(273,y+52,'その後',16,'middle');
    });return s;
  });
  define('auto-map','車の事故は「誰の・何の」損害か',406,'相手の人、相手の物、自分の人、自分の車の4区分。自賠責は他人の人身が対象で、対物や自分の車を補償するものではない。',()=>{
    let s=car(38,20,'自分の車')+car(235,20,'相手の車',C.slate)+text(180,50,'↔',30,'middle');
    const cells=[{x:10,y:133,a:'自分・同乗者',b:'人身傷害等'},{x:185,y:133,a:'相手の人',b:'自賠責＋対人'},{x:10,y:263,a:'自分の車',b:'車両保険'},{x:185,y:263,a:'相手の物',b:'対物賠償'}];
    cells.forEach(c=>{s+=box(c.x,c.y,165,98,[c.a,c.b],c.x===10?C.mint:C.blue);});
    return s+text(180,390,'補償範囲・他人の定義は契約ごとに確認',15,'middle');
  });
  define('tenant-fire','隣家への責任と、家主への責任は別',379,'借家で失火した場面。隣家への不法行為責任には失火責任法の特例があるが、家主への契約上の責任とは分ける。',()=>{
    let s=house(28,30,120,'借りている家')+house(220,30,110,'隣家',C.blue)+text(90,18,'失火',17,'middle',C.red,true);
    s+=person(91,201,'借家人')+person(283,201,'家主',C.slate);
    s+=arrow(124,235,247,235)+text(185,207,'契約上の責任',16,'middle',C.amber,true)+text(185,270,'借家人賠償等',16,'middle');
    s+=arrow(156,80,209,80,C.red)+text(180,177,['隣家：重過失等の有無を確認','失火だから家主にも免責、とは限らない'],15,'middle');
    return s;
  });
  define('fx-trip','円を外貨にして、利息を付けて円へ戻す',454,'払込15万円をTTS150円で1千ドルに交換。税引後で2％増えて1020ドルになり、TTB145円で円転すると14万7900円。レートは架空例。',()=>{
    let s=box(28,15,302,63,['円で払う 150,000円'],C.gold);
    s+=arrow(103,83,103,115)+text(134,107,'÷ TTS 150円',18,'start',C.amber,true);
    s+=box(28,123,302,56,'外貨の元本 1,000ドル',C.blue);
    s+=arrow(103,183,103,215)+text(134,209,'× 1.02（税引後の仮定）',15);
    s+=box(28,223,302,56,'満期の外貨 1,020ドル',C.blue);
    s+=arrow(103,284,103,316)+text(134,310,'× TTB 145円',18,'start',C.amber,true);
    s+=box(28,324,302,56,'円で受取る 147,900円',C.gold);
    return s+text(180,420,'円での損益：−2,100円',20,'middle',C.red,true);
  });
  define('bond-cash','利子と償還差益を、1年分にそろえる',396,'額面100円、年利子2円、購入98円、5年後100円償還の架空例。利子と償還差益を年換算し、購入価格で割る。',()=>{
    let s=axis(28,127,304,'');
    for(let i=0;i<6;i++){const x=31+i*57;s+=line(x,119,x,134,C.slate)+text(x,159,i?`${i}年`:'購入',15,'middle');
      if(i){s+=arrow(x,116,x,73)+text(x,53,i===5?'102':'2',18,'middle',C.green,true);}
      else s+=arrow(x,138,x,192)+text(x-18,219,'−98',18,'start',C.red,true);
    }
    s+=text(180,26,'受取り：年利子2円、最後は利子＋償還金',15,'middle');
    s+=box(66,190,275,58,['償還差益 100−98＝2円','5年で割る → 年0.4円'],C.gold);
    s+=box(13,272,334,82,['（年利子2 ＋ 年0.4）÷ 購入98','×100 ＝ 約2.45％'],C.mint);
    return s;
  });
  define('bond-price','新しい債券の利息が増えると、古い債券は？',364,'ほかの条件を同じとした固定利付債の概念例。新発債の利率が上がると、低い利率の既発債は価格が下がる方向に動く。',()=>{
    let s=box(13,20,158,87,['新しい債券','年3％'],C.blue)+box(187,20,158,87,['前からある債券','年1％'],C.mint);
    s+=text(180,139,'同じ値段なら、新しい方が魅力的',17,'middle',C.ink,true);
    s+=arrow(266,154,266,193)+box(182,202,163,88,['古い債券は','価格が下がる','方向'],C.rose);
    s+=box(13,202,151,88,['安く買えると','買い手の利回り','は上がる'],C.gold)+arrow(174,247,166,247);
    return s+text(180,335,'市場金利 ↑   ⇄   既発債価格 ↓',20,'middle',C.green,true);
  });
  define('fund-roles','販売・運用指図・財産の保管を分ける',436,'契約型投信では投資家が販売会社を通じて申し込み、運用会社が指図、信託銀行が信託財産を管理する。',()=>{
    let s=person(180,8,'投資家')+arrow(180,90,180,116)+box(94,126,172,58,'販売会社',C.gold);
    s+=text(290,110,'申込・換金',16,'middle');
    s+=arrow(180,188,180,234)+box(94,245,172,63,['信託銀行','信託財産を保管'],C.blue);
    s+=box(12,346,155,65,['運用会社','運用方針を決定'],C.mint)+arrow(174,366,249,318);
    s+=text(260,376,'運用を指図',16,'middle');
    return s;
  });
  define('distributions','分配金を、利益と元本の部分に切り分ける',553,'分配後の基準価額と個別元本を比較する。全額利益、一部が元本、全額元本の3パターンを独自の数値で図示。金額は1万口当たりの例。',()=>{
    const cases=[{name:'① 全額が普通分配金',base:10800,after:11000,ordinary:1000,refund:0},
      {name:'② 一部が元本の払戻し',base:11400,after:11000,ordinary:600,refund:400},
      {name:'③ 全額が元本の払戻し',base:12300,after:11000,ordinary:0,refund:1000}];
    let s='';cases.forEach((c,i)=>{const y=25+i*175;s+=text(12,y,c.name,18,'start',C.ink,true)+text(12,y+32,`分配前12,000円／個別元本${c.base.toLocaleString()}円`,15);
      const w=c.ordinary/1000*330;
      if(w)s+=rect(15,y+49,w,61,C.mint)+text(15+w/2,y+76,['普通',`${c.ordinary}円`],16,'middle',C.green,true);
      if(w<330)s+=rect(15+w,y+49,330-w,61,C.gold)+text(15+w+(330-w)/2,y+76,['元本払戻',`${c.refund}円`],16,'middle',C.amber,true);
      s+=text(15,y+138,`新個別元本：${(c.base-c.refund).toLocaleString()}円`,16,'start',C.ink,true);
    });return s;
  });
  define('dollar-cost','同じ1万円で、安い月は多く買える',370,'単価1000円と500円の2回で各1万円投資する例。10口と20口を買い、平均単価は2万円を30口で割る。利益を保証するものではない。',()=>{
    let s=box(12,15,158,62,['毎回の投資額','1万円'],C.blue)+box(188,15,158,62,['毎回の投資額','1万円'],C.blue);
    s+=text(91,112,'単価1,000円',17,'middle')+text(267,112,'単価500円',17,'middle');
    for(let i=0;i<10;i++)s+=rect(34+(i%5)*23,139+Math.floor(i/5)*25,18,18,C.green);
    for(let i=0;i<20;i++)s+=rect(210+(i%5)*23,139+Math.floor(i/5)*25,18,18,C.green);
    s+=text(91,220,'10口',19,'middle',C.green,true)+text(267,262,'20口',19,'middle',C.green,true);
    return s+box(12,294,334,61,['総投資額2万円 ÷ 総数量30口','平均単価 約666.67円'],C.gold);
  });
  define('risk-bell','平均からどれくらい、ばらつく？',377,'正規分布を仮定し、期待収益率10％、標準偏差15％なら平均プラスマイナス1標準偏差のマイナス5〜25％に約68％が入る。将来の保証ではない。',()=>{
    const f=x=>187-135*Math.exp(-.5*((x-180)/(290/6))**2);
    const curve=Array.from({length:81},(_,i)=>{const x=35+i*290/80;return `${i?'L':'M'}${x.toFixed(1)} ${f(x).toFixed(1)}`;}).join('');
    const l=180-290/6,r=180+290/6;const shade=Array.from({length:31},(_,i)=>{const x=l+(r-l)*i/30;return `L${x.toFixed(1)} ${f(x).toFixed(1)}`;}).join('');
    let s=`<path d="M${l} 187${shade}L${r} 187Z" fill="${C.mint}"/><path d="${curve}" fill="none" stroke="${C.green}" stroke-width="3"/>`;
    s+=axis(25,187,308,'収益率');
    [l,180,r].forEach((x,i)=>{s+=line(x,190,x,201,C.slate)+text(x,226,['−5％','10％','25％'][i],17,'middle',C.ink,true);});
    s+=text(180,142,'約68％',20,'middle',C.green,true)+text(180,29,'期待収益率10％・標準偏差15％の例',16,'middle');
    s+=line(l,247,r,247,C.amber)+text(180,277,'平均 ± 1標準偏差',18,'middle',C.amber,true);
    return s+text(180,326,['分布を仮定した説明。','実際の損失は、この範囲を超えることもある。'],15,'middle');
  });
  define('correlation','2資産の動きが違うと、組み合わせ効果が変わる',407,'2本の線は2資産の値動きの概念。相関プラス1は同じ向き、ゼロは直線的な関係がなく、マイナス1は逆向き。',()=>{
    let s='';['＋1：同じ向き','0：直線的な関係なし','−1：反対向き'].forEach((label,i)=>{const y=22+i*128;s+=text(12,y,label,18,'start',C.ink,true);
      const p1=[70,37,59,25,49,18],p2=i===0?[90,57,79,45,69,38]:i===1?[40,80,22,59,34,75]:[22,55,33,67,43,74];
      const plot=points=>points.map((v,j)=>`${j?'L':'M'}${24+j*59} ${y+16+v}`).join('');
      s+=`<path d="${plot(p1)}" fill="none" stroke="${C.green}" stroke-width="3"/><path d="${plot(p2)}" fill="none" stroke="${C.amber}" stroke-width="3"/>`;
    });return s;
  });
  define('nisa-box','年ごとの投資枠と、保有総枠を分ける',387,'年間枠120万円と240万円の合計360万円。非課税保有限度額1800万円の内側に成長枠上限1200万円が含まれる。別々に加算しない。',()=>{
    let s=text(12,26,'1年間で投資できる枠',18,'start',C.ink,true)+box(12,48,110,78,['つみたて','120万円'],C.mint)+box(128,48,218,78,['成長投資枠','240万円'],C.blue);
    s+=text(180,159,'年間合計 360万円',19,'middle',C.green,true);
    s+=rect(12,207,334,137,C.gold,C.line)+text(180,236,'保有総枠 1,800万円',20,'middle',C.ink,true);
    s+=box(23,253,215,73,['うち成長投資枠','上限1,200万円'],C.blue);
    return s+text(180,376,'総枠は取得価額で管理する',16,'middle');
  });
  define('bank-merge','同じ銀行の別支店は、まとめて判定',355,'同じ銀行のA支店700万円とB支店600万円は合計1300万円。一般預金等の保護は預金者1人・1金融機関で元本1000万円とその利息等までが基本。',()=>{
    let s=box(12,24,157,70,['A支店','700万円'],C.blue)+box(190,24,157,70,['B支店','600万円'],C.blue);
    s+=arrow(91,99,151,139)+arrow(269,99,210,139)+box(50,151,260,67,['同じ銀行の本人預金','合計1,300万円']);
    s+=rect(15,250,254,63,C.mint)+rect(269,250,76,63,C.rose)+text(142,275,['保護元本','1,000万円'],17,'middle',C.green,true)+text(307,275,['超過','300'],16,'middle',C.red,true);
    return s+text(180,343,'決済用預金・対象外商品は別のルール',15,'middle');
  });
  define('tax-pipes','所得をまとめる経路と、分ける経路',566,'総合課税は対象所得を合算し、所得控除後に累進税率等を適用。分離課税は対象資産等の所得を別に計算する。所得控除と税額控除の位置を示す。',()=>{
    let s=text(111,26,'総合課税',19,'middle',C.green,true)+text(287,26,'分離課税',19,'middle',C.slate,true);
    s+=box(12,47,203,62,['給与・事業など','各所得を計算'],C.mint)+box(229,47,119,62,['土地・株式等','各所得を計算'],C.blue);
    s+=arrow(112,114,112,144)+arrow(289,114,289,144);
    s+=box(12,152,203,61,['損益通算等の後','所得を合算'])+box(229,152,119,61,['ほかの所得と','分けて計算'],C.blue);
    s+=arrow(112,218,112,274)+text(112,250,'− 所得控除',18,'middle',C.amber,true);
    s+=box(12,283,203,57,'課税所得')+box(229,283,119,57,['個別の','税率等'],C.blue)+arrow(289,218,289,275);
    s+=arrow(112,344,112,395)+text(112,375,'× 税率等',18,'middle',C.green,true);
    s+=box(12,405,203,56,'算出税額')+box(229,405,119,56,'税額',C.blue)+arrow(289,344,289,397);
    s+=text(180,500,'税額控除・源泉徴収税額等を反映し精算',17,'middle',C.amber,true);
    return s+text(180,539,'分離課税にも個別の所得計算・控除等がある',15,'middle');
  });
  define('property-loss','赤字のうち、通算できない部分を取り除く',362,'不動産所得の赤字200万円のうち土地取得の負債利子80万円を除くと、損益通算に使えるのは120万円。',()=>{
    let s=text(180,31,'不動産所得の赤字 200万円',20,'middle',C.ink,true);
    s+=rect(15,64,198,114,C.mint)+rect(213,64,132,114,C.rose);
    s+=text(114,101,['通算できる部分','120万円'],18,'middle',C.green,true)+text(279,93,['土地取得の','負債利子','80万円'],16,'middle',C.red,true);
    s+=arrow(115,183,115,224)+text(278,207,'通算対象外',17,'middle',C.red,true);
    s+=box(15,239,330,72,['例：給与所得500万円と通算','500 − 120 ＝ 380万円'],C.gold);
    return s+text(180,344,'200万円をまるごと引かない',17,'middle',C.ink,true);
  });
  define('medical-deduction','医療費を3つの部分に分ける',344,'対象医療費40万円、対応する保険金15万円、足切り額を10万円とする例。残り15万円が所得控除。実際は総所得金額等の5％との比較等を行う。',()=>{
    let s=text(180,28,'対象医療費 40万円',20,'middle',C.ink,true);
    s+=box(13,61,124,110,['保険金で','補てん','15万円'],C.blue)+box(140,61,82,110,['足切り','10万円'],C.gold)+box(225,61,122,110,['控除できる','部分','15万円'],C.mint);
    s+=text(180,208,'40 − 15 − 10 ＝ 15万円',20,'middle',C.green,true)+arrow(285,178,285,235);
    s+=box(13,248,334,61,'この15万円を「所得」から引く',C.mint);
    return s+text(180,333,'15万円がそのまま還付される意味ではない',15,'middle');
  });
  define('temporary-income','50万円を引く段階と、半分にする段階',402,'受取500万円、払込保険料380万円、他の一時所得なしの架空例。差益120万円から50万円控除、70万円の半分35万円を総所得へ算入。',()=>{
    let s=box(12,17,334,63,['受取500 − 払込380','差益 120万円'],C.blue)+arrow(180,85,180,118);
    s+=rect(15,130,138,85,C.gold)+rect(157,130,188,85,C.mint)+text(84,163,['特別控除','50万円'],17,'middle',C.amber,true)+text(251,163,['一時所得','70万円'],17,'middle',C.green,true);
    s+=arrow(251,220,251,260)+text(113,253,'さらに × 1/2',20,'middle',C.amber,true);
    s+=box(15,275,330,70,['総所得へ算入する額','35万円'],C.mint);
    return s+text(180,382,'一時所得70万円 ≠ 算入額35万円',17,'middle',C.ink,true);
  });
  define('loss-years','当年の損失を、どの年へ動かす？',355,'当年の損益通算後にも残る純損失を、所定条件で翌年以後へ繰り越すか、前年へ繰り戻す。個人青色申告の純損失の概念。',()=>{
    let s=box(10,115,104,98,['前年','黒字'],C.blue)+box(128,115,104,98,['当年','残った損失'],C.rose)+box(246,115,104,98,['翌年以後','黒字'],C.mint);
    s+=arrow(180,76,62,76,C.amber)+text(122,49,'繰戻し',18,'middle',C.amber,true);
    s+=arrow(180,260,296,260,C.green)+text(238,290,'繰越',18,'middle',C.green,true);
    s+=line(180,85,180,111,C.amber)+line(62,83,62,111,C.amber)+line(180,218,180,260,C.green)+line(296,218,296,260,C.green);
    return s+text(180,334,'当年内の「損益通算」とは別の処理',17,'middle');
  });
  define('corporate-bridge','帳簿の利益を、税務上の所得へ直す',381,'会計利益500万円に損金不算入100万円を加算し、益金不算入20万円を減算する簡略例。税務上の所得は580万円。',()=>{
    let s=box(28,17,302,63,['会計上の利益','500万円'],C.blue);
    s+=arrow(180,83,180,112)+box(28,121,302,63,['＋ 損金不算入 100万円','費用でも税務では引けない'],C.gold);
    s+=arrow(180,189,180,218)+box(28,227,302,63,['− 益金不算入 20万円','収益でも税務では入れない'],C.mint);
    return s+box(28,315,302,52,'税務上の所得 580万円',C.mint);
  });
  define('tax-building','住居と店舗の家賃を分け、判定年も分ける',549,'個人の2028年の納税義務を考える例。2026年が基準期間。住宅家賃300万円は原則非課税、店舗家賃800万円を課税売上高として扱う基本例。特定期間等の例外も確認する。',()=>{
    let s=`<path d="M18 62L100 15L182 62V254H18Z" fill="${C.paper}" stroke="${C.green}" stroke-width="2"/>`;
    s+=box(27,76,145,68,['住居','家賃300万円'],C.mint)+box(27,165,145,68,['店舗','家賃800万円'],C.blue);
    s+=text(265,108,['原則非課税','判定に入れない'],16,'middle',C.green,true)+arrow(178,111,203,111,C.green);
    s+=text(265,195,['課税売上高','800万円'],17,'middle',C.slate,true)+arrow(178,198,203,198,C.slate);
    s+=text(180,298,'個人の2028年を判定する時間軸',18,'middle',C.ink,true);
    [['2026年','基準期間'],['2027年','上半期を確認'],['2028年','課税期間']].forEach(([year,label],i)=>{s+=box(9+i*119,321,108,82,[year,label],i===0?C.blue:i===1?C.gold:C.mint);});
    s+=arrow(64,430,303,430)+text(180,459,'前々年の課税売上高から判定',16,'middle');
    return s+text(180,496,['特定期間・登録などによる例外がある','非課税取引と免税事業者は違う'],15,'middle');
  });
  define('saving-shared','2つの財形貯蓄は、同じ非課税枠を使う',332,'預貯金等の住宅財形300万円、年金財形200万円の例。550万円の合算枠のうち500万円を使う。保険等の年金財形の別限度等は本文で確認する。',()=>{
    let s=box(12,17,158,73,['住宅財形','300万円'],C.mint)+box(190,17,158,73,['年金財形','200万円'],C.blue);
    s+=arrow(91,94,146,126)+arrow(269,94,215,126)+text(180,158,'合算して枠を使う',20,'middle',C.ink,true);
    s+=rect(12,190,336,71,C.paper,C.line)+rect(12,190,183,71,C.mint)+rect(195,190,122,71,C.blue);
    s+=text(103,232,'住宅300',18,'middle')+text(256,232,'年金200',18,'middle');
    return s+text(180,299,'550万円の枠に対し、合計500万円',17,'middle',C.green,true);
  });
  define('education-borrower','借りる人と返す人を、2本の線で比べる',382,'貸与型奨学金は学生本人、国の教育ローンは保護者等が借りる。貸し手と借り手を区別し、それぞれの返還・返済条件を読む。',()=>{
    let s=text(12,25,'貸与型奨学金',19,'start',C.ink,true)+box(12,52,150,80,['日本学生','支援機構'],C.blue)+person(280,53,'学生本人');
    s+=arrow(167,72,245,72)+text(207,57,'貸与',16,'middle')+arrow(245,116,167,116,C.amber)+text(208,145,'本人が返還',16,'middle',C.amber,true);
    s+=text(12,213,'国の教育ローン',19,'start',C.ink,true)+box(12,242,150,80,['日本政策','金融公庫'],C.blue)+person(280,242,'保護者等');
    s+=arrow(167,260,245,260)+text(207,244,'融資',16,'middle')+arrow(245,306,167,306,C.amber)+text(207,344,'保護者等が返済',16,'middle',C.amber,true);
    return s;
  });
  define('loan-stacks','返済額の「元金と利息」を積み重ねて比べる',439,'元利均等は返済額の合計が原則一定。元金均等は毎回返す元金が一定で、利息が減るにつれ合計返済額が減る。数値のない概念図。',()=>{
    let s=text(12,26,'元利均等：合計の高さがそろう',18,'start',C.ink,true);
    [72,52,32,12].forEach((h,i)=>{const x=36+i*76;s+=rect(x,56,46,h,C.gold)+rect(x,56+h,46,108-h,C.mint);});
    s+=axis(24,173,318,'返済が進む →')+text(12,230,'元金均等：元金の部分がそろう',18,'start',C.ink,true);
    [87,64,40,16].forEach((h,i)=>{const x=36+i*76;s+=rect(x,350-65-h,46,h,C.gold)+rect(x,285,46,65,C.mint);});
    s+=axis(24,359,318,'返済が進む →')+rect(67,401,20,16,C.mint)+text(94,415,'元金',16)+rect(198,401,20,16,C.gold)+text(226,415,'利息',16);
    return s;
  });
  define('prepay-shapes','短くするのか、毎回の負担を下げるのか',389,'期間短縮型は毎回の返済額を原則維持して期間を短くし、返済額軽減型は期間を原則維持して毎回の返済額を減らす。概念図。',()=>{
    let s=text(12,27,'期間短縮型',19,'start',C.ink,true)+rect(18,53,323,87,C.paper,C.line)+rect(18,53,229,87,C.mint);
    s+=text(133,90,['返済額は','原則そのまま'],16,'middle')+text(296,87,['期間を','短縮'],16,'middle',C.amber,true)+axis(18,148,323,'期間');
    s+=text(12,220,'返済額軽減型',19,'start',C.ink,true)+rect(18,243,323,87,C.paper,C.line)+rect(18,285,323,45,C.mint);
    s+=text(180,273,'毎回の返済額が下がる',17,'middle',C.green,true)+axis(18,339,323,'期間は原則同じ');return s;
  });
  define('disability-time','初診日と障害認定日は、別の日',355,'初診日の加入制度や保険料納付要件を確認し、原則1年6か月後などの障害認定日の状態を判定する。障害等級は基礎と厚生で範囲が違う。',()=>{
    let s=axis(28,76,304,'時間 →')+text(45,47,'初診日',19,'start',C.ink,true)+text(252,47,['障害','認定日'],17,'middle',C.ink,true);
    s+=line(61,69,61,98,C.green)+line(260,69,260,98,C.green)+line(61,113,260,113,C.amber)+text(163,144,'原則1年6か月',18,'middle',C.amber,true);
    s+=box(12,184,158,100,['初診日で確認','加入制度','納付要件'],C.blue)+box(189,184,158,100,['認定日で確認','障害の程度','基礎1・2級等'],C.mint);
    return s+text(180,326,'治癒・症状固定等により認定日の例外あり',15,'middle');
  });
  define('stock-denominators','同じ株価を、利益・純資産と比べる',363,'株価1200円、EPS100円、BPS800円の架空例。PERは利益で、PBRは純資産で割る。倍率と割合を混ぜない。',()=>{
    let s=box(65,14,230,67,['株価','1,200円'],C.blue)+arrow(146,90,91,137)+arrow(213,90,269,137);
    s+=box(12,150,158,87,['÷ EPS','1株利益100円'],C.mint)+box(190,150,158,87,['÷ BPS','1株純資産800円'],C.gold);
    s+=arrow(91,244,91,272)+arrow(269,244,269,272)+text(91,303,['PER','12倍'],21,'middle',C.green,true)+text(269,303,['PBR','1.5倍'],21,'middle',C.amber,true);return s;
  });
  define('option-buyers','コールとプットの買いを、別々の線で見る',438,'満期時の原資産価格に対するオプション買いの損益の概念図。コールは値上がり、プットは値下がりが有利。どちらも買い手の損失は支払プレミアムまで。',()=>{
    let s='';['コールの買い（買う権利）','プットの買い（売る権利）'].forEach((title,i)=>{const y=i*218;s+=text(12,y+24,title,18,'start',C.ink,true);
      s+=axis(31,y+170,304,'原資産価格 →')+line(31,y+103,335,y+103,C.line,'4 4')+text(33,y+93,'損益ゼロ',15);
      const d=i?'M40 48L183 140H332':'M40 140H180L330 48';s+=`<path d="${d}" transform="translate(0 ${y})" fill="none" stroke="${C.green}" stroke-width="4"/>`;
      s+=text(i?260:105,y+159,'−プレミアム',15,'middle',C.red,true);
    });return s;
  });

  // 章・テーマ・レッスンは0始まり（章のみ原本どおり1始まり）。
  const bindings=[
    [1,3,0,'saving-shared'],[1,3,1,'education-borrower'],[1,3,2,'education-borrower'],
    [1,3,3,'loan-stacks'],[1,3,5,'prepay-shapes'],
    [1,4,0,'medical-people'],[1,4,3,'sickness-days'],[1,4,4,'birth-days'],[1,4,7,'care-area'],
    [1,5,4,'childcare-lanes'],[1,6,0,'pension-building'],[1,6,1,'pension-building'],
    [1,6,5,'pension-rate'],[1,6,7,'disability-time'],[1,6,8,'survivor-age'],[1,6,9,'survivor-age'],
    [1,7,0,'pension-building'],[1,7,1,'dc-flow'],[1,7,2,'dc-flow'],
    [2,0,0,'financial-layers'],[2,0,2,'contract-date'],[2,1,0,'coverage-shapes'],
    [2,1,1,'paidup-extension'],[2,1,2,'annuity-life'],[2,3,1,'auto-map'],[2,3,2,'tenant-fire'],
    [2,4,0,'three-roles'],[2,4,2,'temporary-income'],
    [3,1,1,'fx-trip'],[3,2,0,'bond-price'],[3,2,1,'bond-cash'],[3,3,0,'stock-denominators'],
    [3,4,0,'fund-roles'],[3,4,2,'distributions'],[3,5,0,'option-buyers'],
    [3,5,1,'dollar-cost'],[3,5,2,'risk-bell'],[3,5,2,'correlation'],
    [3,6,0,'nisa-box'],[3,6,1,'bank-merge'],
    [4,0,1,'tax-pipes'],[4,2,1,'temporary-income'],[4,3,0,'property-loss'],
    [4,3,2,'loss-years'],[4,4,0,'medical-deduction'],[4,5,0,'tax-pipes'],
    [4,6,1,'corporate-bridge'],[4,7,0,'tax-building'],[4,7,1,'tax-building']
  ];
  function render(id){
    const d=D[id];
    return `<figure class="study-resume-figure" data-study-visual="${id}"><figcaption>${d.title}</figcaption><svg viewBox="0 0 360 ${d.height}" role="img" aria-label="${esc(d.description)}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">${d.draw()}</svg><p>${d.description}</p><button type="button" class="study-diagram-open" data-study-diagram="${id}" aria-label="${d.title}の図を拡大">図を拡大して見る <span aria-hidden="true">↗</span></button></figure>`;
  }
  const grouped=new Map();
  for(const [chapter,theme,lesson,id] of bindings){
    const key=`${chapter}:${theme}:${lesson}`;
    if(!grouped.has(key))grouped.set(key,{chapter,theme,lesson,ids:[]});
    grouped.get(key).ids.push(id);
  }
  for(const {chapter,theme,lesson,ids} of grouped.values()){
    const item=chapter===1?(theme===0?studyLessonContent[lesson]:studyExtraLessons[theme]?.[lesson]):studyLectureChapters[chapter]?.themes[theme]?.lessons[lesson];
    if(!item)throw new Error(`Missing study lesson for visual ${chapter}:${theme}:${lesson}`);
    const diagrams=ids.map(render).join('');
    const old=item.html.match(/<figure\b[^>]*>[\s\S]*?<\/figure>/);
    // 既存の要件・数値は削らず、補足として読み返せるように残す。
    item.html=old?item.html.replace(old[0],`${diagrams}<details class="study-diagram-reference"><summary>説明・比較を文章でも確認</summary>${old[0]}</details>`):diagrams+item.html;
  }
  window.FP_STUDY_VISUALS=Object.freeze({diagrams:Object.keys(D),lessons:[...grouped.values()].map(x=>({chapter:x.chapter,theme:x.theme,lesson:x.lesson,ids:x.ids}))});
  // 後続の授業教材でも、同じ図解・拡大ダイアログを利用する。
  window.registerStudyDiagram=(id,title,height,description,draw)=>{
    if(D[id])throw new Error(`Duplicate study diagram ${id}`);
    define(id,title,height,description,draw);
    return render(id);
  };

  document.body.insertAdjacentHTML('beforeend',`<dialog id="study-diagram-dialog" aria-labelledby="study-diagram-dialog-title"><header><h2 id="study-diagram-dialog-title"></h2><button type="button" autofocus aria-label="図を閉じる">×</button></header><p class="study-diagram-zoom-help">図の中を左右にスクロールできます。</p><div class="study-diagram-zoom-scroll" tabindex="0" role="region" aria-label="拡大した図"></div></dialog>`);
  const dialog=document.getElementById('study-diagram-dialog');let opener=null;
  document.getElementById('study-view').addEventListener('click',event=>{
    const button=event.target.closest('[data-study-diagram]');if(!button)return;
    const d=D[button.dataset.studyDiagram];if(!d)return;
    opener=button;document.getElementById('study-diagram-dialog-title').textContent=d.title;
    const viewport=dialog.querySelector('.study-diagram-zoom-scroll');
    viewport.innerHTML=`<svg viewBox="0 0 360 ${d.height}" role="img" aria-label="${esc(d.description)}" xmlns="http://www.w3.org/2000/svg" font-family="sans-serif">${d.draw()}</svg>`;
    viewport.scrollTop=0;viewport.scrollLeft=0;dialog.showModal();
  });
  dialog.querySelector('header button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{if(opener?.isConnected)opener.focus({preventScroll:true});});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
})();
