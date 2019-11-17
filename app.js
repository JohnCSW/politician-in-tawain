const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const api_politicians = require('./routes/api/polititians');
const index = require('./routes/index');
const detail = require('./routes/detail');
const auth = require('./routes/api/auth');
const profile = require('./routes/profile');
const articles = require('./routes/api/article');
app = express();
//Middelwares:
//-utils for dev:
app.use(morgan('tiny'));
//-filters:
app.use(require('cookie-parser')());
app.use(express.json());
//-convert form-data(multipart)
app.use(require('multer')().none());
app.use(session({secret: 'secret'}));
//Routes:
app.use('/api/politicians', api_politicians);
app.use('/api/articles/', articles);
app.use('/api/auth', auth);
app.use('/profile', profile);
app.use('/detail', detail);
app.use('/', index);
//Template Engine Setup
app.set('view engine', 'ejs');
app.set('views', './templates/');
app.use(express.static(__dirname + '/static'));


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});