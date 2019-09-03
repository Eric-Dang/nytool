import React from 'react';
import * as dataMgr from '../dataMgr';
import './timeSpeed.css';
var {TelnetClient} = require("./TelnetClient")

class TimeSpeed extends React.Component {
    constructor(props){
        super(props);
        this.state = {name:"timeSpeed"}
        this.connectList = new Array()
    }

    onclick(){
        // var config = {
        //     host: '192.168.10.91',
        //     port:9920,
        //     shellPrompt:"***************************",
        //     debug:true,
        //     username:'root',
        //     password:'root',
        //     encoding:'GB2312'
        // }
        // var nt = new TelnetClient(config)
        // nt.connect()
    }

    render() {
        return (
            <div>
                <div>
                    <text>加速倍数:</text>
                    <input type="text" id="timeSpeed" />
                </div>
                <div>
                    <text>服务器IP:</text>
                    <input type="text" id="timeSpeed" />
                </div>
                <div>
                    <text>端口:</text>
                    <input type="text" id="timeSpeed" />
                </div>
                <button onClick={this.onclick()}> ok </button>
            </div>
        )
    }
}

dataMgr.regNewTool("时间加速", ()=>{return (<TimeSpeed/>)})