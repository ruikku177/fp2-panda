// 第1回授業レジュメを参考に、補助問題と一次資料で照合して独自に構成した教材。
// 配列のキーは studyThemes の0始まりのテーマ番号。未収録レッスンは空欄のまま。
const studyExtraLessons = {
  1: [
    {
      questionNumbers: [7, 8],
      panda: '年収をそのまま生活費に使えるわけじゃないよね。何を引けば手取りに近づくかな？',
      html: `<p>家計の将来を考えるとき、額面の年収をそのまま使えるお金として扱うと計画がずれる。このレッスンでは、まず次の式を覚えよう。</p>
        <div class="study-formula" role="group" aria-label="可処分所得は年収から直接税と社会保険料を引いた額"><strong>可処分所得</strong><span>＝ 年収 − 直接税 − 社会保険料</span><small>住居費・生命保険料は、この式では引かない</small></div>
        <p>直接税には所得税や住民税がある。可処分所得は、いわゆる手取りに近い金額だ。</p>
        <h3>数字を入れてみよう</h3><div class="study-example"><p>年収500万円、直接税40万円、社会保険料75万円なら</p><p><strong>500 − 40 − 75 ＝ 385万円</strong></p><p>この385万円から生活費・住居費・保険料などを支払う。</p></div>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「住居費や生命保険料も引いて可処分所得を出す」は誤り。家計の支出として別に考える。問8はこの知識と、バランスシート・係数の知識が混ざる横断問題。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>年収400万円、直接税30万円、社会保険料60万円なら可処分所得は？</p><details><summary>答えを見る</summary><p>310万円。住居費はこの計算では引かない。</p></details></section>`
    },
    {
      questionNumbers: [6, 7],
      panda: '家族の予定を年表にしたら、次は毎年のお金の動きにつなげよう。',
      html: `<p><strong>ライフイベント表</strong>は、入学・住宅購入・退職などが「いつ」起こるかを整理する表。<strong>キャッシュフロー表</strong>は、その予定を踏まえて各年の収入、支出、年間収支、貯蓄残高を並べる表だ。</p>
        <div class="study-rule-grid"><div><strong>予定</strong><span>何年後に進学？</span></div><div><strong>収支</strong><span>その年の教育費は？</span></div><div><strong>残高</strong><span>年末の貯蓄はいくら？</span></div></div>
        <table class="study-mini-table"><caption>架空の家族の予定を表にすると</caption><thead><tr><th>時期</th><th>予定</th><th>お金への影響</th></tr></thead><tbody><tr><td>今年</td><td>進学準備</td><td>教育費を見積もる</td></tr><tr><td>2年後</td><td>入学</td><td>教育費が増える</td></tr><tr><td>3年後</td><td>通学</td><td>毎年の教育費を見直す</td></tr></tbody></table>
        <p>たとえば3年後に進学を予定するなら、その年の教育費が増えるかもしれない。家族構成が変わらなくても物価や制度、暮らし方が変われば、数字は見直す。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「予定の時期」がライフイベント表、「年ごとの収支・残高」がキャッシュフロー表。問6では家族の年齢や進学予定も表に入っている。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>家族構成が同じなら生活費はずっと変わらない？</p><details><summary>答えを見る</summary><p>いいえ。物価などの変化も考えて見直す。</p></details></section>`
    },
    {
      questionNumbers: [6, 7],
      panda: '将来の生活費と将来の貯蓄、似ているけど計算は別なんやで。',
      html: `<h3>① 将来の生活費</h3><div class="study-equation">n年後の支出＝基準年の支出×（1＋変動率）ⁿ</div><p>基準年の生活費が200万円で毎年1％増えるなら、3年後は<strong>200×1.01³＝206.0602万円</strong>。</p>
        <h3>② 年末の貯蓄残高</h3><div class="study-equation">今年末の残高＝前年末の残高×（1＋運用利率）＋今年の年間収支<small>年間収支＝今年の収入合計−支出合計</small></div>
        <figure class="study-visual"><figcaption>架空例：年末の貯蓄が変わる道筋</figcaption><div class="study-money-flow"><div><small>前年末の貯蓄</small><strong>100万円</strong></div><span aria-hidden="true">×1.01</span><div><small>運用後</small><strong>101万円</strong></div><span aria-hidden="true">＋20万円</span><div class="is-final"><small>今年末の貯蓄</small><strong>121万円</strong></div></div><p>今年の年間収支は、収入300万円−支出280万円＝<strong>＋20万円</strong>。</p></figure><p>端数処理の指定があれば、問題文の順序に従う。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>問6は「基準年→3年後」の増加と「3年後末→4年後末」の残高更新を分ける。残高に掛ける利率と支出に掛ける変動率を混ぜない。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>前年末100万円、利率2％、今年の収支＋20万円なら今年末は？</p><details><summary>答えを見る</summary><p>100×1.02＋20＝122万円。前年末の残高に利率を掛けてから今年の収支を足す。</p></details></section>`
    },
    {
      questionNumbers: [5, 8],
      panda: '預金と家があっても、ローンを引いたら本当の財産はいくらかな？',
      html: `<p>家計の<strong>バランスシート</strong>は、ある一時点の資産と負債を並べるもの。</p><div class="study-equation">純資産＝資産合計−負債合計</div><div class="study-balance" role="group" aria-label="架空例。資産900万円は負債600万円と純資産300万円の合計"><div><strong>資産</strong><span>900万円</span></div><div><strong>負債</strong><span>600万円</span><strong>純資産</strong><span>300万円</span></div></div><p class="study-balance-caption">左側の資産900万円 ＝ 右側の負債600万円 ＋ 純資産300万円</p>
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
        <table class="study-mini-table"><caption>元本100万円・年2％の例</caption><thead><tr><th>時点</th><th>計算</th><th>残高</th></tr></thead><tbody><tr><td>はじめ</td><td>―</td><td>100万円</td></tr><tr><td>1年後</td><td>100×1.02</td><td>102万円</td></tr><tr><td>2年後</td><td>102×1.02</td><td>104.04万円</td></tr></tbody></table><p>2年目は増えた2万円にも利息が付く。係数表がある試験では<strong>元本×その年数・利率の終価係数</strong>で計算する。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「いま一括で持っているお金→将来の一括額」は終価係数。毎年の積立なら別の係数を使う。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>問12（2）のように退職金をまとめて運用し、10年後の額を求める係数は？</p><details><summary>答えと理由を見る</summary><p>終価係数。今の一括資金から将来の一括額を求めるから。</p></details></section>`
    },
    {
      questionNumbers: [8, 11, 12],
      panda: '「10年後の目標額」を「いま必要な元本」に戻すこともできるよ。',
      html: `<p>将来の一括額から、いま必要な一括額へ戻すときは<strong>現価係数</strong>。問12（3）は「10年後に500万円ほしい。いまいくら必要？」だから、500万円に10年の現価係数を掛ける。</p>
        <div class="study-rule-grid"><div><strong>今 → 将来</strong><span>終価係数</span></div><div><strong>将来 → 今</strong><span>現価係数</span></div><div><strong>共通点</strong><span>どちらも一括のお金</span></div></div>
        <div class="study-example"><strong>問12（3）の条件で計算</strong><p>10年後に500万円必要。10年・1％の現価係数0.905を掛ける。</p><p><strong>500万円×0.905＝452.5万円</strong>を現在用意する。</p></div>
        <p>係数の数字が1より大きいか小さいかも目安になる。ただし必ず<strong>出発点と求めたい時点</strong>を文章から確認しよう。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「いま必要な額」「現在価値」とあれば現価を考える。問8はほかの表の知識も一緒に問われる。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>5年後の100万円に対応する現在の一括元本を求める係数は？</p><details><summary>答えと理由を見る</summary><p>現価係数。将来の一括額を現在の価値に戻すから。</p></details></section>`
    },
    {
      questionNumbers: [8, 9, 10, 12],
      panda: '毎年こつこつ積み立てる場合は、いま一括で預ける場合と違うよ。',
      html: `<p>毎年一定額を積み立てたら将来いくらになるかは<strong>年金終価係数</strong>。逆に、将来の目標額を作るため毎年いくら積み立てるかは<strong>減債基金係数</strong>。</p>
        <div class="study-rule-grid"><div><strong>毎年の積立額 → 将来の合計</strong><span>年金終価係数</span></div><div><strong>将来の目標額 → 毎年の積立額</strong><span>減債基金係数</span></div><div><strong>問12（1）</strong><span>前者の例</span></div></div>
        <p><strong>分かっている額 → 求める額</strong>を矢印にしてから係数を選ぶ。「毎年20万円を積み立てる→15年後の合計」は年金終価係数。「15年後に1,000万円ほしい→毎年の積立額」は減債基金係数。</p>
        <p>問10（イ）は15年後に1,000万円を準備するための<strong>毎年の積立額</strong>。係数表の15年・2％の減債基金係数0.0578を使い、1,000万円×0.0578＝57.8万円と求める。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「積み立てた<strong>結果</strong>」と「目標から<strong>逆算</strong>」を区別。年金終価係数を目標額に掛けて積立額にするのは逆。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>10年後の目標額から、毎年必要な積立額を出す係数は？</p><details><summary>答えと理由を見る</summary><p>減債基金係数。将来の一括目標額から毎年の積立額へ逆算するから。</p></details></section>`
    },
    {
      questionNumbers: [8, 9, 10, 11, 12],
      panda: '毎年「受け取る」側なら、必要な元本と受取額のどちらを求めたい？',
      html: `<p>一定期間、毎年同額を受け取るために<strong>いま必要な元本</strong>は<strong>年金現価係数</strong>で求める。一方、まとまった元本を運用しながら<strong>毎年いくら受け取れるか</strong>は<strong>資本回収係数</strong>。住宅ローンの元利均等返済額にも後者を使う。</p>
        <div class="study-rule-grid"><div><strong>毎年の受取額 → 必要な元本</strong><span>年金現価係数</span></div><div><strong>元本 → 毎年の受取額</strong><span>資本回収係数</span></div><div><strong>借入額 → 毎年の返済額</strong><span>資本回収係数</span></div></div>
        <div class="study-example"><strong>受取額から元本を求める</strong><p>問10（ア）：毎年200万円を5年間受け取る。200万円×年金現価係数4.7135＝<strong>942.7万円</strong>。</p></div><p>これと逆に、問12（4）は元本から毎年の取崩額を求めるので資本回収係数。問12（5）も借入額から毎年の返済額を求めるので資本回収係数。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「借入可能額」は返済額から元本への逆算なので年金現価係数。問8の正しい選択肢はこの対応を問う。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>借入額から毎年の元利均等返済額を求める係数は？</p><details><summary>答えと理由を見る</summary><p>資本回収係数。今の借入額から毎年の返済額を求めるから。</p></details></section>`
    },
    {
      questionNumbers: [8, 9, 10, 11, 12],
      panda: '6つの係数は暗記だけやなくて、矢印の向きで選べるようにしよう。',
      html: `<p>まず<strong>一括か、毎年か</strong>。次に<strong>今から将来か、将来から今か</strong>を見る。係数名の「年金」は公的年金だけを意味せず、毎年の一定額を扱う印だ。</p>
        <figure class="study-visual"><figcaption>6つの係数は「何から何を求めるか」で3組にする</figcaption><div class="study-coefficient-map"><section><h3>① 一括 ↔ 一括</h3><div><span>今の一括額 → 将来の一括額</span><strong>終価係数</strong></div><div><span>将来の一括額 → 今の一括額</span><strong>現価係数</strong></div></section><section><h3>② 毎年積立 ↔ 将来の目標</h3><div><span>毎年の積立額 → 将来の合計額</span><strong>年金終価係数</strong></div><div><span>将来の目標額 → 毎年の積立額</span><strong>減債基金係数</strong></div></section><section><h3>③ 毎年の受取・返済 ↔ 今の元本</h3><div><span>毎年の受取・返済額 → 今の元本</span><strong>年金現価係数</strong></div><div><span>今の元本・借入額 → 毎年の受取・返済額</span><strong>資本回収係数</strong></div></section></div></figure>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>係数表の利率・年数が問題条件と一致する行を見る。問12は（1）〜（5）で矢印の向きが変わる。単位と端数処理も最後に確認。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>毎年の取崩額から必要元本を逆算するなら？</p><details><summary>答えと理由を見る</summary><p>年金現価係数。毎年の受取額から現在必要な元本を求めるから。</p></details></section>`
    }
  ],
  3: [
    null, null, null,
    {
      questionNumbers: [13],
      panda: '借換えで毎年の返済額がどう変わるか、同じ期間で比べよう。',
      html: `<p>ローンでは金利に加え、<strong>毎回いくら返すか</strong>を決める返済方法を確認する。</p><div class="study-coefficients"><div><span>元利均等返済</span><strong>元金＋利息の合計が原則一定</strong></div><div><span>元金均等返済</span><strong>返す元金が一定。利息が減るにつれ毎回の返済額も減少</strong></div></div>
        <p>問13は旧・新とも借入額1,500万円、返済期間10年の元利均等返済。旧金利2％の資本回収係数0.1113、新金利1％の0.1056を使う。</p>
        <div class="study-equation">10年間の返済軽減額＝旧年返済額×10−新年返済額×10</div><div class="study-example"><p>旧：1,500万円×0.1113＝166.95万円／年</p><p>新：1,500万円×0.1056＝158.4万円／年</p><p><strong>（166.95−158.4）×10＝85.5万円</strong></p></div><p>問13では手数料を考慮しない。実際の借換えでは諸費用も確認する。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>資本回収係数は「借入額→毎年の返済額」。総額を比べるなら、両方に同じ10年を掛ける。減債基金係数と取り違えない。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>借換え後の金利が低いだけで、必ず実際の総支払額が減る？</p><details><summary>答えを見る</summary><p>必ずとはいえない。借換え費用なども確認する。問13では問題の指定で費用を考慮しない。</p></details></section>`
    },
    null,
    {
      questionNumbers: [13, 14],
      panda: '繰上返済で何回ぶんの元金を先に返せるか、表で追えるかな？',
      html: `<p><strong>期間短縮型</strong>の繰上返済は、先の返済回数分に当たる元金をまとめて返し、返済期間を短くする方法。問14では120回目返済後の残高から、100万円以内で届く将来の残高を探す。</p>
        <table class="study-mini-table"><caption>問14の返済予定表から必要な行を抜粋（円）</caption><thead><tr><th>返済回数</th><th>返済後残高</th></tr></thead><tbody><tr><td>120回目</td><td>15,107,049</td></tr><tr><td>134回目</td><td>14,159,930</td></tr><tr><td>135回目</td><td>14,091,003</td></tr></tbody></table>
        <ol class="study-steps"><li>120回目の残高15,107,049円から100万円を引くと、下限は<strong>14,107,049円</strong>。</li><li>135回目の残高では下限を下回り、繰上返済額が100万円を超える。上限内で最も進めるのは<strong>134回目の14,159,930円</strong>。</li><li>繰上返済額は15,107,049−14,159,930＝<strong>947,119円</strong>。</li><li>121〜134回目の<strong>14回分＝1年2か月</strong>を短縮する。</li></ol>
        <p>問13の借換えは別のローンに組み直す話。<strong>繰上返済</strong>と<strong>借換え</strong>を混同しない。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>問14では返済額を14回足さない。返済額には利息が含まれるため、比較するのは<strong>残高の差</strong>。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>135回目の残高14,091,003円を選べない理由は？</p><details><summary>答えを見る</summary><p>15,107,049−14,091,003＝1,016,046円となり、繰上返済の上限100万円を超えるため。</p></details></section>`
    }
  ],
  8: [
    {
      questionNumbers: [15, 16, 17],
      panda: '会社の決算書3つは、同じ数字を違う角度から見ているよ。',
      html: `<p>企業を見る代表的な書類は<strong>貸借対照表（B/S）</strong>、<strong>損益計算書（P/L）</strong>、<strong>キャッシュフロー計算書（C/F）</strong>。それぞれ「いつの、何」を表すかで区別する。</p>
        <div class="study-rule-grid"><div><strong>B/S</strong><span>一時点の資産・負債・純資産</span></div><div><strong>P/L</strong><span>一定期間の収益・費用・利益</span></div><div><strong>C/F</strong><span>一定期間の資金の増減</span></div></div>
        <div class="study-example"><strong>同じ会社でも見るものが違う</strong><p>決算日の資産と借入れを見るならB/S。1年間の売上と利益ならP/L。1年間に現金がどう増減したかならC/F。</p></div>
        <p>B/Sは<strong>資産＝負債＋純資産</strong>でつり合う。家計バランスシートと形は似ているが、企業の決算書をそのまま家計の記録と同一視しない。</p>
        <p>問17には<strong>企業会計上の利益</strong>と<strong>法人税法上の所得</strong>も出る。税務上の所得は会計上の利益を基礎に、税法に合わせた調整をして計算する。両者が必ず同額になるわけではない。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>問15〜17では「一時点」か「一定期間」かを見分ける。P/Lは一定期間の経営成績、C/Fは一定期間の資金の増減。税務上の所得も会計上の利益と区別する。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>企業の一時点の財政状態を示す書類は？</p><details><summary>答えを見る</summary><p>貸借対照表（B/S）。</p></details></section>`
    },
    {
      questionNumbers: [15, 16],
      panda: '「営業利益」と「経常利益」の間には何が入るかな？',
      html: `<p>損益計算書では、売上から何を引き、何を足したかで利益の名前が変わる。</p>
        <figure class="study-visual"><figcaption>架空例：利益を上から順に計算する（単位：万円）</figcaption><ol class="study-profit-ladder"><li><small>売上高1,000 − 売上原価600</small><strong>売上総利益 <em>400</em></strong></li><li><small>− 販売費及び一般管理費250</small><strong>営業利益 <em>150</em></strong></li><li><small>＋ 営業外収益10 − 営業外費用20</small><strong>経常利益 <em>140</em></strong></li><li><small>＋ 特別利益5 − 特別損失15</small><strong>税引前当期純利益 <em>130</em></strong></li></ol></figure>
        <p>問15では、「営業利益に特別損益を加減して経常利益」とする説明が誤り。特別損益を入れるのは<strong>経常利益の後</strong>だ。問16でも売上総利益・営業利益・税引前当期純利益の順序を確かめる。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「営業外」は経常利益まで、「特別」はその次、と階段を一段ずつ追う。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>営業利益に営業外収益・費用を加減すると？</p><details><summary>答えと理由を見る</summary><p>経常利益。特別損益を加減するのは、その次の段階。</p></details></section>`
    },
    {
      questionNumbers: [70, 71, 72],
      panda: '分割払いとリボ払い、毎月払う点は似ていても決め方が違うよ。',
      html: `<p><strong>分割払い</strong>は買うときに支払回数を決める。<strong>リボ払い</strong>は利用残高に対し、毎月の支払額を一定などの方式で決める。リボで新たに買い物をすると残高が増え、支払期間が延びることがある。</p>
        <figure class="study-visual"><figcaption>同じ6万円の買い物でも「決めるもの」が違う</figcaption><div class="study-payment-compare"><div><strong>分割払い</strong><span>購入時</span><p>この買い物を<strong>3回</strong>で払うと決める</p><small>買い物ごとに支払回数を決める</small></div><div><strong>リボ払い</strong><span>利用残高</span><p>契約した方式に沿って<strong>毎月の支払額</strong>を決める</p><small>買い物が増えると残高・完済時期も変わり得る</small></div></div><p>実際の支払額・手数料は契約条件による。</p></figure>
        <p>問70の「定額リボは買う時点で回数を決める」は、分割払いの説明と入れ替わっている。具体的な手数料や方式はカード契約の条件を確認する。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>「回数を決める」なら分割、「残高を基準に毎月の額を決める」ならリボ、と見分ける。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>買い物のたびに支払回数を決めるのは？</p><details><summary>答えと理由を見る</summary><p>分割払い。リボ払いは利用残高に応じて毎月の支払額が決まる。</p></details></section>`
    },
    {
      questionNumbers: [70, 71, 72],
      panda: '買い物の後払いと現金の借入れは、同じカードでもルールが違うよ。',
      html: `<h3>ショッピングとキャッシング</h3><p><strong>ショッピング</strong>は商品・サービス代金の後払い、<strong>キャッシング</strong>は現金の借入れ。貸金業法の<strong>総量規制</strong>では、カード会社のショッピングは対象外だが、キャッシングは原則として対象になる。</p>
        <h3>キャッシングの利息</h3><p>翌月一括返済でも利息が発生する。問71は「一括なら利息なし」と思い込ませる問題。実際の利率・計算方法は契約条件を確認する。</p>
        <h3>本人利用と信用情報</h3><p>カードは<strong>券面の会員本人が使う</strong>。家族にも貸さない。信用情報は所定の手続で本人が開示請求できる。</p>
        <aside class="study-tip"><h3>🐾 解くときのコツ</h3><p>問72は「ショッピングもキャッシングも総量規制の対象外」という一括りが誤り。どちらの機能について述べているかに線を引こう。</p></aside>
        <section class="study-check"><h3>30秒チェック</h3><p>カードのショッピングとキャッシング、総量規制の対象になるのは？</p><details><summary>答えを見る</summary><p>キャッシングが原則対象。ショッピングは対象外。</p></details></section>`
    }
  ]
};
