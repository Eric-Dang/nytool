const {regNewReq,getDateStr} = require('../../serviceMgr')
const {TelnetClient} = require('../base/TelnetClient')

function processChangeTimeSpeed(clientData, response){
    var allServers = JSON.parse(clientData.servers)
    var count = allServers.length
    var ret = {
        errCode:'finish',
        info: "speed: " + clientData.speed + "\n",
    }
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
        
        let t = new TelnetClient(telnetConfig)
        t.on('authed', ()=>{
            try{
                let speed = Number(clientData.speed)
                console.log(getDateStr() + " speed: "+ speed);
                if(isNaN(speed) || speed < 0)
                    throw {message:"速度必须为大于等于0的数字"}

                let cmd = "timeSpeedChange("+ Number(clientData.speed) + ")"
                t.send(cmd)    
            }
            catch(error){
                var ret = {
                    errCode:'error',
                    info: error.message,
                }
                response.end(JSON.stringify(ret))
            }
        })

        t.on('data', (data)=>{
            console.log(getDateStr() + " ip:"+ server.ip + " port:" + server.port + " finish!");
            count = count - 1
            ret.info = ret.info + getDateStr() + " ip:"+ server.ip + " port:" + server.port + " finish!\n"
            if(count === 0)
                response.end(JSON.stringify(ret))

            t.release()
        })
        t.connect()
    })
}

module.exports = {
    init:function(){regNewReq('changeTimeSpeed', processChangeTimeSpeed)}
}