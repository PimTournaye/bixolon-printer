const express = require('express');
const app = express();
const port = 3503;

const print = require('./print.js');

const DATE = Date.now().to;

console.log(DATE);

app.get('/', (req, res) => {
  res.send('Hello World! \n Printing!')
  console.log('connected');
  print.printZebra(`
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  `, 'BIXOLON_BK3_3')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})