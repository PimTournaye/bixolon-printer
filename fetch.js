import fetch from "node-fetch";


module.exports = class Fetcher {

    constructor() {
        this.API_KEY = '9$XA5DqD@tpI';
        this.lastMessage = undefined;

    }

    getLatest() {
        //Get JSON from API
        const response = await fetch('https://www.jemelibere.be/wp-json/wp/v2/story?api_key=9$XA5DqD@tpI');
        const data = await response.json();

        //Get the message out of the JSON
        const message = data[0].content.rendered;

        if (message != this.lastMessage) {
            // Replace the last message for check
            this.lastMessage = message;
            return lastMessage;
        }

    }


    getSome(amount){
        const response = await fetch('https://www.jemelibere.be/wp-json/wp/v2/story?api_key=9$XA5DqD@tpI');
        const data = await response.json();

        return data;
    }

    getAll() {

        const response = await fetch('https://www.jemelibere.be/wp-json/wp/v2/story?api_key=9$XA5DqD@tpI');
        const data = await response.json();
        
        return data;
    }

    getAllTimeFiltered(time){
        
        const response = await fetch('https://www.jemelibere.be/wp-json/wp/v2/story?api_key=9$XA5DqD@tpI');
        const data = await response.json();
        
        return data;
    }
}