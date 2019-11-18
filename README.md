# Politicians In Taiwan 
## A Short Introduction:
PIT(stands for Politicians In Taiwan) is a webiste that provides the news, video clips, 
and posts from the forum about your interested politicians.
## Tech Stacks:
```
├── @hapi/joi@15.0.3
├── bcrypt@3.0.6
├── body-parser@1.19.0
├── bootstrap@4.3.1
├── cheerio@1.0.0-rc.3
├── cookie-parser@1.4.4
├── ejs@2.6.1
├── express@4.17.0
├── express-session@1.16.2
├── jquery@3.4.1
├── jsonwebtoken@8.5.1
├── mongoose@5.5.9
├── morgan@1.9.1
├── multer@1.4.1
├── nodemon@1.19.1
├── popper.js@1.15.0
├── puppeteer@1.16.0
├── request@2.88.0
└── request-promise@4.2.4
```
## Configuration:
1. `git clone https://github.com/JohnCSW/politician-in-tawain.git`
2. `npm i`
3.  Make sure you have installed [MongoDB](https://www.mongodb.com/) locally, and have run the mongoDB daemon.
4. `node ./util/polititian-db-loader.js`
5. `node app.js` on <http://localhost:5000>
## Features:
* Search politicians you're interested in.
<img src='./readme-src/PIT_Search.gif'>

* Provide you the profile and the **links** of video clips, news and posts from forum(PTT) about your interested politicain.
* Log In/Sign Up for keeping your favorite articles, video clips and posts
## Note:
1. **All politicians that can be searched include only the head of the regons in Taiwan**
2. This website I made months ago hasn't been tested yet.Bugs may happen.
3. The structure of code hasn't been refatored.It may seem to be a little messy.
4. It can only be run locally, which means it's still need some efforts to put it online.
5. It's a beginner project, so if you see something weird...you know. :(
