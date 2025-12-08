const express = require('express');
const dotenv = require('dotenv');
const mariadb = require('mariadb');
const cookieParser = require('cookie-parser');
const iocookieParser = require('socket.io-cookie-parser')
const bcrypt = require('bcrypt');
const { createServer, get } = require('http')
const { Server } = require('socket.io')



dotenv.config({path: '.env-local'});

const db = mariadb.createPool({
	host: process.env.HOST,
	port: process.env.PORTDB,
	user: process.env.USERDB,
	password: process.env.PASSWD,
	database: process.env.DB,
	connectionLimit: 10,
	initializationTimeout: 30000
})

console.log("grrr");
console.log(process.env.USERDB);

db.getConnection((err,connection)=>{
	if(err){
		console.error("bad!");
	}
	if(connection) connection.release()
	return;
})

const rooms = {};
const roomquest = {};
const roominfo = {};
const roomanswers = {};

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer,{
	path:"/api/socket",
})

app.use(express.json());
//app.use(cors());
app.use(cookieParser('AWJUOFh9824DOAIu98'));

io.use(iocookieParser('AWJUOFh9824DOAIu98'));

const port = process.env.PORT || 8080;

app.get("/api", async (req,res) =>{
	const dbquery = "SELECT * FROM user";
	const table = await db.query(dbquery,req.query.username);
	res.status(200).json(table);
})

app.post("/api/login", async (req,res) =>{
	console.log("pedido login")
	const username = req.body.user;
	const dbquery = 'SELECT passwd FROM user WHERE username=?';
	try{
		const pass = await db.query(dbquery,username);
		console.log(pass)
		bcrypt.compare(req.body.passwd,pass[0].passwd, (err,r) =>{
			if(r) {
				res.cookie("sign",username,{signed:true});
				res.status(200).send("logged in");
			}
			else res.status(200).send("wrong password");
		})
	}
	catch(err) {
		console.log(err)
		res.status(200).send("Wrong User")
	}
})


app.post("/api/register", async (req,res) =>{
	console.log("pedido register")
	const dbquery = "INSERT INTO user (username,email,passwd) VALUES (?,?,?)";
	bcrypt.hash(req.body.passwd1,10, async (err,hash) =>{
		if(!err && req.body.user.length>0 && req.body.email.length >0 && req.body.passwd1.length >0){
			try{
				console.log(req.body)
				console.log(hash)
				r = await db.query(dbquery,[req.body.user,req.body.email,hash]);
				console.log(r);
				res.status(200).send("Good")
			}
			catch(error){
				console.log(error)
				if(error.message.search("'email'")!=-1){
					res.status(200).send("email")
				}
				else if(error.message.search("'username'")!=-1){
					res.status(200).send("user")
				}
				else{
					console.log(`Error sql: ${error.message}`)
					res.status(200).send("Bad")
				}
			}
		}
		else{
			console.error(err);
		}
	})
})

app.get("/api/logged", async (req,res) =>{
	if(req.signedCookies.sign){
		res.status(200).send(req.signedCookies.sign)
	}
	else res.status(200).send("not logged")
})

app.get("/api/rooms", async (req,res) =>{
	const dbquery = "SELECT label,descr,rooms.id,capacity,rooms.passwd,user.username FROM rooms INNER JOIN user ON rooms.ownerid=user.id WHERE rooms.available=1";
	try{
		const r = await db.query(dbquery);
		r.forEach(room => {
			room.passwd = !(room.passwd == null);
			if(rooms[room.id]) room.count = rooms[room.id].length;
			else room.count = 0;
		});
		res.status(200).send(r);
	}
	catch(err){
		console.log(err);
		res.status(200).send();
	}
})

app.post("/api/createroom", async (req,res)=>{
	if(req.signedCookies.sign){
		const getiddb = "SELECT id FROM user WHERE username=?"
		const insertdb = "INSERT INTO rooms (ownerid,label,quest_id,capacity,passwd,descr,available) VALUES (?,?,?,?,?,?,1)"
		try{
			let userid = await db.query(getiddb,req.signedCookies.sign)
			userid = userid[0].id
			let passwd = null
			if(req.body.passwd!="") passwd = req.body.passwd
			console.log([userid,req.body.label,req.body.questid,req.body.cap,passwd,req.body.descr])
			await db.query(insertdb,[userid,req.body.label,req.body.questid,req.body.cap,passwd,req.body.descr])
			res.status(200).send("success")
		}
		catch(err){
			console.log(err)
			res.status(200).send("something went wrong")
		}
	}
	else res.status(500).send("")
})

app.get("/api/players", async (req,res)=>{
	if(rooms[req.signedCookies.room]) res.status(200).send(rooms[req.signedCookies.room]);
	else res.status(200).send([]);
})



app.post("/api/joinroom", async (req,res)=>{
	const dbquery = "SELECT passwd FROM rooms WHERE id=?"
	try{
		r = await db.query(dbquery,req.body.id)
		if(!r[0].passwd) {
			res.cookie("room",req.body.id,{signed:true});
			res.status(200).send("room");
		}
		else if(r[0].passwd && req.body.passwd){
			console.log(`${req.signedCookies.sign} is trying to joining room ${req.body.id}\nPasswd: ${req.body.passwd}`)
			if(r[0].passwd == req.body.passwd){
				res.cookie("room",req.body.id,{signed:true});
				res.status(200).send("room");
			}
			else res.status(200).send("passwd")
		}
		else res.status(200).send("passwd")
	}
	catch(err){
		console.log(err)
		res.status(500).send("home")
	}
})

app.post("/api/createquest", async (req,res)=>{
	console.log("someting")
	if(req.signedCookies.sign){
		console.log(req.body)
		const getid = "SELECT id FROM user WHERE user.username=?"
		const insert1db = "INSERT INTO questionaire (title,ownerid) VALUES (?,?);"
		try{
			let userid = await db.query(getid, req.signedCookies.sign)
			userid = userid[0].id
			const r = await db.query(insert1db,[req.body.title,userid])
			const questionaireid = Number(r.insertId)
			console.log(questionaireid)
			const insert2db = "INSERT INTO question (questionaire_id,quest,answers,ord) VALUES (?,?,?,?)"
			for(let i=0; i<req.body.questions.length;i++){
				db.query(insert2db,[questionaireid, req.body.questions[i], req.body.answers[i],i+1])
			}
		}
		catch(err){
			console.log(err)
		}
	}
	else res.status(500).send("");
})

app.get("/api/quests", async (req,res)=>{
	if(req.signedCookies.sign){
		const seldb = "SELECT questionaire.id,title FROM questionaire INNER JOIN user ON user.id=questionaire.ownerid WHERE user.username=?"
		try{
			const r = await db.query(seldb, req.signedCookies.sign)
			res.send(r)
		}
		catch(err){
			console.log(err)
			res.status(500).send("db error")
		}
	}
})


app.get("/api/logout", async function(req,res) {
	res.clearCookie("sign",{signed:true});
	res.status(200).send("Logged out")
})

io.use((socket,next)=>{
	if(socket.request.signedCookies.sign) next();
	else next(new Error("Not logged"));
})

io.use(async (socket,next) =>{
	const room = socket.request.signedCookies.room;
	const socketuser = socket.request.signedCookies.sign; 
	if(room) {
		if(!rooms[room]){
			rooms[room] = []
		}
		if(rooms[room].indexOf(socketuser)!=-1) next(new Error("User already in room"))
		else{
			try{
				const r = await db.query("SELECT available,capacity,username FROM rooms INNER JOIN user ON rooms.ownerid=user.id WHERE rooms.id=?",room)
				console.log(`ROOM ${room} INFO`)
				console.log(r)
				if((!r[0].available && !(roominfo[room] && roominfo[room].players.includes(socketuser))) || rooms[room].length > r[0].capacity) next(new Error("Room full or not available"));
				else{
					rooms[room].push(socketuser)
					console.log(`${socketuser} is joining room ${room}`)
					socket.join(room)
					socket.to(room).emit("data", `${socketuser} has joined`)
					if(roominfo[room] && roominfo[room].players.includes(socketuser)) {
						const c = roominfo[room].curr-1;
						const data = {
							quest: roomquest[room].quest[c],
							owner: roominfo[room].owner == socketuser,
							ans: roomquest[room].ans[c]
						}
						console.log(`qeustlength: ${roomquest[room].quest.length} c: ${c}`)
						if(roomquest[room].quest.length == c){
							data.quest = "Waiting for Results",
							data.ans = []
						}
						console.log(data)
						socket.emit("question", data);
					}
					else{
						const data = {
							quest: "Waiting for game to begin",
							owner: r[0].username == socketuser,
							ans: []
						}
						socket.emit("question", data);
					}
					console.log(rooms)
					next();
				}
			}
			catch(err){
				console.log(err)
			}
		}
	}
	else next(new Error("No room"));
})



io.on("connection", socket =>{
	//console.log(socket.request.headers.cookie.sign)
	
	socket.on("message", (args)=>{
		socket.to(socket.request.signedCookies.room).emit("data",`${socket.request.signedCookies.sign}: ${args}`)
		socket.emit("data",`${socket.request.signedCookies.sign}: ${args}`)
	})

	const sendQuestion = (roomid) =>{
		const c = roominfo[roomid].curr++;
		const data = {
			quest: roomquest[roomid].quest[c],
			owner: 0,
			ans: roomquest[roomid].ans[c]
		}
		console.log(data)
		roominfo[roomid].ans = {}
		io.to(roomid).emit("question", data);
	}

	socket.on("start_game", async ()=>{
		const roomid = socket.request.signedCookies.room;
		const checkAvailable = "SELECT available,username FROM rooms INNER JOIN user ON user.id=rooms.ownerid WHERE rooms.id=?"
		const aval = await db.query(checkAvailable, roomid);
		console.log(aval)
		console.log(socket.request.signedCookies.sign)
		if(aval[0].available && aval[0].username==socket.request.signedCookies.sign){
			const closeRoom = "UPDATE rooms SET available=0 WHERE id=?"
			try{
				await db.query(closeRoom,roomid)
				const dbquery = "SELECT quest, answers, questionaire_id FROM question,rooms WHERE rooms.id=? AND rooms.quest_id=question.questionaire_id ORDER BY question.ord"
				const r = await db.query(dbquery,roomid);
				console.log(r);
	
				const questions = [];
				const answers = [];
				for(let i =0; i< r.length;i++){
					questions.push(r[i].quest)
					answers.push(r[i].answers.split(";"))
				}
	
				roomquest[roomid]={
					quest : questions,
					ans : answers
				};
				roominfo[roomid]={
					quest_id : r[0].questionaire_id,
					curr : 0,
					owner: aval[0].username,
					players: [...rooms[roomid]],
					ans : {}
				};
				console.log(roominfo[roomid]);
				sendQuestion(roomid);
			}
			catch(err){
				console.log(err)
			}
		}
	})

	const saveAnswers = async (roomid)=>{
		const insertquery = "INSERT INTO answer (room_id,answeredby,choice,ord) VALUES (?,?,?,?);"
		const curInfo = roominfo[roomid];
		for(let i=0; i<curInfo.players.length; i++){
			try{
				const cplayer = curInfo.players[i];
				db.query(insertquery,[roomid,cplayer,curInfo.ans[cplayer],curInfo.curr])
			}
			catch(err){
				console.log(err)
			}
		}
	}

	socket.on("option", async (args)=>{
		const roomid = socket.request.signedCookies.room;
		if(args>=0&&args<roomquest[roomid].ans[roominfo[roomid].curr-1].length){
			const socketid = socket.request.signedCookies.sign
			roominfo[roomid].ans[socketid] = args
			if(roominfo[roomid].players.length == Object.keys(roominfo[roomid].ans).length){
				await saveAnswers(roomid);
				console.log(`${roomquest[roomid].quest.length} : ${roominfo[roomid].curr}`)
				if(roomquest[roomid].quest.length > roominfo[roomid].curr) sendQuestion(roomid)
				else {
					roominfo[roomid].curr++;
					const data = {
						quest: "Results",
						owner: 0,
						ans: []
					}
					io.to(roomid).emit("question",data)
				}
			}
		}
	})

	socket.on("results",()=>{
		const roomid = socket.request.signedCookies.room;
		const data = {
			quest: "Waiting for Results",
			owner: socket.request.signedCookies.sign==roominfo[roomid].owner,
			ans: []
		}
		socket.emit("question",data)
	})


	socket.on("result_request", async (ans)=>{
		const roomid = socket.request.signedCookies.room;
		const socketuser = socket.request.signedCookies.sign
		if(socketuser == roominfo[roomid].owner){
			if(!roomanswers[roomid]){
				try{
					const seldb = "SELECT choice,answeredby,ord FROM rooms INNER JOIN answer ON rooms.id=answer.room_id WHERE rooms.id=? ORDER BY ord"
					const r = await db.query(seldb,roomid)
					roomanswers[roomid] = []
					const answers = []
					for(let i = 0; i<roomquest[roomid].quest.length; i++){
						answers[i] = []
						for(let j = 0; j<roomquest[roomid].ans[i].length; j++){
							answers[i][j] = []
						}
					}
					for(let i = 0; i<r.length;i++){
						answers[r[i].ord-1][r[i].choice].push(r[i].answeredby)
					}
					console.log(answers)
					for(let i = 0; i<roomquest[roomid].quest.length; i++){
						roomanswers[roomid].push({
							quest: roomquest[roomid].quest[i],
							options: roomquest[roomid].ans[i],
							values: [...answers[i]]
						})
					}
					console.log(roomanswers[roomid])
					io.to(roomid).emit("results",roomanswers[roomid][0]);
				}
				catch(err){
					console.log(err)
				}
			}
			else{
				if(ans) io.to(roomid).emit("results",roomanswers[roomid][ans]);
				else io.to(roomid).emit("results",roomanswers[roomid][0]);
			}
		}
	})


	socket.on("disconnect", (reason) => {
		const room = socket.request.signedCookies.room;
		rooms[room] = rooms[room].filter(a => a != socket.request.signedCookies.sign)
		socket.to(room).emit("data", `${socket.request.signedCookies.sign} has left`)
        console.log(`${socket.request.signedCookies.sign} has left room ${socket.request.signedCookies.room}`)
		console.log(rooms)
    });

    socket.on("error", (err) => {
        console.log("Socket.IO error:", err);
		console.log(err.stack)
    });

})

io.engine.on("connection_error", (err) => {
	console.error("Engine connection error:", err);
});

httpServer.listen(port);

/** 
app.listen(port, ()=>{
	console.log(`Listening on port ${port}`)
})
 */