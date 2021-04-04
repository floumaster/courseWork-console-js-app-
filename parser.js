const fetch = require('node-fetch');
const moment = require('moment');
var DomParser = require('dom-parser');
const fs = require("fs");
var parser = new DomParser();

async function sendRecuest(url) {
    return fetch(url).then(data => data.text())
}

const obj = {
    async parse() {
        const requestUrl = 'https://randomus.ru/name?type=0&sex=0&count=100';
        let _data = {};
        let name = [];
        let surnames = [];
        let patr = [];
        await sendRecuest(requestUrl).then(data => {
            const names = data.substring(data.indexOf('data-numbers') + 14, data.indexOf('>', data.indexOf('<textarea id="result_textarea"')) - 1);
            const arr = names.split(',');
            for (let i = 0; i < arr.length; i++) {
                name.push(arr[i].split(' ')[1]);
                surnames.push(arr[i].split(' ')[0]);
                patr.push(arr[i].split(' ')[2]);
            }
            _data['name'] = name;
            _data['surname'] = surnames;
            _data['patronymic'] = patr;
        });
        return _data;
    },
    async parse_words() {
        const requestUrl = 'https://sanstv.ru/randomWord/lang-en/strong-2/count-1000/word-%3F%3F%3F%3F%3F%3F';
        let first_arr = [];
        let second_arr = [];
        await sendRecuest(requestUrl).then(data => {
            const names = data.substring(data.indexOf(`<td id='result'><nt><ol class='words'`) + 66, data.indexOf('</ol></nt></td>', data.indexOf(`<td id='result'><nt><ol class='words'></ol>`)) - 1);
            let arr = names.split(`</span></li><li ><span class='strong' '>`);
            let s_arr = arr[arr.length - 1].split(`</span></li><li ><span class='strong2' '>`);
            arr.pop();
            s_arr.pop();
            arr = arr.concat(s_arr);
            first_arr = arr;
        });
        await sendRecuest(requestUrl).then(data => {
            const names = data.substring(data.indexOf(`<td id='result'><nt><ol class='words'`) + 66, data.indexOf('</ol></nt></td>', data.indexOf(`<td id='result'><nt><ol class='words'></ol>`)) - 1);
            let arr = names.split(`</span></li><li ><span class='strong' '>`);
            let s_arr = arr[arr.length - 1].split(`</span></li><li ><span class='strong2' '>`);
            arr.pop();
            s_arr.pop();
            arr = arr.concat(s_arr);
            second_arr = arr;
        });
        let obj = {};
        obj.first = first_arr;
        obj.second = second_arr;
        return obj;
    },

}


module.exports = obj;