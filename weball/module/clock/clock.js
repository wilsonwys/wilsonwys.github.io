var canvas = document.getElementById('clock');
var ctx = canvas.getContext('2d');
ctx.save();
var SIZE = Math.min(canvas.width, canvas.height);
var r = SIZE / 2;
//通过rem确保时钟尺寸变化时元素尺寸同步变化
//设计尺寸是200，所以比例参照200计算
var rem = SIZE / 200;
//确保canvas大小为正方形
canvas.width = canvas.height = SIZE;
//将canvas原点设置到中心位置
ctx.translate(r, r);

//画钟盘、数字和刻度点
function drawBackground() {
	//draw clock circle
	ctx.beginPath();
	ctx.lineWidth = 10 * rem;
	ctx.arc(0, 0, r - ctx.lineWidth / 2, 0, 2 * Math.PI);
	ctx.stroke();
	//draw numbers
	var hourNumbers = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2];
	ctx.font = 15 * rem + 'px Arail';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle = '#000000';
	hourNumbers.forEach(function(number, i){
		var rad = 2 * Math.PI / 12 * i;
		var x = Math.cos(rad) * (r - 30 * rem);
		var y = Math.sin(rad) * (r - 30 * rem);
		ctx.fillText(number, x, y);
	});
	//draw dots
	for(var i = 0; i < 60; i++) {
		var rad = 2 * Math.PI / 60 * i;
		var x = Math.cos(rad) * (r - 18 * rem);
		var y = Math.sin(rad) * (r - 18 * rem);
		ctx.beginPath();
		if(i % 5 === 0) {
			ctx.fillStyle = '#000000';
		} else {
			ctx.fillStyle = '#cccccc';
		}
		ctx.arc(x, y, 2 * rem, 0, 2*Math.PI);
		ctx.fill();
	}
}

//画时针
function drawHour(hour = 0, minute = 0, second = 0, millisecond = 0) {
	ctx.save();
	ctx.beginPath();
	var hourRad = 2 * Math.PI / 12 * hour;
	var minuteRad = 2 * Math.PI / 12 / 60 * minute;
	var secondRad = 2 * Math.PI / 12 / 60 / 60 * second;
	var millisecondRad = 2 * Math.PI / 12 / 60 / 60 / 1000 * millisecond;
	ctx.rotate(hourRad + minuteRad + secondRad + millisecondRad);
	ctx.lineWidth = 4 * rem;
	ctx.lineCap = 'round';
	ctx.moveTo(0, 10 * rem);
	ctx.lineTo(0, -40 * rem);
	ctx.closePath();
	ctx.stroke();
	ctx.restore();
}

//画分针
function drawMinute(minute = 0, second = 0, millisecond = 0) {
	ctx.save();
	ctx.beginPath();
	var minuteRad = 2 * Math.PI / 60 * minute;
	var secondRad = 2 * Math.PI / 60 / 60 * second;
	var millisecondRad = 2 * Math.PI / 60 / 60 / 1000 * millisecond;
	ctx.rotate(minuteRad + secondRad + millisecondRad);
	ctx.lineWidth = 3 * rem;
	ctx.lineCap = 'round';
	ctx.moveTo(0, 10 * rem);
	ctx.lineTo(0, -60 * rem);
	ctx.closePath();
	ctx.stroke();
	ctx.restore();
}

//画秒针
function drawSecond(second = 0, millisecond = 0) {
	ctx.save();
	ctx.beginPath();
	var secondRad = 2 * Math.PI / 60 * second;
	var millisecondRad = 2 * Math.PI / 60 / 1000 * millisecond;
	ctx.rotate(secondRad + millisecondRad);
	ctx.fillStyle = '#e14543';
	ctx.moveTo(-2 * rem, 15 * rem);
	ctx.lineTo(2 * rem, 15 * rem);
	ctx.lineTo(1 * rem, -75 * rem);
	ctx.lineTo(-1 * rem, -75 * rem);
	ctx.lineTo(-2 * rem, 15 * rem);
	ctx.closePath();
	ctx.fill();
	ctx.restore();
}

//画中心点
function drawDot() {
	ctx.beginPath();
	ctx.fillStyle = '#ffffff';
	ctx.arc(0, 0, 3 * rem, 0, 2 * Math.PI)
	ctx.closePath();
	ctx.fill();
}

//刷新整个时钟
function draw() {
	ctx.clearRect(-1 * r, -1 * r, 2 * r, 2 * r);
	var time = new Date();
	var hour = time.getHours();
	var minute = time.getMinutes();
	var second = time.getSeconds();
	var millisecond = time.getMilliseconds();
	drawBackground();
	drawHour(hour, minute, second, millisecond);
	drawMinute(minute, second, millisecond);
	drawSecond(second, millisecond);
	drawDot();
}

//当页面加载完成时调整clock大小
window.onload = function() {
	//先画一次，避免出现空白
	draw();
	//按指定频率更新时钟
	setInterval(draw, 16);
	resizeTimer();
}

//当窗口大小改变时调整clock大小
window.onresize = function() {
	resizeTimer();
}

//调整clock大小计时器，用于动画
var resizeTimerId = 0;
function resizeTimer() {
	//动态改变clock大小
	window.clearInterval(resizeTimerId);
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	var targetSize = Math.min(w, h) * 0.8;
	resizeTimerId = setInterval(
		function () {
			resizeClock(targetSize, 20);
		},16);
}

//调整clock大小
function resizeClock(targetSize = 450, step = 20) {
	ctx.restore();
	if(SIZE > targetSize) {
		SIZE -= step;
	} else {
		SIZE += step;
	}
	r = SIZE / 2;
	//通过rem确保时钟尺寸变化时元素尺寸同步变化
	//设计尺寸是200，所以比例参照200计算
	rem = SIZE / 200;
	//确保canvas大小为正方形
	canvas.width = canvas.height = SIZE;
	//将canvas原点设置到中心位置
	ctx.translate(r, r);
	//接近targetSize，停止动画
	if(Math.abs(SIZE - targetSize) <= step + 1) {
		window.clearInterval(resizeTimerId);
	}
}