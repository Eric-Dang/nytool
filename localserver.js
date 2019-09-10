const  {TelnetClient} = require("./src/modules/TelnetClient")
const fs = require('fs');
const lf = fs.openSync("./log.txt", 'w')
require("http").createServer(function (req, res) {
    // var tc = new TelnetClient({host:'192.168.10.91', port:9920, username:'root', password:'root', shellPrompt:'*********************'})
    // tc.connect()
    fs.appendFileSync(lf, req.headers.host + " " + req.url + '\r\n')
    res.end(req.url + " Hello from server started by Electron app!");
}).listen(9090)