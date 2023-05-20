//includes
const http = require('http');
const crypto = require('crypto');

// constants
const serverDomain = "127.0.0.1"
const serverPort = 3000

const STATUS_PENDING = 0
const STATUS_COMPLETE = 1
var sessions = {}

function genUUID()
{
    return crypto.randomBytes(20).toString('hex')
}

function resolveBody(req, res, body)
{
    jsonbody = JSON.parse(body)

    //Create the default JSON
    let json_response = {
        status : 200 , 
        message : 'default' 
    }

    if (req.method === "POST" && req.url === "/session-result") 
    {
        const status = sessions[jsonbody["sessionid"]]

        // If the session has no response yet, do this
        json_response = {
            status : status === undefined ?  400 : 200,
            sessionstatus: status,
            sessionmessage: status === undefined ? undefined : "<data here>"
        }
    } 

    else if (req.method === "POST" && req.url === "/create-session") 
    {
        console.log(sessions)

        const newid = genUUID() 
        sessions[newid] = STATUS_PENDING

        json_response = {
            status : 200 , 
            id : newid
        }
    }

    return json_response
}

http.createServer(function (req, res) {
    console.log(`Server will listen at : ${serverDomain}:${serverPort}`);

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        let json_response = resolveBody(req, res, body)

        //change the MIME type to 'application/json' 
        res.writeHead(200, {'Content-Type': 'application/json'});
        console.log('Server Running');
        res.end( JSON.stringify(json_response) ); 
    });
    
}).listen(serverPort);

