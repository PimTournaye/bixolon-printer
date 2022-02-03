import { printDirect } from '@thiagoelg/node-printer';
const PRINTER_NAME = 'BIXOLON_BK3_3'


const INITIAL_PRINTER = '\x1B\x40';
const PAPER_EJECT = '\x1D\x65\x05';
const PAPER_CUTTING = '\x08\x56\x31';

const IMAGE = '\x1C\x70\x01\x00'
const FRENCH_CHAR = '\x1B\x52\x01'

// Will get to refactoring later once I know what I need
export default class Printer {
    constructor(printerName){
        this.name = printerName
    }

    printRaw(text){
        console.log(typeof text);
        let modifiedText = "\n \n" + text + "\n \n \n \n" 
        console.log(typeof Buffer.from(modifiedText), Buffer.from(modifiedText));
        console.log(typeof this.name, this.name);
        printDirect({
            //data: Buffer.from(INITIAL_PRINTER).toString() + Buffer.from(modifiedText).toString() + Buffer.from(PAPER_CUTTING).toString() + Buffer.from(PAPER_EJECT).toString(), 
            data: Buffer.from(INITIAL_PRINTER) + Buffer.from(IMAGE) + Buffer.from(FRENCH_CHAR) + Buffer.from(modifiedText) + Buffer.from(PAPER_CUTTING) + Buffer.from(PAPER_EJECT), 
            printer:this.name,
            type: "RAW",
            success:function(){	console.log("printed: \n"+text + '\n \n');},
            error:function(err){console.log(err);}
        });
    }

    printBlank(amount){
        let blank = ''
        for (let i = 0; i <= amount; i++) {
            blank += '\n';
        }
        this.printRaw(blank);
    }

    printImage(image){
        printDirect({
            data:image, 
            printer:PRINTER_NAME,
            type: "JPEG",
            success:function(){	console.log("printed image");},
            error:function(err){console.log(err);}
        });
    }

    print(data){
        printDirect({
            data: Buffer.from(INITIAL_PRINTER) + Buffer.from(data) + Buffer.from(PAPER_CUTTING) + Buffer.from(PAPER_EJECT) , 
            printer:this.name,
            type: "RAW",
            success:function(){	console.log("printed: \n"+text + '\n \n');},
            error:function(err){console.log(err);}
        });
    }

    prepareData(data){

    }

    applySpecialOptions(){

    }
}    