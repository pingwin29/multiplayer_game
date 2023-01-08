
const startField = document.getElementById("startField");
const gameField = document.getElementById("gameField");
const back = document.getElementById("backBtn");
// const resetresetBtn = document.getElementById("resetBtn");
const inputRoom = document.getElementById("create_match");
const roomContainer = document.getElementById('room_container');
const activeuser = document.getElementById("active");
const { usrname } = Qs.parse(location.search, { ignoreQueryPrefix: true });
const plaryername = document.getElementById("plaryername");
const inputmsg = document.getElementById("inputmsg");
const message = document.getElementById("message");
const join_btn = document.getElementsByClassName("join_btn");
const clientpoint = document.getElementById("cpoint");
const serverpoint = document.getElementById("spoint");


//set player name to ui

localStorage.setItem("playername", usrname);
const player_name = localStorage.getItem("playername");
var socket = io();
plaryername.innerHTML = player_name;













// ============================get data from server========================// 

// set user name to sever
socket.on("connect", () => {
    let socketid = socket.id; // x8WIv7-mJelg7on_ALbx
    socket.emit("create_user", { socketid, player_name });
});

socket.on("Allroom", data => {
    console.log(typeof data);
    renderRoom(data);
})

socket.on("AllUser", data => {
    activeuser.innerHTML = data.length;
})

socket.on("message", data => {
    renderMesg(data);
})

socket.on("diableBtn", data => {
    console.log(data);
    for (let x = 0; x < join_btn.length; x++) {
        if (join_btn[x].getAttribute("data_room") == data) {
            join_btn[x].disabled = true;
            join_btn[x].style.background = 'grey';
            join_btn[x].textContent = 'Join Match(2/2)';
        };
    }
});

socket.on("alert", data => {
    alert(data);
})















// =================================join or create functions ============================//


function createRoom() {
    const roomName = inputRoom.value;
    if (roomName.trim().length !== 0) {
        // const id = socket.id;
        const id = `room:${socket.id}`;

        socket.emit("create_room", {
            roomName,
            id
        });

        inputRoom.value = "";

        showGame();
        // socket.emit("join_room", id);
    } else {
        alert("enter Room Name");
    }
}
function joinRoom(tag) {
    const roomid = tag.getAttribute("data_room");
    socket.on("joinpermession", data => {
        if (data) {
            showGame();
        }
    })
    socket.emit("join_room", roomid);

}
function backAction() {
    // TO CHECK OWNER
    socket.emit("remvoeRoom", `room:${socket.id}`);
    //TO LEAVE PLAYER FORMROOM
    socket.emit("leaveroomplayer", socket.id);
    hideGame();

}


function renderMesg(data) {
    const div = document.createElement("div");
    div.innerHTML = `${data.currentUser} : ${data.data}`;
    message.append(div);
}

function sendMsg() {

    socket.emit("message", inputmsg.value);
}

function renderRoom(data) {
    roomContainer.innerHTML = "";
    const rooms = [...data];
    rooms.map(room => {

        roomContainer.innerHTML += `<div div class= "room" >
    <div class="row">
        <div class="room_info col-md-6 col-sm-6 col-xs-6">${room.roomName}</div>
        <div class="room_join col-md-6 col-sm-6 col-xs-6">
            <button
                type="submit"
                class="btn btn-success join_btn"
                data_room='${room.id}'
                onclick="joinRoom(this)"
            >
                Join Match
            </button>
        </div>
    </div> 
          </div > `;
    })

}


function showGame() {
    gameField.style.display = "block";
    startField.style.display = "none";

    // default fucntion 
    defaultgame();
    return -1


}

function hideGame() {
    gameField.style.display = "none";
    startField.style.display = "block";
    return -1
}







// -------------------------------Game setup-------------------------------// 



const playerOne = document.getElementById("playerOne");
const playerTwo = document.getElementById("playerTwo");
const box = document.getElementsByClassName("box");
const backposition = document.getElementsByClassName("back");
const user_info = document.getElementsByClassName("usr_info");
const card = document.getElementsByClassName("card");
const resetBtn = document.getElementById("resetBtn");
const gameboard = document.getElementById("gameboard");
const Message = document.getElementById("Message");
const popupMessageContainer = document.getElementById("popupMessage");
const popupmessage = document.getElementById("message");
const chatinput = document.getElementById("chatinput");
const chatbox = document.getElementById("chatbox");
const message_chat = document.getElementsByClassName("message_chat")[0];

//set varibale for game;
let client = [];
let server = [];
const winPoint = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
// 0 , 2 , 4
let inTrun = 0;
let win = [];








// function whoClick() {
//     if (inTrun % 2 == 0) {

//         return 'playerTwo';
//     } else {

//         return 'playerOne';
//     }
// }
function defaultgame() {
    activeusrEffect(0);
    diorvisibelBorad(false);
    reset();
}

function clickdisable() {
    console.log(`hello`);
    for (let index = 0; index < box.length; index++) {
        box[index].setAttribute('onclick', 'null');
    }
    return
}

function clickable() {
    const array = client.concat(server);
    console.log(`client disable` + array);
    for (let index = 0; index < box.length; index++) {
        !array.includes(index) && box[index].setAttribute('onclick', ` choose(${index}); this.onclick = null; `);
    }
    return
}

// function clickables() {
//     for (let index = 0; index < box.length; index++) {
//         box[index].setAttribute('onclick', ` choose(${index}); this.onclick = null; `);
//     }
//     return
// }

function boxEffect() {
    win.map(ele => {
        card[ele].children[1].classList.add('active');
    })
    return
}

function removeBoxEffect() {
    for (let index = 0; index < box.length; index++) {
        card[Number(index)].children[1].classList.remove('active');
        setTimeout(() => {
            card[Number(index)].children[1].innerHTML = "";
        }, 600)
    }
    return
}

function winSituation() {
    boxEffect();
    clickdisable();
    activeusrEffect(0);
    return -1
}

function reset() {
    inTrun = 0;
    client = [];
    server = [];
    // clientpoint.innerHTML = 0;
    // serverpoint.innerHTML = 0;
    removerotateEffect();
    activeusrEffect(1);
    removeBoxEffect();
    clickable();
    return
}

function isWin(playerPoint) {
    if (playerPoint.length >= 3) {
        for (let index = 0; index < winPoint.length; index++) {
            let pointarray = winPoint[index];
            win = [];
            for (let innerindex = 0; innerindex < playerPoint.length; innerindex++) {
                let point = playerPoint[innerindex];
                pointarray.join("").includes(point) && win.push(point);
            }
            if (win.length === 3) {

                return true;
            }
        }
        return false;
    } else {
        return false;
    }
}

function rotateEffect(boxno) {
    card[boxno].classList.add("active");
    return
}

function removerotateEffect() {
    for (let i = 0; i < card.length; i++) {
        card[i].classList.remove('active');
    }
    return
}

function render(boxno, signal) {
    card[Number(boxno)].children[1].innerHTML = `<span span class="${signal}" > ${signal}</span > `;
    rotateEffect(Number(boxno));
    return
}

function drawBoard(boxno) {
    console.log(boxno);
    client.push(boxno);



    console.log('after add box form clent:');
    console.log({ client, server });
    activeusrEffect(1);
    render(boxno, "x");
    isWin(client) && winSituation();
    isWin(client) && showPopupMessage("win");



    socket.emit("getroomno", socket.id);

    console.log("---------------------_______________++++++++++++++++");

    socket.emit("Boxnumber", boxno);

    // to check draw 
    if (!isWin(client) && !isWin(server) && client.concat(server).length == 9) {
        return socket.emit("draw", "draw");
    }

    isYourTrun(false);

    return
}

function winalert(value) {
    value ? alert("you win") : alert('you lose');
}

function activeusrEffect(index) {
    user_info[index].classList.add('acitve');
    removeusrEfffect(index === 1 ? 0 : 1)
    return
}

function removeusrEfffect(index) {
    user_info[index].classList.remove("acitve");
    return
}
function diorvisibelBorad(value) {
    value ? Message.style.display = "none" : Message.style.display = "block";
    value ? gameboard.style.display = 'block' : gameboard.style.display = "none";
    //all reset game if player enter or leave
    reset();
    return
}


function choose(boxno) {
    // inTrun++;
    // const whois = whoClick();
    // drawBoard(whois, boxno)
    drawBoard(boxno);
    return
}


function isYourTrun(value) {
    value ? clickable() : clickdisable();
    return
}

function showPopupMessage(value) {
    popupMessageContainer.style.display = "block";
    if ("draw" === value) {

        return popupmessage.innerHTML = `
        Draw !!!`;
    }
    if ("win" === value) {
        clientpoint.innerHTML = Number(clientpoint.innerHTML) + 1;
        return popupmessage.innerHTML = `
        <img
        src="../img/Happy-with-tongue-unscreen.gif"
        width="50"
        height="50"
        alt=""
        srcset=""
      />
      Win !!!`;
    } else if ("lose" === value) {
        console.log(`before change form server side pint ${serverpoint.innerHTML}`);
        serverpoint.innerHTML = Number(serverpoint.innerHTML) + 1;
        console.log(`after change form server side pint ${serverpoint.innerHTML}`);
        return popupmessage.innerHTML = `
        <img
        src="../img/Very-unhappy-unscreen.gif"
        width="50"
        height="50"
        alt=""
        srcset=""
      />
      Lose !!!`;
    }
}
function hidePopupMessage() {
    popupMessageContainer.style.display = "none";
    return -1

}

function restartgame() {
    socket.emit("restartgame", true);

    reset();
    hidePopupMessage();
    isYourTrun(false);
}

function chat() {
    if (chatinput.value.trim().length > 0) {
        let msg = chatinput.value;
        let date = new Date();
        let hours = date.getHours();
        let ap = hours > 12 ? `PM` : "AM";
        let minutes = date.getMinutes();
        let time = `${hours}:${minutes} ${ap}`
        let username = player_name;
        socket.emit("chat", { msg, username, time });
        chatinput.value = "";
    } else {
        alert("enter mesaage")
    }
}


socket.on("showgame", value => {
    diorvisibelBorad(value);
    isYourTrun(false);
});

socket.on("allleaveFromroom", roomid => {
    hideGame();
    reset();
    socket.emit("leave_room", roomid);
});

socket.on("turn", value => {
    console.log({ client, server });
    isWin(server) && winSituation();
    !(isWin(server)) && isYourTrun(value);
    isWin(server) && showPopupMessage("lose");
    activeusrEffect(0);
});

socket.on("boxnoFromServer", boxno => {
    server.push(boxno);
    render(boxno, "o");
})
socket.on("draw", value => {
    showPopupMessage("draw");
})







// socket.on("win", value => {
//     winalert(value);
// });

socket.on("chatmsgfromserver", data => {
    console.log(data);
    let div = document.createElement("div");
    div.innerHTML = `
    <div class="sendby">${data.username}</div>
    <div class="message_box">${data.msg}</div>
    <div class="time">${data.time}</div>
    `;
    chatbox.append(div);
    message_chat.scrollTop = message_chat.clientHeight;

})

// resetBtn.addEventListener('click', () => {
//     reset();
// })















socket.on("getroomid", roomid => {
    alert(roomid);
})