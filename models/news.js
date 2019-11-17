const puppeteer = require('puppeteer');
const qs = require('querystring');
const rp = require('request-promise');
const $ = require('cheerio');
const newsURI = 'https://news.google.com/?';
const newsOptions = {
     hl: 'zh-TW', gl: 'TW', ceid: 'TW:zh-Hant'
};
const pttOptions = {
    uri: 'https://www.ptt.cc/bbs/HatePolitics/search?',
    qs: {
        page: 1
    }
};
const ytOptions = {
    uri: 'https://www.youtube.com/results?',
    qs:{

    }
}
function getRecentNews(name){
    return new Promise(async (resolve, reject ) => {
        try{
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto(newsURI + qs.stringify(newsOptions));
            await page.type('input:nth-of-type(2)', name);
            await page.click('button:nth-of-type(4)');
            await page.waitFor(2000, {visible: true});
            await page.screenshot({path: 'resource/test.png'});
            const headlinles = await page.$$eval('article > h3 > a', headlines => { 
                return headlines
                .map(h => {return {title: h.innerHTML, link: h.href }});
            });
            await browser.close();

            const interested_headlines = headlinles.filter(h => {
                return h.title.includes(name);
            });
            if (interested_headlines.length < 10){
                resolve(interested_headlines);
            }else{
                resolve(interested_headlines.slice(0, 10));
            }
                
        }catch(ex){
            reject(ex);
        };
    });
}

function getPTTArticles(name){
    return new Promise(async (resolve, reject)=>{
        try{
            pttOptions.qs.q = name;
            const htmlString = await rp(pttOptions);
            const articles = $('.title > a', htmlString)
            .map((i, el) => {
                return {title: $(el).text(), link: 'https://www.ptt.cc' + $(el).attr('href')}
            }).get();
            resolve(articles);   
        }catch(ex){
            reject(ex);
        }
         
    });
}

function getYTClips(name){
    return new Promise(async (resolve, reject) => {
        try{
            ytOptions.qs.search_query = name;
            const htmlString = await rp(ytOptions);
            const clips = $('.yt-lockup-dismissable', htmlString)
            .map((i, el) => {
                const headline = $('.yt-lockup-title > a', el)
                return {
                    title: headline.attr('title'),
                    link: 'https://www.youtube.com/'+ headline.attr('href')
                }
            }).get();
            resolve(clips);
        }catch(ex){
            reject(ex);
        }
    });
    
}
// Testing function
// (async() => {
//     console.log(await getYTClips('韓國瑜'));
// })();

module.exports = {
    getRecentNews: getRecentNews,
    getPTTArticles: getPTTArticles,
    getYTClips: getYTClips
}