const path = require('path');
const root = require('../util/path');

const {read, removeLine, reset, addLine, updateLine} = require('../util/crud');

let listPath = path.join(root, 'data', 'misc', 'list.txt');

function randomLine(count, words, maxLength, cb) {
    for (let i = 0; i < count; i++) {
        const sLength = Math.ceil(Math.random() * maxLength + 1);
        let transcript = '';
        for (let k = 0; k < sLength; k++) {
            const word = words[Math.floor(Math.random() * words.length)];
            if (k === 0)
                transcript += word;
            else
                transcript += ' ' + word;
        }

        cb(listPath, transcript);
    }
}

function splitWord(word) {
    const wd = word.split('');
    let w = '';

    for (let i = 0; i < wd.length; i++) {
        if (i === 0)
            w += wd[i];
        else
            w += ' ' + wd[i];
    }
    return w;
}

exports.read = async () => {
    return read(listPath)
        .catch(err => {
            console.log(err);
        })
}

exports.add = (req, res, next) => {
    const s = req.body.sentence;
    const a = req.body.appendix ? ' ' + req.body.appendix : '';

    // const list = read(listPath)
    //     .then(list => {
    //         const words = [];
    //         for (const line of list) {
    //
    //             if (!line.includes(' ') && line.length > 1) {
    //                 words.push(line);
    //
    //                 // addLine(listPath, splitWord(line))
    //                 //     .catch(err => {
    //                 //         console.log(err);
    //                 //     })
    //
    //             }
    //
    //         }
    //         // randomLine(7, words, 4, addLine);
    //
    //
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })

    addLine(listPath, s + a)
        .catch(err => {
            console.log(err);
        })

    const q = req.query.testing ? '?testing=1' : '';

    res.redirect('/audio' + q);
}

exports.remove = (req, res, next) => {
    const index = req.body.index;

    removeLine(index, listPath)
        .catch(err => {
            console.log(err);
        })
    res.redirect('/audio');
}

exports.reset = (req, res, next) => {
    clean(listPath)
        .catch(err => {
            console.log(err)
        })
    res.redirect('/audio');
}

exports.update = (req, res, next) => {
    const updatedItem = req.body.updatedItem;
    const index = req.body.index;

    updateLine(listPath, index, updatedItem)
        .catch(err => {
            console.log(err);
        })
    res.redirect('/audio');
}