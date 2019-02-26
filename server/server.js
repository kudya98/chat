const express = require("express");
const session = require('express-session')
const bodyParser = require("body-parser");
const uuidv1 = require('uuid/v1');
const uuidv3 = require('uuid/v3');
const uuidv4 = require('uuid/v4');
const md5 = require('md5');
//const cors = require('cors');
const API_PORT = 3001;
const app = express();
const router = express.Router();
const http = require('http').Server(app);
const cookieParser = require('cookie-parser');
const mysql = require('mysql');
app.use(cookieParser());
app.set('trust proxy', 1);
app.use(session({
    secret: 'secret',
    genid: function(req) {
        return uuidv4()
    },
    cookie: {},
    resave:false,
    saveUninitialized:false
}));
//app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use("/api", router);

const MESSAGE_HISTORY = 100;
const clients = [];
const messages = [];

router.get("/session", (req, res) => {
    if (req.cookies.session) {
        res.json({logged:true,username:req.cookies.username});
        res.end()
    }
    else {
        res.json({logged:false});
    }
});
router.post("/registration", (req, res) => {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "12345",
        database: "db1"
    });
    let username = req.body.username;
    let password = req.body.password;
    con.connect(function(err) {
        if (err) throw err;
        con.query(`SELECT * FROM users WHERE login='${username}'`, function (err, result, fields) {
            if (result.length){
                res.send("User already exists");
                res.end();
            } else {
                let password_md5=md5(password);
                con.query(`INSERT INTO users VALUES(default,'${username}','${password_md5}')`, function (err, result, fields) {
                    if (err) console.log(err);
                    if(result) res.send("User created");
                    res.end();
                })
            };
        });
    });
});
router.post("/auth", (req, res) => {
    const con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "12345",
        database: "db1"
    });
    let username = req.body.username;
    let password = req.body.password;
    let password_md5=md5(password);
    con.connect(function(err) {
        if (err) throw err;
        con.query(`SELECT * FROM users WHERE (login="${username}") AND (password="${password_md5}")`, function (err, result, fields) {
            if (err) throw err;
            if (result.length){
                res.cookie('username',username, { maxAge: 10000000, httpOnly: false });
                res.cookie('session',req.session.id, { maxAge: 10000000, httpOnly: false });
                res.json({logged:true,username:username});
            } else res.status(401).send('User not found!');
            console.log(result);
        });
    });
    /*if (clients.find((client)=>client===username)){
        res.status(409);
        console.log('name used');
        res.send('Name used');
        return;
    }
    */
});



router.get("/clients", (req, res) => {
    let active_clients = clients
        .filter(client => client.sockets.length);//Клиенты с активными сессиями
    res.send(active_clients.map((client,i)=>client.username));
});
router.get("/messages", (req, res) => {
    res.send(messages.map((message)=>{return {sender:message.sender,content:message.content}}));
});

const io = require('socket.io')(http);
io.on('connection', function(socket){
    socket.username=socket.handshake.query.username;
    (()=> {
        let msg={log:true,content:socket.username+' зашёл'}
        messages.push(msg);
        io.emit('chat message',msg);
    })();
    if (clients.find((client)=>client.username===socket.username)){
        clients.find((client)=>client.username===socket.username).sockets.push(socket.id);
    } else {
        client = {username:socket.username,sockets:[socket.id]}
        clients.push(client);
        io.emit('update-clients',);
    }

    socket.on('disconnect', function(){
        let disconnected_client = clients.find(client => client.username === socket.username);
        let disconnected_client_sockets =  disconnected_client.sockets;
        let disconnected_socket_index = disconnected_client_sockets.findIndex(temp_socket=>temp_socket===socket.id);
        disconnected_client_sockets.splice(disconnected_socket_index,1);
        //clients.splice(clients.indexOf(socket),1);
        if(!disconnected_client_sockets.length) {
            let msg={log:true,content:socket.username+' Вышел'}
            messages.push(msg);
            io.emit('chat message',msg);
            io.emit('update-clients',);
        }

    });
    socket.on('chat message', function(msg){
        if (messages.length>MESSAGE_HISTORY) messages.splice(0,1);
        //messages.push(msg);
        io.emit('chat message',msg);
    });
});

app.listen(API_PORT, () => console.log(`APP LISTENING ON PORT ${API_PORT}`));
http.listen(3002, function(){
    console.log('HTTP LISTENING ON PORT 3002');
});