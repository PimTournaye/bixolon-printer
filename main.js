import Fetcher from './fetch.js';
import Printer from './printer.js';
import TextFormatter from './textFormatter.js';
import { Gpio } from 'onoff';

import printer from '@thiagoelg/node-printer';
import _, { debounce } from 'lodash';

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

console.log(ticketPrinters);

let tempPrinterArray = [];

// Make Printer objects for each element in the array
ticketPrinters.forEach(element => {
    let printer = new Printer(element.name)
    tempPrinterArray.push(printer);
})

// Replace our list of printers with the correct objects
ticketPrinters = tempPrinterArray;

// Important variables
const LOOP_TIMER = 10000


// GPIO setup
if (process.platform == 'linux') {
    const buttonPin = 4;
    const button = new Gpio(buttonPin, 'in', 'both', {debounceTimeout: 10})
}


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
        let strippedMessage = formatter.stripHTML(message.lastMessage)

        let wrappedMessage = formatter.wrap(strippedMessage, 48)
        console.log(wrappedMessage);
        currentPrinter.printRaw(wrappedMessage)
    } else {
        console.log('no new message')
        //console.log(message);
    }
}, LOOP_TIMER);


if (process.platform == 'linux') {
    // Watch for button press to call the wind function
    button.watch((err, value) =>{
        if(err) throw err;
        wind();
        //button.unexport();
    })
}






///////////////////////
// Other functions ////
///////////////////////

// Function for emulating tons of new messages coming in
const wind = () => {
    let amount = _.random(12, 50)
    let messages = [];
    
    let someMessages = fetcher.getSome(amount);

    someMessages.forEach(data => {
        const message = data[0].content.rendered;
        
        //Get rid of HTML tags so we can cleanly print the message
        let strippedMessage = formatter.stripHTML(message)
        // Make sure no words get split when starting a new line
        let wrappedMessage = formatter.wrap(strippedMessage, 48)

        let currentPrinter = _.sample(ticketPrinters);
    });


}