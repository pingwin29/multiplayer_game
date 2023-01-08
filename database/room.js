
let rooms = [];


function setRoom(data) {
    rooms.push(data);
}
function getAllRoom() {
    return rooms;
}
function removeCurrentRoom(id) {
    console.log(`remove id room:${id}`);
    const index = rooms.findIndex(room => room.id == `room:${id}`);
    if (index !== -1) {
        return rooms.splice(index, 1);
    }
}






module.exports = {
    setRoom,
    getAllRoom,
    removeCurrentRoom,


}