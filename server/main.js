//serve-json.js
const http = require('http');

const serverDomain = "127.0.0.1"
const serverPort = 3000

console.log(`Server will listen at : ${serverDomain}:${serverPort}`);

function resolveBody(req, res, body)
{
    //Create a JSON
    let json_response = {
        status : 200 , 
        message : 'default' 
    }

    if (req.method === "POST"        && req.url === "/one") {
        json_response = {
            status : 200 , 
            message : 'one' 
        }
    } 

    else if (req.method === "POST"   && req.url === "/two") {
        json_response = {
            status : 200 , 
            message : 'two' 
        }
    }

    return json_response
}

http.createServer(function (req, res) {

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        console.log(body);
        let json_response = resolveBody(req, res, body)

        //change the MIME type to 'application/json' 
        res.writeHead(200, {'Content-Type': 'application/json'});
        console.log('Server Running');
        res.end( JSON.stringify(json_response) ); 
    });
    
}).listen(serverPort);

