const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');

//init nexmo
const nexmo = new Nexmo({
    apiKey : 'API_KEY',
    apiSecret : 'SECRET_KEY'
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
        'YOUR_REGISTER_NUMBER', number, text, {type : 'unicode'},
        (err, responseData) =>{
            if(err){
                console.log(err);
            }
            else{
                //Get data from response
                const {messages} = responseData;
                const { ['message-id']: id, ['to']: number, ['error-text']: error  } = messages[0];
                console.dir(responseData);
                const data = {
                    // id : responseData.message[0]['message-id'],
                    // number : responseData.message[0]['to']
                    id, number, error
                };

                //emit to the client
                io.emit('smsStatus', data);
            }
        }
    );
});

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