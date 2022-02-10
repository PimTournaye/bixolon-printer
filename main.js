import Fetcher from "./fetch.js";
import Printer from "./printer.js";
import TextFormatter from "./textFormatter.js";
import { Gpio } from "onoff";
import delay from "delay";

import printer from "@thiagoelg/node-printer";
import _ from "lodash";

import j5pkg from "johnny-five";
const { Board, Relay, Switch, Led } = j5pkg;

import IOpkg from "raspi-io";
const { Raspi, RaspiIO } = IOpkg;

//////////////////////
// BIG SETUP /////////
//////////////////////

// Setup GPIO for Raspberry Pi
const board = new Board({
  io: new RaspiIO(),
});

// Making objects
let fetcher = new Fetcher();
let formatter = new TextFormatter();

///////////////////////////
// PRINTERS SETUP /////////
///////////////////////////

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
  //printer.execute('test')
});

// Replace our list of printers with the correct objects
ticketPrinters = tempPrinterArray;

/////////////////////////
// IMPORTANT VARIABLES //
/////////////////////////

// Timer for how long it takes to print any messgae while in fastmode (in milliseconds)
const FAST_TIMER = 10000;
// Timer for how long it takes to check for a message while in normal mode (in milliseconds)
const NORMAL_TIMER = 10000;

// Init counter
let fakeCounter = 0;
// Amount of times it takes to print an old message after there hasn't been a new one
let fakeThreshold = 6;

// Counter for the wind function (all printers at once)
let windCounter = 0;
// Threshold to trigger wind
let windThreshold = 10;


// Init to check if fastmode is interrupted
let cancelled;

// Amount of time a blink of the light will take
let relayNormalLength = NORMAL_TIMER / 20;
// Amount of times the lights will blink
let relayNormalAmount = 4;

/////////////////////
// GPIO setup ///////
/////////////////////

// Johnny-five
const RELAY = {
  in1: new Led("GPIO26", "out"),
  in2: new Led("GPIO19", "out"),
  in3: new Led("GPIO13", "out"),
  in4: new Led("GPIO6", "out"),
  in5: new Led("GPIO5", "out"),
  in6: new Led("GPIO22", "out"),
  in7: new Led("GPIO27", "out"),
  in8: new Led("GPIO17", "out"),
};

/////////////////////////
// MAIN FUCNTIONS ///////
/////////////////////////

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

    // Blink the relays
    //normalBlink = relayBlink(500);

    blinker(NORMAL_TIMER / 20, 4);
    // Print the message with a bit of a delay
    setTimeout(() => {
      currentPrinter.execute(wrappedMessage);
      console.log("normal print with timeout");
    }, NORMAL_TIMER);
    setTimeout(() => {
      //clearInterval(normalBlink);

    }, NORMAL_TIMER - 200);
    // reset the fake counter
    fakeCounter = 0;

    // If fake threshold is met, print an old message
  } else if (fakeCounter == fakeThreshold) {
    let fakeMessage = _.sample(pastMessages);
    let content = fakeMessage.content.rendered;

    // Beginning formatting
    let strippedContent = formatter.stripHTML(content);
    let wrappedContent = formatter.wrap(strippedContent, 48);

    // Blink the relays
    blinker(relayNormalLength, relayNormalAmount);
    //Send to printer
    currentPrinter.execute(wrappedContent);
    console.log("reached treshold");
    fakeCounter = 0;
  } else {
    fakeCounter++;
    console.log("no new message");
  }
};
// Loop for when there is press, also know as FAST MODE
let fastMode = async () => {

  cancelled = false;
  // Set a random amount
  let amount = _.random(50, 100);
  // Get that amount of messages from the API
  let someMessages = await fetcher.getSome(amount);
  console.log(cancelled);
  if (!cancelled) {
    console.log('commencing with fast mode');
    someMessages.forEach((data, i) => {

      console.log(cancelled);
      setTimeout(() => {
        console.log('windCounter:', windCounter);
        if (windCounter == windThreshold - 1) {
          console.log('starting wind');
          wind();
          windCounter = 0;
        } else {
          // if (cancelled == true) {
          //   console.log('stopping ongoing fastmode');
          //   return;
          // };

          // Get the content out of the object
          const message = data.content.rendered;

          //Get rid of HTML tags so we can cleanly print the message
          let strippedMessage = formatter.stripHTML(message);
          // Make sure no words get split when starting a new line
          let wrappedMessage = formatter.wrap(strippedMessage, 48);
          // Get a random printer
          let currentPrinter = _.sample(ticketPrinters);

          blinker(FAST_TIMER / 32, 1)

          // Print the message
          currentPrinter.execute(wrappedMessage)

          console.log("ticket #", i);
          windCounter++
        }
      }, FAST_TIMER * i);
    })
  };
  cancelled = true;
};

///////////////////////
// Other functions ////
///////////////////////

// Blinking func for the relays
let blinker = (timer, times) => {
  for (let i = 0; i <= times; i++) {
    setTimeout(() => {
      for (const key in RELAY) {
        let jitter = _.random(20, 300)
        const relay = RELAY[key];
        setTimeout(() => {
          relay.on();

        }, jitter);
      }
    }, timer * i);
    setTimeout(() => {
      for (const key in RELAY) {
        let jitter = _.random(20, 300)
        const relay = RELAY[key];
        setTimeout(() => {
          relay.off()
        }, jitter);
      }
    }, (timer * i + (timer / 2)));
  }
}

let wind = async () => {
  let amount = 9;
  let i = 0;
  let someMessages = await fetcher.getSome(amount);

  let oneMessage = _.sample(someMessages);

  ticketPrinters.forEach((printer) => {
    let data = oneMessage.content.rendered

    //Get rid of HTML tags so we can cleanly print the message
    let strippedMessage = formatter.stripHTML(data);
    // Make sure no words get split when starting a new line
    let wrappedMessage = formatter.wrap(strippedMessage, 48);

    printer.execute(wrappedMessage);
    i++;
  })
};
/////////////////
/// MAIN LOOP ///
/////////////////

board.on("ready", async () => {
  const modeSwitch = new Switch("GPIO4");
  let loop;
  let fast;

  modeSwitch.on("open", async () => {
    console.log('switching to fast mode');
    // Stop normal mode interval
    clearInterval(loop)
    fast = await fastMode();
  });

  modeSwitch.on("close", async () => {
    console.log("switching to normal mode");
    cancelled = true;
    // Stop fastMode, even if it's the middle of something
    //clearInterval(fastMode) this needs a fix

    // Repeat the normalMode function at a set interval
    loop = setInterval(async () => {
      await normalMode();
    }, NORMAL_TIMER);

  }
  )
})
