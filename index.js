const express = require("express");
const path = require("path");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const { setRoom, getAllRoom, removeCurrentRoom } = require('./database/room');
const { setUser, getAllUser, getUserLeave, getUser } = require("./database/user");
const { setroom, getroom, getallroom, setroomplayer, clearallplayer, getroomplayer, clearroom } = require("./database/start");
// route setup 
let PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname + "/public/")));


// io.use((socket, next) => {
//     const user = getUser(socket.id);
//     if (user) {
//         next();
//     } else {
//         res.sendFile(__dirname + 'index.html');
//     }
// })

app.get("/", (req, res) => {

    res.sendFile(__dirname + 'index.html');

})

app.get("/game.html", (req, res) => {
    const user = getUser(socket.id);
    if (user) {
        res.sendFile(__dirname + 'game.html');
    } else {
        res.sendFile(__dirname + 'index.html');
    }

});

// server setup 


server.listen(PORT, () => {
    console.log("server is ready")
}

)

//socket 

io.on("connection", socket => {
    io.emit('Allroom', getAllRoom());

    console.log(`new Plyaer is connected`);
    getroominserver();

    socket.on("create_room", data => {
        setRoom(data);
        const allRoom = getAllRoom();
        setroom(data.id);

        io.emit('Allroom', allRoom);
        socket.join(data.id);
        getroominserver();
    });

    socket.on("create_user", data => {
        setUser(data);
        const allUser = getAllUser();
        //------------------------------
        console.log(allUser);
        //--------------------------
        io.emit('AllUser', allUser);

    });

    socket.on("remvoeRoom", roomid => {

        const rm = removeCurrentRoom(socket.id);

        console.log(`leave owner roomid is ${roomid}`);
        io.to(roomid).emit("allleaveFromroom", roomid);

        const allRoom = getAllRoom();
        io.emit('Allroom', allRoom);
        clearroom(`room:${socket.id}`);
        getallroom()

    });



    socket.on("leave_room", roomid => {
        socket.leave(roomid);
        getroominserver();
    })

    socket.on("join_room", roomid => {
        const room = io.sockets.adapter.rooms.get(roomid);

        if (room.size < 2) {

            socket.emit("joinpermession", true);
            socket.join(roomid);

            //-------------------------
            console.log(`after 2 player are ready `);

            getroominserver();

            //--------------------------


            if (room.size == 2) {
                io.emit('diableBtn', roomid);
                io.to(roomid).emit("showgame", true);
            }
            socket.broadcast.to(roomid).emit("turn", true);

        } else {
            socket.emit("joinpermession", false);
        }

    });



    socket.on("Boxnumber", boxno => {
        const roomname = getUserRoom(socket.id);
        socket.broadcast.to(roomname).emit("boxnoFromServer", boxno,);
        socket.broadcast.to(roomname).emit("turn", true);
    });

    // socket.on("win", value => {
    //     const roomname = getUserRoom(socket.id);
    //     socket.broadcast.to(roomname).emit("win", value);
    //     socket.broadcast.to(roomname).emit("turn", true);
    // });

    socket.on("draw", value => {
        const roomname = getUserRoom(socket.id);
        getallroom();
        io.to(roomname).emit("draw", value);
    })

    socket.on("restartgame", value => {
        const roomname = getUserRoom(socket.id);
        // setroomplayer(roomname, socket.id);
        if (getroomplayer(roomname) % 2 == 0) {
            clearallplayer(roomname);
            socket.broadcast.to(roomname).emit("turn", true);
        }
    })

    socket.on("getroomno", socketid => {

        const allsids = io.sockets.adapter.sids[socketid];

        console.log({ allsids });

    })


    socket.on("leaveroomplayer", socketid => {
        const allsids = io.sockets.adapter.sids;

        console.log({ allsids });

        allsids.forEach(function (rooms, sid) {

            console.log(`leave roomplayer -----------------------`);

            if (sid == socketid) {
                rooms.forEach(room => {
                    console.log(room);
                    if (room !== socketid) {
                        clearallplayer(room);
                        socket.leave(room);
                        io.to(room).emit("showgame", false);


                        //--------------------------------
                        console.log('after player leave from room');

                        getroominserver();

                        //-----------------------------------
                    }
                })
            }


        })

    });

    socket.on("chat", data => {
        io.emit("chatmsgfromserver", data);
    })


    socket.on("disconnect", () => {
        // delete room if disconnected user create room 
        io.to(`room:${socket.id}`).emit("allleaveFromroom", `room:${socket.id}`);

        const user = getUserLeave(socket.id);
        const allUser = getAllUser();
        io.emit('AllUser', allUser);
        const rm = removeCurrentRoom(socket.id);
        const allRoom = getAllRoom();
        io.emit('Allroom', allRoom);
    });


});

















function getroominserver() {
    console.log("for show by rooms")
    const roomsss = io.sockets.adapter.rooms;
    roomsss.forEach((value, key) => {
        console.log(`room is ${key} and `);
        value.forEach(ele => {

            console.log(`player is is ${ele}`)
        })
        console.log("-------------------")
    })
};


function getUserRoom(userid) {
    let roomname;
    const allsids = io.sockets.adapter.sids;
    allsids.forEach(function (rooms, sid) {
        if (sid == userid) {
            rooms.forEach(room => {
                if (room !== userid) {
                    roomname = room;
                }
            })
        }


    })
    return roomname
}