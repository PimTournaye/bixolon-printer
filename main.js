import Fetcher from "./fetch.js";
import Printer from "./printer.js";
import TextFormatter from "./textFormatter.js";
import { Gpio } from "onoff";
import delay from "delay";

import printer from "@thiagoelg/node-printer";
import _ from "lodash";

//import { Board, Relay, Switch} from 'johnny-five'
import j5pkg from 'johnny-five';
const { Board, Relay, Switch, Led} = j5pkg;
//import {Board, Led, Switch} from 'johnny-five'

import IOpkg from 'raspi-io';
const {Raspi, RaspiIO} = IOpkg;
const board = new Board({
  io: new RaspiIO()
});


let fetcher = new Fetcher();
let formatter = new TextFormatter();

/////////////////
// SETUP ////////
/////////////////

// Printers setup
let ticketPrinters = [];
let printerID = 0;

// Put all Bixolon printers in an array
printer.getPrinters().forEach((element) => {
  let name = element.name;
  if (name.includes("BIXOLON")) {
    ticketPrinters.push({
      ticketPrinter: element,
      ID: printerID,
    });
    printerID++;
  } else console.log("skipping non-bixolon printer");
});

console.log(ticketPrinters);

let tempPrinterArray = [];

// Make Printer objects for each element in the array
ticketPrinters.forEach((element) => {
  let printer = new Printer(element.ticketPrinter.name);
  tempPrinterArray.push(printer);
});

// Replace our list of printers with the correct objects
ticketPrinters = tempPrinterArray;

// Important variables
let LOOP_TIMER = 10000;
let fakeCounter = 0;
let fakeThreshold = 15;
let pressState = false;

/////////////////////
// GPIO setup ///////
/////////////////////

// Johnny-five
const GPIO_SWITCH = new Switch('GPIO4');
const RELAY = {
    in1: new Led('GPIO26', 'out'),
    in2: new Led('GPIO19', 'out'),
    in3: new Led('GPIO13', 'out'),
    in4: new Led('GPIO6', 'out'),
    in5: new Led('GPIO5', 'out'),
    in6: new Led('GPIO22', 'out'),
    in7: new Led('GPIO27', 'out'),
    in8: new Led('GPIO17', 'out'),
}

 // ONOFF package
// const GPIO_SWITCH = new Gpio(4, 'in', 'both');
// const RELAY = {
//     in1: new Gpio('GPIO26', 'out'),
//     in2: new Gpio('GPIO19', 'out'),
//     in3: new Gpio('GPIO13', 'out'),
//     in4: new Gpio('GPIO6', 'out'),
//     in5: new Gpio('GPIO5', 'out'),
//     in6: new Gpio('GPIO22', 'out'),
//     in7: new Gpio('GPIO27', 'out'),
//     in8: new Gpio('GPIO17', 'out'),
// }

////////////////////
// MAIN LOOP ///////
////////////////////

let normalMode = async () => {
  // Get last message
  let message = await fetcher.getLatest();
  // Get some of the past messages just to be sure
  let pastMessages = await fetcher.getSome(50);
  // Get a random printer from our array of available printers
  let currentPrinter = _.sample(ticketPrinters);

  // Check if it's a new message
  if (message.hasNewMessage == true) {
    console.log("new message");

    //Get rid of HTML tags so we can cleanly print the message
    let strippedMessage = formatter.stripHTML(message.lastMessage);
    // Wrap the message so it doesn't split words on the ticket
    let wrappedMessage = formatter.wrap(strippedMessage, 48);

    for (const key in RELAY) {
        const relay = RELAY[key];
        blink(relay, LOOP_TIMER / 2)
    }
    // Print the message with a bit of a delay
    setTimeout(() => {
      //currentPrinter.execute(wrappedMessage);
      console.log('normal print with timeout');
    }, LOOP_TIMER)

    console.log('normal printed');
    // reset the fake counter
    fakeCounter = 0;
  } else if (fakeCounter == fakeThreshold) {
    let fakeMessage = _.sample(pastMessages);
    let content = fakeMessage.content.rendered;

    // Beginning formatting
    content = formatter.stripHTML(content);
    content = formatter.wrap(content);

    //Send to printer
    currentPrinter.execute(content);
    console.log('reached treshold');
    fakeCounter = 0;
  } else {
    fakeCounter++;
    console.log("no new message");
  }
};
// Loop for when there is press, also know as FAST MODE
let fastMode = async () => {
  // Set a random amount
  let amount = _.random(50, 100);

  // Get that amount of messages from the API
  let someMessages = await fetcher.getSome(amount);

  //Break the cycle if needed
  if (!pressState) return;
  // Check for boolean to commence with the main loop
  if (pressState == true) {
    someMessages.forEach((data, i) => {
      setTimeout(() => {
        // Get the content out of the object
        const message = data.content.rendered;

        //Get rid of HTML tags so we can cleanly print the message
        let strippedMessage = formatter.stripHTML(message);
        // Make sure no words get split when starting a new line
        let wrappedMessage = formatter.wrap(strippedMessage, 48);

        // Get a random printer
        let currentPrinter = _.sample(ticketPrinters);

        for (const key in RELAY) {
            const element = RELAY[key];
            blink(element, LOOP_TIMER / 2)
          }
        
        // Print the message
        //currentPrinter.execute(wrappedMessage)
        console.log("printed", i);
      }, LOOP_TIMER * i);
    });
  }
};

let main = async () => {
  console.log('starting main');
  blink(RELAY.in1, 2000)
  GPIO_SWITCH.watch( async(err, value) => {
    console.log(value);
    if (value == 1) {
      LOOP_TIMER = 2000;
      pressState = true;
      await fastMode();
    } else {
      LOOP_TIMER = 10000;
      pressState = false;
      setInterval(async()=>{
        await normalMode();
      }, LOOP_TIMER)
    }
  });
};

///////////////////////
// Other functions ////
///////////////////////

// Blinking func for the relays
let blink = (relay, timer) => {
  //const Gpio = require('../onoff').Gpio; // Gpio class
  // const led = new Gpio(17, 'out');       // Export GPIO17 as an output
  let stopBlinking = false;

  // Toggle the state of the connected GPIO every 200ms
  const blinkingState = (_) => {
    if (stopBlinking) {
      console.log("stop the blinking of", relay);
      return led.unexport();
    }

    relay.read((err, value) => {
      console.log(value);
      // Asynchronous read
      if (err) {
        throw err;
      }

      relay.write(value ^ 1, (err) => {
        // Asynchronous write
        console.log("blink!");
        if (err) {
          throw err;
        }
      });
    });

    setTimeout(blinkingState, 200);
  };
  // Stop blinking the LED after 5 seconds
  setTimeout((_) => (stopBlinking = true), timer);
};

let singleTest = async () => {
  let codesheet = "iso88596";
  let message = await fetcher.getLatest();
  // Get a random printer from our array of available printers
  let currentPrinter = _.sample(ticketPrinters);
  //Get rid of HTML tags so we can cleanly print the message
  let strippedMessage = formatter.stripHTML(message.lastMessage);

  let wrappedMessage = formatter.wrap(strippedMessage, 48);

  let converted = formatter.converter(wrappedMessage);
  currentPrinter.execute(converted);

  //currentPrinter.printFile(file)
};

let relayBlink = (interval) => setInterval(() => {
  for (const key in RELAY) {
    const element = RELAY[key];
    element.blink(500);
}
}, interval);


board.on("ready", async () => {
  const spdt = new Switch('GPIO4');
  const led = new Led('GPIO26');
  
  spdt.on("open", () => await fastMode());
  spdt.on("close", () => await normalMode());
});
//main();
