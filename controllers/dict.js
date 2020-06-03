const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');
const {read, removeLine, clean, addLine} = require('../util/crud');

const filePath = path.join(rootDir, 'data', 'etc', 'ka.dic');

let words = [];

exports.getDict = async (req, res, next) => {

    words = await read(filePath);
    res.render('dict', {
        pageTitle: 'Dict',
        words: words,
    })

}

exports.addWord = async (req, res, next) => {
    const newWord = req.body.newWord;

    if (!newWord) return;

    const words = await read(filePath);

    let w = newWord + ' ';
    for (const char of newWord) {
        if (phonemes[char] !== undefined) {
            w += phonemes[char] + ' ';
        } else {
            w += char + ' ';
        }
    }

    if (words.includes(w)) {
        console.log('exists');
        res.redirect('dict');
        return;
    }

    words.push(w);
    words.sort();

    fs.writeFile(filePath, '', () => {
    })
    for (const word of words) {
        fs.appendFile(filePath, word + '\n', () => {
        })
    }
    res.redirect('/dict');

}

exports.removeLine = (req, res, next) => {
    const index = req.body.index;
    removeLine(index, filePath, words);
    res.redirect('/dict');
}

exports.clearFile = (req, res, next) => {
    fs.writeFileSync(filePath, '', err => {
        console.log(err);
    })

    res.redirect('/dict');
}

exports.submit = (req, res, next) => {
    fs.copyFileSync(filePath, '/home/avoup/Documents/speech_recognition/acoustic_models/ka/etc/ka.dic', err => {
        if (err) console.log(err)
    })

    res.redirect('/dict');
}

phonemes = {
    "ა": "a",
    "ბ": "b",
    "გ": "g",
    "დ": "d",
    "ე": "e",
    "ვ": "v",
    "ზ": "z",
    "თ": "th",
    "ი": "i",
    "კ": "k",
    "ლ": "l",
    "მ": "m",
    "ნ": "n",
    "ო": "o",
    "პ": "p",
    "ჟ": "jh",
    "რ": "r",
    "ს": "s",
    "ტ": "t",
    "უ": "u",
    "ფ": "f",
    "ქ": "q",
    "ღ": "gh",
    "ყ": "y",
    "შ": "sh",
    "ჩ": "ch",
    "ც": "c",
    "ძ": "zh",
    "წ": "w",
    "ჭ": "wh",
    "ხ": "x",
    "ჯ": "j",
    "ჰ": "h",
}

// TODO phoneme dictionary
// TODO phoneme to character
// TODO dynamic phonemes from file
// TODO audio waveform

// TODO audio files total length counter
// TODO edit line
// TODO choose bitrate and frequency for audio

// TODO to-record list with auto populate after stop record
// TODO on click populate
// TODO stay in directory after listen or remove
// TODO clear only in directory files




