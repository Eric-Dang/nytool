const axios = require('axios');

function rpcLoadConfig(path, callBack){
        axios.get('http://127.0.0.1:999/loadConfig', {
            params: {
                path: path,
            }
        }).then((response)=>{
            console.log("rpcLoadConfig", response.data)
            if(response.data.errorCode === 'ok'){
                callBack(response.data.configs)
            }
            else{
                alert("加载失败！\n"+response.data.errorCode)
            }            
        }).catch(function (error) {
            alert("异常：\n" + error.message)
        });
}

module.exports = {
    loadConfig:rpcLoadConfig
}