
var mysql = require('mysql');
var connection  = mysql.createConnection({
	// connectionLimit : 10,
	// insecureAuth:true,
  	host            : 'localhost',
  	user            : 'root',
  	password        : '123456',
  	database        : 'test'
});

connection.connect(function(err) {
  	if (err) {
		console.error('error connecting: ' + err.stack);
		return;
  	}

  	console.log('connected as id ' + connection.threadId);
});

function getDateStr() {
    var d = new Date()
    return String().concat(d.getFullYear(), "-", d.getMonth(), "-", d.getDay(), " ", d.getHours(), ":", d.getMinutes(), ":", d.getSeconds())
}

var server = http.createServer(function(request, response) {
    console.log(getDateStr() + ' Received request for:' + decodeURI(request.url));
    // var page, params = parsingRequest(decodeURI(request.url))
    // var tt = JSON.parse(params.servers)
	// console.log("params", tt)
	
	connection.query('SELECT * from test;', function (error, results, fields) {
		if (error) throw error;
		const ret = packDBResult(1, results, fields)
		var s = JSON.stringify(ret)
		var t = JSON.parse(s)
		console.log("data", s)
		console.log("data2", t)
		response.setHeader("access-control-allow-origin", "http://localhost:3000")
		response.write(s)
		response.end()
	});
	response.end("123")
});