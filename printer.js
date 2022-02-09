import {
    printDirect
} from '@thiagoelg/node-printer';
import _ from 'lodash';

import TextFormatter from './textFormatter.js';
import ThermalPrinter from 'node-thermal-printer'



let formatter = new TextFormatter();

const PRINTER_NAME = 'BIXOLON_BK3_3';

const INITIAL_PRINTER = '\x1B\x40';
const PAPER_EJECT = '\x1D\x65\x05';
const PAPER_CUTTING = '\x08\x56\x31';

const IMAGE = '\x1C\x70\x01\x00'
const FRENCH_CHAR = '\x1B\x52\x11'

let CODES = {
    CODE_PAGE_PC437_USA             : Buffer.from([0x1b, 0x74, 0]),
  CODE_PAGE_PC850_MULTILINGUAL    : Buffer.from([0x1b, 0x74, 2]),
  CODE_PAGE_PC860_PORTUGUESE      : Buffer.from([0x1b, 0x74, 3]),
  CODE_PAGE_PC863_CANADIAN_FRENCH : Buffer.from([0x1b, 0x74, 4]),
  CODE_PAGE_PC851_GREEK           : Buffer.from([0x1b, 0x74, 11]),
  CODE_PAGE_PC853_TURKISH         : Buffer.from([0x1b, 0x74, 12]),
  CODE_PAGE_PC857_TURKISH         : Buffer.from([0x1b, 0x74, 13]),
  CODE_PAGE_PC737_GREEK           : Buffer.from([0x1b, 0x74, 14]),
  CODE_PAGE_ISO8859_7_GREEK       : Buffer.from([0x1b, 0x74, 15]),
  CODE_PAGE_WPC1252               : Buffer.from([0x1b, 0x74, 16]),
  CODE_PAGE_PC866_CYRILLIC2       : Buffer.from([0x1b, 0x74, 17]),
  CODE_PAGE_PC852_LATIN2          : Buffer.from([0x1b, 0x74, 18]),
  CODE_PAGE_PC858_EURO            : Buffer.from([0x1b, 0x74, 19]),
  CODE_PAGE_PC855_CYRILLIC        : Buffer.from([0x1b, 0x74, 34]),
  CODE_PAGE_PC861_ICELANDIC       : Buffer.from([0x1b, 0x74, 35]),
  CODE_PAGE_ISO8859_2_LATIN2      : Buffer.from([0x1b, 0x74, 39]),
  CODE_PAGE_ISO8859_15_LATIN9     : Buffer.from([0x1b, 0x74, 40]),
  CODE_PAGE_PC1118_LITHUANIAN     : Buffer.from([0x1b, 0x74, 42]),
  CODE_PAGE_PC1119_LITHUANIAN     : Buffer.from([0x1b, 0x74, 43]),
  CODE_PAGE_PC1125_UKRANIAN       : Buffer.from([0x1b, 0x74, 44]),
  CODE_PAGE_WPC1250_LATIN2        : Buffer.from([0x1b, 0x74, 45]),
  CODE_PAGE_WPC1251_CYRILLIC      : Buffer.from([0x1b, 0x74, 46]),
  CODE_PAGE_WPC1253_GREEK         : Buffer.from([0x1b, 0x74, 47]),
  CODE_PAGE_WPC1254_TURKISH       : Buffer.from([0x1b, 0x74, 48]),
  CODE_PAGE_WPC1255_HEBREW        : Buffer.from([0x1b, 0x74, 49]),
  CODE_PAGE_WPC1256_ARABIC        : Buffer.from([0x1b, 0x74, 50]),
  CODE_PAGE_WPC1257_BALTIC_RIM    : Buffer.from([0x1b, 0x74, 51]),
  CODE_FRENCH : Buffer.from([0x1b, 0x55, 11])
}


// Will get to refactoring later once I know what I need
export default class Printer {
    constructor(printerName) {
        this.name = printerName
    }

    execute(text){
        let epsonThermalPrinter = new ThermalPrinter.printer({
            type: ThermalPrinter.types.EPSON,
            width: 48,
            characterSet: 'PC437_USA',
            removeSpecialCharacters: false,
            lineCharacter: "-",
        });

        let formatted = formatter.addWhiteSpace(text);
        formatted = formatter.stripHTML(formatted);

        epsonThermalPrinter.append(INITIAL_PRINTER);
        epsonThermalPrinter.append(IMAGE);
        
        epsonThermalPrinter.println(formatted);
        epsonThermalPrinter.newLine();

        epsonThermalPrinter.append(PAPER_CUTTING);
        epsonThermalPrinter.append(PAPER_EJECT);
    
        printDirect({
            data: epsonThermalPrinter.getBuffer(),
            printer: PRINTER_NAME,
            type: 'RAW',
            success: function (jobID) {
                console.log(`printer job: ${jobID}`);
                epsonThermalPrinter.clear();
            },
            error: function (err) {
                console.log(err);
            }
        })
    }

    

    printRaw(text) {
        let unescaped = _.unescape(text)

        unescaped = formatter.addWhiteSpace(unescaped);

        for (const key in CODES) {
                const element = CODES[key];
                
                printDirect({
                    data: this.prepareData(unescaped, element),
                    printer: this.name,
                    type: "RAW",
                    success: function () {},
                    error: function (err) {
                        console.log(err);
                    }
                });
            };
        };

    prepareData(data, codepage) {

        let preparedData = Buffer.from(INITIAL_PRINTER) + Buffer.from(IMAGE) + Buffer.from(codepage) + Buffer.from(data) + Buffer.from(`\n\n${codepage}`) + Buffer.from(PAPER_CUTTING) + Buffer.from(PAPER_EJECT);
        console.log("preparedData: ", preparedData);
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
