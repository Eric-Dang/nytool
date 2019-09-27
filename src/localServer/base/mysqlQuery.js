const {getDateStr} = require('../../serviceMgr')
const mysql = require('mysql');

function packDBResult(dbret, serverID, results, fields){
	// keys 只需要初始化一次
	if (dbret.keys == undefined){
		dbret.keys = []
		dbret.keys.push("serverID")
		fields.forEach((v)=>{
			dbret.keys.push(v.name)
		})
	}

	// datas 初始化一次
	if (dbret.datas == undefined){
		dbret.datas = []
	}
	
	// 添加查询结果
	results.forEach((v)=>{
		var d = {
			serverID : serverID,
		}
		fields.forEach((vv)=>{
			d[vv.name]=v[vv.name]
		})
		dbret.datas.push(d)
	})
	return dbret
}

const dbErrorCode = {
	success:0,
	connectFailed:1,
	sqlError:2,	

	properties:{
        0:{name:'success', value:0},
        1:{name:'connectFailed', value:1},
		2:{name:'sqlError', value:2},
    }
}
// ------------------------------------------------------------------------------------
// 查询数据库
// @dbConfig: db配置 {"serverID" "dbIP" "port" "dbName" "userName" "password"}
// @sql: 执行的语句
// @callBack: 回调函数
// callBack(dbConfig, sql, result)
function queryDataFromDB(dbConfigs, sql, callBack){
	let dbRet = {
		results: []
	}
	dbConfigs.forEach(dbcof=>{
		let connection  = mysql.createConnection({
			host            : dbcof.dbIP,
			port			: dbcof.port,
			user            : dbcof.userName,
			password        : dbcof.password,
			database        : dbcof.dbName,
		});

	  	connection.connect(function(err) {
			if (err) {
				console.error('error connecting: ' + err.stack);
				let errInfo = "连接"+ dbcof.serverID + "服的数据库失败\n" + err.stack
				dbRet.results.push({serverID:dbcof.serverID, info:errInfo, errorCode:dbErrorCode.connectFailed})
			}

			if(dbRet.results.length == dbConfigs.length)
			{
				callBack()
			}
		});

		connection.query(sql, function (error, results, fields) {
			if (error){
				console.error('error query: ' + error.stack);
				let errInfo = "查询"+ dbcof.serverID + "服的数据库失败\n" + error.stack
				dbRet.results.push({serverID:dbcof.serverID, info:errInfo, errorCode:dbErrorCode.sqlError})
			}
			else{
				dbRet.results.push({serverID:dbcof.serverID, info:"", errorCode:dbErrorCode.success})
				packDBResult(dbRet, dbcof.serverID, results, fields)
			}

			if(dbRet.results.length == dbConfigs.length)
			{
				callBack(dbConfigs, sql, dbRet)
			}
		});
		connection.end()
	})
}

module.exports = {
	queryDataFromDB:queryDataFromDB,
	dbErrorCode:dbErrorCode
}