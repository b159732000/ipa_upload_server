// index.js
// 通過require獲取兩個node內建模組
const http = require('http');
const nUrl = require('url');

// '127.0.0.1'表明只有本機可訪問，'0.0.0.0'表示所有人可訪問
const hostname = '127.0.0.1';
const port = 3010;

// 通過http.createServer獲取一個server例項
// 其中(req, res) => {}，在伺服器每次接收到請求時都會被執行
const server = http.createServer((req, res) => {
  let method = req.method; // 客戶端請求方法
  let url = nUrl.parse(req.url); // 將請求url字串轉換為node的url物件
  // 如果客戶端GET請求'/'，會執行這個分支裡面的邏輯
  if (method === 'GET' && url.pathname === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end('伺服器收到GET請求，成功回應');
    return;
  }
  // 如果客戶端GET請求'/api/user'，會執行這個分支裡面的邏輯
  if (method === 'GET' && url.pathname === '/api/user') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      code: 0,
      msg: '',
      result: {
        username: 'shasharoman'
      }
    }));
    return;
  }
  if (method === 'POST' && url.pathname === '/') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end('伺服器收到POST請求，成功回應');
      return;
  }
  // 沒有匹配其他分支的話，執行以下邏輯
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end('Not Found');
});

// server開始監聽，等待請求到來
server.listen(port, hostname, () => {})