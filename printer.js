const nodeprinter = require('@thiagoelg/node-printer')
const PRINTER_NAME = 'BIXOLON_BK3_3'
   

// Will get to refactoring later once I know what I need
module.exports = class Printer {
    constructor(printerName){
        this.name = printerName
    }

    printRaw(text){
        nodeprinter.printDirect({
            data:text, 
            printer:this.name,
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