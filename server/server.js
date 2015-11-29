import path from 'path';
import express from 'express';

const port = 5000;
const publicPath = path.resolve(__dirname, '../public');
const app = express();

app.use(express.static(publicPath));

app.get('/*', (req, res) => {
  res.sendFile(publicPath + '/index.html');
});

app.listen(port, () => {
  console.log(publicPath);
  console.log('Server running at http://localhost:%s', port);
});
