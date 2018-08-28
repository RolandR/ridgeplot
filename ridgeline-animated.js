

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
	,xSamples: 400
	,zSamples: 400
	,background: "#111"
	,padding: -200
	,turnsPerSecond: 0.05
	,translateZ: -0.7
}

var img = document.createElement("img");
img.onload = processImage;
img.src = c.image;

function processImage(){
	
	var imageWidth = img.width;
	var imageHeight = img.height;
	//var imageHeight = Math.round((imageWidth/img.width) * img.height);
	
	var tempCanvas = document.createElement("canvas");
	var tempContext = tempCanvas.getContext("2d");
	tempCanvas.width = img.width;
	tempCanvas.height = img.height;
	tempContext.drawImage(img, 0, 0, imageWidth, imageHeight);
	
	var largestDimension = Math.max(img.width, img.height);
	
	var xDist = largestDimension;
	var zDist = largestDimension;
	
	/* Calculate display size */
	
	var xRatio = img.width / width;
	var yRatio = img.height / height;
	
	var ratio = Math.max(xRatio, yRatio);
	var displayWidth = img.width / ratio - 2*c.padding;
	var displayHeight = img.height / ratio - 2*c.padding;
	displayHeight = displayHeight * 0.2;
	
	var translateX = ~~(width/2 - displayWidth/2)+0.5;
	var translateY = ~~(height/2 - displayHeight/2)+0.5;
	
	context.fillStyle = c.background;
	context.fillRect(0, 0, canvas.width, canvas.height);
	context.translate(
		 translateX
		,translateY
	);
	
	var rotation = 0;	
	var startTime = Date.now();
	
	var imageData = tempContext.getImageData(0, 0, imageWidth, imageHeight).data;
	var data = new Uint8Array(imageData.length/4);
	
	for(var i = 0; i < data.length; i ++){
		data[i] = imageData[i*4];
	}
	
	render();
	
	function render(){
		
		context.fillRect(-translateX, -translateY, canvas.width, canvas.height);
		
		var angle = (((Date.now()-startTime)/1000)*(2*Math.PI*c.turnsPerSecond) + Math.PI) % (2*Math.PI);
		
		var basePos = [
			Math.sin(angle)*(largestDimension/2) - Math.cos(angle)*(largestDimension/2) + largestDimension/2,
			Math.cos(angle)*(largestDimension/2) + Math.sin(angle)*(largestDimension/2) + largestDimension/2
		];
		
		var xIncrement = [
			Math.sin(angle)*xDist,
			Math.cos(angle)*xDist
		];
		
		
		var zIncrement = [
			Math.cos(angle)*zDist,
			Math.sin(angle)*zDist
		];
		
		for(var zs = 0; zs < c.zSamples; zs++){
			var z = zs/c.zSamples-0.5 + c.translateZ;
			var pos = [
				basePos[0] + zIncrement[0]*(zs/c.zSamples),
				basePos[1] - zIncrement[1]*(zs/c.zSamples)
			];
			for(var xs = 0; xs < c.xSamples; xs++){
				var x = xs/c.xSamples-0.5;
				var samplePos = [
					pos[0] - xIncrement[0]*(xs/c.xSamples),
					pos[1] - xIncrement[1]*(xs/c.xSamples),
				]
				
				var y = -0.5;
				var fooX = ~~samplePos[0];
				var fooY = ~~samplePos[1];
				
				if(!(fooX<0 || fooX>=img.width || fooY<0 || fooY>=img.height)){
					y = data[fooX + fooY*img.width]/256 - 0.5
				}
				
				//console.log(~~samplePos[0], ~~samplePos[1], y);
				
				var drawX = (x/z + 0.5)*displayWidth;
				var drawY = (y/z + 0.5)*displayHeight;
				
				if(xs == 0){
					context.lineWidth = (z+0.5-c.translateZ)*0.3+0.1;
					var color = (z+0.5-c.translateZ)*128+128;
					context.strokeStyle = "rgb(0, "+color+", 0)";
					
					context.stroke();
					context.beginPath();
					
					context.moveTo(drawX, drawY);
				} else {
					context.lineTo(drawX, drawY);
				}
			}
		}
		
		
		requestAnimationFrame(render);
	}
		
	/*function getValueAt(x, y){

		if(x<0 || x>=img.width || y<0 || y>=img.height){
			return 0;
		}

		var pos = x + y*img.width;
		return data[pos];
		
	}*/
	
	function rendurr(){
		
		var angle = (((Date.now()-startTime)/1000)*(2*Math.PI*c.turnsPerSecond) + Math.PI) % (2*Math.PI);
		
		context.fillStyle = c.background;
		context.fillRect(-translateX, -translateY, canvas.width, canvas.height);
		/*tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
		
		tempContext.save();
		tempContext.scale(1, c.height/c.width);
		tempContext.translate(tempCanvas.width/2, tempCanvas.width/2);
		tempContext.rotate(angle);
		tempContext.translate(-tempCanvas.width/2, -tempCanvas.width/2);
		tempContext.drawImage(img, -drawPadding, -drawPadding, imageWidth+drawPadding*2, imageWidth+drawPadding*2);
		tempContext.restore();
		
		imageData = tempContext.getImageData(0, 0, imageWidth, imageHeight).data;*/
		
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


