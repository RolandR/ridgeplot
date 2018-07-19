

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
	 image: "burgunder_heightmap.png"
	,width: 600
	,height: 300
	,stroke: "#fff"
	,background: "#111"
	,lineWidth: 0.5
	//,maxAmplitude: canvas.height * 0.04
	,maxAmplitude: 400
	,padding: -200
	,turnsPerSecond: 0.05
	,translateZ: -1.5
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
	
	/*tempCanvas.style.position = "absolute";
	tempCanvas.style.top = "0px";
	canvasContainer.appendChild(tempCanvas);*/
	
	var lineCount = imageHeight;
	var segmentCount = imageWidth;
	
	/* Calculate display size */
	
	var xRatio = img.width / width;
	var yRatio = img.height / height;
	
	//console.log(xRatio, yRatio);
	
	var ratio = Math.max(xRatio, yRatio);
	var displayWidth = img.width / ratio - 2*c.padding;
	var displayHeight = img.height / ratio - 2*c.padding;
	
	displayHeight = displayHeight * 0.3;
	
	var translateX = ~~(width/2 - displayWidth/2)+0.5;
	var translateY = ~~(height/2 - displayHeight/2)+0.5;
	
	context.fillStyle = c.background;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.strokeStyle = c.stroke;
	context.lineWidth = c.lineWidth;
	context.translate(
		 translateX
		,translateY
	);
	
	var rotation = 0;
	
	var drawPadding = ((Math.sqrt(2)-1) * (imageWidth))/2;
	//var drawPadding = 0;
	
	var startTime = Date.now();
	
	var imageData = tempContext.getImageData(0, 0, imageWidth, imageHeight).data;
	
	render();
	
	function render(){
		
		var angle = (((Date.now()-startTime)/1000)*(2*Math.PI*c.turnsPerSecond) + Math.PI) % (2*Math.PI);
		
		context.fillStyle = c.background;
		context.fillRect(-translateX, -translateY, canvas.width, canvas.height);
		tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
		
		tempContext.save();
		tempContext.scale(1, c.height/c.width);
		tempContext.translate(tempCanvas.width/2, tempCanvas.width/2);
		tempContext.rotate(angle);
		tempContext.translate(-tempCanvas.width/2, -tempCanvas.width/2);
		tempContext.drawImage(img, -drawPadding, -drawPadding, imageWidth+drawPadding*2, imageWidth+drawPadding*2);
		tempContext.restore();
		
		imageData = tempContext.getImageData(0, 0, imageWidth, imageHeight).data;
		
		var baseHeight = (1/(lineCount+1))*displayHeight;
		
		context.beginPath();
		
		for(var i = 0; i < imageData.length; i += 4){
			var x = ((i/4)%imageWidth)/imageWidth - 0.5;
			var z = (~~((i/4)/imageWidth))/imageHeight - 0.5 + c.translateZ;
			var y = imageData[i]/256 - 0.5;
			
			var isNewLine = (i/4)%imageWidth == 0;
			
			var drawX = (x/z + 0.5)*displayWidth;
			var drawY = (y/z + 0.5)*displayHeight;
			
			if(isNewLine){
				
				context.lineWidth = (z+0.5-c.translateZ)*0.3+0.1;
				var color = (z+0.5-c.translateZ)*128+128;
				context.strokeStyle = "rgb(0, "+color+", 0)";
				
				context.stroke();
				context.beginPath();
				
				context.moveTo(drawX, drawY);
			} else {
				context.lineTo(drawX, drawY);
			}
			
			
			//distance = distance * distance;
			/*var distanceWidth = (displayWidth*(distance*0.9+0.1));
			var distancePadding = (displayWidth-distanceWidth)/2;
			
			if(x == 0){
				
				baseHeight = Math.pow(distance,2)*displayHeight;
				
				draw(distance, distanceWidth, distancePadding);
			}
			
			var posX = ~~((x/(segmentCount-1))*distanceWidth + distancePadding);
			var posY = ~~(baseHeight - (imageData[i]/256)*c.maxAmplitude * distance);
			
			if(x == 0){
				context.moveTo(distancePadding, posY);
			} else {
				context.lineTo(posX, posY);
			}*/
		}
		
		/*function draw(distance, distanceWidth, distancePadding){
			context.lineWidth = (distance/2)+0.1;
			var color = (Math.pow(distance, 1.5)) * 128 + 128;
			//context.fillStyle = "rgb("+color+", "+color+", "+color+")";
			//color = color + 100;
			context.strokeStyle = "rgb(0, "+color+", 0)";
			context.stroke();
			//context.lineTo(distanceWidth + distancePadding, displayHeight);
			//context.lineTo(distancePadding, displayHeight);
			//context.closePath();
			//context.fill();
			context.beginPath();
		}*/
		
		requestAnimationFrame(render);
		
	}
	
}


