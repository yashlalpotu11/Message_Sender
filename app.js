const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

//init nexmo
const nexmo = new Nexmo({
    apiKey : '0b7ed748',
    apiSecret : 'Tx4L75sS5s83bmAU'
}, {debug : true});

//Init app
const app = express();

//Template engine setup
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

//public folder setup
app.use(express.static(__dirname + '/public'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true}));

//index route
app.get('/', (req, res)=>{
    res.render('index');
})

//catch form submit
app.post('/', (req, res)=>{
    const number = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms(
        '919028920820', number, text, {type : 'unicode'},
        (err, responseData) =>{
            if(err){
                console.log(err);
            }
            else{
                console.log(responseData);
                //Get data from response
                const data = {
                    id : responseData.message[0]['message-id'],
                    number : responseData.message[0]['to']
                }

                //emit to the client
                io.emit('smsStatus', data);
            }
        }
    )
})

//define port
const port = 3001;

//start server
const server = app.listen(port,()=>{
    console.log(`server started on port no ${port}`);
})

//connect to socket io
const io = socketio(server);
io.on('connection', (socket)=>{
    console.log('connected');
    io.on('disconnect', ()=>{
        console.log('Disconnected');
    })
})