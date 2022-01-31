import Fetcher from './fetch.js';
import Printer from './printer.js';
import printer from '@thiagoelg/node-printer';

let print = new Printer();
let fetcher = new Fetcher();


/////////////////
// SETUP ////////
/////////////////

// Printers setup
let ticketPrinters = [];
let printerID = 0;

printer.getPrinters().forEach(element => {
    let name = element.name
    if (name.includes('BIXOLON')) {
        ticketPrinters.push({
            ticketPrinter: element,
            ID: printerID
        });
        printerID++;
    } else console.log('skipping non-bixolon printer');
});

// Important variables
const LOOP_TIMER = 10000


////////////////////
// MAIN LOOP ///////
////////////////////

setInterval(() => {
    
}, LOOP_TIMER);






///////////////////////
// Other functions ////
///////////////////////
