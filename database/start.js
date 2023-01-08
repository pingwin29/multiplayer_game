let roomplayer = new Map();
function setroom(id) {
    // console.log(`id si sssssssssssssssss"` + id);
    roomplayer.set(`${id}`, []);
    return
}

function getroom(id) {
    return roomplayer.get(`${id}`);
}

function getallroom() {
    roomplayer.forEach(function (value, key) {
        console.log(`key is ${key} and value is ${value}`);
        console.log("--------------------------------000000000000");
    })

    return
}

function setroomplayer(id, name) {
    roomplayer.forEach(function (value, key) {
        if (key == id) {
            value.push(name);
        }
    });
    return console.log(`setroomplaeyr` + { roomplayer });
}

function getroomplayer(id) {
    let resu = 0;
    roomplayer.forEach(function (value, key) {
        if (key == id) {
            resu = value.length;
        }
    })
        ;
    return resu;
}

function clearroom(id) {
    roomplayer.delete(id);
    return -1
}

function clearallplayer(id) {
    roomplayer.forEach(function (value, key) {
        if (key == id) {
            value = [];
        }
    })
    return
}
module.exports = {
    setroom,
    getroom,
    getallroom,
    setroomplayer,
    getroomplayer,
    clearroom,
    clearallplayer

}