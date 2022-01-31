import Fetcher from './fetch.js';
import Printer from './printer.js';
import TextFormatter from './textFormatter.js';

import printer from '@thiagoelg/node-printer';
import _ from 'lodash';

let fetcher = new Fetcher();
let formatter = new TextFormatter();


/////////////////
// SETUP ////////
/////////////////

// Printers setup
let ticketPrinters = [];
let printerID = 0;

// Put all Bixolon printers in an array
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

let tempPrinterArray = [];

// Make Printer objects for each element in the array
ticketPrinters.forEach(element => {
    let printer = new Printer(element.name)
    tempPrinterArray.push(printer);
})

// Replace our list of printers with the correct objects
ticketPrinters = tempPrinterArray;

// Important variables
const LOOP_TIMER = 3000


////////////////////
// MAIN LOOP ///////
////////////////////

setInterval( async () => {
    
    let message = await fetcher.getLatest()

    if (message.hasNewMessage == true) {

        console.log('new message', message.lastMessage)

        // Get a random printer from our array of available printers
        let currentPrinter = _.sample(ticketPrinters);
        //Get rid of HTML tags so we can cleanly print the message
        let cleanMessage = formatter.stripHTML(message.lastMessage)
        currentPrinter.printRaw(cleanMessage)


    } else {
        console.log('no new message')
        console.log(message);
    }
}, LOOP_TIMER);






///////////////////////
// Other functions ////
///////////////////////

// Function for emulating tons of new messages coming in
const wind = () => {

}