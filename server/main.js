//includes
const http = require('http');
const crypto = require('crypto');

// constants
const serverDomain = "127.0.0.1"
const serverPort = 3000

const STATUS_PENDING = 0
var sessions = {}

function genUUID()
{
    return crypto.randomBytes(20).toString('hex')
}

function resolveBody(req, body)
{
    jsonbody = JSON.parse(body)

    //Create the default JSON
    let json_response = {
        status : 200 , 
        message : 'default' 
    }

    if (req.method === "POST" && req.url.endsWith("/session-status"))
    {
        const status = sessions[jsonbody["sessionid"]]

        // If the session has no response yet, do this
        json_response = {
            status : status === undefined ?  400 : 200,
            sessionstatus: status,
            sessionmessage: status === undefined ? undefined : jsonbody["proofstring"]
        }
    } 

    else if (req.method === "POST" && req.url.endsWith("/create-session"))
    {
        console.log(sessions)

        const newid = genUUID() 
        sessions[newid] = STATUS_PENDING

        json_response = {
            status : 200 , 
            id : newid
        }
    }

    else if (req.method === "POST" && req.url.endsWith("/submit-session-result"))
    {
        json_response = {
            status : 400
        }

        if (sessions[jsonbody["sessionid"]] !== undefined) {
            sessions[jsonbody["sessionid"]] = jsonbody["proofstring"]

            json_response = {
                status : 200
            }
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
        if (body== '')
            body = '{}'

        let json_response = resolveBody(req, body)

        //change the MIME type to 'application/json' 
        res.writeHead(200, {'Content-Type': 'application/json'});
        console.log('Server Running');
        res.end( JSON.stringify(json_response) ); 
    });
    
}).listen(serverPort);

