const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
mongoose.connect('mongodb://localhost/news', { useNewUrlParser: true,  useCreateIndex: true,})
.then(() => { console.log('Connecting to the db(User)...')} )
.catch(err => { console.error('Someting failed')} );

const articlesSchema = mongoose.Schema({
    title: String,
    link: String,
    type: String,
    politician_name: String,
    politician_imglink: String
});
const schema = mongoose.Schema({
    name: {type: String, required: true, minlength: 3, maxlength: 20},
    email: {type: String, required: true, minlength: 5, maxlength: 100, unique: true},
    account: {type: String, required: true, minlength: 3 , maxlength: 100, unique: true},
    password: {type: String, required: true, minlength: 3 , maxlength: 100},
    fav_articles: [articlesSchema]
});


schema.methods.getAuthToken = function () {
    const data = Object.assign({}, this);
    delete data.password;
    const token = jwt.sign({user:{ 
        _id: this._id,
        name: this.name,
        account: this.account,
        email: this.email
    }}, 'privatekey');
    return token;
};


const User = mongoose.model('Users', schema);

function validateSignUp(user) {
    const schema = {
        name: Joi.string().min(3).max(20).required(),
        email: Joi.string().email({minDomainSegments: 2 }).required(),
        //At least one digit and one alpha must be included
        password: Joi.string().regex(/(\w*[a-zA-Z]+\w*\d+\w*|\w*\d+\w*[a-zA-Z]+\w*)/).required(),
        account: Joi.string().min(3).max(10).required()
    }
    return Joi.validate(user, schema);
}

module.exports = {
    User : User,
    validateSignUp: validateSignUp
}