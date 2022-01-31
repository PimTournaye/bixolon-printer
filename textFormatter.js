export default class TextFormatter {
    constructor(text){
        this.text = text;
    }

    stripHTML(text){
        let strippedString = text.replace(/(<([^>]+)>)/gi, "");
        return strippedString;
    }

    wrap(text, lineWidth){
        let message = text.replace(new RegExp(`(?![^\\n]{1,${lineWidth}}$)([^\\n]{1,${lineWidth}})\\s`, 'g'), '$1\n')
        return message;
    }
}