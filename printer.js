import {
    printDirect
} from '@thiagoelg/node-printer';
import _ from 'lodash';
import utf8 from 'utf8';
import legacy from 'legacy-encoding';

import EscPosEncoder from 'esc-pos-encoder'

let encoder = new EscPosEncoder();

// import ThermalPrinterEncoder from 'thermal-printer-encoder';

// let encoder = new ThermalPrinterEncoder({
//     language: 'esc/pos'
// });

const PRINTER_NAME = 'BIXOLON_BK3_3'

const INITIAL_PRINTER = '\x1B\x40';
const PAPER_EJECT = '\x1D\x65\x05';
const PAPER_CUTTING = '\x08\x56\x31';

const IMAGE = '\x1C\x70\x01\x00'
const FRENCH_CHAR = '\x1B\x52\x11'




function toUTF8Array(str) {
    let utf8 = [];
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) utf8.push(charcode);
        else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                      0x80 | (charcode & 0x3f));
        }
        else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
        // surrogate pair
        else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff)<<10)
                      | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >>18),
                      0x80 | ((charcode>>12) & 0x3f),
                      0x80 | ((charcode>>6) & 0x3f),
                      0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}


let en = 'iso-8859-1'
const test3 = '\x1B\x74\x04'
//const test3 = toUTF8Array(en);


let testString = ` ' character test << >> … ÀÁÂÏȊ äæéẽëěęḙḛéêèçöṻ c'est « test » & @ ‼ ⁈ '`
// Will get to refactoring later once I know what I need
export default class Printer {
    constructor(printerName) {
        this.name = printerName
    }

    printRaw(text, codesheet) {
        console.log(typeof text);
        let unescaped = _.unescape(text)

        //console.log(unescaped);
        let encodedMsg;
        try {
            encodedMsg = encoder
                //.codepage(codesheet)
                .newline()
                .text(unescaped, "858")
                .text('\n \n \n current codesheet:' + codesheet)
                .encode()

                //console.log(encodedMsg);
        } catch (err) {
            console.error(err);
        }
        console.log(unescaped);
        
        printDirect({
            data: this.prepareData(Buffer.from(unescaped)),
            printer: this.name,
            type: "RAW",
            success: function () {},
            error: function (err) {
                console.log(err);
            }
        });
    }

    prepareData(data) {
        let preparedData = Buffer.from(INITIAL_PRINTER) + Buffer.from(IMAGE) + /* Buffer.from(FRENCH_CHAR) */ + Buffer.from(test_bytes) + Buffer.from(test_bytes2) + Buffer.from(test3) + Buffer.from(data) + Buffer.from(PAPER_CUTTING) + Buffer.from(PAPER_EJECT);
        console.log(preparedData);
        return preparedData;
    }

    applySpecialOptions() {

    }

    printFile(data) {
            printDirect({
                //data: Buffer.from(INITIAL_PRINTER) + Buffer.from(FRENCH_CHAR) + Buffer.from(IMAGE) + Buffer.from(data) + Buffer.from(PAPER_CUTTING) + Buffer.from(PAPER_EJECT),
                data: data,
                printer: this.name,
                type: 'PDF',
                success: function () {},
                error: function (err) {
                    console.error('error on printing: ' + err);
                }
            })
        };
    }
