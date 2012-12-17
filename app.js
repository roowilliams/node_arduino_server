/* This app waits for data from the serial port, and then emits it to client side
 as 'serialEvent' */

var serialport = require("serialport"); // include the serialport library
var SerialPort = serialport.SerialPort; // localize object constructor

var express =   require('express'),
    app     =   express(), 
    http  =   require('http'),
    server =  http.createServer(app),
    io    =   require('socket.io').listen(server);

// listen for new web clients:
server.listen(8080);        

// open the serial port. Change the name to the name of your port, just like in Processing and Arduino:
var sp = new SerialPort("/dev/tty.usbmodem3a21", { 
    // look for return and newline at the end of each data packet:
    parser: serialport.parsers.readline("\r\n") 
});


// respond to web GET requests with the index.html page:
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
  
});



// listen for new socket.io connections:
io.sockets.on('connection', function (socket) {
    // if there's a socket client, listen for new serial data:  
    sp.on('data', function (data) {
        socket.emit('serialEvent', data);
    });
});





