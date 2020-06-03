const fs = require('fs');
const readline = require('readline');

async function read(path) {
    const list = [];
    const fileStream = fs.createReadStream(path);

    fileStream.on('error', (err) => {
        fs.writeFile(path, '', (err) => {
            console.log('file created');
        });
    })

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    })

    for await (const line of rl) {
        list.push(line);
    }

    return list;
}

async function write(path, list) {

    fs.writeFileSync(path, '', err => {
        if (err) throw err;
    })

    for (let i = 0; i < list.length; i++) {
        let item;
        if (i !== 0)
            item = '\n' + list[i];
        else
            item = list[i];

        fs.appendFileSync(path, item, err => {
            if (err) throw err;
        })
    }
}

exports.read = (path) => {
    return read(path);
};

exports.removeLine = async (index, path) => {
    // avoid list wipe out
    if (index < 0)
        throw 'error: negative index';

    let list = await read(path);

    list.splice(index, 1);

    return write(path, list);
}

exports.reset = (path) => {
    fs.writeFile(path, '', err => {
        if (err) throw err;
    })
}

exports.addLine = async (path, item, sort) => {

    const list = await read(path);

    if (list.includes(item)) {
        throw 'Item exists';
    }

    function append(newItem, i) {
        if (i !== 0)
            newItem = '\n' + newItem;

        fs.appendFile(path, newItem, (err) => {
            if (err) throw err;
        })
    }

    list.push(item);
    if (sort) {
        list.sort();

        fs.writeFile(path, '', (err) => {
            if (err) throw err;
        })

        for (let i = 0; i < list.length; i++) {
            append(list[i], i)
        }
    } else {
        append(item, list.length-1);
    }
}

exports.updateLine = async (path, index, item) => {
    const list = await read(path);

    list[index] = item;

    return write(path, list);
}
