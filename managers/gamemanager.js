const TILE_SIZE = 64;
const COLLISION_ACCURACY = 3.0; // Higher is more accurate, but slower.

function GameManager(ctx, ctxUI, ctxCollision, canvas)
{
    this.controlEntity = null;
    this.canvas = canvas;
    this.backgroundEntity = null;
    this.bgCollision = null;
    this.ctx = ctx;
    this.ctxUI = ctxUI;
    this.ctxCol = ctxCollision;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.hitBoxVisible = null;
	
	this.im = null; // InputManager
    this.am = null; // AssetManager
	this.ai = null;
	this.bm = null; // BattleManager
    this.cam = null; // Camera
    this.mm = null; // MapManager
    this.em = null; // EntityManager
    this.sm = null; // SceneManager
    this.ui = null; // UIManager
	
    this.timer = null;
    this.gamePaused = false;
    
}
GameManager.prototype.start = function() {
    this.initManagers();
    this.init();
	this.queueAssets();
    this.am.downloadAll(() => {
		// this.startBattle(new Fire(gm, 64, 256));
	 	this.initialize(new Player(this.am.getAsset("./img/player.png")), 1, 64*7, 64*9);
        this.loop();
    })
}

GameManager.prototype.queueAssets = function () {
	this.am.queueDownload("./img/player.png");
    this.am.queueDownload("./img/GrassOnlyBackground.png");
    this.am.queueDownload("./img/collidable_background.png");
    this.am.queueDownload("./img/Background_Layer.png");
    this.am.queueDownload("./img/Collision_Layer.png");
    this.am.queueDownload("./img/Foreground_Layer.png");
    this.am.queueDownload("./img/werewolf.png");
    this.am.queueDownload("./img/greenrage.png");
    this.am.queueDownload("./img/shark.png");
    this.am.queueDownload("./img/alienfirebird.png");
    this.am.queueDownload("./img/temple.jpg");
    this.am.queueDownload("./img/chest.png");
}

/* loads the starting map and character's starting position. */
GameManager.prototype.initialize = function (player, mapid, destx, desty) {
	this.player = player;
	this.mm.initialize();
	this.loadMap(mapid, destx, desty);
	this.gamePaused = false;
}

GameManager.prototype.startInput = function () {
    console.log('Starting input');
    this.im.start();
    console.log('Input started');
}

GameManager.prototype.initManagers = function (params) {
	this.am = new AssetManager();
    this.em = new EntityManager();
	this.ai = new AIManager();
	this.bm = new BattleManager();
    this.cam = new Camera(this.canvas.width, this.canvas.height);
    this.im = new InputManager("Dungeon");
    this.ui = new UIManager();
	this.mm = new MapManager();
	
	console.log("Managers Initialized");
}

GameManager.prototype.init = function () {
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
	
	this.initManagers();
    this.timer = new Timer();
    this.disableInput = false;
    this.startInput();
    this.hitBoxVisible = false;
    console.log('game initialized');
}
/* unloads the old map, then loads in the new map and all the entities */
GameManager.prototype.loadMap = function (mapid, destx, desty) {
	this.map = this.mm.getMap(mapid);
	// console.log(mapid);
	this.em.removeAllEntities();
	this.player.x = destx;
	this.player.y = desty;
	
	this.em.addEntity(this.map.bgLayer);
	this.em.addEntity(this.map.cLayer);
	this.em.addEntity(this.player);
	
	this.bgCollision = this.map.cMask;	
	
	//need logic for spawning enemies in spawn zones
	for (var i = 0; i < this.map.entities.length; ++i) {
		this.em.addEntity(this.map.entities[i]);
	}
    //debugger;
}
/* Loads battle scene, disabling overworld entities and controls */
GameManager.prototype.startBattle = function (enemy) {
	
	this.cam.stopFollow();
	this.cam.jumpToByCorner(0, 0);
	
	this.em.cacheEntities();
	this.em.removeAllEntities();
	
	// gm.em.addEntity(map.bgLayer);
	// gm.em.addEntity(map.cLayer);
	this.im.setAllFalse("Dungeon");
	this.bm.startBattle({enemyType: enemy});
	
	// needs more logic to add battle assets
	// pause overworld functions
}

/* Disables battle scene, loading regular functionality to overworld. */
GameManager.prototype.endBattle = function () {
	this.em.removeAllEntities();
    gm.bm.currentBattle = undefined;
	this.em.restoreEntities();
	this.im.changeCurrentGroupTo("Dungeon")
	this.cam.follow(this.player);
	
	// remove battle assets
	// resume overworld functions
}

/* Opens the game menu, switching canvas focus and keybinds */
GameManager.prototype.openGameMenu = function () {
	this.gamePaused = true;
	this.showUI = true;
	this.im.changeCurrentGroupTo("ui");
	this.startInput(this.ctxUI);
	this.ui.showGameMenu = true;
	// need to disable previous keys (maybe).
	document.getElementById("uiLayer").style.zIndex = "3";
}
/* Closes the game mneu, switching canvas focus back to the game. */
GameManager.prototype.closeGameMenu = function () {
	this.gamePaused = false;
	this.showUI = false;
	this.im.changeCurrentGroupTo("Dungeon");
	this.startInput();
	this.ui.showGameMenu = false;
	document.getElementById("uiLayer").style.zIndex = "-1";
}

/* Opens the game menu, switching canvas focus and keybinds */
GameManager.prototype.openBattleMenu = function (x, y) {
	x ? x : 200;
	y ? y : 200;
	this.gamePaused = false;
	this.showUI = true;
	this.im.changeCurrentGroupTo("ui");
	this.startInput(this.ctxUI);
	this.ui.battleMenu.moveMenu(x, y);
	this.ui.showBattleMenu = true;
	// need to disable previous keys (maybe).
	document.getElementById("uiLayer").style.zIndex = "3";
}
/* Closes the game mneu, switching canvas focus back to the game. */
GameManager.prototype.closeBattleMenu = function () {
	this.gamePaused = false;
	this.showUI = false;
	this.im.changeCurrentGroupTo("Dungeon");
	this.startInput();
	this.ui.showBattleMenu = false;
	document.getElementById("uiLayer").style.zIndex = "-1";
}

GameManager.prototype.openDialogueBox = function (name, string) {
	this.gamePaused = true;
	this.showUI = true;
	this.im.changeCurrentGroupTo("ui");
	this.startInput(this.ctxUI);
	this.ui.showDialogue = true;
	document.getElementById("uiLayer").style.zIndex = "3";
	this.ui.dialogueBox.newDialogue(name, string);
}

GameManager.prototype.closeDialogueBox = function () {
	this.gamePaused = false;
	this.showUI = false;
	this.im.changeCurrentGroupTo("Dungeon");
	this.startInput(this.ctx);
	this.ui.showDialogue = false;
	document.getElementById("uiLayer").style.zIndex = "-1";
}

GameManager.prototype.checkMapCollision = function (rectBox, callback) {
	imgData = this.ctxCol.getImageData(rectBox.x, rectBox.y, rectBox.width, rectBox.height);
	
	var incX = rectBox.width / COLLISION_ACCURACY;
	var incY = rectBox.height / COLLISION_ACCURACY;
	
	incX = (~~incX === incX) ? incX : (incX+1 | 0 );
	incY = (~~incY === incY) ? incY : (incY+1 | 0 );
	
	for (var offsetY = 0; offsetY < incY; offsetY++ ) {
	    for (var offsetX = 0; offsetX < incX; offsetX++ ) {
	        for (var pixelY = 0+offsetY; pixelY < rectBox.height; pixelY += incY ) {
	            for (var pixelX = 0+offsetX; pixelX < rectBox.width; pixelX += incX){
	                if ( imgData.data[(pixelX + pixelY * imgData.width) * 4 + 3] > 50 ) {
		            	//console.log((pixelX + pixelY * imgData.width) * 4 + 3);
	                	callback(true, {x: pixelX, y: pixelY}, imgData);
	                }
	            }
	        }
	    }
	}
}

GameManager.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    if (!this.gamePaused) {
    	this.em.update();
    	this.cam.update();
    	this.click = undefined;
    	this.em.draw();
    }
    if (this.showUI) {
    	this.ui.update();
    	this.ui.draw();
    }	
	if(this.bm.currentBattle) 
	{
		this.bm.update();
	}
    
    requestAnimationFrame(this.loop.bind(this), this.ctx.canvas);
   //this.update();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}