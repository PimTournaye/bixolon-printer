import Fetcher from './fetch.js';
import Printer from './printer.js';
import TextFormatter from './textFormatter.js';
import {Gpio} from 'onoff';

import printer from '@thiagoelg/node-printer';
import _ from 'lodash';


let fetcher = new Fetcher();
let formatter = new TextFormatter();

//let file = fs.readFileSync('./output2.pdf')

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
    let printer = new Printer(element.ticketPrinter.name)
    tempPrinterArray.push(printer);
})

// Replace our list of printers with the correct objects
ticketPrinters = tempPrinterArray;

// Important variables
let LOOP_TIMER = 10000

/////////////////
// GPIO setup ///
/////////////////


const buttonPin = 4;
const GPIO_SWITCH = new Gpio(buttonPin, 'in', 'both');
const RELAY = {
    in1: new Gpio(1, 'out'),
    in2: new Gpio(1, 'out'),
    in3: new Gpio(1, 'out'),
    in4: new Gpio(1, 'out'),
    in5: new Gpio(1, 'out'),
    in6: new Gpio(1, 'out'),
    in7: new Gpio(1, 'out'),
    in8: new Gpio(1, 'out'),
}


////////////////////
// MAIN LOOP ///////
////////////////////

let normalLoop = setTimeout(async () => {
    let message = await fetcher.getLatest()
    if (message.hasNewMessage == true) {
        console.log('new message', message.lastMessage);

        // Get a random printer from our array of available printers
        let currentPrinter = _.sample(ticketPrinters);
        //Get rid of HTML tags so we can cleanly print the message
        let strippedMessage = formatter.stripHTML(message.lastMessage);

        let wrappedMessage = formatter.wrap(strippedMessage, 48);

        blink(RELAY.in1, LOOP_TIMER / 2)
        setTimeout(() => {
            currentPrinter.execute(wrappedMessage)
        }, LOOP_TIMER / 2)
    } else {
        console.log('no new message')
    }
}, LOOP_TIMER);

let pressLoop = () => {
    let amount = _.random(50, 100)

    let someMessages = fetcher.getSome(amount);

    someMessages.forEach(data => {
        setTimeout(() => {
            const message = data[0].content.rendered;

            //Get rid of HTML tags so we can cleanly print the message
            let strippedMessage = formatter.stripHTML(message)
            // Make sure no words get split when starting a new line
            let wrappedMessage = formatter.wrap(strippedMessage, 48)

            let currentPrinter = _.sample(ticketPrinters);

            currentPrinter.execute(wrappedMessage);


        }, 2000);
    });
}



let main = () => {

    const GPIO_SWITCH = null;

    GPIO_SWITCH.watch((err, value) => {

        if (value == 'HIGH') {
            LOOP_TIMER = 2000;
            pressloop();
        } else {
            LOOP_TIMER = 10000;
            normalLoop();
        }

    })
}



///////////////////////
// Other functions ////
///////////////////////

// Blinking func for the relays
let blink = (relay, timer) => {
    
    //const Gpio = require('../onoff').Gpio; // Gpio class
    // const led = new Gpio(17, 'out');       // Export GPIO17 as an output
    let stopBlinking = false;
    
    // Toggle the state of the LED connected to GPIO17 every 200ms
    const blinkingState = _ => {
        if (stopBlinking) {
            return led.unexport();
        }
        
        relay.read((err, value) => { // Asynchronous read
            if (err) {
                throw err;
            }
            
            relay.write(value ^ 1, err => { // Asynchronous write
                if (err) {
                    throw err;
                }
            });
        });
        
        setTimeout(blinkLed, 200);
    };
    
    // Stop blinking the LED after 5 seconds
    setTimeout(_ => stopBlinking = true, timer);
}

let codesheetTest = async () => {
    let message = await fetcher.getLatest()
    codesheets.forEach(codesheet => {
        setTimeout(() => {

        }, 2000);

        // Get a random printer from our array of available printers
        let currentPrinter = _.sample(ticketPrinters);
        //Get rid of HTML tags so we can cleanly print the message
        let strippedMessage = formatter.stripHTML(message.lastMessage);

        let wrappedMessage = formatter.wrap(strippedMessage, 48);

        let converted = formatter.converter(wrappedMessage)
        try {
            currentPrinter.printRaw(`${formatter.addWhiteSpace(converted)}
            
            
            encoding: ${codesheet}`, codesheet);
        } catch (error) {
            console.error(error);
        }

    })
}
let singleTest = async () => {

    let codesheet = "iso88596";
    let message = await fetcher.getLatest()
    // Get a random printer from our array of available printers
    let currentPrinter = _.sample(ticketPrinters);
    //Get rid of HTML tags so we can cleanly print the message
    let strippedMessage = formatter.stripHTML(message.lastMessage);

    let wrappedMessage = formatter.wrap(strippedMessage, 48);

    let converted = formatter.converter(wrappedMessage)
    currentPrinter.execute(converted);

    //currentPrinter.printFile(file)
}