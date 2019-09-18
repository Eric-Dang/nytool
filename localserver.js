var http = require('http');
const {TelnetClient} = require('./src/modules/TelnetClient')

function strMapToObj(map) {
  let obj = Object.create(null);
  for (let [k,v] of map) {
    obj[k] = v;
  }
  return obj;
}

function getDateStr() {
    var d = new Date()
    return String().concat(d.getFullYear(), "-", d.getMonth(), "-", d.getDay(), " ", d.getHours(), ":", d.getMinutes(), ":", d.getSeconds(), ".", d.getMilliseconds())
}

function parsingRequest(data){
    var reqInfos = data.substr(1).split('?')
    var page = reqInfos[0]
    var param = reqInfos[1].split('&')

    var params = {}
    for (i = 0; i < param.length; ++i)
    {
        var ps = param[i].split('=')
        params[ps[0]] = ps[1]
    }
    return page, params
}

var server = http.createServer(function(request, response) {
    console.log(getDateStr() + ' Received request for:' + decodeURI(request.url));
    var page, params = parsingRequest(decodeURI(request.url))
    var allServers = JSON.parse(params.servers)
    var count = allServers.length
    allServers.forEach((server) =>{
        var telnetConfig = {
            host:server.ip,
            port:Number(server.port),
            username:'root',
            password:'root',
            debug:true,
            shellPrompt:"***************************",
            encoding:'GB2312'
        }
        
        var t = new TelnetClient(telnetConfig)
        t.on('authed', ()=>{
            t.send("print('aaaaaaaaaaaaaa')")
        })
    
        t.on('data', (data)=>{
            console.log(getDateStr() + " ip:"+ server.ip + " port:" + server.port + " finsh!");
            response.write("ip:"+ server.ip + " port:" + server.port + " finsh!");
            count = count - 1
            if(count === 0)
                response.end()

            t.release()
        })
        t.connect()
    })
});
server.listen(999, function() {
    console.log(getDateStr() + ' Server is listening on port 999');
});