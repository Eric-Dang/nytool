// ------------------------------------------------------------------------------------------------------
// 本地服务接口
// ------------------------------------------------------------------------------------------------------
var clientReqProcess = {}
// ------------------------------------------------------------------------------------------------------
// @page: 请求的页面
// @proFun(clientData, response): 处理函数
// @proFun @clientData: 客户端发送的请求参数
// @proFun @response: http对应的response对象(简单实用参考serverTimeSpeed.js)
function regNewReq(page, proFun){
    if(clientReqProcess[page]){
        console.error("regNewReq repeat reg! %s", page)
    }
    else{
        clientReqProcess[page] = proFun
    }
}
// 根据页面获取处理函数 如果不存在则返回默认函数
function getReqProcessFun(page){
    if(clientReqProcess[page]){
        return clientReqProcess[page]
    }

    return (clientData, response)=>{
        console.error("getReqProcessFun not process fun! %s", page)
        response.end("对应请求无法处理！")
    }
}

module.exports = {
    getReqProcessFun:getReqProcessFun,
    regNewReq:regNewReq
}
