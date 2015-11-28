var http = require("http");
var request = require('request');
var httpg = require('http-get');
var fs = require('fs');
var PDFDocument = require ('pdfkit');
var NEW_NODE_REQUEST = "/NEW_NODE/";
var nextID = 0;
var TEST_REQUEST = "/TEST";

function write(data, address){fs.writeFile(address, data, function (err,data) {
  if (err) {
    return console.log(err);
  }
  console.log("Write successful");
});}

function read(address){
	fs.readFile(address, "utf8", function (err,data) {
  		if (err) {
    	return console.log(err);
  		}
  		console.log(data);
	});
}

http.createServer(function (request, response) {
	
	//FAVICON
	if(request.url == "/favicon.ico"){
		response.writeHead(200, {'Content-Type': 'image/x-icon'} );
    	response.end();
    	return;
	
	//TEST    	
	} else if(request.url == TEST_REQUEST){
		//response.writeHead(200, {'Content-Type': 'text/plain'});
		/*var file = fs.createWriteStream("file.png");
		var rq = http.get("http://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example", function(rp) {
  		rp.pipe(file);
		});*/
		
		httpg.get('http://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example', 'img.png', function (error, result) {
    	if (error) {
        	console.error(error);
    	} else {
        	console.log('File downloaded at: ' + result.file);
        	//downloadFile("api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example","img.png",function(){});
		doc = new PDFDocument();
		doc.pipe(response);
		//doc.pipe(fs.createWriteStream('file.pdf'));
		doc.image('img.png');
		
		doc.end()
    	}
		});

		
    	//response.end("TEST");
    	return;
	
    //NEW NODE
	} else if(request.url.substring(0,NEW_NODE_REQUEST.length) === NEW_NODE_REQUEST){
		var split = request.url.split("/");
		var userId = split[2];
		var qr = split[3];
		console.log("NEW NODE: " + userId + " " + qr);
		write(userId + "/" + qr,"nodes/" + nextID + ".txt");
		response.writeHead(200, {'Content-Type': 'text/plain'});
		response.end(nextID + "");
		nextID++;
	}

	console.log(request.url);
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   
   // Send the response body as "Hello World"
   response.end('Hello World\n');
}).listen(8081);



// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');