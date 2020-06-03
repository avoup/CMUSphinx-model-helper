const fs = require('fs');
const path = require('path');

const audio = require('../util/audioUtil');
// const AudioRecorder = require('node-audiorecorder');

const {read, removeLine, reset, addLine, updateLine} = require('../util/crud');

const root = require('../util/path');

const {read: list} = require('./list');

let filePath = path.join('data', 'etc', 'ka_train.transcription');
let fileIdsPath = path.join('data', 'etc', 'ka_train.fileids');

let DIRECTORY = path.join('data', 'wav', 'train');

let transcripts = [];
let fileIds = [];

function romanify(string) {
    if (string === 'init')
        return 'init';

    const latin = {
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
    let result = '';

    if (string.includes(' ')) {
        const split = string.split(' ');
        for (const word of split) {
            for (const char of word){

                result += latin[char];
            }
        }
    } else {
        for (const char of string) {
            result += latin[char];
        }
    }
    return result;
}

function changeEnv(testing) {
    if (testing) {
        DIRECTORY = path.join('data', 'wav', 'test');
        filePath = path.join('data', 'etc', 'ka_test.transcription');
        fileIdsPath = path.join('data', 'etc', 'ka_test.fileids');
    } else {
        DIRECTORY = path.join('data', 'wav', 'train');
        filePath = path.join('data', 'etc', 'ka_train.transcription');
        fileIdsPath = path.join('data', 'etc', 'ka_train.fileids');
    }
}

// middleware
exports.environment = (req, res, next) => {
    const testing = req.query.testing;
    console.log('testing?');
    next();
}

exports.getAudio = async (req, res, next) => {
    changeEnv(req.query.testing);

    transcripts = await read(filePath);
    fileIds = await read(fileIdsPath);

    const directory = req.query.directory;
    const si = req.query.si ? req.query.si : 0;

    res.render('audio', {
        pageTitle: 'Audio',
        transcripts: transcripts,
        fileIds: fileIds,
        isRecording: false,
        testing: req.query.testing,
        directory: directory ? directory : '',
        list: await list(),
        si: si ? si : '',
    })
}

exports.postAudio = async (req, res, next) => {

    const sentence = req.body.sentence;
    const dir = req.body.directory;
    const si = req.query.si;

    let name = dir ? dir : 'main';
    name += '-'
        + (sentence.includes(' ') ? 's' : 'w');
    name += '-'
        + romanify(sentence);

    const fileName = await audio.record(DIRECTORY, dir, name)
        .catch(err => {
            console.log(err);
        });

    // write transcript
    addLine(filePath, `<s> ${sentence} </s> (${fileName})`, false)
        .catch(err => {
            console.log(err);
        })
    addLine(fileIdsPath, `/${DIRECTORY.split('/')[2]}${dir ? '/' + dir : dir}/${fileName}`, false)
        .catch(err => {
            console.log(err);
        })

    res.render('audio', {
        pageTitle: 'Audio',
        isRecording: true,
        transcripts: transcripts,
        fileIds: fileIds,
        testing: req.query.testing,
        directory: dir ? dir : '',
        sentence: sentence,
        list: await list(),
        si: si ? si : '',
    })
}

exports.stopRecording = (req, res, next) => {
    audio.stop();
    const dir = req.query.directory;
    const testing = req.query.testing;

    const si = req.query.si;

    let url = '/audio?directory=';
    url += dir ? dir : '';
    url += testing ? '&testing=1' : '';
    url += si ? '&si=' + si : '';

    // const q = req.query.testing ? '?testing=1' : '';

    res.redirect(url);
}

exports.playAudio = (req, res, next) => {
    const file = req.body.file;
    // changeEnv(req.query.testing);
    audio.play(DIRECTORY, file);

    const q = req.query.testing ? '?testing=1' : '';

    res.redirect('/audio' + q);
}

exports.removeAudio = (req, res, next) => {
    const file = req.body.file;
    const index = req.body.index;

    audio.remove(DIRECTORY, file);

    // remove from transcripts and fileIds
    removeLine(transcripts.length - (+index + 1), filePath)
        .catch(err => {
            console.log(err)
        });
    removeLine(fileIds.length - (+index + 1), fileIdsPath)
        .catch(err => {
            console.log(err)
        });

    const q = req.query.testing ? '?testing=1' : '';

    res.redirect('/audio' + q);
}

exports.clearFiles = (req, res, next) => {
    const paths = [
        path.join('data', 'etc', 'ka_train.transcription'),
        path.join('data', 'etc', 'ka_train.fileids'),
        path.join('data', 'etc', 'ka_test.transcription'),
        path.join('data', 'etc', 'ka_test.fileids'),
    ];
    const audioPaths = [
        path.join('data', 'wav', 'train'),
        path.join('data', 'wav', 'test'),
    ]
    // reset file transcripts and ids
    for (const p of paths) {
        reset(p);
    }
    // remove files
    for (const ap of audioPaths) {
        fs.readdir(ap, (err, files) => {
            if (err) console.log(err);

            for (const file of files) {
                fs.unlink(path.join(ap, file), err => {
                    if (err) console.log(err);
                });
            }
        });
    }

    const q = req.query.testing ? '?testing=1' : '';

    res.redirect('/audio' + q);
}

