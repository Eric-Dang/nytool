import React from 'react';
import * as dataMgr from '../dataMgr';
import './timeSpeed.css';
//var {TelnetClient, strUtil} = require("./TelnetClient")
// import TelnetClient from "./TelnetClient"

class TimeSpeed extends React.Component {
    constructor(props){
        super(props);
        this.state = {name:"timeSpeed"}
        this.connectList = new Array()
    }

    onclick(){
        var config = {
            host: '192.168.10.91',
            port:9920,
            shellPrompt:"***************************",
            debug:true,
            username:'root',
            password:'root',
            encoding:'GB2312'
        }
        // var nt = new TelnetClient(config)
        // nt.connect()
    }

    render() {
        return (
            <div>
                <div>
                    <text>加速倍数:</text><br/>
                    <input type="text" id="mult" className="timeSpeed"/><br/><br/>
                    <text>服务器IP:</text><br/>
                    <input type="text" id="ip" className="timeSpeed"/><br/><br/>
                    <text>端口:</text><br/>
                    <input type="text" id="port" className="timeSpeed"/><br/><br/>
                    <button className="changeButton" onClick={this.onclick()}> 修改 </button><br/>
                </div>
            </div>
        )
    }
}

dataMgr.regNewTool("时间加速", ()=>{return (<TimeSpeed/>)})