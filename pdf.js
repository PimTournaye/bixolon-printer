import PDFDocument from 'pdfkit';
import {
  createWriteStream
} from 'fs';

import Printer from './printer.js';

import fs from "fs"

let teststring = ` ' TEST 2 character test << >> … 
ÀÁÂÏȊ äæéẽëěęḙḛéêèçöṻ c'est « test » & @ ‼ ⁈ '


other test





more test










lots more test`;

let lorem = `Etant pensionnée, je n&rsquo;ai pas vécu de souci par rapport à une vie professionnelle. Par contre, j&rsquo;ai 3 choses à dire sur le plan de mon expérience. Je suis « aidant proche » à 2 égards: primo, je m&rsquo;occupe de ma tante (pas d&rsquo;enfants, 90 ans) en résidence service. L&rsquo;isolement y est extrême, son moral et son état physique se détériorent à vive allure. Secundo: j&rsquo;ai un fils de 39 ans, souffrant d&rsquo;une maladie psychique grave et invalidante. Le contexte a aggravé sa solitude et son moral. Je suis fort sollicitée à cet égard. Et enfin, je suis présidente d&rsquo;une association de familles ayant un proche atteint de troubles psychiques. Il s&rsquo;agit de Similes Wallonie: nous avons des groupes de parole et je peux vous dire que les constats concernant les usagers en santé mentale sont graves: difficultés d&rsquo;hospitalisation, diminution des liens sociaux, via les clubs thérapeutiques, manque d&rsquo;activités, rechutes etc etc. Les parents sont dans de graves difficultés supplémentaires à cause de la pandémie. Et cela me touche car j&rsquo;ai une grande partie de ma vie qui est consacrée à toutes ces personnes.`



export default function makePDF(text, height) {

  const doc = new PDFDocument({
    size: [width, height],
    margins: { // by default, all are 72
      top: 10,
      bottom: 10,
      left: 10,
      right: 10
    }
  })
};

// Pipe its output somewhere, like to a file or HTTP response
// See below for browser usage
doc.pipe(createWriteStream('output.pdf'));

// Embed a font, set the font size, and render some text
doc
  .font('Roboto-Regular.ttf')
  .fontSize(9)
  .text(lorem, {
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
}