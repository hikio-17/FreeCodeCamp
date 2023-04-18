var express = require('express');
var cors = require('cors');
require('dotenv').config()

const multer = require('multer');

var app = express();
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// SET STORAGE
const upload = multer({ dest: 'uploads'});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    error.httpStatusCode = 400;
    return res.send(error);
  }
  res.json({
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
  });
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
