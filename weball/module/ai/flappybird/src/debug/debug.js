function Debug() {
    this.startTime = document.getElementById("startTime");
    this.trainingTime = document.getElementById("trainingTime");
    this.hightScore = document.getElementById("hightScore");
    this.trainingInfo = document.getElementById("trainingInfo");
    this.other = document.getElementById("other");
}

Debug.prototype.printStartTime = function () {
	this.startTime.innerHTML = "开始时间: " + DateTime(window.startTime);
}

Debug.prototype.printTrainingTime = function () {
	this.trainingTime.innerHTML = "训练时间: " + DiffDateTime(window.startTime.getTime(), Date.now());
}

Debug.prototype.printHightScore = function () {
	this.hightScore.innerHTML = "最高分数: " + window.hightScore + "分 " + DateTime(new Date());
}

Debug.prototype.printTrainingInfo = function (info) {
	this.trainingInfo.innerHTML = "训练信息: " + info;
}

Debug.prototype.printOther = function (info) {
	this.other.innerHTML = "补充信息: " + info;
}

function DateTime (date) {
	var year = date.getFullYear();
	var month = (date.getMonth()+1<10?"0":"")+(date.getMonth()+1);
	var day = (date.getDate()<10?"0":"")+date.getDate();
	var hours = (date.getHours()<10?"0":"")+date.getHours();
	var minutes = (date.getMinutes()<10?"0":"")+date.getMinutes();
	var seconds = (date.getSeconds()<10?"0":"")+date.getSeconds();
	return year + "-" + month + "-" + day + " " +
		hours + ":" + minutes + ":" + seconds;
}

function DiffDateTime(millisecondStart, millisecondEnd) {
	 //时间差的毫秒数
	var diff = millisecondEnd - millisecondStart;
	//计算出相差天数
	var days=Math.floor(diff/(24*3600*1000));
	//计算天数后剩余的毫秒数
	var left=diff%(24*3600*1000);
	//计算出小时数
	var hours=Math.floor(left/(3600*1000));
	//计算小时后剩余的毫秒数
	var left=left%(3600*1000);
	//计算相差分钟数
	var minutes=Math.floor(left/(60*1000));
	//计算分钟后剩余的毫秒数
	var left=left%(60*1000); 
	//计算相差秒数
	var seconds=Math.round(left/1000);
	return (days+"天"+hours+"小时"+minutes+"分钟"+seconds+"秒");
}
