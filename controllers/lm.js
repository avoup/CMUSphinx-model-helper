const fs = require('fs');
const path = require('path');
const root = require('../util/path');

const {read, removeLine, clean, addLine} = require('../util/crud');


const filePath = path.join(root, 'data', 'lm', 'ka.txt');
let sentences = [];

exports.getLm = async (req, res, next) => {
    if (!fs.existsSync('data/lm/')) {
        fs.mkdirSync('data/lm/');
    }
    const appendix = req.query.appendix;

    sentences = await read(filePath);

    res.render('lm', {
        pageTitle: 'Language Model',
        transcripts: sentences,
        appendix: appendix,
    })
}

exports.postSentence = (req, res, next) => {
    const newSentence = req.body.newSentence;
    const appendix = req.body.appendix;
    const sentence = `<s> ${newSentence + (appendix ? ' ' + appendix : '')} </s>`;

    addLine(filePath, sentence, false)
        .catch(err => {
            console.log(err);
        })

    res.redirect('/lm' + '?appendix=' + appendix);
}

exports.removeLine = (req, res, next) => {
    const index = req.body.index;

    removeLine(index, filePath, sentences)
        .catch(err => {
            console.log(err);
        })

    res.redirect('/lm');
}

exports.clearFile = (req, res, next) => {
    fs.writeFile(filePath, '', err => {
        console.log(err);
    })

    res.redirect('/lm');
}

exports.submit = (req, res, next) => {
    fs.copyFileSync(filePath, '/home/avoup/Documents/language_models/ka/ka.txt', err => {
        if (err) console.log(err);
    })

    res.redirect('/lm');
}