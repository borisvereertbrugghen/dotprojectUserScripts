// ==UserScript==
// @name         Dotproject insert data
// @namespace    http://boris.pearlchain.net/
// @version      16.6
// @description  enter something useful
// @author       Boris
// @match        http://dotproject.pearlchain.net/index.php?m=timecard*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// @require https://raw.githubusercontent.com/carhartl/jquery-cookie/master/src/jquery.cookie.js
// ==/UserScript==

function getLastTasks(){
    var theVal =$.cookie("dotprojectTamperLastTasks");
    if(theVal!==null && theVal !== undefined){
        return theVal;
    }else{
        return "";
    }
}
function setLastTasks(taksString){
    if(taksString.lastIndexOf(';',0)===0){
        taksString=taksString.substring(1);
    }
    $.cookie("dotprojectTamperLastTasks",taksString);
}

function showTasks(){
    if(getUrlParameter('removetask')=='all'){
        setLastTasks('');
    }
    var tasks=getLastTasks();
    if(tasks===''){
        return;
    }
    var ts = tasks.split(";");
    console.log(ts);
    var addTasks = '<td width="600">';
    var link=$(location).attr('href');
    var newTasks='';
    for(var i = 0; i < ts.length; i++){
        var task=ts[i];
        if(task===''){
            continue;
        }
        console.log(task);
        var v = task.split('-',5);
        console.log(v);
        var name=v[3];
        var full=v[3];
        if(v.length>=4 && v[4]!=='' && v[4]!== undefined){
            full=v[4];
        }
        if(getUrlParameter('task')==''+i){
            console.log('doing action on task '+i);
            if(getUrlParameter('removetask')=='yes'){
               console.log('Removing task no '+i);
               continue;
            }
        }
        console.log(name);
        console.log(full);
        addTasks += "<div> "+full+" <a href='"+link+"&task="+i+"&removetask=yes'> remove </a></div>";
        if(newTasks===''){
            newTasks=task;
        }else{
            newTasks=newTasks+";"+task;
        }
    }
    console.log(newTasks);
    setLastTasks(newTasks);
    addTasks += "<div>  <a href='"+link+"&removetask=all'> removeAll </a></div>";
    addTasks+='</div>';
    var td = $("table>tbody>tr>td>table>tbody>tr>td>h1").parent();
    td.width(500);
    var row = td.parent();
    row.html(row.html()+addTasks);
}

showTasks();
//when we are on tab 0
var sunday = $( "table>tbody>tr>td>div[align='left']>b" ).filter(":first");//.css( "border", "3px double red" );
if(sunday.length){
    var theTable = sunday.parent().parent().parent().parent().parent();
    var dayEle=null;
    var dayTotalHours=0;
    var tasksInday=new Array();
    var rows = theTable.find("tr");
    rows.each(function (index){
        var day = $(this).find("td>div>b");
        if(day.length){
            var myDay=day.html();
            console.log('found '+myDay);
            if(dayEle!==null && dayTotalHours<8){
                //dayEle.css( "border", "1px solid red" );
                var tasks = getLastTasks();
                console.log(tasks);
                var ts = tasks.split(";");
                console.log(ts);
                var links='<div  style="width:300px;background: rgba(200, 54, 54, 0.3);border:1px solid red;">';
                var link = dayEle.parent().parent().find("a").attr("href");
                for(var i = 0; i < ts.length; i++){
                    var task=ts[i];
                    if(task===''){
                        continue;
                    }
                    console.log(task);
                    var v = task.split('-',4);
                    console.log(tasksInday);
                    if(tasksInday.indexOf(v[2])<0){
                        links += '<div style="width:300px">';
                        links += "<a href='"+link+ "&entity="+v[0]+"&pro="+v[1]+"&task="+v[2]+"&hours="+(8-dayTotalHours)+"' >"+v[3]+"</a> ";
                        var to=(8-dayTotalHours);
                        links += '<span style="position:absolute; right:0px;">';
                        for(var x=1;x<=8;x++){
                            links += '<span style="width:8px;display:inline-block;">';
                            if(x<=to){
                               links += "<a href='"+link+ "&entity="+v[0]+"&pro="+v[1]+"&task="+v[2]+"&hours="+x+"&autopost=1' >"+x+"</a> ";
                            }
                            links += "</span >";
                        }
                        links += "</span >";
                        links += "</div>";
                    }
                }
                links += "</div>";
                console.log(links);
                dayEle.html(dayEle.html()+"<span style='position: absolute;right:14%;font-size:smaller'>"+links+"</span>");
            }
            if(myDay!='Sunday'&&myDay!='Saturday'){
                dayEle=day.parent();
                dayTotalHours=0;
                tasksInday=new Array();
            }else{
                dayEle=null;
            }
        }else{
            if(dayEle!==null){
                var tds = $(this).find("td");
                if(tds.length==3){
                    var hourEle  = $(this).find("td").last();
                    var taskIdUrl = $(this).find("a").first().attr("href");
                    console.log(taskIdUrl);
                    var taskId  = taskIdUrl.substring(24);
                    console.log(taskId);
                    tasksInday.push(taskId);
                    console.log(tasksInday);
                    //hourEle.css( "border", "3px double red" );
                    var hour = parseInt(hourEle.html());
                    dayTotalHours+=hour;
                    console.log('log line '+hour+" / "+dayTotalHours);
                }
            }
        }
    });
    //add extra edit links
    var edits = $( "a:contains('[Edit]')");
    //edits.css( "border", "3px double red" );
    edits.each(function (index){
        var data = $(this).parent();
        var hours = parseInt(data.parent().find("td").last().html());
        var theUrl = $(this).attr("href");
        var newData = data.html();
        for (var i=1;i<=8;i++){
            if(i==hours){
                newData+="<b> "+i+" </b>";
            }else{
                newData+="<a href='"+theUrl+"&hours="+i+"&autopost=1' > "+i+" </a>";
            }
        }
        newData+="<a href='"+theUrl+"&del="+i+"&autopost=1' >"+'<img align="absmiddle" src="./images/icons/stock_delete-16.png" width="16" height="16" alt="Delete this project" border="0"> </a>';
        //newData+='<a href="javascript:delIt()"><img align="absmiddle" src="./images/icons/stock_delete-16.png" width="16" height="16" alt="Delete this project" border="0"></a>';
        data.html(newData);
    });
    
    
}
//when posting a task (tab 2)
var theform = $("form[name='AddEdit']");
if(theform.length){
    console.log("Form");
    $("form[name='AddEdit']").submit(function (e){
  		e.preventDefault();
    	console.log("Before Form");
        var tasks = getLastTasks();
        var entity=$("select[name='project_company']").val();
        var pro=$("select[name='task_project']").val();
        var task=$("select[name='task_log_task']").val();
        console.log('task '+entity+" - "+pro+" - "+task);
        alert('task '+entity+" - "+pro+" - "+task);
        task.fail();
    });
    $("input[name='btnFuseAction']").removeAttr('onclick');
    $("input[name='btnFuseAction']").click(function(){
        var entity=$("select[name='project_company']").val();
        var te = $("select[name='project_company'] option:selected").text().replace("Pearlchain.net","Prl");
        var pro=$("select[name='task_project']").val();
        var tp = $("select[name='task_project'] option:selected").text().replace("PR ","");
        var task=$("select[name='task_log_task']").val();
        var tv = $("select[name='task_log_task'] option:selected").text().replace("TA ","");
        if(entity>0&&pro>0&&task>0){
    		console.log("adding new task");
            var tasks = getLastTasks();
    		console.log(tasks);
            var ts = tasks.split(";");
    		console.log(ts);
            var t=te+"/"+tp+"/"+tv;
            t=t.split("-").join("");
            var value=""+entity+"-"+pro+"-"+task+"-"+t;
            console.log('task '+value);
            var index = ts.indexOf(value);
            if(index>=0){
            	ts.splice(index, 1);
    			console.log("sliced"+ts);
            }
            ts.unshift(value);
    		console.log("unshift"+ts);
            if(ts.lenght>5){
                ts.splice(5,1);
            }
    		console.log("l>5"+ts);
            var newVal=ts.join(';');
    		console.log(newVal);
            setLastTasks(newVal);
        }
        submitIt();
    });
    
    var entity = getUrlParameter('entity');
    if(entity !== undefined){
        $("select[name='project_company']").val(entity);
        changeList('task_project',projects, entity);
    }
    var pro = getUrlParameter('pro');
    if(pro !== undefined){
        $("select[name='task_project']").val(pro);
        changeList('task_log_task',tasks, pro);
    }
    var task = getUrlParameter('task');
    if(task !== undefined){
        $("select[name='task_log_task']").val(task);
    }
    var hours = getUrlParameter('hours');
    if(hours !== undefined){
        $("input[name='task_log_hours']").val(hours);
    }
     var del = getUrlParameter('del');
    if(del !== undefined){
        $("input[name='del']").val(1);
    }
    
    var autoPost = getUrlParameter('autopost');
    if(autoPost==1){
        $("input[name='btnFuseAction']").click();
    }
}else{
    console.log("no Form");
}

function getUrlParameter(sParam)
{
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
} 




