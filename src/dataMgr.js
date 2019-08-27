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
        return (<text className="defaultTip">还没新功能</text>);

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
