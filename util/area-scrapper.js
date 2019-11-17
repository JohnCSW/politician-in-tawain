const url = 'http://www.isha.org.tw/tools/2012web_s_tools_02a_01%E7%B8%A3%E5%B8%82%E5%88%A5%E4%BB%A3%E7%A2%BC%E8%A1%A8.asp';
const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');

(async() => {
    const htmlString = await rp(url);
    //-Scrape html for inspecting.
    // fs.writeFile('resource/area-list.html', htmlString, err => {
    //     if(err) throw err;
    //     console.log('Saved!');
    // });
    const area_list = []

    const area_rows = $(htmlString)
    .find('tr');

    area_rows.each((i, row) => {
        area_list.push($(row).children().eq(1).text());
        area_list.push($(row).children().eq(3).text());
    });

    fs.writeFile('resource/area-list.json', JSON.stringify(area_list),
    err => {
        if (err) throw err;
        console.log('Saved!');
    });
    
    
})();