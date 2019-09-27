const fs    = require('fs');
const path  = require('path');
const http  = require('http');
const {getReqProcessFun, getDateStr} = require('./src/serviceMgr')
const axios = require('axios');
const querystring = require('querystring');
// ---
// 导入功能模块
// ---

function loadAllService(){
    var rootDir = path.join(__dirname, './src/localServer/modules')
    var files = fs.readdirSync(rootDir);
    files.forEach(function(file, index) {
        var curPath = rootDir + "/" + file;
        if(fs.statSync(curPath).isFile() && path.extname(curPath) == '.js') {
            const {init} = require(curPath)
            init()
        }
    });
}

loadAllService()

function parsingRequest(data){
    var reqInfos = data.substr(1).split('?')
    console.log("parsingRequest", reqInfos[0])
    return {page:reqInfos[0], params:querystring.parse(reqInfos[1])}
}

var server = http.createServer(function(request, response) {
    console.log(getDateStr() + ' Received request for:' + request.url)
    var reqData = parsingRequest(request.url)
    console.log("recv http", reqData.page, reqData.params)
    var fun = getReqProcessFun(reqData.page)
    fun(reqData.params, response)
});
server.listen(999, function() {
    console.log(getDateStr() + ' Server is listening on port 999');
});
