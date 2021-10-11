const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
const server = http.createServer(app);

// set up the cors
const io = new Server(server, {  
    cors: {    
        origin: "http://localhost:8080",    
        methods: ["GET", "POST"],  
    }
});

io.on('connection', socket => {
    console.log("User conencted: ", socket.id)

    // disconnect from server
    socket.on('disconneect', () => console.log("User disconnected from server: ", data.id))
})

const users = [
    { name: "user1", age: 27, id: 1 },
    { name: "user2", age: 31, id: 2 },
    { name: "user3", age: 26, id: 3 },
]

app.get('/', (req, res) => {
    res.send("<h2> Hello world!</h2>")
})

app.get('/messages', (req, res) => {
    res.json(users)
})

app.listen(port, (err) => {
    if(err) {
        console.log("An error has occured, ", err)
    }
    return console.log(`Sever is running on http://localhost:${port}`)
})