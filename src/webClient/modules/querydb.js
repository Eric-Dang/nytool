import React from 'react';
import * as dataMgr from '../../dataMgr';
import './timeSpeed.css';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
const axios = require('axios');
const {loadConfig} = require("../base/loadConfig")

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
//E:\\GitHub\\nytool\\config\\dbConfig.json
//E:\GitHub\nytool\config\dbConfig.json
    onloadConfig()
    {
        const configPathText = document.getElementById('configPath');
        console.log("configPathText", configPathText.value)
        loadConfig(configPathText.value, data=>{
            let dbList = Array()
            data.dbList.forEach(x=>{
                if(undefined === x.userName){
                    x.userName = data.default.userName
                }
                if(undefined === x.password){
                    x.password = data.default.password
                }
                dbList.push(x)
            })
            this.setState({dbList:dbList})
        })
    }

    onDBExecute()
    {
        const sqlText = document.getElementById('sql');
        const connectList = this.state.connectList.slice()
        axios.get('http://localhost:999/dbQuery', {
            params: {
                speed: this.state.speed,
                servers:JSON.stringify(connectList)
            }
        }).then((response)=>{this.recvServerData(response)}).catch(function (error) {
            alert("异常：\n" + error.message)
        });
    }

    render() {
        const dbList = this.state.dbList.slice()
        dbList.forEach((v,i)=>{
            dbList[i].id = i
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
                <label className="dbconfig">
                    <text>配置信息</text>
                    <div className="showdiv">
                        <text className="ipText">配置地址:</text>
                        <textarea type="text" id="configPath" className="configPath"/>
                        <button className="multButton" onClick={()=>{this.onloadConfig()}}>加载配置</button><br/>
                        <hr/>
                        <BootstrapTable data={dbList} striped={true} hover={true} selectRow={selectRowProp}>
                            <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>ID</TableHeaderColumn>
                            <TableHeaderColumn dataField="serverID" dataAlign="center" dataSort={true}>server ID</TableHeaderColumn>
                            <TableHeaderColumn dataField="dbIP" dataAlign="center" dataSort={true}>Server IP</TableHeaderColumn>
                            <TableHeaderColumn dataField="port" dataAlign="center">Server Port</TableHeaderColumn>
                        </BootstrapTable>
                    </div>
                </label>
                <label className="dbresult">
                    <text>查询结果</text>
                    <div className="showdiv">
                        <text className="ipText">SQL:</text>
                        <textarea type="text" id="sql" className="dbSql"/>
                        <button className="dbExecute" onClick={()=>{this.onDBExecute()}}>执行</button><br/>
                        <hr/>
                        {dbshows}
                    </div>
                </label>
            </div>
        )
    }
}

dataMgr.regNewTool("数据查询", ()=>{return (<QueryDB/>)})
