var http = require('http');
const {TelnetClient} = require('./src/localServer/base/TelnetClient')
var {getReqProcessFun} = require('./src/serviceMgr')
// import * as dd from './src/serviceMgr'

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
    var page, clientData = parsingRequest(decodeURI(request.url))
    var fun = getReqProcessFun(page)
    fun(clientData, response)
});
server.listen(999, function() {
    console.log(getDateStr() + ' Server is listening on port 999');
});
