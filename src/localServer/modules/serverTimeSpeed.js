const {regNewReq,getDateStr} = require('../../serviceMgr')
const {TelnetClient} = require('../base/TelnetClient')

function processChangeTimeSpeed(clientData, response){
    var allServers = JSON.parse(clientData.servers)
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
}

module.exports = {
    init:function(){regNewReq('changeTimeSpeed', processChangeTimeSpeed)}
}