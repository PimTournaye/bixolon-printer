const nodeprinter = require('@thiagoelg/node-printer')
const PRINTER_NAME = 'BIXOLON_BK3_3'
   
String.prototype.toBytes = function (){
    var arr = [];
    for (var i = 0; i < this.length; i++) {
    arr.push(this[i].charCodeAt(0))
    }
    return arr;
    };


const INITIAL_PRINTER = '\x1B\x40';
const PAPER_EJECT = '\x1D\x65\x05';

const PAPER_CUTTING = '\x08\x56\x31';
//const PAPER_EJECT = '\29\101\5';

// Will get to refactoring later once I know what I need
module.exports = class Printer {
    constructor(printerName){
        this.name = printerName
    }

    printRaw(text){
        let modifiedText = '\n \n' + text + "\n \n \n \n" 
        
        nodeprinter.printDirect({
            data: Buffer.from(INITIAL_PRINTER) + Buffer.from(modifiedText) + Buffer.from(PAPER_CUTTING) + Buffer.from(PAPER_EJECT) , 
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
        nodeprinter.printDirect({
            data:image, 
            printer:PRINTER_NAME,
            type: "JPEG",
            success:function(){	console.log("printed image");},
            error:function(err){console.log(err);}
        });
    }

    print(data){
        nodeprinter.printDirect({
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