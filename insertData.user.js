// ==UserScript==
// @name         Dotproject insert data
// @namespace    http://boris.pearlchain.net/
// @version      0.1
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
    $.cookie("dotprojectTamperLastTasks",taksString);
}

//when we are on tab 0
var sunday = $( "table>tbody>tr>td>div[align='left']>b" ).filter(":first");//.css( "border", "3px double red" );
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
            dayEle.css( "border", "1px solid red" );
            var tasks = getLastTasks();
        	console.log(tasks);
            var ts = tasks.split(";");
        	console.log(ts);
            var links='';
            var link = dayEle.parent().parent().find("a").attr("href");
            for(var i = 0; i < ts.length; i++){
                var task=ts[i];
                console.log(task);
                var v = task.split('-',4);
                console.log(tasksInday);
                if(tasksInday.indexOf(v[2])<0){
                    links += "<span style='padding-left:20px;'> <a href='"+link+ "&entity="+v[0]+"&pro="+v[1]+"&task="+v[2]+"&hours="+(8-dayTotalHours)+"' >"+v[3]+"</a> </span>";
                }
            }
            console.log(links);
            dayEle.html(dayEle.html()+"<span style='position: absolute;right:15%;font-size:smaller'>"+links+"</span>");
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
                var taskIdUrl = $(this).find("a").first().attr("href")
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




