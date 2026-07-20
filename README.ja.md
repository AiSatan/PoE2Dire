[🇬🇧 English](README.md) ·
[🇧🇷 Português](README.pt-br.md) ·
[🇷🇺 Русский](README.ru.md) ·
[🇹🇭 ไทย](README.th.md) ·
[🇩🇪 Deutsch](README.de.md) ·
[🇫🇷 Français](README.fr.md) ·
[🇪🇸 Español](README.es.md) ·
🇯🇵 日本語

> [!IMPORTANT]
> **この翻訳は機械翻訳であり、ネイティブスピーカーによる確認を受けていません。**
> 誤りや不正確な表現が含まれている可能性があります。英語の原文はこちら: [README.md](README.md)。
> 翻訳の改善にご協力いただけると助かります。PR や issue をお気軽にどうぞ！

> [!NOTE]
> PoE2Dire は非公式のファンメイドプロジェクトです。Grinding Gear Games および Path of Exile とは提携・関連しておらず、承認や後援も受けていません。

# PoE2Dire

Path of Exile（1 および 2）のパッチノートを Dota 2 風のレイアウトで表示する拡張機能です。
[この Reddit スレッドがきっかけです](https://www.reddit.com/r/PathOfExile2/comments/1tkazjr/can_someone_explain_to_me_why_ggg_doesnt_present/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)。

Path of Exile 2 のサブレディットにある、この拡張機能の[Reddit スレッド](https://www.reddit.com/r/PathOfExile2/comments/1toxfei/dota2_style_patch_notes_browser_extension/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button)。

<img width="1539" height="1157" alt="preview_update" src="https://github.com/user-attachments/assets/e5e48c44-386b-4df3-8ae6-9d21aa8b9f43" />
<img width="1201" height="1021" alt="showcase" src="https://github.com/user-attachments/assets/c41b4e58-084c-4a46-969e-76e239129df7" />


この拡張機能が動作するのは以下のページのみです:

```text
https://www.pathofexile.com/forum/*
https://br.pathofexile.com/forum/*
https://ru.pathofexile.com/forum/*
https://th.pathofexile.com/forum/*
https://de.pathofexile.com/forum/*
https://fr.pathofexile.com/forum/*
https://es.pathofexile.com/forum/*
https://jp.pathofexile.com/forum/*
```

また、説明文や画像の取得のために `poewiki.net` と `poe2wiki.net` へのアクセスを要求します。


## 使い方

0. お使いのブラウザにインストールしてください: [Chrome](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)/[Firefox](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)
1. Path of Exile フォーラムのパッチノートページを開きます（[今はこのページが人気です](https://www.pathofexile.com/forum/view-thread/3932540)）
2. 上部の PoE2Dire アイコンをクリックして有効化します <img width="114" height="79" alt="image" src="https://github.com/user-attachments/assets/2b800f16-d7a4-4f35-b4cc-65940e61ee31" />（アイコンが見当たらない場合はピン留めが必要です。パズルのアイコンをクリックし、そこから探してクリックしてください）
3. これで完了です
4. もう一度クリックすると無効化できます。ページを再読み込みしても構いません。

動画の例: [https://www.youtube.com/watch?v=ES66rQrVNQY](https://www.youtube.com/watch?v=ES66rQrVNQY)


## 機能

- 文字を入力し始めるだけで検索が起動します。キーワードを打ち始めるだけで、他の操作は不要です。
- 独自の目次 — 見やすく使いやすい！
- アイテムやスキルの説明をホバー表示 — そのユニークの効果を忘れた？ カーソルを合わせれば wiki の説明が見られます！
- キーワードの説明をホバー表示 — まだ 5000 時間しかプレイしていない初心者ですか？ ご安心を。「aggregated」のような分からない単語にカーソルを合わせれば、意味の全文が読めます！（poewiki のキーワードページに基づいているため PoE 用です。PoE2 プレイヤーの方は今のところ混乱しないようご注意ください）

## インストール方法


> ぜひレビューを残してください。より多くの人に見つけてもらえます！


### Chrome にインストール

[Chrome ウェブストア](https://chromewebstore.google.com/detail/paekoknkbpfidmpabiikofkemegpfgnh?utm_source=item-share-cb)

### Firefox にインストール（Firefox モバイルでも動作します）

[Firefox アドオンページ](https://addons.mozilla.org/en-US/firefox/addon/poe2dire/)

### ユーザースクリプトとしてインストール

> [!CAUTION]
> これはユーザースクリプトが何か分かっている人向けです

お使いの「monkey」へのスクリプトの入れ方はすでにご存じかと思います。`PoE2Dire.user.js` は [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases) ページからダウンロードできます。ViolentMonkey 向けの動画例はこちら: [https://www.youtube.com/watch?v=cgWVGSAxoEY](https://www.youtube.com/watch?v=cgWVGSAxoEY)

> 噂によると「インストールページから生の .js に直接リンクできる」とのことです。

手順をまとめると次のとおりです:

1. [GitHub Releases](https://github.com/aisatan/PoE2Dire/releases) から `PoE2Dire.user.js` ファイルをダウンロードします。
2. リリースアセットの `PoE2Dire.user.js` を開きます。
3. お使いのユーザースクリプトマネージャーにインストールします。
4. Path of Exile フォーラムのパッチノートページで、ユーザースクリプトマネージャーのメニューから `Toggle PoE2Dire` をクリックします。

これは Firefox の Tampermonkey と ViolentMonkey でのみ確認しています。うまく動かない場合は、お気軽に issue を立ててください。


### みんなスマホを持ってないの？

拡張機能をインストールできない、またはしたくないスマートフォンやブラウザ向けの方法です。

> [!NOTE]
> 一部のモバイルブラウザはブックマークレットのスクリプトをブロックするため、すべての環境で動作するとは限りません。`Android` の `Brave` で確認しています。動かない場合は issue を立ててください。どなたかが解決策をご存じかもしれません。

> [!CAUTION]
> これはリモートのコード（`https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js`）をダウンロードし、ブラウザ上で**実行**します。
> 必須ではありませんが、安全のため**シークレットモード**の利用を**強くおすすめします**。

私のスマホ（Brave ブラウザ）でのインストール動画:

https://github.com/user-attachments/assets/a034d803-7d16-443c-8e9b-e5f683d9e309

高画質版: https://youtube.com/shorts/AmYBZYfP4YY

スマホ用ブックマークレットは、GitHub Pages で公開されている単一ファイルのビルドを読み込みます:

```js
javascript:(function(){var s=document.createElement('script');s.src='https://aisatan.github.io/PoE2Dire/PoE2Dire-bookmarklet.js?poe2dire=' + Date.now();s.referrerPolicy='no-referrer';s.onerror=function(){alert('PoE2Dire failed to load. The page may block bookmarklet scripts.');};document.documentElement.appendChild(s);})();
```

使い方:

1. ブラウザのブックマークを作成します（どのサイトでも構いません）
2. ブックマークの URL と名前を編集します。
3. 上記の `javascript:` から始まるコード全体をブックマークの URL として貼り付けます。
4. `0000 poe2dire` のような呼び出しやすい名前を付けます
5. Path of Exile フォーラムのパッチノートページを開きます。
6. ブックマークを実行します（多くのブラウザでは名前を入力するだけで見つけて起動できます）


## うまく動きませんか？

GitHub でお気軽に issue を立ててください。できる限り対応しますが、お約束はできません。


## コントリビューション

質問、PR、issue、フォークなど、どうぞお気軽に。
ドキュメントは足りていませんが、雑な JS コードでも十分に追えるはずです。
ただ、私が何十年も書いてきた場当たり的な JS は変に見えるかもしれません。ちゃんとしたプロジェクトに使ったことはなく、jQuery のスクリプトばかりだったので。


## 支援 🌠

こうしたささやかな支援方法をご検討いただけると嬉しいです:

⭐ GitHub でスターを付ける ⭐

☕ [コーヒーをおごる <3](https://buymeacoffee.com/aisatan) ☕

<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/02ac03f9-3dd0-4674-8ea2-03b38e0e1f81" />[Blender Foundation に寄付する](https://fund.blender.org/donate-once/)
<img width="32" height="32" alt="blender_emoji_transparent_32" src="https://github.com/user-attachments/assets/1e6fa180-211d-4658-9b4f-c549a336a75e" />
