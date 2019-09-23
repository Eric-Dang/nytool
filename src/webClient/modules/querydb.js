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

    ondel()
    {
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

        return (
            <div>
                <div className="showdiv">
                    <BootstrapTable data={dbList} striped={true} hover={true} >
                        <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}>ID</TableHeaderColumn>
                        <TableHeaderColumn dataField="ip" dataAlign="center" dataSort={true}>Server IP</TableHeaderColumn>
                        <TableHeaderColumn dataField="port" dataAlign="center">Server Port</TableHeaderColumn>
                    </BootstrapTable>
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
