const rp = require('request-promise');
const request = require('request');
const $ = require('cheerio');
const baseUrl = 'https://zh.wikipedia.org/wiki/现任中华民国一、二级行政区行政首长列表';
const fs = require('fs');
// *For testing purpose
async function scrapHTMLPage() {
    const html = await rp(encodeURI(baseUrl));
    fs.writeFile('resource/list.html', html, err => {
        if (err) { throw err }
        console.log('Saved!');
    });
};
let politcians = [];
//Scraping profile
(async () => {
    const html = await rp(encodeURI(baseUrl));
    //table
    const all_list = $('table.wikitable > tbody', html)
    .not((i, el) => {
        return i == 1;
    }).get();
    
    all_list.forEach((el) => {
        //exclude thead(index 0)
        const people = $(el).children().not((i, el) => { i == 0 }).get();
        //concat all rows(which represent polititians)
        politcians = politcians.concat(people);
    });
    politcians = politcians
    .filter(p => { return $(p).children().eq(2).is('td')})
    .map(p => {
        const position = $(p)
        .children().eq(1)
        .children('a').eq(1).text();

        const area = position.substring(0, 3);

        const title = position.substring(3);

        const name = $(p)
        .children().eq(2)
        .children('a').text();

        const party = $(p)
        .children().eq(6)   
        .children('a').text();
        
        const gender = $(p)
        .children().eq(4)
        .text().trim();

        const imgsrc = 'https:' + $(p)
        .children().eq(3)
        .children('a')
        .children('img')
        .attr('src');

        return {
            area: area,
            name: name,
            gender: gender,
            title: title,
            party: party,
            imgsrc: imgsrc
        }
    });
    try{
        fs.writeFile('resource/list.json', JSON.stringify(politcians), err => {
            if (err) { throw err };
            console.log('List Saved!');
            scrapeImage();
        });
    }catch(ex){
        console.error('Error', ex.message);
    }
    
})();
//Scrapping image
function scrapeImage()  {
    politcians.forEach(p => {
        request(p.imgsrc).pipe(fs.createWriteStream(`resource/images/${p.area}-${p.name}`));
        console.log('Image:',`${p.area}-${p.name}.jpg Saved`);
    });
};