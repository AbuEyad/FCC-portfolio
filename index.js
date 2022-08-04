// index.js
// where your node app starts

// init project
//require('dotenv').config();
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

const dns = require('dns')
const urlparser = require('url')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const mySecret = process.env['MONGO_URI']

mongoose.connect("mongodb+srv://abuEyad:TImM6ozdYkigpNvc@cluster0.ctc2f.mongodb.net/fcc?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true });


const schema = new mongoose.Schema({url: 'string'});
const Url = mongoose.model('Url', schema);

app.use(bodyParser.urlencoded({extended: false}))
app.post('/api/shorturl',function(req, res){
  console.log(req.body)
  const bodyurl = req.body.url;
  console.log(bodyurl);
  const something = dns.lookup(urlparser.parse(bodyurl).hostname, (error, address)=>{
    if(!address){
      res.json({error: 'Invalid URL'})
    }else {
      let url = new Url({url:bodyurl})
      url.save((err, data)=>{
        res.json({
          original_url: data.url,
          short_url: data.id
        })
      })
    }
  })
});
app.get("/api/shorturl/:id", (req, res)=>{
  const id = req.params.id;
  Url.findById(id, (err, data)=>{
    if(!data){
      res.json({error: "Invalid URL"})
    }else{
      res.redirect(data.url)
    }
  })
})

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/timestamp", function (req, res) {
  res.sendFile(__dirname + '/views/timestamp.html');
});
app.get("/requestHeaderParser", function (req, res) {
  res.sendFile(__dirname + '/views/requestHeaderParser.html');
});
app.get("/URLShortner", function (req, res) {
  res.sendFile(__dirname + '/views/URLShortner.html');
});


// your first API endpoint...
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
// Request Header Parser App
app.get("/api/whoami", (req, res)=>{
  res.json({
    "ipaddress" : req.connection.remoteAddress,
    "language" : req.headers['accept-language'],
    "software" : req.headers['user-agent']


  })
})
//******************
//Timestamp app
//1- empty request
app.get("/api/", (req,res)=>{
  res.json({
    "unix" : new Date().getTime(),
    "utc" : new Date().toUTCString()
  })
})
//2- other requests
app.get("/api/:date_string", function(req,res){

  let dateString = req.params.date_string;
  let passedInValue = new Date(dateString);

  if (passedInValue == "Invalid Date"){
    if (parseInt(dateString)){
      res.json({
        "unix": new Date(parseInt(dateString)).getTime(),
        "utc": new Date(parseInt(dateString)).toUTCString()
      })
      }else{
      res.json({"error" : "Invalid Date"})
      }
    }else{
    res.json({
      "unix": passedInValue.getTime(),
      "utc" : passedInValue.toUTCString()
    })
    }
  res.json({"eroor" : "Invalid Date"})
})
//******************
//URL URL Shortner


//*****************
// listen for requests :)
var listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
