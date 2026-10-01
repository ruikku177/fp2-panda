// 第1回授業レジュメを参考に、補助問題と一次資料で照合して独自に構成した教材。
// 配列のキーは studyThemes の0始まりのテーマ番号。未収録レッスンは空欄のまま。
const studyExtraLessons = {
  1: [
    {
      questionNumbers: [7, 8],
      panda: '年収をそのまま生活費に使えるわけじゃないよね。何を引けば手取りに近づくかな？',
      html: `<p>家計の将来を考えるとき、額面の年収をそのまま使えるお金として扱うと計画がずれる。<strong>可処分所得＝収入−直接税−社会保険料</strong>。直接税には所得税や住民税がある。</p>
        <h3>どこで差し引く？</h3><ol><li>年収500万円（架空例）</li><li>直接税40万円・社会保険料75万円を引く</li><li>可処分所得は<strong>385万円</strong></li><li>この385万円から生活費・住居費・保険料などを支払う</li></ol>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「住居費や生命保険料も引いて可処分所得を出す」は誤り。家計の支出として別に考える。問8はこの知識と、バランスシート・係数の知識が混ざる横断問題。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>年収400万円、直接税30万円、社会保険料60万円なら可処分所得は？</p><details><summary>答えを見る</summary><p>310万円。住居費はこの計算では引かない。</p></details></section>`
    },
    {
      questionNumbers: [6, 7],
      panda: '家族の予定を年表にしたら、次は毎年のお金の動きにつなげよう。',
      html: `<p><strong>ライフイベント表</strong>は、入学・住宅購入・退職などが「いつ」起こるかを整理する表。<strong>キャッシュフロー表</strong>は、その予定を踏まえて各年の収入、支出、年間収支、貯蓄残高を並べる表だ。</p>
        <div class="study-rule-grid"><div><strong>予定</strong><span>何年後に進学？</span></div><div><strong>収支</strong><span>その年の教育費は？</span></div><div><strong>残高</strong><span>年末の貯蓄はいくら？</span></div></div>
        <p>たとえば3年後に進学を予定するなら、その年の教育費が増えるかもしれない。家族構成が変わらなくても物価や制度、暮らし方が変われば、数字は見直す。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「予定の時期」がライフイベント表、「年ごとの収支・残高」がキャッシュフロー表。問6では家族の年齢や進学予定も表に入っている。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>家族構成が同じなら生活費はずっと変わらない？</p><details><summary>答えを見る</summary><p>いいえ。物価などの変化も考えて見直す。</p></details></section>`
    },
    {
      questionNumbers: [6, 7],
      panda: '将来の生活費と将来の貯蓄、似ているけど計算は別なんやで。',
      html: `<h3>支出の変動率</h3><p>基準年の生活費が200万円で毎年1％増えるなら、3年後は<strong>200×1.01³＝206.0602万円</strong>。問題文が端数処理を指定した場合は、その順序に従う。</p>
        <h3>貯蓄残高の更新</h3><p><strong>当年末の貯蓄残高＝前年末の貯蓄残高×（1＋運用利率）＋当年の年間収支</strong>。年間収支はその年の収入合計から支出合計を引く。</p>
        <p>架空例：前年末100万円、運用利率1％、今年の収入300万円・支出280万円なら、今年末は<strong>100×1.01＋（300−280）＝121万円</strong>。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>問6は「基準年→3年後」の増加と「3年後末→4年後末」の残高更新を分ける。残高に掛ける利率と支出に掛ける変動率を混ぜない。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>前年末100万円、利率0％、今年の収支＋20万円なら今年末は？</p><details><summary>答えを見る</summary><p>120万円。</p></details></section>`
    },
    {
      questionNumbers: [5, 8],
      panda: '預金と家があっても、ローンを引いたら本当の財産はいくらかな？',
      html: `<p>家計の<strong>バランスシート</strong>は、ある一時点の資産と負債を並べるもの。<strong>純資産＝資産合計−負債合計</strong>。資産900万円、ローン残高600万円なら純資産300万円だ。</p>
        <div class="study-rule-grid"><div><strong>資産</strong><span>預貯金・株式・不動産など</span></div><div><strong>負債</strong><span>住宅ローン・自動車ローンなど</span></div><div><strong>純資産</strong><span>資産から負債を引いた額</span></div></div>
        <p>問5では、本人と配偶者の資産を合わせ、ローン残高を引く。自宅が共有なら<strong>同じ土地・建物を二重に数えない</strong>。生命保険は死亡保険金ではなく、資料にある解約返戻金相当額を使う。株式や不動産は、問題が示す作成時点の時価で見る。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>先に資産と負債を別々に合計し、最後に差し引く。ローンは借入時の金額ではなく現時点の残高。負債の方が大きければ純資産はマイナスにもなる。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>資産1,200万円、負債1,350万円の純資産は？</p><details><summary>答えを見る</summary><p>−150万円。</p></details></section>`
    }
  ],
  2: [
    {
      questionNumbers: [9, 11, 12],
      panda: 'いま持っているお金を運用したら、将来はいくらになるかな？',
      html: `<p><strong>複利</strong>では、増えた利息にも次の期間の利息が付く。いまの元本を将来の金額に直すときは<strong>終価係数</strong>を使う。</p>
        <p>たとえば元本100万円、2％で2年間なら、100×1.02×1.02＝104.04万円。係数表がある試験では<strong>元本×その年数・利率の終価係数</strong>で計算する。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「いま一括で持っているお金→将来の一括額」は終価係数。毎年の積立なら別の係数を使う。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>問12（2）のように退職金をまとめて運用し、10年後の額を求める係数は？</p><details><summary>答えを見る</summary><p>終価係数。</p></details></section>`
    },
    {
      questionNumbers: [8, 11, 12],
      panda: '「10年後の目標額」を「いま必要な元本」に戻すこともできるよ。',
      html: `<p>将来の一括額から、いま必要な一括額へ戻すときは<strong>現価係数</strong>。問12（3）は「10年後に500万円ほしい。いまいくら必要？」だから、500万円に10年の現価係数を掛ける。</p>
        <div class="study-rule-grid"><div><strong>今 → 将来</strong><span>終価係数</span></div><div><strong>将来 → 今</strong><span>現価係数</span></div><div><strong>共通点</strong><span>どちらも一括のお金</span></div></div>
        <p>係数の数字が1より大きいか小さいかも目安になる。ただし必ず<strong>出発点と求めたい時点</strong>を文章から確認しよう。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「いま必要な額」「現在価値」とあれば現価を考える。問8はほかの表の知識も一緒に問われる。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>5年後の100万円に対応する現在の一括元本を求める係数は？</p><details><summary>答えを見る</summary><p>現価係数。</p></details></section>`
    },
    {
      questionNumbers: [8, 9, 10, 12],
      panda: '毎年こつこつ積み立てる場合は、いま一括で預ける場合と違うよ。',
      html: `<p>毎年一定額を積み立てたら将来いくらになるかは<strong>年金終価係数</strong>。逆に、将来の目標額を作るため毎年いくら積み立てるかは<strong>減債基金係数</strong>。</p>
        <div class="study-rule-grid"><div><strong>毎年の積立額 → 将来の合計</strong><span>年金終価係数</span></div><div><strong>将来の目標額 → 毎年の積立額</strong><span>減債基金係数</span></div><div><strong>問12（1）</strong><span>前者の例</span></div></div>
        <p>問10（イ）は15年後に1,000万円を準備するための<strong>毎年の積立額</strong>。係数表の15年・2％の減債基金係数0.0578を使い、1,000万円×0.0578＝57.8万円と求める。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「積み立てた<strong>結果</strong>」と「目標から<strong>逆算</strong>」を区別。年金終価係数を目標額に掛けて積立額にするのは逆。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>10年後の目標額から、毎年必要な積立額を出す係数は？</p><details><summary>答えを見る</summary><p>減債基金係数。</p></details></section>`
    },
    {
      questionNumbers: [8, 9, 10, 11, 12],
      panda: '毎年「受け取る」側なら、必要な元本と受取額のどちらを求めたい？',
      html: `<p>一定期間、毎年同額を受け取るために<strong>いま必要な元本</strong>は<strong>年金現価係数</strong>で求める。一方、まとまった元本を運用しながら<strong>毎年いくら受け取れるか</strong>は<strong>資本回収係数</strong>。住宅ローンの元利均等返済額にも後者を使う。</p>
        <div class="study-rule-grid"><div><strong>毎年の受取額 → 必要な元本</strong><span>年金現価係数</span></div><div><strong>元本 → 毎年の受取額</strong><span>資本回収係数</span></div><div><strong>借入額 → 毎年の返済額</strong><span>資本回収係数</span></div></div>
        <p>問10（ア）は毎年200万円を5年間受け取るための元本なので、200万円×年金現価係数4.7135＝942.7万円。問12（4）（5）は資本回収係数を選ぶ。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「借入可能額」は返済額から元本への逆算なので年金現価係数。問8の正しい選択肢はこの対応を問う。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>借入額から毎年の元利均等返済額を求める係数は？</p><details><summary>答えを見る</summary><p>資本回収係数。</p></details></section>`
    },
    {
      questionNumbers: [8, 9, 10, 11, 12],
      panda: '6つの係数は暗記だけやなくて、矢印の向きで選べるようにしよう。',
      html: `<p>まず<strong>一括か、毎年か</strong>。次に<strong>今から将来か、将来から今か</strong>を見る。係数名の「年金」は公的年金だけを意味せず、毎年の一定額を扱う印だ。</p>
        <div class="study-table-scroll" tabindex="0" role="region" aria-label="6つの係数の使い分け。横にスクロールできます"><table><thead><tr><th>出発点</th><th>求めるもの</th><th>係数</th></tr></thead><tbody><tr><td>今の一括額</td><td>将来の一括額</td><td>終価</td></tr><tr><td>将来の一括額</td><td>今の一括額</td><td>現価</td></tr><tr><td>毎年の積立額</td><td>将来の合計額</td><td>年金終価</td></tr><tr><td>将来の目標額</td><td>毎年の積立額</td><td>減債基金</td></tr><tr><td>毎年の受取・返済額</td><td>今の元本</td><td>年金現価</td></tr><tr><td>今の元本・借入額</td><td>毎年の受取・返済額</td><td>資本回収</td></tr></tbody></table></div>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>係数表の利率・年数が問題条件と一致する行を見る。問12は（1）〜（5）で矢印の向きが変わる。単位と端数処理も最後に確認。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>毎年の取崩額から必要元本を逆算するなら？</p><details><summary>答えを見る</summary><p>年金現価係数。</p></details></section>`
    }
  ],
  3: [
    null, null, null,
    {
      questionNumbers: [13],
      panda: '借換えで毎年の返済額がどう変わるか、同じ期間で比べよう。',
      html: `<p>住宅ローンの返済方法には、毎回の元利合計を原則一定にする<strong>元利均等返済</strong>と、返す元金を一定にする<strong>元金均等返済</strong>がある。元金均等では利息部分が残高の減少につれて小さくなり、返済総額も徐々に下がる。</p>
        <p>問13は旧・新とも借入額1,500万円、返済期間10年の元利均等返済。旧金利2％の資本回収係数0.1113、新金利1％の0.1056を使う。</p>
        <p><strong>10年間の返済軽減額＝旧年返済額×10−新年返済額×10</strong>。計算は1,500万円×（0.1113−0.1056）×10＝85.5万円。問題は手数料を考慮しない条件だが、実際の借換えでは諸費用も確認する。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>資本回収係数は「借入額→毎年の返済額」。総額を比べるなら、両方に同じ10年を掛ける。減債基金係数と取り違えない。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>借換え後の金利が低いだけで、必ず実際の総支払額が減る？</p><details><summary>答えを見る</summary><p>必ずとはいえない。借換え費用なども確認する。問13では問題の指定で費用を考慮しない。</p></details></section>`
    },
    null,
    {
      questionNumbers: [13, 14],
      panda: '繰上返済で何回ぶんの元金を先に返せるか、表で追えるかな？',
      html: `<p><strong>期間短縮型</strong>の繰上返済は、返済予定表の先の元金をまとめて返し、返済期間を短くする方法。問14では120回目返済後の残高から、100万円以内で届く将来の残高を探す。</p>
        <ol><li>120回目返済後の残高は<strong>15,107,049円</strong>。</li><li>100万円引いた下限は<strong>14,107,049円</strong>。これを下回る将来残高は、繰上返済額が100万円を超えてしまう。</li><li>表で下限以上の最小残高は<strong>134回目の14,159,930円</strong>。</li><li>差額947,119円を繰り上げると、121〜134回目の<strong>14回分＝1年2か月</strong>短縮する。</li></ol>
        <p>問13の借換えは別のローンに組み直す話。<strong>繰上返済</strong>と<strong>借換え</strong>を混同しない。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>問14では返済額を14回足さない。返済額には利息が含まれるため、比較するのは<strong>残高の差</strong>。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>121回目から134回目までを含めると何回分？</p><details><summary>答えを見る</summary><p>134−121＋1＝14回分。</p></details></section>`
    }
  ],
  8: [
    {
      questionNumbers: [15, 16, 17],
      panda: '会社の決算書3つは、同じ数字を違う角度から見ているよ。',
      html: `<p>企業を見る代表的な書類は<strong>貸借対照表（B/S）</strong>、<strong>損益計算書（P/L）</strong>、<strong>キャッシュフロー計算書（C/F）</strong>。それぞれ「いつの、何」を表すかで区別する。</p>
        <div class="study-rule-grid"><div><strong>B/S</strong><span>一時点の資産・負債・純資産</span></div><div><strong>P/L</strong><span>一定期間の収益・費用・利益</span></div><div><strong>C/F</strong><span>一定期間の資金の増減</span></div></div>
        <p>B/Sは<strong>資産＝負債＋純資産</strong>でつり合う。家計バランスシートと形は似ているが、企業の決算書をそのまま家計の記録と同一視しない。</p>
        <p>問17には<strong>企業会計上の利益</strong>と<strong>法人税法上の所得</strong>も出る。税務上の所得は会計上の利益を基礎に、税法に合わせた調整をして計算する。両者が必ず同額になるわけではない。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>問15〜17では「一時点」か「一定期間」かを見分ける。P/Lは一定期間の経営成績、C/Fは一定期間の資金の増減。税務上の所得も会計上の利益と区別する。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>企業の一時点の財政状態を示す書類は？</p><details><summary>答えを見る</summary><p>貸借対照表（B/S）。</p></details></section>`
    },
    {
      questionNumbers: [15, 16],
      panda: '「営業利益」と「経常利益」の間には何が入るかな？',
      html: `<p>損益計算書では、売上から何を引き、何を足したかで利益の名前が変わる。</p>
        <ol><li><strong>売上総利益</strong>＝売上高−売上原価</li><li><strong>営業利益</strong>＝売上総利益−販売費及び一般管理費</li><li><strong>経常利益</strong>＝営業利益＋営業外収益−営業外費用</li><li><strong>税引前当期純利益</strong>＝経常利益＋特別利益−特別損失</li></ol>
        <p>問15では、「営業利益に特別損益を加減して経常利益」とする説明が誤り。特別損益を入れるのは<strong>経常利益の後</strong>だ。問16でも売上総利益・営業利益・税引前当期純利益の順序を確かめる。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「営業外」は経常利益まで、「特別」はその次、と階段を一段ずつ追う。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>営業利益に営業外収益・費用を加減すると？</p><details><summary>答えを見る</summary><p>経常利益。</p></details></section>`
    },
    {
      questionNumbers: [70, 71, 72],
      panda: '分割払いとリボ払い、毎月払う点は似ていても決め方が違うよ。',
      html: `<p><strong>分割払い</strong>は買うときに支払回数を決める。<strong>リボ払い</strong>は利用残高に対し、毎月の支払額を一定などの方式で決める。リボで新たに買い物をすると残高が増え、支払期間が延びることがある。</p>
        <div class="study-rule-grid"><div><strong>分割</strong><span>買い物ごとに回数を決める</span></div><div><strong>リボ</strong><span>残高に応じ毎月の支払額を決める</span></div><div><strong>確認</strong><span>手数料・残高・完済時期</span></div></div>
        <p>問70の「定額リボは買う時点で回数を決める」は、分割払いの説明と入れ替わっている。具体的な手数料や方式はカード契約の条件を確認する。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「回数を決める」なら分割、「残高を基準に毎月の額を決める」ならリボ、と見分ける。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>買い物のたびに支払回数を決めるのは？</p><details><summary>答えを見る</summary><p>分割払い。</p></details></section>`
    },
    {
      questionNumbers: [70, 71, 72],
      panda: '買い物の後払いと現金の借入れは、同じカードでもルールが違うよ。',
      html: `<p><strong>ショッピング</strong>は商品・サービス代金の後払い、<strong>キャッシング</strong>は現金の借入れ。貸金業法の<strong>総量規制</strong>では、カード会社のショッピングは対象外だが、キャッシングは原則として対象になる。</p>
        <p>キャッシングは翌月一括返済でも、利用日数などに応じた利息が発生する。問71は「一括なら利息なし」と思い込ませる問題。カードごとの実際の利率・計算方法は契約条件を確認する。</p>
        <p>カードは<strong>券面の会員本人が使う</strong>。家族にも貸さない。信用情報は所定の手続で本人が開示請求できる。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>問72は「ショッピングもキャッシングも総量規制の対象外」という一括りが誤り。どちらの機能について述べているかに線を引こう。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>カードのショッピングとキャッシング、総量規制の対象になるのは？</p><details><summary>答えを見る</summary><p>キャッシングが原則対象。ショッピングは対象外。</p></details></section>`
    }
  ]
};
