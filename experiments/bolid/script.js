var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var keys = [];


function init()
{
	//********************
	//csillagok beállítása
	//********************
	for(i=0;i<30;++i)
	{
	lassu[i]=[Math.random()*480,Math.random()*700];
	kozepes[i]=[Math.random()*480,Math.random()*700];
	gyors[i]=[Math.random()*480,Math.random()*700];
	}

	tick();
}



function collideObject(x,y,width,height)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

//********************
//BG animation
//********************
function drawStars()
{
	var i;

	ctx.lineWidth=4;

	for(i=0;i<30;++i)
	{

		ctx.strokeStyle="yellow";
		ctx.fillStyle = "yellow";
		ctx.beginPath();ctx.moveTo(lassu[i][1],lassu[i][0]);ctx.lineTo(lassu[i][1]+1,lassu[i][0]+1);ctx.stroke();

		ctx.strokeStyle="white";
		ctx.fillStyle = "white";
		ctx.beginPath();ctx.moveTo(kozepes[i][1],kozepes[i][0]);ctx.lineTo(kozepes[i][1]+1,kozepes[i][0]+1);ctx.stroke();

		ctx.strokeStyle="#2b6fff";
		ctx.fillStyle = "#2b6fff";
		ctx.beginPath();ctx.moveTo(gyors[i][1],gyors[i][0]);ctx.lineTo(gyors[i][1]+1,gyors[i][0]+1);ctx.stroke();
		lassu[i][1]-=sebesseg;
		kozepes[i][1]-=sebesseg*2;
		gyors[i][1]-=sebesseg*4;
		if(lassu[i][1] < 0) lassu[i]=[Math.random()*480,Math.random()*700];
		if(kozepes[i][1] < 0) kozepes[i]=[Math.random()*480,Math.random()*700];
		if(gyors[i][1] < 0) gyors[i]=[Math.random()*480,Math.random()*700];
	}	
}

function clearScreen()
{
		//Clear screen
		ctx.fillStyle = "black";
		ctx.fillRect(0,0,640, 480);
		ctx.globalAlpha = 0.3;
		putImg("gameBG.jpg",0,0,640,480);
		ctx.globalAlpha = 1.0;
}

function putImg(src,x,y,w,h){
	var img = new Image();
	img.src = src; 
	ctx.drawImage(img,x,y,w,h);            
}

function tick()
{
	world.scrollSpeed += 0.001;
	



	player.move();
	world.checkCollision();

	world.deleteOldTiles();
	world.newTile();

	world.tick();

	clearScreen();
	if(world.autoscroll == true) drawStars();
	world.render();
	player.render();

	requestAnimationFrame(world.render);
	window.setTimeout("tick()", 15);
}

function intersection(x1, y1, w1, h1, x2, y2, w2, h2)
{
	if (w2 !== Infinity && w1 !== Infinity) {
		w2 += x2;
		w1 += x1;
		if (isNaN(w1) || isNaN(w2) || x2 > w1 || x1 > w2) return false;
	  }
	  if (y2 !== Infinity && h1 !== Infinity) {
		h2 += y2;
		h1 += y1;
		if (isNaN(h1) || isNaN(y2) || y2 > h1 || y1 > h2) return false;
	  }

	  return true;
	  
}

//********************
//BG animation data
//********************
var lassu=[0,0];
var kozepes=[0,0];
var gyors=[0,0];
var sebesseg=2;











var player = {
	x: 160,
	y:360,
	width:30,
	height:30,
	velY: 0,
	speed: 2,
	friction: 0.9,
	moveDir: 0,
	canMove: true,

	render: function()
	{
		ctx.imageSmoothingEnabled = false;
		/*ctx.fillStyle = "green";
		ctx.fillRect(player.x,player.y,player.width,player.height);*/
		putImg("player.png",this.x,this.y,this.width,this.height);
		ctx.imageSmoothingEnabled = true;

	},

	move: function()
	{

		if(player.moveDir == 1) player.velY--;
		if(player.moveDir == -1) player.velY++;

		
		// apply some friction to y velocity.
		player.velY *= player.friction;
		for(index in world.tiles)
		{
			var tile = world.tiles[index];

			if(intersection(tile.x,tile.y,tile.width,tile.height,player.x,player.y,player.width,player.height))
			{
				player.canMove = false;
			}
		}

		if(player.canMove) player.y += player.velY;

		if (player.y > 600) {
			player.y = 600;
		} else if (player.y <= 0) {
			player.y = 0;
		}

	}
	
}






var world = {
	height:480,
	width:640,
	autoscroll: true,
	scrollSpeed: 3,
	distanceTravelled: 0,


	
	
	tiles:
	[
		new collideObject(640,200,60,60)
	],

	render: function(){


		ctx.imageSmoothingEnabled = false;
		//Render objects
		for(index in this.tiles)
		{
			var tile = this.tiles[index];
			/*ctx.fillStyle = "blue";
			ctx.fillRect(tile.x,tile.y,tile.width,tile.height);*/
			putImg("meteorite.png",tile.x,tile.y,tile.width,tile.height);
		}
		ctx.imageSmoothingEnabled = true;


		ctx.fillStyle = "white";
		ctx.font = "28px Arial";
		ctx.fillText("Distance travelled: " + (world.distanceTravelled / 5000).toFixed().toString() + " parsec", 10, 40);
	},

	scrollTiles: function()
	{
		this.distanceTravelled += 0.0000000000000000000000000000001;
		if(this.autoscroll == true)
		{
			for(index in this.tiles)
			{
				var tile = this.tiles[index];
				tile.x -= this.scrollSpeed;
				this.distanceTravelled += this.scrollSpeed;
			}
		}

	},

	newTile: function()
	{
		if(this.tiles.length >= 50) return;
		else
		{
			var prevTile = this.tiles[this.tiles.length-1]
			var randHeight = Math.floor(Math.random() * 580) + 20;
			var xPos = (prevTile.x + (prevTile.width * 2))
			var nextTile = new collideObject(xPos,randHeight,60,60);
			this.tiles.push(nextTile);
		}


	},

	checkCollision: function()
	{
		for(index in this.tiles)
		{
			var tile = this.tiles[index];

			if(intersection(tile.x,tile.y,tile.width,tile.height,player.x,player.y,player.width,player.height))
			{
				world.autoscroll = false;
			}

			/*if(player.x > tile.x && player.x < tile.x + player.width && player.y > tile.y && player.y < tile.y + player.height)
			{
				world.autoscroll = false;
			}*/
		
		}
	},


	deleteOldTiles: function()
	{
		for(index in this.tiles)
		{
			if(this.tiles[index].x <= -100)
			{
				this.tiles.splice(index,1);
			}
		}
	},

	tick: function()
	{
		this.scrollTiles();
	}
}



//window.addEventListener('keydown', player.move);

window.addEventListener("keydown", function(e){
	if(e.key == "w") player.moveDir = 1;
	if(e.key == "s") player.moveDir = -1;
});


window.addEventListener("keyup", function(e){
	player.moveDir = 0;
});

init();
