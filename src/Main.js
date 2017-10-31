// +--------------------------------+
// |           <Imports>            |
// +________________________________+

//Third-party libraries
const
    Cheerio = require('cheerio'), //Lets stick with cheer, XPath is not good for this part
    Dom = require('xmldom').DOMParser, // Dom parser from plain strings
    Request = require('request'), // Http Request helper
    Rp = require('request-promise'), //Request promise for node
    Telegraf = require('telegraf'), // a Library for working with Telegram api
    Promise = require('bluebird'), // Promises implementation in Node
    Q = require('q'), // Another promise implementation, different features
    FS = require("fs"), //Disk IO things
    DotEnv = require('dotenv'), //Load .env values
    Unique = require('array-unique') //Fast implementation of unique in arrays
    ;


//Application libraries

//=============[Helpers]================
require("./Helper/helper.js")(); //Adds all functions in helper.js to current namespace



//=============[Telegram Bot]================

const
    DwshBotTelegram = require('./Bot/DwshBotTelegram')
    ;

// +--------------------------------+
// |          </Imports>            |
// +________________________________+

//|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-

// +--------------------------------+
// |          <Config>              |
// +________________________________+

//============[Telegram]============
const PROMOTION_BOT_TOKEN = ENV("TELEGRAM_TOKEN"); // Bot api PROMOTION_BOT_TOKEN
const pollingConfig = {
    interval: 0,
    timeout: 60
};

//============[Google Custom Search Engine API]============
const
    GOOGLE_CX = ENV("GOOGLE_CX"),
    GOOGLE_API_KEY = ENV("GOOGLE_API_KEY")
    ;

// +--------------------------------+
// |         </Config>              |
// +________________________________+

//|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-

// +--------------------------------+
// |         <Functions>            |
// +________________________________+

/**
 * @return {String[]} Url and small text for answers
 */
async function searchGoogle(query){
    return new Promise( async (ok, no)=>{
        query = encodeURI(query);//Url encode query before sending
        let urls = [];

        try { //Get promoted products as json from API
            let json = await Rp({
                uri: `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${query}`,
                json: true
            });



        } catch (e) {
            no(e.message)
        }
        return ok({
            urls: urls
        });
    })
};
// +--------------------------------+
// |        </Functions>            |
// +________________________________+

//|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-


// +--------------------------------+
// |            <Main>              |
// +________________________________+


let bot = new PoromotionTelegramBot(PROMOTION_BOT_TOKEN);

log("Starting bot...");
bot.Start();    //Start the bot
log("Bot started!");


// +--------------------------------+
// |           </Main>              |
// +________________________________+

