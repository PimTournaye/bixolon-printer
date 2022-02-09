import Fetcher from './fetch.js';
import Printer from './printer.js';
import TextFormatter from './textFormatter.js';
import {
    Gpio
} from 'onoff';

import printer from '@thiagoelg/node-printer';
import _ from 'lodash';

import fs from 'fs';


let codesheets = ["cp367", "cp437", "cp737", "cp775", "cp808", "cp819", "cp850", "cp852", "cp855", "cp856", "cp857", "cp858", "cp860", "cp861", "cp862", "cp863", "cp864", "cp865", "cp866", "cp869", "cp874", "cp922", "cp932", "cp936", "cp949", "cp950", "iso-2022-jp", "iso-2022-jp-1", "iso-8859-1", "iso-8859-11", "iso-8859-15", "iso-8859-2", "iso-8859-3", "iso-8859-4", "iso-8859-5", "iso-8859-6", "iso-8859-6-e", "iso-8859-6-i", "iso-8859-7", "iso-8859-8", "iso-8859-8-e", "iso-8859-8-i", "iso-8859-9", "iso-ir-100", "iso-ir-101", "iso-ir-109", "iso-ir-110", "iso-ir-126", "iso-ir-127", "iso-ir-138", "iso-ir-144", "iso-ir-148", "iso2022jp", "iso646.irv", "iso646cn", "iso646jp", "iso646us", "iso8859-1", "iso8859-11", "iso8859-15", "iso8859-2", "iso8859-3", "iso8859-4", "iso8859-5", "iso8859-6", "iso8859-7", "iso8859-8", "iso8859-9", "iso88591", "iso885910", "iso885911", "iso885913", "iso885914", "iso885915", "iso885916", "iso88592", "iso88593", "iso88594", "iso88595", "iso88596", "iso88597", "iso88598", "iso88599", "iso_8859-1", "iso_8859-15", "iso_8859-1:1987", "iso_8859-2", "iso_8859-2:1987", "iso_8859-3", "iso_8859-3:1988", "iso_8859-4", "iso_8859-4:1988", "iso_8859-5", "iso_8859-5:1988", "iso_8859-6", "iso_8859-6:1987", "iso_8859-7", "iso_8859-7:1987", "iso_8859-8", "iso_8859-8:1988", "iso_8859-9", "iso_8859-9:1989", "unicode", "unicode11utf8", "us", "us-ascii", "usascii", "utf-16le", "utf16", "utf16be", "utf16le", "utf7", "utf7imap", "utf8"];

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


// GPIO setup

// const buttonPin = 4;
// const button = new Gpio(buttonPin, 'in', 'both', {
//     debounceTimeout: 10
// })



////////////////////
// MAIN LOOP ///////
////////////////////

let normalState = setInterval(async () => {
    let message = await fetcher.getLatest()
    if (message.hasNewMessage == true) {
        console.log('new message', message.lastMessage);

        // Get a random printer from our array of available printers
        let currentPrinter = _.sample(ticketPrinters);
        //Get rid of HTML tags so we can cleanly print the message
        let strippedMessage = formatter.stripHTML(message.lastMessage);

        let wrappedMessage = formatter.wrap(strippedMessage, 48);

        currentPrinter.execute(wrappedMessage)

    } else {
        console.log('no new message')
        //console.log(message);
    }
}, LOOP_TIMER);

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
    
        let converted = formatter.converter(wrappedMessage)
        try {
            currentPrinter.printRaw(`${formatter.addWhiteSpace(converted)}
            
            
            encoding: ${codesheet}`, codesheet);
        } catch (error) {
            console.error(error);
        }
    
})}
const TEST = "Etant pensionnée, je n&rsquo;ai pas vécu de souci par rapport à une vie professionnelle. Par contre, j&rsquo;ai 3 choses à dire sur le plan de mon expérience. Je suis « aidant proche » à 2 égards: primo, je m&rsquo;occupe de ma tante (pas d&rsquo;enfants, 90 ans) en résidence service. L&rsquo;isolement y est extrême, son moral et son état physique se détériorent à vive allure. Secundo: j&rsquo;ai un fils de 39 ans, souffrant d&rsquo;une maladie psychique grave et invalidante. Le contexte a aggravé sa solitude et son moral. Je suis fort sollicitée à cet égard. Et enfin, je suis présidente d&rsquo;une association de familles ayant un proche atteint de troubles psychiques. Il s&rsquo;agit de Similes Wallonie: nous avons des groupes de parole et je peux vous dire que les constats concernant les usagers en santé mentale sont graves: difficultés d&rsquo;hospitalisation, diminution des liens sociaux, via les clubs thérapeutiques, manque d&rsquo;activités, rechutes etc etc. Les parents sont dans de graves difficultés supplémentaires à cause de la pandémie. Et cela me touche car j&rsquo;ai une grande partie de ma vie qui est consacrée à toutes ces personnes."

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

//singleTest();


//codesheetTest();