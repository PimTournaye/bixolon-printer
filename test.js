import PDFDocument from 'pdfkit';
import { createWriteStream } from 'fs';

import Printer from './printer.js';

import fs from "fs"

let teststring = ` ' TEST 2 character test << >> … 
ÀÁÂÏȊ äæéẽëěęḙḛéêèçöṻ c'est « test » & @ ‼ ⁈ '


other test





more test










lots more test`;

let lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ac placerat vestibulum lectus mauris ultrices eros in cursus. Id leo in vitae turpis massa sed elementum tempus egestas. Enim sed faucibus turpis in. Tristique senectus et netus et malesuada fames ac. Semper auctor neque vitae tempus. Ut morbi tincidunt augue interdum velit euismod. Cras ornare arcu dui vivamus arcu felis bibendum ut tristique. Est ullamcorper eget nulla facilisi etiam dignissim diam quis enim. Adipiscing diam donec adipiscing tristique risus nec feugiat. Aliquet porttitor lacus luctus accumsan. Varius vel pharetra vel turpis nunc eget lorem. Platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras. Pulvinar pellentesque habitant morbi tristique senectus et netus. Nunc sed velit dignissim sodales ut. Eu feugiat pretium nibh ipsum consequat nisl vel.

Hendrerit dolor magna eget est. Scelerisque felis imperdiet proin fermentum. Orci dapibus ultrices in iaculis nunc sed augue lacus. Vulputate sapien nec sagittis aliquam malesuada bibendum arcu vitae. Nunc sed blandit libero volutpat sed cras ornare arcu. Blandit libero volutpat sed cras ornare arcu dui vivamus. Ut faucibus pulvinar elementum integer. Turpis nunc eget lorem dolor sed viverra ipsum nunc aliquet. Quam nulla porttitor massa id neque aliquam vestibulum morbi blandit. Morbi tristique senectus et netus et malesuada fames ac. Est lorem ipsum dolor sit amet consectetur. Urna condimentum mattis pellentesque id nibh tortor id. In aliquam sem fringilla ut morbi tincidunt augue interdum. Pharetra vel turpis nunc eget lorem. Sed libero enim sed faucibus. Nibh cras pulvinar mattis nunc sed blandit libero volutpat. Aliquet lectus proin nibh nisl condimentum. Interdum varius sit amet mattis vulputate. Velit ut tortor pretium viverra suspendisse. Nunc sed id semper risus in.`
// Create a document
const doc = new PDFDocument({size: 'A10'});

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
doc.pipe(createWriteStream('output2.pdf'));

// Embed a font, set the font size, and render some text
doc
.font('RobotoMono.ttf')
.fontSize(9)
  .text(lorem
  , {
    //width: 72,
    fit: [72, 500],
    align: 'center',
    indent: 48,
    columns: 1,
    //height: 300,
  })
  .save();

// Add an image, constrain it to a given size, and center it vertically and horizontally
/* doc.image('./test.jpg', {
  fit: [250, 300],
  align: 'center',
  valign: 'center'
}); */

// Finalize PDF file
doc.end();

let printer = new Printer("BIXOLON_K3P_2");

let file = fs.readFileSync('./output2.pdf');

printer.printFile(file);

