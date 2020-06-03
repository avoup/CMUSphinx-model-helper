const fs = require('fs');
const path = require('path');
const AudioRecorder = require('node-audiorecorder');

const PLAYER = require('play-sound')(opts = {});
const AR = new AudioRecorder({
    program: process.platform === 'win32' ? 'sox' : 'rec',
    bits: 16,
    rate: 16000,
    type: 'wav',

    silence: 0.2,
    thresholdStart: 0,
    thresholdStop: 0,
    keepSilence: true,
}, console);

exports.record = async (dir, subDir, fileName) => {

    if (!fs.existsSync(path.join(dir, subDir))) {
        fs.mkdirSync(path.join(dir, subDir));
    }

    // filename without extension
    if (!fileName) {
        fileName = Math.random()
            .toString(36)
            .replace(/[^a-z]+/g, '')
            .substr(0, 4);
    }
    // filename with extension
    const fullFileName = path.join(dir, subDir, fileName).concat('.wav');

    console.log('Recording at: ', fullFileName);

    const fileStream = fs.createWriteStream(fullFileName, {encoding: 'binary'});
    // Start and write to the file.
    AR.start().stream().pipe(fileStream);

    AR.stream().on('close', function (code) {
        console.warn('Recording closed. Exit code: ', code);
    });
    AR.stream().on('end', function () {
        console.warn('Recording ended.');
    });
    AR.stream().on('error', function () {
        console.warn('Recording error.');
    });

    return fileName;

}

exports.stop = () => {
    AR.stop();
}

exports.play = (dir, file) => {

    console.log('listen: ' + path.join(dir, file + '.wav'))

    PLAYER.play(path.join(dir, file + '.wav'), err => {
        if (err) console.log('err:' + err);
    })
}

exports.remove = (dir, file) => {
    fs.unlinkSync(path.join(dir, file + '.wav'))
}