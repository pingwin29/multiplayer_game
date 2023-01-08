let users = [];
function setUser(data) {
    const user = data;
    users.push(user);
    return user;
}
function getAllUser() {
    return users
}

function getUser(id) {
    const index = users.findIndex(user => user.socketid === id);
    return users[index];
}

function getUserLeave(id) {
    const index = users.findIndex(user => user.socketid === id);
    if (index !== -1) {
        return users.splice(index, 1);
    }
}

module.exports = {
    setUser, getAllUser, getUserLeave, getUser
}