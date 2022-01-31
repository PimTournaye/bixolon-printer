import express from 'express';
import Printer from './printer';
const app = express();
const port = 3503;
import { join } from 'path';

import { urlencoded, json } from 'body-parser';
// parse application/x-www-form-urlencoded
app.use(urlencoded({ extended: false }))

// parse application/json
app.use(json())

const printer = new Printer()

app.get('/', (req, res) => {
res.sendFile(join(__dirname, '/index.html'));
  console.log('connected');
  
})

app.post('/', (req, res) => {
    console.log('posted');
    printer.printRaw(req.body.text)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})