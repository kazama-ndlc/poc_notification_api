const express = require('express');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const app = express();
app.use(express.json());

const VALID_CLIENT_ID = 'Tp8Fx3JkpegwzHBeBdZLgBpSgXHrNZnMme4D-QVYBecFP3u-8FxFpRTVhxdwe9i2';
const VALID_CLIENT_SECRET = 'ajpZ4fjWfG4LnBLbwFSijz8hbUtJmL2m';
const FIXED_TOKEN = 'usf7nWhZeLySGKxXnS-cUuxcC_QSAuY2akfnxbL_5SVBWLWkNS9FsPDJemJnhL_2JJ7N3dV_9hP5TW9bGBeKpj9SF3P37iYVg-ZJ';
const EXPIRES_IN_SECOND = 99999;

app.post('/auth/token', (req, res) => {
  console.log('トークン取得リクエストを受信しました。');
  const { client_id, client_secret } = req.body;
  
  if (!client_id || !client_secret) {
    console.log('client_idまたはclient_secretが未設定です。', client_id, client_secret);
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields'
    });
  }
  
  if (client_id === VALID_CLIENT_ID && client_secret === VALID_CLIENT_SECRET) {
    return res.json({
      access_token: FIXED_TOKEN,
      expires_in: EXPIRES_IN_SECOND,
      status: 'success'
    });
  } else {
    console.log('client_idまたはclient_secretの値が誤っています。', client_id, client_secret);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid credentials'
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function verifyAccessToken(req, res, next) {
  console.log('TS通知を受信しました。');
  const token = req.headers['authorization'];
  if (!token || token !== FIXED_TOKEN) {
    console.log('TS通知を受信しましたが認証に失敗しました。トークン: ', token);
    return res.status(401).json({
      status: 'error',
      message: 'Invalid or missing token'
    });
  }
  next();
}

app.post('/status/receive', verifyAccessToken, (req, res) => {
  console.log('TS通知のトークン認証に成功しました。');
  const {
    "lc-num": lcNum,
    "modified-by": modifiedBy,
    "modified-date": modifiedDate,
    "txn-id": txnId,
    "txn-status": txnStatus,
    "txn-type": txnType,
    "ClientRefId": clientRefId
  } = req.body;
  
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const timestamp = jst.toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '');
  const logFileName = `request-${timestamp}.log`;
  const logFilePath = path.join(__dirname, 'logs', logFileName);
  
  const logContent = [
    `Received request at: ${timestamp}`,
    `Request headers: ${JSON.stringify(req.headers, null, 2)}`,
    `Request body: ${JSON.stringify(req.body, null, 2)}`
  ].join('\n\n');
  
  fs.mkdir(path.join(__dirname, 'logs'), { recursive: true }, (err) => {
    if (err) {
      console.error('ログディレクトリの作成に失敗: ', err);
    }
    
    fs.writeFile(logFilePath, logContent, (err) => {
      if (err) {
        console.error('ログファイルの書き込みに失敗: ', err);
      }
      
      console.log('ログをファイルに保存しました: ', logFileName);
      console.log(`対象ログダウンロードURL: https://poc-notification-api.onrender.com/download-log/${logFileName}`);
      console.log(`全ログ一括ダウンロードURL: https://poc-notification-api.onrender.com/download-all-logs`);
    });
  });
  
  console.log('Received request at: ', new Date());
  console.log('Request header: ', req.headers);
  console.log('Request body: ', req.body);
  
  return res.status(200).json({
    status: 'success',
    message: 'Data received successfully'
  });
});

app.get('/download-log/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'logs', filename);
  
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).send('ファイルが見つかりません');
    }
    res.download(filePath);
  });
});

app.get('/download-all-logs', (req, res) => {
  const archive = archiver('zip', { zlib: { level: 9 } });
  const logsDir = path.join(__dirname, 'logs');
  
  res.attachment('all-logs.zip');
  
  archive.on('error', (err) => {
    console.error('ZIP作成エラー: ', err);
    res.status(500).send('ZIP作成に失敗しました');
  });
  
  archive.pipe(res);
  archive.directory(logsDir, false);
  archive.finalize()
});

app.get('/', (req, res) => {
  res.status(200).send('OK');
});