const nodeprinter = require('@thiagoelg/node-printer')
const PRINTER_NAME = 'BIXOLON_BK3_3'
   

// Will get to refactoring later once I know what I need
class Printer {
    constructor(printerName){
        this.PRINTER_NAME = printerName
    }

    printRaw(text){
        printer.printDirect({
            data:text, 
            printer:this.PRINTER_NAME,
            type: "RAW",
            success:function(){	console.log("printed: "+text);},
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
        nodeprinter.printDirect({
            data:image, 
            printer:PRINTER_NAME,
            type: "JPEG",
            success:function(){	console.log("printed image");},
            error:function(err){console.log(err);}
        });
    }
}    



const printer = new Printer()
module.exports = {printer}