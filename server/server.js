const express = require('express');
const dotenv = require('dotenv');
const mariadb = require('mariadb');
const cookieParser = require('cookie-parser');
const iocookieParser = require('socket.io-cookie-parser')
const bcrypt = require('bcrypt');
const { createServer } = require('http')
const { Server } = require('socket.io')



dotenv.config({path: '.env-local'});

const db = mariadb.createPool({
	host: process.env.HOST,
	port: process.env.PORTDB,
	user: process.env.USERDB,
	password: process.env.PASSWD,
	database: process.env.DB,
	connectionLimit: 5
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
	const dbquery = "SELECT passwd FROM user WHERE username=?";
	const username = req.body.user;
	try{
		const pass = await db.query(dbquery,username);
		bcrypt.compare(req.body.passwd,pass[0].passwd, (err,r) =>{
			if(r) {
				res.cookie("sign",username,{signed:true});
				res.status(200).send("logged in");
			}
			else res.status(200).send("wrong password");
		})
	}
	catch {
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
	const dbquery = "SELECT label,descr,id,capacity,passwd FROM rooms";
	try{
		r = await db.query(dbquery);
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

app.post("/api/joinroom", async (req,res)=>{
	const dbquery = "SELECT passwd FROM rooms WHERE id=?"
	try{
		r = await db.query(dbquery,req.body.id)
		if(!r[0].passwd) {
			res.cookie("room",req.body.id,{signed:true});
			res.status(200).send(true);
		}
		else res.status(200).send(false)
	}
	catch(err){
		console.log(err)
		res.status(200).send(false)
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
			rooms[room].push(socketuser)
			const r = await db.query("SELECT available,capacity FROM rooms WHERE id=?",room)
			if(!r[0].available || rooms[room].length > r[0].capacity) next(new Error("Room full or not available"));
			else{
				console.log(`${socketuser} is joining room ${room}`)
				socket.join(room)
				socket.to(room).emit("data", `${socketuser} has joined`)
				console.log(rooms)
				next();
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