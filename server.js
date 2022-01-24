const express = require('express');
const Printer = require('./printer');
const app = express();
const port = 3503;
const path = require('path');

var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const printer = new Printer()

app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, '/index.html'));
  console.log('connected');
  
})

app.post('/', (req, res) => {
    console.log('posted');
    console.log(req.body.text);
    printer.printRaw(req.body.text)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})