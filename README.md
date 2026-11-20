# 金沢、二人の秋。 — KANAZAWA JOURNEY

2026年11月21日（土）〜23日（月・祝）の2名旅行向けに作成した、レスポンシブな「旅のしおり」PWAです。

## Features

- 上質なエディトリアルUI。iPhoneに対応、デスクトップでは2カラムのダッシュボード
- 3日間の旅程切替と、各スポットの詳細／Googleマップ経路／公式サイト
- **Jade 12:30 / 12:45 / 13:00** の仮予定時刻を切替（予約の操作は行いません）
- **一笑を21日に挑戦 / 22日に移す / 21日訪問済み** の3状態に応じて旅程を自動調整
- **22日：通常・小雨 ↔ 強い雨・風** の2経路を切替（県立美術館＋任意のライトアップ／県立図書館）
- 準備チェック、訪問済みチェック、自由メモ（端末内に自動保存）
- Open-Meteo の3日間予報を取得（取得できない場合は保存済み予報表示）／公式の気象庁リンク
- 予約済み列車・夕食だけを含む `.ics` 出力。Jadeは予約済みにチェックした場合のみ追加
- ホーム画面に追加可能。初回読み込み以降は旅程の基本情報をオフラインで表示

**重要**：このアプリは旅行・予約状況を自動的には変更しません。チェックボックスは「自分が確認した」ための記録です。天気の切り替えも手動です。予約確定、営業変更、魚の入荷、混雑を保証しません。

## Getting started

外部ライブラリは不要です。ローカルサーバーで起動します。

```bash
python3 -m http.server 8000
# http://localhost:8000/
```

## Deploy to a **new GitHub repository**

このフォルダを新規GitHubリポジトリとして登録する場合、GitHub CLIで以下を実行します。

```bash
# GitHub CLIをインストールし、gh auth loginを済ませてから
cd kanazawa-journey-2026
./publish-to-github.sh
```

スクリプトは `kanazawa-autumn-2026` を**新規 **private リポジトリ****として作成し、mainブランチをpushします（GitHub CLIによる明示的な認証が必要です）。既存のリポジトリは変更しません。

自動的なGitHub Pages公開には、リポジトリの Settings → Pages → Build and deployment → Source を **GitHub Actions** に設定してください。その後 `Deploy static PWA` ワークフローを実行／再実行すれば、公開URLが生成されます。

**`./publish-to-github.sh --public` を指定した場合のみ公開リポジトリになります。** 公開リポジトリには **旅程・ホテル名・店名・列車時刻** が含まれます。個人的な旅行情報を公開したくない場合は、`publish-to-github.sh` の `--public` を `--private` に変更し、公開方法を別途検討してください。アプリ内のメモやチェックの内容はブラウザのlocalStorageにのみ保存され、リポジトリには書き込まれません。

## Verified travel constraints (2026-11-20)

- 宿泊：ダイワロイネットホテル金沢駅西口（2泊予約済）
- 21日：海浜幕張08:09 → 東京09:20 → 金沢11:52／金沢cuisine 良 18:30予約済
- 22日：近江町市場に2時間／はす家 **木倉町本店** 19:00予約済。ライトアップは天気と混雑次第
- 23日：朝9時頃チェックアウト、9:30兼六園／紅牡丹12:30は祝日営業を要確認／金沢18:44発かがやき582号
- 一笑：初日昼の挑戦枠。難しければ22日の14:00へ戻す
- Jade：21日12:30は**予約未確定**、タクシー・荷物預け時間に注意
- 妙立寺：22日10:00は予約未確定。21日朝8:30以降に電話
- 21世紀美術館プール地下部：21日朝9:00から順番待ち開始。別途展覧会チケットが必要

## Official sources

- 21世紀美術館プール https://www.kanazawa21.jp/data_list.php?d=1&g=120
- 一笑 https://issho.kagaboucha.com/
- 兼六園ライトアップ https://kenrokuen.or.jp/events/lightup-2609/
- 石川県立図書館 https://www.library.pref.ishikawa.lg.jp/
- 近江町市場 https://ohmicho-ichiba.com/
- Jade https://kagonoya.food-kr.com/0716/
- 紅牡丹（祝日営業案内） https://colorfulcompany.jp/kanazawa/venues/14334
- ホテル https://www.daiwaroynet.jp/kanazawa-ekinishi/access/

## Security and privacy

- 予約・ログイン・決済処理なし。外部リンクは `rel="noopener noreferrer"` で開きます
- メモ・チェックは**使用中のブラウザ端末内**のみに保存
- 天気取得に Open-Meteo（位置：金沢市の概略緯度経度）を使用。ユーザーの現在地は取得しません
- Google Maps は明示的にタップしたときだけ開きます
- GitHub Pages を無料で使う場合は通常 public リポジトリが必要です。個人的な旅程の公開範囲に注意してください

## QA

Chromium がローカルにインストールされていれば、次のテストはローカルサーバーなしで実行できます：

```bash
node tests/logic_test.cjs
python3 tests/smoke_test.py
```

実装検査：必須スポット・日付・予約ラベル、天候スイッチ、一笑の移動、チェックの永続化、詳細ダイアログ、iPhone幅での横溢れ、ブラウザコンソールエラー。
