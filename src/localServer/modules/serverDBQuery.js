const {regNewReq,getDateStr} = require('../../serviceMgr')
const {queryDataFromDB} = require('../base/mysqlQuery')
const fs = require("fs")

function dbQuery(clientData, response){
    const dbConfigs = JSON.parse(clientData.dbConfigs)

    queryDataFromDB(dbConfigs, clientData.sql, (_c, _s, ret)=>{
        console.log("dbQuery", ret)
        let rets = JSON.stringify(ret)
        response.setHeader("Access-Control-Allow-Origin","*")
        response.write(rets)
        response.end()
    })
}

module.exports = {
    init:function(){regNewReq('dbQuery', dbQuery)}
}