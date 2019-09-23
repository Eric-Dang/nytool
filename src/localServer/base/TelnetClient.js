var net = require('net');
var iconv = require("iconv-lite");
const TelnetState = {
    init: 0,
    failed:1,
    connecting:2,
    authing:3,
    ready:4,
    close:5,

    properties:{
        0:{name:'init', value:0},
        1:{name:'failed', value:1},
        2:{name:'connecting', value:2},
        3:{name:'authed', value:3},
        4:{name:'ready', value:4},
        5:{name:'close', value:4},
    }
}


const strUtil = {
    search: function(str, pattern){
        if (pattern instanceof RegExp)
            return (str.search(pattern) != -1)
        else
            return (str.indexOf(pattern) != -1)
    }
}
 
class TelnetClient{
    constructor(telnetConfig){
        this.host = telnetConfig.host != undefined ? telnetConfig.host : '127.0.0.1'
        this.port = telnetConfig.port != undefined ? telnetConfig.port : 8080
        this.username = telnetConfig.username != undefined ? telnetConfig.username : 'root'
        this.password = telnetConfig.password != undefined ? telnetConfig.password : 'root'
        this.timeout =  telnetConfig.timeout != undefined ? telnetConfig.timeout : 1000
        this.loginPrompt = telnetConfig.loginPrompt != undefined ? telnetConfig.loginPrompt : 'Login: '
        this.passwordPrompt = telnetConfig.passwordPrompt != undefined ? telnetConfig.passwordPrompt : 'Password: '
        this.irs = telnetConfig.irs != undefined ? telnetConfig.irs : '\r\n'
        this.shellPrompt = telnetConfig.shellPrompt != undefined ? telnetConfig.shellPrompt : /(?:\/ )?#\s/
        this.execTimeout = telnetConfig.execTimeout != undefined ? telnetConfig.execTimeout : 2000
        this.sendTimeout = telnetConfig.sendTimeout != undefined ? telnetConfig.sendTimeout : 2000
        this.debug = telnetConfig.debug != undefined ? telnetConfig.debug : false
        this.serverEncoding = telnetConfig.encoding
        this.net = null
        this.state = TelnetState.init
        this.processFuns = {}
        this.sending = false
        this.sendlist = new Array()
        this.evts = {
            "data"      : true,
            "close"     : true,
            "drain"     : true,
            "end"       : true,
            "error"     : true,
            "lookup"    : true,
            "ready"     : true,
            "timeout"   : true,
            "authed"    : true,
        }
    }

    connect(){
        this.net = net.Socket() // net.createConnection({host:this.host, port:this.port})

        this.net.setEncoding('binary');
        if(this.timeout > 0)
            this.net.setTimeout(this.timeout, ()=>{
                if(this.processFuns.timeout)
                    this.processFuns.timeout()
            })

        this.state = TelnetState.connecting
        this.net.connect(this.port, this.host)
        // 时间处理
        this.net.on("connect",  (data)=>{this.connected(data)})
        this.net.on("data",     (data)=>{this.recvmessage(data)})
        this.net.on("close",    (data)=>{this.close(data)})
        this.net.on("drain",    (data)=>{this.drain(data)})
        this.net.on("end",      (data)=>{this.netend(data)})
        this.net.on("error",    (data)=>{this.error(data)})
        this.net.on("lookup",   (data)=>{this.lookup(data)})
        this.net.on("ready",    (data)=>{this.ready(data)})
        // this.net.on("timeout",  this.timeout)
    }

    send(data, callback){
        if (this.net == null)
        {
            if (callback)
                callback(false)
            return false
        }

        
        if (this.sending)
        {
            this.sendlist.push({data: data, cb: callback})
            return true
        }
        else
        {
            this.sending = this.state
            this.net.write(data+this.irs, () =>{
                this.sending = false
                if(callback)
                    callback(true)
                var n = this.sendlist.shift()
                if(n)
                    this.send(n.data, n.cb)
            })
        }
    }

    debuglog(format, ...args){
        if(this.debug){
            console.log(format, ...args)
        }
    }

    connected(){
        this.state = TelnetState.authing
        this.debuglog("connect to %s %d ok!", this.host, this.port)
    }

    recvmessage(data){
        if(data == undefined)
            return

        if(this.serverEncoding != undefined)
            data = iconv.decode(data, this.serverEncoding)

        if(this.state == TelnetState.authing){
            if(strUtil.search(data, this.loginPrompt))
                this.send(this.username + this.irs)
            else if(strUtil.search(data, this.passwordPrompt))
                this.send(this.username + this.irs)
            else if (strUtil.search(data, this.shellPrompt)){
                this.state = TelnetState.ready
                if(this.processFuns.authed)
                    this.processFuns.authed(data)
            }
        }
        else if(this.state == TelnetState.ready){
            if(this.processFuns.data)
                this.processFuns.data(data)
            else
                this.debuglog("recvmessage no process fun %s", data)
        }
        else
        {
            this.debuglog("recvmessage is error state %s, recv data %s", this.state, data)
        }
    }

    close(data){
        this.net = null
        this.debuglog("telnet close")
        if(this.processFuns.close)
            this.processFuns.close(data)
    }

    drain(data){
        this.debuglog("telnet drain %s", data)
        if(this.processFuns.drain)
            this.processFuns.drain(data)
    }

    netend(data){
        this.debuglog("telnet netend %s", data)
        if(this.processFuns.end)
            this.processFuns.end(data)
    }

    error(data){
        this.debuglog("telnet error %s", data)
        if(this.processFuns.error)
            this.processFuns.error(data)
    }

    lookup(data){
        this.debuglog("telnet lookup %s", data)
        if(this.processFuns.lookup)
            this.processFuns.lookup(data)
    }

    ready(data){
        this.debuglog("telnet ready %s", data)
        if(this.processFuns.ready)
            this.processFuns.ready(data)
    }

    timeout(data){
        this.debuglog("telnet timeout %s", data)
        if(this.processFuns.timeout)
            this.processFuns.timeout(data)
        this.net.destroy()
        this.net = null
    }

    release(){
        this.net.destroy()
        this.net = null
    }
    
    on(evt, cb){
        if(!this.evts[evt]){
            this.debuglog("添加监听接口失败! 不支持 evt:%s", evt)
            return false
        }
        else if(this.processFuns[evt] != undefined){
            this.debuglog("添加监听接口失败! 已经添加 %s", this.processFuns)
            return false
        }
        else if(typeof(cb) != 'function'){
            this.debuglog("添加监听接口失败! 回调接口类型错误 %s", typeof(cb))
            return false
        }
        else{
            this.processFuns[evt] = cb
            return true
        }
    }
}
// electron
// 使用require
// export default TelnetClient;

// nodejs
// 使用 import
module.exports = {
    TelnetClient:TelnetClient
}
