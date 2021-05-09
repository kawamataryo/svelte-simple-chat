import WebSocket from "ws"

const wss = new WebSocket.Server({ port: 8082 });

type Chat = {
  userId: string,
  message: string
}

// インメモリでデータを保持
const chatBoard: Chat[] = [];

wss.on('connection', (ws) => {
  ws.on('message', (payload) => {
    if(typeof payload === 'string') {
      chatBoard.push(JSON.parse(payload));
    }

    // 全ての接続先に送信
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(chatBoard));
    })
  });

  ws.send(JSON.stringify(chatBoard));
});
