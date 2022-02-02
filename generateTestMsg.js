import {faker} from "@faker-js/faker";
import _ from 'lodash';
import fetch from 'node-fetch';

console.log(faker);

faker.locale = 'fr_BE';

for (let i = 0; i <= 50; i++) {
    console.log('loop', i);
    let phrase = faker.hacker.phrase();
    let lorem = faker.lorem.paragraph();
    let desc = faker.commerce.productDescription();

    let choices = [
        phrase,
        lorem,
        desc
    ];
    let choice = _.sample(choices);

    const body = {
        'testimony': choice,
        'parent': 324,
        'testimony-nonce': '07de2874bc'
    };

    const response = await fetch('https://www.jemelibere.be/wp-json/routes/testimony', {
        method: 'post',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    const data = await response.json();

    console.log(data);
}