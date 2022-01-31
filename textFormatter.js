export default class TextFormatter {
    constructor(text){
        this.text = text;
    }

    stripHTML(text){
        let strippedString = text.replace(/(<([^>]+)>)/gi, "");
        return strippedString;
    }
}