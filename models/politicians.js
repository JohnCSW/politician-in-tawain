const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/news', { useNewUrlParser: true })
.then( () => { console.log('Connecting to db(politicions)...')})
.catch(err => { console.error('Something faied')});

const schema = mongoose.Schema({
    area: {type: String, required: true, minlength: 3, maxlength: 10},
    name: {type: String, required: true, minlength: 2, maxlength: 10},
    gender: {type: String, required: true, minlength: 1, maxlength: 3},
    title: {type: String, required: true, minlength: 2, maxlength: 10},
    party: {type: String, required: true, minlength: 2, maxlength: 10},
    imgsrc: { type: String, required: true, minlength: 2,maxlength: 1024}
});
const Politician = mongoose.model('Politicians', schema);

module.exports = {
    db: mongoose,
    Politician: Politician
}