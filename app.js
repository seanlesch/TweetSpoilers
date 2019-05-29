import Twitter from 'twitter';
import config from './config.js';
var T = new Twitter(config);

var params = {
    q: '#nodejs',
    count: 10,
    resultType: 'recent',
    lang: 'en'
}

T.get('search/tweets')