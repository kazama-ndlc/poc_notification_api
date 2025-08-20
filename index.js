const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const VALID_CLIENT_ID = 'Tp8Fx3JkpegwzHBeBdZLgBpSgXHrNZnMme4D-QVYBecFP3u-8FxFpRTVhxdwe9i2'
const VALID_CLIENT_SECRET = 'ajpZ4fjWfG4LnBLbwFSijz8hbUtJmL2m'
const FIXED_TOKEN = 'usf7nWhZeLySGKxXnS-cUuxcC_QSAuY2akfnxbL_5SVBWLWkNS9FsPDJemJnhL_2JJ7N3dV_9hP5TW9bGBeKpj9SF3P37iYVg-ZJ'
const EXPIRES_IN_SECOND = ''


app.get('/', (req, res) => {
  res.send('poc_notification_api is running!!!!!!');
});

app.get('/test1', (req, res) => {
  res.send('test1 succes!!!!!!');
});

app.get('/id', (req, res) => {
  res.send('Tp8Fx3JkpegwzHBeBdZLgBpSgXHrNZnMme4D-QVYBecFP3u-8FxFpRTVhxdwe9i2');
});

app.get('/secret', (req, res) => {
  res.send('ajpZ4fjWfG4LnBLbwFSijz8hbUtJmL2m');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});