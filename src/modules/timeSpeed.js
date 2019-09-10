import React from 'react';
import * as dataMgr from '../dataMgr';
import './timeSpeed.css';

class TimeSpeed extends React.Component {
    constructor(props){
        super(props);
        this.state = {name:"timeSpeed"}
        this.connectList = new Array()
    }

    onclick(){
        var ws = new WebSocket("http://localhost:9090/base?n=test")
        ws.onopen = function(e) {
            socket.send("My name is John");
        };
        ws.onmessage = function(event) {
            alert(`[message] Data received from server: ${event.data}`);
        };
          
        ws.onclose = function(event) {
            if (event.wasClean) {
                alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
            } else {
                // e.g. server process killed or network down
                // event.code is usually 1006 in this case
                alert('[close] Connection died');
            }
            ws.close()
        };
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
                    <button className="changeButton" onClick={this.onclick}> 修改 </button><br/>
                </div>
            </div>
        )
    }
}

dataMgr.regNewTool("时间加速", ()=>{return (<TimeSpeed/>)})