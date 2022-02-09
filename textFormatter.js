export default class TextFormatter {
    constructor(text){
        this.text = text;
    }

    stripHTML(text){

        let strippedString = text.replace(/(<([^>]+)>)/gi, "");
        let extra = strippedString.replace(/&rsquo;/g,`'`);


        return extra;
    }

    wrap(text, lineWidth){
        let message = text.replace(new RegExp(`(?![^\\n]{1,${lineWidth}}$)([^\\n]{1,${lineWidth}})\\s`, 'g'), '$1\n')
        return message;
    }

    addWhiteSpace(text){
        let spaced = '\n \n \n' + text + '\n \n \n';
        return spaced
    }

    converter(text){
        let first = text.replace(new RegExp("([é])\w+/g"), Buffer.from('\x08\x02'));

        return first;
    }

    apostrophe(text){
        let message = text.replace(new RegExp(`(\‘\’\‛\❜\❛\'\′\❜\❛\＇)w+`, 'g'), `'`);
        return message;
    }
}