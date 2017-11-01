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

// +--------------------------------+
// |          </Imports>            |
// +________________________________+

//|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-

// +--------------------------------+
// |          <Config>              |
// +________________________________+

//============[Telegram]============
const TELEGRAM_TOKEN = ENV("TELEGRAM_TOKEN"); // Bot api TELEGRAM_TOKEN
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
        try { //Get promoted products as json from API
            let googleResult = await Rp({
                uri: `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${query}`,
                json: true
            });
            if (!googleResult.items){
                ok("No results :(")
            }
            let urls = googleResult.items.map((item,i)=>{
                let url = {
                    url: item.link,
                    title: item.title
                }
                if (
                    typeof item.pagemap !== "undefined"
                    &&
                    typeof item.pagemap.cse_thumbnail !== "undefined"
                ){
                    url.thumb_url=item.pagemap.cse_thumbnail[0].src
                    url.thumb_width = Number(item.pagemap.cse_thumbnail[0].width)
                    url.thumb_height = Number(item.pagemap.cse_thumbnail[0].height)
                }

                url["type"] = "article";

                url["id"] = Math.random()*1000+i;
                url["input_message_content"] = {
                    message_text: url.url,
                    parse_mode: "HTML",
                    disable_web_page_preview: false
                };
                return url;
            });
            return ok(urls);
        } catch (e) {

            no(e.message)
        }
    })
};
// +--------------------------------+
// |        </Functions>            |
// +________________________________+

//|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-


// +--------------------------------+
// |            <Main>              |
// +________________________________+


log("Starting bot...");
const bot = new Telegraf(TELEGRAM_TOKEN);

bot.on('inline_query', async ({ inlineQuery, answerInlineQuery }) => {
    const offset = parseInt(inlineQuery.offset) || 0
    const results= await searchGoogle(inlineQuery.query)
    // const results = urls.map((url,i)=>{
    //
    //     return url;
    // })

    return answerInlineQuery(results, {next_offset: offset + 30})
})



bot.startPolling()

log("Bot started!");


// +--------------------------------+
// |           </Main>              |
// +________________________________+
