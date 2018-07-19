

var canvasContainer = document.getElementById("canvasContainer");

var canvas = document.getElementById("renderCanvas");
var context = canvas.getContext("2d");

var scale = 1;

var height = ~~(canvasContainer.clientHeight*scale);
var width = ~~(canvasContainer.clientWidth*scale);

canvas.height = height;
canvas.width = width;

canvas.style.height = height/scale +"px";
canvas.style.width = width/scale +"px";

var c = {
	 image: "abc.png"
	,width: 40
	,height: 70
	,stroke: "#fff"
	,background: "#222"
	,lineWidth: 3
	,maxAmplitude: 30
	,padding: 50
}

var img = document.createElement("img");
img.onload = processImage;
img.src = c.image;

function processImage(){
	
	var imageWidth = c.width;
	var imageHeight = c.height;
	//var imageHeight = Math.round((imageWidth/img.width) * img.height);
	
	var tempCanvas = document.createElement("canvas");
	var tempContext = tempCanvas.getContext("2d");
	tempCanvas.width = imageWidth;
	tempCanvas.height = imageHeight;
	tempContext.drawImage(img, 0, 0, imageWidth, imageHeight);
	
	var imageData = tempContext.getImageData(0, 0, imageWidth, imageHeight).data;
	var data = new Uint8Array(imageData.length/4);
	
	for(var i = 0; i < data.length; i++){
		data[i] = Math.max(
			imageData[i*4+0],
			imageData[i*4+1],
			imageData[i*4+2]
		) * (imageData[i*4+3]/256);
	}
	
	var lineCount = imageHeight;
	var segmentCount = imageWidth;
	var lines = [];
	
	/* Calculate display size */
	
	var xRatio = img.width / width;
	var yRatio = img.height / height;
	
	//console.log(xRatio, yRatio);
	
	var ratio = Math.max(xRatio, yRatio);
	var displayWidth = img.width / ratio - 2*c.padding;
	var displayHeight = img.height / ratio - 2*c.padding;

	for(let line = 0; line < lineCount; line++){
		lines[line] = [];
		for(let segment = 0; segment < segmentCount; segment++){
			lines[line].push(-Math.random()*(Math.pow(data[line*segmentCount + segment]/256*0.8 + 0.2, 2))*c.maxAmplitude);
		}
	}
	
	context.fillStyle = c.background;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = c.stroke;
	context.lineWidth = c.lineWidth;
	context.translate(
		 width/2 - displayWidth/2
		,height/2 - displayHeight/2
	);
	for(let line = 0; line < lines.length; line++){
		let baseHeight = ((line+1)/(lineCount+1))*displayHeight;
		context.beginPath();
		context.moveTo(0, baseHeight + lines[line][0]);
		for(let segment = 1; segment < lines[line].length; segment++){
			let prevX = ((segment-1)/(segmentCount-1))*displayWidth;
			let x = (segment/(segmentCount-1))*displayWidth;
			let controlPointDist = (displayWidth/segmentCount)*0.5;
			let y = baseHeight + lines[line][segment];
			let prevY = baseHeight + lines[line][segment-1];
			//context.lineTo(x, y);
			context.bezierCurveTo(prevX+controlPointDist, prevY, x-controlPointDist, y, x, y);
		}
		context.stroke();
		context.lineTo(displayWidth, displayHeight);
		context.lineTo(0, displayHeight);
		context.closePath();
		context.fill();
	}
	
}


