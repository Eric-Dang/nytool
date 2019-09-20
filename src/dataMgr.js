import React from 'react';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import './dataMgr.css';
// ------------------------------------------------------------------------------------------------------
// 功能信息
// ------------------------------------------------------------------------------------------------------
// 功能配置表
var toolConfig = new Array()
// ------------------------------------------------------------------------------------------------------
function createToolObj(name, render){
    return {
        name: name,
        render:render,
    }
}

// 注册新功能
// @name: 标签页名字
// @render: 页面绘制函数 返回为绘制内容
// 例: function render() return (<ToolClass/>)
export function regNewTool(name, render){
    if(typeof(render) != "function")
        return false

    if(typeof(name) != "string")
        return false
    
    var to = createToolObj(name, render)
    toolConfig.push(to)
}
// ------------------------------------------------------------------------------------------------------
// 页面部分
// ------------------------------------------------------------------------------------------------------
// 获取所有功能按钮
function GetShowInfo(f){
    if (toolConfig.length == 0)
        return (
        <div>
        <text className="defaultTip">还没新功能</text>
        </div>);

    var webShows = toolConfig.map(
        (x) => {
            return (<Tab label={x.name}> {x.render()} </Tab>)
        }
    )
    return(
        <div className="BaseBorder">
            <Tabs className="ToolButtonBorder">
            {webShows}
            </Tabs>
        </div>
    );
}


export function ShowInfo(f){
    return GetShowInfo(f)
}

// ------------------------------------------------------------------------------------------------------
// 本地服务接口
// ------------------------------------------------------------------------------------------------------
var clientReqProcess = {}
// ------------------------------------------------------------------------------------------------------
// @page: 请求的页面
// @proFun(clientData, response): 处理函数
// @proFun @clientData: 客户端发送的请求参数
// @proFun @response: http对应的response对象(简单实用参考serverTimeSpeed.js)
export function regNewReq(page, proFun){
    if(clientReqProcess[page]){
        console.error("regNewReq repeat reg! %s", page)
    }
    else{
        clientReqProcess[page] = proFun
    }
}
// 根据页面获取处理函数 如果不存在则返回默认函数
export function getReqProcessFun(page){
    if(clientReqProcess[page]){
        return clientReqProcess[page]
    }

    return (clientData, response)=>{
        console.error("getReqProcessFun not process fun! %s", page)
        response.writeHead(404, "对应请求无法处理！")
        response.end()
    }
}