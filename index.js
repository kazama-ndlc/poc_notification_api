const express = require('express');
const app = express();
app.use(express.json());

const VALID_CLIENT_ID = 'Tp8Fx3JkpegwzHBeBdZLgBpSgXHrNZnMme4D-QVYBecFP3u-8FxFpRTVhxdwe9i2';
const VALID_CLIENT_SECRET = 'ajpZ4fjWfG4LnBLbwFSijz8hbUtJmL2m';
const FIXED_TOKEN = 'usf7nWhZeLySGKxXnS-cUuxcC_QSAuY2akfnxbL_5SVBWLWkNS9FsPDJemJnhL_2JJ7N3dV_9hP5TW9bGBeKpj9SF3P37iYVg-ZJ';
const EXPIRES_IN_SECOND = 99999;

app.post('/auth/token', (req, res) => {
  const { client_id, client_secret } = req.body;
  
  if (!client_id || !client_secret) {
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