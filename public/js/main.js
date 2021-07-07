const numberInp = document.getElementById('number');
const textInp = document.getElementById('msg');
const button = document.getElementById('button');
const response = document.querySelector('.response');

button.addEventListener('click', send, false);

const socket = io();
socket.on('smsStatus', function(data){
    res.innerHTML = `<h5>Text message send to` + data.number + `</h5>`
})

function send(){
    const number = numberInp.value.replace(/\D/g, '');
    const text = textInp.value;

    fetch('/', {
        method :'post',
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify({number : number, text : text})
    })
    .then(function(res){
        console.log(res);
    }).catch(function(err){
        console.log(err);
    })
}