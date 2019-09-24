import React from 'react';
import * as dataMgr from '../../dataMgr';
import './timeSpeed.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
const axios = require('axios');

class TimeSpeed extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            connectList: Array(),
            speed: 0,
            selectList: Array(),            
        };
    }

    recvServerData(response){
        alert(response.data.info)
    }
    onclick(){
        const connectList = this.state.connectList.slice()
        axios.get('http://localhost:999/changeTimeSpeed', {
            params: {
                speed: this.state.speed,
                servers:JSON.stringify(connectList)
            }
        }).then((response)=>{this.recvServerData(response)}).catch(function (error) {
            alert("异常：\n" + error.message)
        });
    }

    onadd(){
        const connectList = this.state.connectList.slice()
        var ipText = document.getElementById('ip');
        var portText = document.getElementById('port');
        var hasAdd = false
        connectList.forEach((v) => {
            if (v.ip == ipText.value && v.port == portText.value)
                hasAdd = true
        });

        if (!hasAdd)
        {
            connectList.push({ip:ipText.value, port:portText.value, id:connectList.length + 1})
            this.setState({connectList:connectList})
        }
    }
    onspeed()
    {
        var multText = document.getElementById('mult');
        this.setState({speed:multText.value})
    }

    ondel()
    {
        const connectList = this.state.connectList.slice()
        const selectList = this.state.selectList.slice()
        for(var i = selectList.length; i >= 0; i--)
        {
            if(selectList[i] == true)
                connectList.splice(i, 1)
        }
        selectList.splice(0)
        this.setState({connectList:connectList})
        this.setState({selectList:selectList})
    }

    render() {
        const connectList = this.state.connectList.slice()
        connectList.forEach((v,i)=>{
            connectList[i].id = i
        })
        const selectRowProp = {
            mode: 'checkbox',
            bgColor: 'yellow',
            clickToSelect: true,
            onSelect:(data,isSelected, event, rowIndex)=>{
                console.log("select id",data,isSelected, event, rowIndex)
                const selectList = this.state.selectList.slice()
                if(isSelected)
                    selectList[rowIndex] = true
                else
                    selectList[rowIndex] = false

                this.setState({selectList:selectList})
            }
        };

        return (
            <div>
                <div className="multdiv">
                    <text className='title'>速度 </text><br/><br/>
                    <text className="multText">加速倍数:</text><input type="text" id="mult" className="multInput"/>
                    <button className="multButton" onClick={()=>{this.onspeed()}}> 修改速度 </button><br/>
                </div>
                <hr />
                <div className="serverdiv">
                    <text className='title'>服务器配置 </text><br/><br/>
                    <text className="ipText">服务器IP:</text><input type="text" id="ip" className="ipInput"/><br/>
                    <text className="portText">端口:</text><input type="text" id="port" className="portInput"/><br/>
                    <button className="addButton" onClick={()=>{this.onadd()}}> 添加 </button><br/>
                </div>
                <hr />
                <div className="showdiv">
                    <text className='title'>已添加服务器</text><br/><br/>
                    <BootstrapTable data={connectList} striped={true} hover={true} selectRow={selectRowProp}>
                        <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn dataField="ip" dataAlign="center" dataSort={true}>Server IP</TableHeaderColumn>
                        <TableHeaderColumn dataField="port" dataAlign="center">Server Port</TableHeaderColumn>
                    </BootstrapTable>
                    <button className="execButton" onClick={()=>{this.onclick()}}> 执行 </button>
                    <button className="delButton" onClick={()=>{this.ondel()}}> 删除 </button><br/>
                </div>
            </div>
        )
    }
}

dataMgr.regNewTool("时间加速", ()=>{return (<TimeSpeed/>)})
