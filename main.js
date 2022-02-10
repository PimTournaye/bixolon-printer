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
});

// Replace our list of printers with the correct objects
ticketPrinters = tempPrinterArray;

// Important variables
const FAST_TIMER = 10000;
const NORMAL_TIMER = 10000;
let fakeCounter = 0;
let fakeThreshold = 6;
let pressState = false;

/////////////////////
// GPIO setup ///////
/////////////////////

// Johnny-five
const GPIO_SWITCH = new Switch("GPIO4");
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
  // Initialize variable for later
  let normalBlink;
  // Check if it's a new message
  if (message.hasNewMessage == true) {
    console.log("new message");

    //Get rid of HTML tags so we can cleanly print the message
    let strippedMessage = formatter.stripHTML(message.lastMessage);
    // Wrap the message so it doesn't split words on the ticket
    let wrappedMessage = formatter.wrap(strippedMessage, 48);

    // Blink the relays
    normalBlink = relayBlink(500);
    // Print the message with a bit of a delay
    setTimeout(() => {
      //currentPrinter.execute(wrappedMessage);
      console.log("normal print with timeout");
    }, LOOP_TIMER);

    console.log("normal printed");
    // reset the fake counter
    fakeCounter = 0;
  } else if (fakeCounter == fakeThreshold) {
    let fakeMessage = _.sample(pastMessages);
    let content = fakeMessage.content.rendered;

    // Beginning formatting
    content = formatter.stripHTML(content);
    content = formatter.wrap(content);

    // Blink the relays

    //Send to printer
    currentPrinter.execute(content);
    console.log("reached treshold");
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
  let blinkFast;
  // Get that amount of messages from the API
  let someMessages = await fetcher.getSome(amount);

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

      blinkFast = relayBlink(2000);

      // Print the message
      //currentPrinter.execute(wrappedMessage)
      console.log("printed", i);
    }, LOOP_TIMER * i);
  });
  clearInterval(blinkFast);
};

///////////////////////
// Other functions ////
///////////////////////

// Blinking func for the relays

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
};

let relayBlink = (interval) =>
  setInterval(() => {
    for (const key in RELAY) {
      const element = RELAY[key];
      element.blink(500);
    }
  }, interval);


/////////////////
/// MAIN LOOP ///
/////////////////

board.on("ready", async () => {
  const modeSwitch = new Switch("GPIO4");

  modeSwitch.on("open", async () => await fastMode()); // test to see if
  modeSwitch.on("close", async () => await normalMode()); // test to see if we need an interval and a clear afterwards
});
