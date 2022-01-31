import fetch from 'node-fetch';
//import { fetch } from "node-fetch";

export default class Fetcher {
    constructor(name) {
        this.API_KEY = '9$XA5DqD@tpI';
        this.lastMessage = undefined;
        this.name = name;
        this.hasNewMessage = false;
    }

    async getLatest() {
        //Get JSON from API
        const response = await fetch(`https://www.jemelibere.be/wp-json/wp/v2/story?api_key=${this.API_KEY}`)
        const data = await response.json();

        //Set hasNewMessage bool to false by default before checking
        this.hasNewMessage = false;

        //Get the message out of the JSON
        const message = data[0].content.rendered;
        
        const result = {
            lastMessage: this.lastMessage,
            hasNewMessage: this.hasNewMessage
        }

        if (message != this.lastMessage) {

            // Replace the last message for check
            this.lastMessage = message;

            //Update result object
            result.lastMessage = message;
            result.hasNewMessage = true;

            return result;
        } else {
            return result;
        }
    }


    async getSome(amount){
        const response = await fetch(`https://www.jemelibere.be/wp-json/wp/v2/story?api_key=9$XA5DqD@tpI&per_page=${amount}`);
        const data = await response.json();

        return data;
    }

    async getAll() {

        const response = await fetch('https://www.jemelibere.be/wp-json/wp/v2/story?api_key=9$XA5DqD@tpI');
        const data = await response.json();
        
        return data;
    }

    async getAllTimeFiltered(time){
        
        const response = await fetch('https://www.jemelibere.be/wp-json/wp/v2/story?api_key=9$XA5DqD@tpI');
        const data = await response.json();
        
        return data;
    }
}