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
        const dbList = this.state.dbList.slice()
        const selectList = this.state.selectList.slice()
        let dbConfigs = []
        selectList.forEach((v,i)=>{
            console.log("selectList.forEach", v,i)
            if(v == true && dbList[i]){
                dbConfigs.push(dbList[i])
            }
            else{
                alert("异常：\n 数据信息异常")
                return
            }
        })

        if(dbConfigs.length == 0)
        {
            alert("选择要查询的数据库")
            return
        }
        console.log("sql", sqlText.value)
        axios.get('http://localhost:999/dbQuery',{
            params:{
                dbConfigs:JSON.stringify(dbConfigs),
                sql:sqlText.value
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

            console.log("datas", datas)
    
            const tt = dbRet.keys.map((i, k)=>{
                return (<TableHeaderColumn dataField={i} dataAlign="center">{i}</TableHeaderColumn>)
            })
            
            let showError = ""
            dbRet.results.forEach((x)=>{
                if(x.errorCode != 0){
                    showError = showError + x.info + '\n'
                }
            })
            let errorShow
            if(showError.length > 0)
            {
                dbshows = (
                    <div>
                    <text>showError</text><hr/>
                    <BootstrapTable data={datas} striped={true} hover={true}>
                        <TableHeaderColumn dataField="_id" isKey={true} dataAlign="center" dataSort={true}>ID</TableHeaderColumn>
                        {tt}
                    </BootstrapTable>
                    </div>
                )
            }
            else{
                dbshows = (
                    <BootstrapTable data={datas} striped={true} hover={true}>
                        <TableHeaderColumn dataField="_id" isKey={true} dataAlign="center" dataSort={true}>ID</TableHeaderColumn>
                        {tt}
                    </BootstrapTable>
                )
            }
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
