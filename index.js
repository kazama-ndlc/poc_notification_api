const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('poc_notification_api is running!!!!!!');
});

app.get('/test1', (req, res) => {
  res.send('test1 succes!!!!!!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});