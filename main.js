import Fetcher from './fetch.js';
import Printer from './printer.js';
import TextFormatter from './textFormatter.js';
import {
    Gpio
} from 'onoff';

import printer from '@thiagoelg/node-printer';
import _ from 'lodash';

import fs from 'fs';
import util from 'util'


let codesheets = [
    "cp437", 
    "cp720", 
    "cp737", 
    "cp775", 
    "cp850", 
    "cp851", 
    "cp852", 
    "cp853", 
    "cp855", 
    "cp857", 
    "cp858", 
    "cp860", 
    "cp861", 
    "cp862", 
    "cp863", 
    "cp864", 
    "cp865", 
    "cp866", 
    "cp869", 
    "cp874", 
    "cp922", 
    "cp1098", 
    "cp1118", 
    "cp1119", 
    "cp1125", 
    "cp2001", 
    "cp3001", 
    "cp3002", 
    "cp3011", 
    "cp3012", 
    "cp3021", 
    "cp3041", 
    "cp3840", 
    "cp3841", 
    "cp3843", 
    "cp3844", 
    "cp3845", 
    "cp3846", 
    "cp3847", 
    "cp3848", 
    "iso885915", 
    "iso88592", 
    "iso88597", 
    "rk1048", 
    "windows1250", 
    "windows1251", 
    "windows1252", 
    "windows1253", 
    "windows1254", 
    "windows1255", 
    "windows1256", 
    "windows1257", 
    "windows1258"];

let fetcher = new Fetcher();
let formatter = new TextFormatter();

let file = fs.readFileSync('./output2.pdf')

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
const LOOP_TIMER = 100000


// GPIO setup

const buttonPin = 4;
const button = new Gpio(buttonPin, 'in', 'both', {
    debounceTimeout: 10
})



////////////////////
// MAIN LOOP ///////
////////////////////

// let main = setInterval(async () => {
//     let message = await fetcher.getLatest()
//     if (message.hasNewMessage == true) {
//         console.log('new message', message.lastMessage);

//         // Get a random printer from our array of available printers
//         let currentPrinter = _.sample(ticketPrinters);
//         //Get rid of HTML tags so we can cleanly print the message
//         let strippedMessage = formatter.stripHTML(message.lastMessage);

//         let wrappedMessage = formatter.wrap(strippedMessage, 48);

//         currentPrinter.printRaw(wrappedMessage)

//     } else {
//         console.log('no new message')
//         //console.log(message);
//     }
// }, LOOP_TIMER);


if (process.platform == 'linux') {
    console.log('watching for GPIO input');
    // Watch for button press to call the wind function
    button.watch((err, value) => {
        console.log('PRESSED!');
        if (err) throw err;
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

    let someMessages = fetcher.getSome(amount);

    someMessages.forEach(data => {
        setTimeout(() => {
            const message = data[0].content.rendered;

            //Get rid of HTML tags so we can cleanly print the message
            let strippedMessage = formatter.stripHTML(message)
            // Make sure no words get split when starting a new line
            let wrappedMessage = formatter.wrap(strippedMessage, 48)

            let currentPrinter = _.sample(ticketPrinters);

            //currentPrinter.printRaw(wrappedMessage);


        }, 2000);
    });
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
        try {
            currentPrinter.printRaw(wrappedMessage, codesheet);
        } catch (error) {
            console.error(error);
        }
    
})}

let singleTest = async () => {

    let codesheet = "iso88596";
    let message = await fetcher.getLatest()
    // Get a random printer from our array of available printers
    let currentPrinter = _.sample(ticketPrinters);
    //Get rid of HTML tags so we can cleanly print the message
    let strippedMessage = formatter.stripHTML(message.lastMessage);

    let wrappedMessage = formatter.wrap(strippedMessage, 48);

    currentPrinter.printRaw(wrappedMessage, codesheet);

    //currentPrinter.printFile(file)
}

singleTest();


//codesheetTest();