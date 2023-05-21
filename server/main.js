//includes
const http = require('http');
const crypto = require('crypto');

// constants
const serverDomain = "127.0.0.1"
const serverPort = 3000

const STATUS_PENDING = 0
var sessions = new Map()

function genUUID()
{
    return crypto.randomBytes(20).toString('hex')
}

function logWithTime(s)
{
    console.log(new Date().toISOString(), "   ", s)
}

function cleanSessions()
{
    const now = Date.now()

    sessions.forEach((value, key) => {
        if (now - value.timestamp > 1000 * 60 * 60) {
            sessions.delete(key)
            logWithTime(`Deleted old key ${key}`)
        }
    })
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
        json_response = {
            status : 400
        }

        try{
            const status = sessions.get(jsonbody["sessionid"]).status
            const sessiondate = sessions.get(jsonbody["sessionid"]).timestamp

            // If the session has no response yet, do this
            json_response = {
                status : 200,
                sessionstatus: status,
                sessioncreated: sessiondate
            }
        }
        catch (err) {
            logWithTime(err)
        }
    } 

    else if (req.method === "POST" && req.url.endsWith("/create-session"))
    {
        cleanSessions()

        logWithTime(sessions)

        const newid = genUUID() 
        sessions.set(newid, {
            status: STATUS_PENDING, 
            timestamp: Date.now()
        })

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

        logWithTime(`Trying to get ${jsonbody["sessionid"]} from 'sessions'`)

        try {
            
            const modifiedSession = sessions.get(jsonbody["sessionid"])
            logWithTime(modifiedSession)
            modifiedSession.status = jsonbody["proofstring"]
            logWithTime(modifiedSession)
            
            sessions.set(jsonbody["sessionid"], modifiedSession)

            json_response = {
                status : 200
            }
        }
        catch (err) {
            logWithTime(err)
        }
    }

    return json_response
}

http.createServer(function (req, res) {
    logWithTime(`Server will listen at : ${serverDomain}:${serverPort}`);

    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
    });
    req.on('end', () => {
        if (body== '')
            body = '{}'

        let json_response = resolveBody(req, body)

	// CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
        //change the MIME type to 'application/json' 
        res.writeHead(200, {'Content-Type': 'application/json'});
        logWithTime('Server Running');
        res.end( JSON.stringify(json_response) ); 
    });
    
}).listen(serverPort);

