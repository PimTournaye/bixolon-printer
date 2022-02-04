import {
    printDirect
} from '@thiagoelg/node-printer';
import _ from 'lodash';
import utf8 from 'utf8';
import legacy from 'legacy-encoding';

const PRINTER_NAME = 'BIXOLON_BK3_3'

const toAscii = (string) => string.split('').map(char=>char.charCodeAt(0)).join(" ")


const INITIAL_PRINTER = '\x1B\x40';
const PAPER_EJECT = '\x1D\x65\x05';
const PAPER_CUTTING = '\x08\x56\x31';

const IMAGE = '\x1C\x70\x01\x00'
const FRENCH_CHAR = '\x1B\x52\x11'
//const FRENCH_CHAR = 'ESC R 1'

let testString = ` ' character test << >> … ÀÁÂÏȊ äæéẽëěęḙḛéêèçöṻ c'est « test » & @ ‼ ⁈ '`
// Will get to refactoring later once I know what I need
export default class Printer {
    constructor(printerName) {
        this.name = printerName
    }

    printRaw(text) {
        console.log(typeof text);
        let modifiedText = "\n \n" + text + "\n \n \n \n"
        let unescaped = _.unescape(modifiedText)

        console.log(unescaped);
        
        printDirect({
            data: this.prepareData(unescaped),
            printer: this.name,
            type: "RAW",
            success: function () {},
            error: function (err) {
                console.log(err);
            }
        });
    }

    prepareData(data) {
        //let test = legacy.encode(data)
        let preparedData = Buffer.from(INITIAL_PRINTER) + Buffer.from(IMAGE) + Buffer.from(FRENCH_CHAR) + Buffer.from(data, "binary") + Buffer.from(PAPER_CUTTING) + Buffer.from(PAPER_EJECT);
        return preparedData;
    }

    applySpecialOptions() {

    }

    printFile(data) {
            printDirect({
                //data: Buffer.from(INITIAL_PRINTER) + Buffer.from(FRENCH_CHAR) + Buffer.from(IMAGE) + Buffer.from(data) + Buffer.from(PAPER_CUTTING) + Buffer.from(PAPER_EJECT),
                data: Buffer.from(data)+ Buffer.from(PAPER_CUTTING) + Buffer.from(PAPER_EJECT),
                printer: this.name,
                type: 'PDF',
                success: function () {},
                error: function (err) {
                    console.error('error on printing: ' + err);
                }
            })
        };
    }
