FROM node:18-alpine

# アプリケーションディレクトリを作成
WORKDIR /usr/src/app

# アプリケーションの依存関係をインストール
# ワイルドカードを使用して、package.json と package-lock.json の両方がコピーされるようにする
COPY package*.json ./

RUN npm install

# アプリケーションのソースをバンドルする
COPY . .

# ポート80を公開
EXPOSE 80

# アプリケーション起動
CMD [ "node", "server.js" ]