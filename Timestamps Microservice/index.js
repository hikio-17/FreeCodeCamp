// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api", (req, res) => {
  const currentDate = new Date();
  const unixTimesStamp = Date.parse(currentDate);
  const utcDate = currentDate.toUTCString();

  res.json({ unix: unixTimesStamp, utc: utcDate });
});

app.get('/api/:date?', (req, res) => {
  const dateString = req.params.date;
  const dateStringRegex = /^[0-9]+$/;
  const numbersOnly = dateStringRegex.test(dateString);

  if (!numbersOnly) {
    const unixTimesStamp = Date.parse(dateString);
    const utcDate = new Date(unixTimesStamp).toUTCString();

    unixTimesStamp ? res.json({ unix: unixTimesStamp, utc: utcDate }) : res.json({ error: 'Invalid Date'});
  } else {
    const unixTimestamp = parseInt(dateString);
    const actualDate = new Date(unixTimestamp);
    const utcDate = actualDate.toUTCString();

    res.json({ unix: unixTimestamp, utc: utcDate });
  }
});


// app.get('/api/:date?', (req, res) => {
//   const dateString = req.params.date
//   const dateStringRegex = /^[0-9]+$/
//   const numbersOnly = dateStringRegex.test(dateString)
 
//   if (!numbersOnly) {
//     const unixTimestamp = Date.parse(dateString);
//     console.log(unixTimestamp);
//     const utcDate = new Date(unixTimestamp).toUTCString()
 
//     unixTimestamp
//     ? res.json({ unix: unixTimestamp, utc: utcDate })
//     : res.json({ error: "Invalid Date" })
//   } 
//   else {
//     const unixTimestamp = parseInt(dateString)
//     const actualDate = new Date(unixTimestamp)
//     const utcDate = actualDate.toUTCString()
 
//     res.json({ unix: unixTimestamp, utc: utcDate })
//   }
 
//    app.get('/api', (req, res) => {
//      const currentDate = new Date().toUTCString()
//      const currentUnix = Date.parse(currentDate)
//      res.json({ unix: currentUnix, utc: currentDate })
//    })
//  })

// listen for requests :)
var listener = app.listen(8000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
