import React from 'react';
import * as dataMgr from '../../dataMgr';
import './timeSpeed.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
const axios = require('axios');

class QueryDB extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            dbList: Array(),
            selectList:Array(),
            dbRet:null,
        };
    }

    recvServerData(response){
        console.log("1111111111111111111", response.data.keys, response.data.datas);
        this.setState({dbRet:response.data})
    }
    onclick(){
        const selectList = this.state.selectList.slice()
        axios.get('http://127.0.0.1:999/dbQuery', {
            params: {
                dblist:selectList
            }
        }).then((response)=>{
            this.recvServerData(response)
        }).catch(function (error) {
            console.log("22222222222222222", error);
        });
    }

    onadd(){
        const connectList = this.state.connectList.slice()

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


        var dbshows = (<div/>)
        const dbRet = this.state.dbRet
        if(dbRet){
            const datas = []
            dbRet.datas.forEach((x)=>{
                x._id = datas.length
                datas.push(x)
            })
    
            const tt = dbRet.keys.map((i, k)=>{
                return (<TableHeaderColumn dataField={i} dataAlign="center">{i}</TableHeaderColumn>)
            })
    
            dbshows = (
                <BootstrapTable data={datas} striped={true} hover={true}>
                    <TableHeaderColumn dataField="_id" isKey={true} dataAlign="center" dataSort={true}>ID</TableHeaderColumn>
                    {tt}
                </BootstrapTable>
            )
        }

        return (
            <div>
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
                <hr />
                <div>
                    {dbshows}
                </div>
            </div>
        )
    }
}

dataMgr.regNewTool("数据查询", ()=>{return (<QueryDB/>)})
