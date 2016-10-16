var webgl = null;
var vertexShaderObject = null;
var fragmentShaderObject = null;
var programObject = null;
var v4PositionIndex = null;

var vertices = 
[
1.0, 1.0,
1.0, -1.0,
-1.0, 1.0,
-1.0, -1.0
];

function webglInit() {
	//此处的myCanvas为你的canvas的id
	var myCanvas = document.getElementById("myCanvas");
    //此处的containerView为你的canvas的父div元素id
    var myDivObject = document.getElementById("containerView");
    webgl = myCanvas.getContext("experimental-webgl");
    if(webgl == null)
    	alert("你的浏览器不支持webgl");
	myCanvas.width = myDivObject.clientWidth; //千万注意，参见下面说明。
	myCanvas.height = myDivObject.clientHeight; //同上
    webgl.viewport(0, 0, myDivObject.clientWidth, myDivObject.clientHeight);//同上
}

function shaderInitWithVertexAndFragmentShader(vsh, fsh) {
	vertexShaderObject = webgl.createShader(webgl.VERTEX_SHADER);
	fragmentShaderObject = webgl.createShader(webgl.FRAGMENT_SHADER);
	webgl.shaderSource(vertexShaderObject, vsh);
	webgl.shaderSource(fragmentShaderObject, fsh);
	webgl.compileShader(vertexShaderObject);
	webgl.compileShader(fragmentShaderObject);
	if (!webgl.getShaderParameter(vertexShaderObject, webgl.COMPILE_STATUS)) { alert(webgl.getShaderInfoLog(vertexShaderObject) + "in vertex shader"); return; }
	if (!webgl.getShaderParameter(fragmentShaderObject, webgl.COMPILE_STATUS)) { alert(webgl.getShaderInfoLog(fragmentShaderObject) + "in fragment shader"); return; }
}

function initShaderProgram(positionName) {
	programObject = webgl.createProgram();
	webgl.attachShader(programObject, vertexShaderObject);
	webgl.attachShader(programObject, fragmentShaderObject);
	webgl.bindAttribLocation(programObject, v4PositionIndex, positionName);
	webgl.linkProgram(programObject);
	if (!webgl.getProgramParameter(programObject, webgl.LINK_STATUS)) {
		alert(webgl.getProgramInfoLog(programObject));
		return;
	}
	webgl.useProgram(programObject);
}

function getScriptTextByID(scriptID){
	var shaderScript = document.getElementById(scriptID);
	if (shaderScript == null) return "";

	if (shaderScript.textContent != null && shaderScript.textContent != "") {
		return shaderScript.textContent;
	}
	if (shaderScript.text != null && shaderScript.text != "") {
		return shaderScript.text;
	}
	var sourceCode = "";
	var child = shaderScript.firstChild;
	while (child) {
		if (child.nodeType == child.TEXT_NODE) sourceCode += child.textContent;
		child = child.nextSibling;
	}
	return sourceCode;
}

function requestURLPlainText(url) {
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.open("GET", url, false);
	xmlHttp.send();
	return xmlHttp.responseText;
}

function createTextureByImgObject(imgObj){
	//webgl 对象为前面教程里面函数创建的全局WebGL上下文对象。
	//下面这一句可有可无，但为了养成良好习惯，还是写上吧。
	//把临时纹理绑定设定在0号。
	webgl.activeTexture(webgl.TEXTURE0); 
	
	//创建纹理对象，并设置其属性。需要注意的是，
	//在GLES里面，TEXTURE_WRAP_S/T 只能设置为GL_CLAMP_TO_EDGE，所以也是可以不写的哟。
	var textureObject = webgl.createTexture();
	webgl.bindTexture(webgl.TEXTURE_2D, textureObject);
	webgl.texImage2D(webgl.TEXTURE_2D, 0, webgl.RGBA, webgl.RGBA, webgl.UNSIGNED_BYTE, imgObj);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MIN_FILTER, webgl.NEAREST);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_MAG_FILTER, webgl.NEAREST);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_S, webgl.CLAMP_TO_EDGE);
	webgl.texParameteri(webgl.TEXTURE_2D, webgl.TEXTURE_WRAP_T, webgl.CLAMP_TO_EDGE);

	return textureObject;
}

//在此，我们封装出一个通过img标签的id创建一个纹理的函数：
function createTextureByImgID(imgID){
	var imgObj = document.getElementById(imgID);
	if(imgObj == null) {
		return null; //这里应该写一些容错代码，但是本阶段属于初级阶段，暂不考虑。
	}
	return createTextureByImgObject(imgObj);
}

//绘制图片纹理
function renderOrigin(){
	// 读者可选择自己喜欢的加载方式，本教程为了方便，
	// 选择html标签方式加载shader代码。
	var vsh = getScriptTextByID("vsh_main"); 
	var fsh = getScriptTextByID("fsh_origin");	

	webglInit();
	shaderInitWithVertexAndFragmentShader(vsh, fsh);
	initShaderProgram("position");

	var buffer = webgl.createBuffer();
	webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
	webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);

	webgl.enableVertexAttribArray(v4PositionIndex);
	webgl.vertexAttribPointer(v4PositionIndex, 2, webgl.FLOAT, false, 0, 0);

	//在这里把我们的纹理交给WebGL:
	var texObj = createTextureByImgID("myimage");
	// 为了安全起见，在使用之前请绑定好纹理ID。虽然在createTextureByImgID函数里面已经绑定了，但是，那并不是必须的，这里才是必须的。
	webgl.activeTexture(webgl.TEXTURE0); 
	var uniform = webgl.getUniformLocation(programObject, "inputImageTexture");
	webgl.uniform1i(uniform, 0);

	webgl.clearColor(0.0, 0.0, 0.0, 1.0);
	webgl.clear(webgl.COLOR_BUFFER_BIT);
	webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);
}



//video
var video = document.getElementById("myvideo");
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;
var exArray = []; //存储设备源ID
MediaStreamTrack.getSources(function (sourceInfos) {
	for (var i = 0; i != sourceInfos.length; ++i) {
		var sourceInfo = sourceInfos[i];
        //这里会遍历audio,video，所以要加以区分
        if (sourceInfo.kind === 'video') {
        	exArray.push(sourceInfo.id);
        }
    }
});

function getMedia() {
	if (navigator.getUserMedia) {
		navigator.getUserMedia({
			'video': {
				'optional': [{
                    'sourceId': exArray[1] //0为前置摄像头，1为后置
                }]
            },
            'audio':true
        }, successFunc, errorFunc);    //success是获取成功的回调函数
	}
	else {
		alert('Native device media streaming (getUserMedia) not supported in this browser.');
	}
}

function successFunc(stream) {
    //alert('Succeed to get media!');
    if (video.mozSrcObject !== undefined) {
        //Firefox中，video.mozSrcObject最初为null，而不是未定义的，我们可以靠这个来检测Firefox的支持
        video.mozSrcObject = stream;
    }
    else {
    	video.src = window.URL && window.URL.createObjectURL(stream) || stream;
    }
}

function errorFunc(e) {
	alert('Error！'+e);
}

// 将视频帧绘制到Canvas对象上,Canvas每60ms切换帧，形成肉眼视频效果
function drawVideoAtCanvas(video,context) {
	window.setInterval(function () {
		context.drawImage(video, 0, 0,517,517);
	}, 60);
}

//视频
function getVedio() {
	var myCanvas = document.getElementById('myCanvas');
	var myContext = myCanvas.getContext('2d');
	drawVideoAtCanvas(video, myContext);
	// drawVideoAtCanvas(video, webgl);
}
//video

//绘制摄像头纹理
function renderCamera(){
	// 读者可选择自己喜欢的加载方式，本教程为了方便，
	// 选择html标签方式加载shader代码。
	var vsh = getScriptTextByID("vsh_main"); 
	var fsh = getScriptTextByID("fsh_origin");	

	webglInit();
	// shaderInitWithVertexAndFragmentShader(vsh, fsh);
	// initShaderProgram("position");

	// var buffer = webgl.createBuffer();
	// webgl.bindBuffer(webgl.ARRAY_BUFFER, buffer);
	// webgl.bufferData(webgl.ARRAY_BUFFER, new Float32Array(vertices), webgl.STATIC_DRAW);

	// webgl.enableVertexAttribArray(v4PositionIndex);
	// webgl.vertexAttribPointer(v4PositionIndex, 2, webgl.FLOAT, false, 0, 0);

	// //在这里把我们的纹理交给WebGL:
	// var texObj = createTextureByImgID("myimage");
	// // 为了安全起见，在使用之前请绑定好纹理ID。虽然在createTextureByImgID函数里面已经绑定了，但是，那并不是必须的，这里才是必须的。
	// webgl.activeTexture(webgl.TEXTURE0); 
	// var uniform = webgl.getUniformLocation(programObject, "inputImageTexture");
	// webgl.uniform1i(uniform, 0);

	// webgl.clearColor(0.0, 0.0, 0.0, 1.0);
	// webgl.clear(webgl.COLOR_BUFFER_BIT);
	// webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 4);

	var video = document.getElementById("myvideo");
}