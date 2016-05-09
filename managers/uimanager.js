/**
 * 
 */

function UIManager() {
	this.ctx = gm.ctxUI;
	this.screenWidth = this.ctx.canvas.width;
	this.screenHeight = this.ctx.canvas.height;
	this.gameMenu = new GameMenu(this, this.ctx, 10, 10);
	this.gameMenu.addButtonPackage(this.gameMenu.getGameMenuButtons());
	this.dialogueBox = new DialogueBox(this, this.ctx);
	this.showDialogue = false;
	this.showGameMenu = false;
	this.showBattleMenu = false;
	
	this.battleMenu = new GameMenu(this, this.ctx, 100, 100);
    this.battleMenu.addButtonPackage(this.battleMenu.getBattleMenuButtons());
    this.battleMenu.updateMenu(0, 0, this.screenWidth / 6, this.screenHeight / 18);
    this.battleMenu.adaptiveMenu = true;
	
	document.getElementById("uiLayer").style.zIndex = "-1";
	this.controls();
}
UIManager.prototype.update = function() {
	if (this.showGameMenu) {
		this.gameMenu.update();
	}
	if (this.showBattleMenu) {
		this.battleMenu.update();
	}
	if (this.showDialogue) {
		this.dialogueBox.update();
	}
	
	gm.im.setAllFalse();
}
UIManager.prototype.draw = function() {
	this.ctx.clearRect(0, 0, this.screenWidth, this.screenHeight);
	if (this.showGameMenu) {
		this.gameMenu.draw();
	}
	if (this.showDialogue) {
		this.dialogueBox.draw();
	}
	if (this.showBattleMenu) {
		this.battleMenu.draw();
	}
}

UIManager.prototype.controls = function () {
	var temp = gm.im.currentgroup.name;
	gm.im.addGroup("ui");
	//console.log(gm.im.currentgroup);
	gm.im.currentgroup.addMouse();
	gm.im.addInput(new Input("up", 'w'));
	gm.im.addInput(new Input("down", 's'));
	gm.im.addInput(new Input("left", 'a'));
	gm.im.addInput(new Input("right", 'd'));
	gm.im.addInput(new Input("menu", 'i'));
	gm.im.addInput(new Input("confirm", 'e'));
	gm.im.changeCurrentGroupTo(temp);
}




/* +------------------------------------------+ */
/* |           ===  Game Menu  ===            | */
/* +------------------------------------------+ */
function GameMenu(uimanager, ctx, x, y) {
	this.ui = uimanager;
	this.VERT_PADDING = this.ui.screenWidth / 50;
	this.BUTTON_HEIGHT = this.ui.screenHeight / 16;
	this.MENU_WIDTH = this.ui.screenWidth / 4;
	this.TOP_BOT_PADDING = this.ui.screenHeight / 48;
	
	this.x = x;
	this.y = y;
	this.ctx = ctx;
	this.buttons = [];
	this.adaptiveMenu = false;
}
GameMenu.prototype.update = function () {
	// Update buttons
	var i;
	for (i = 0; i < this.buttons.length; i++) {
		this.buttons[i].update(this.ctx);
	}
	
	if (!this.adaptiveMenu) {
		if (gm.im.checkInput("menu")) {
			gm.closeGameMenu();
			gm.im.currentgroup.input_list[4].isPressed = false;
		}
	}
	
	if (this.adaptiveMenu) {
		if (gm.im.checkMouse() && gm.im.getClick() != null) {
	    	if (gm.im.getMouse().x < this.x && 
					gm.im.currentgroup.mouse.y < this.y &&
					gm.im.currentgroup.mouse.x > this.x + this.MENU_WIDTH &&
					gm.im.currentgroup.mouse.y > this.y + (this.BUTTON_HEIGHT * this.buttons.length + this.TOP_BOT_PADDING*2)) {
	    		gm.closeBattleMenu();
	    	}
	    }
	}
	
}
GameMenu.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, (this.BUTTON_HEIGHT * this.buttons.length + this.TOP_BOT_PADDING*2), 15, true, true);
			
	// Draw buttons
	var i;
	for (i = 0; i < this.buttons.length; i++) {
		this.buttons[i].draw(this.ctx);
	}
}
GameMenu.prototype.addButtonPackage = function (buttonPackage) {
	this.buttons = buttonPackage.slice(0);
}

GameMenu.prototype.moveMenu = function (x, y) {
	this.updateMenu(x, y, this.MENU_WIDTH, this.BUTTON_HEIGHT);
}

GameMenu.prototype.updateMenu = function (x, y, menuWidth, buttonHeight) {
	this.x = x;
	this.y = y;
	this.MENU_WIDTH = menuWidth;
	this.BUTTON_HEIGHT = buttonHeight;
	for (i = 0; i < this.buttons.length; i++) {
		this.buttons[i].moveButton(x + this.VERT_PADDING, y + (this.BUTTON_HEIGHT*i + this.TOP_BOT_PADDING), menuWidth - this.VERT_PADDING*2, buttonHeight);
	}
}


GameMenu.prototype.getGameMenuButtons = function () {
	var buttons = [];
	buttons.push(new Button(this, this.ctx, "Items",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*0 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openItems = function () {
				console.log("Open Items");
			}));
	
	buttons.push(new Button(this, this.ctx, "Magic",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*1 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openMagic = function () {
				console.log("Open Magic");
			}));
	
	buttons.push(new Button(this, this.ctx, "Equipment",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*2 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openEquipment = function () {
				console.log("Open Equipment");
			}));
	
	buttons.push(new Button(this, this.ctx, "Status",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*3 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openStatus = function () {
				console.log("Open Status");
				//gm.openBattleMenu(300, 300);
			}));
	
	buttons.push(new Button(this, this.ctx, "Options",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*4 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openOptions = function () {
				console.log("Open Options");
			}));
	
	buttons.push(new Button(this, this.ctx, "Save",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*5 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openSave = function () {
				console.log("Open Save");
				//gm.openDialogueBox("Star Wars", "CHEWBACCA: A legendary Wookiee warrior and Han Solo’s co-pilot aboard the Millennium Falcon, Chewbacca was part of a core group of Rebels who restored freedom to the galaxy. Known for his short temper and accuracy with a bowcaster, Chewie also has a big heart -- and is unwavering in his loyalty to his friends. He has stuck with Han through years of turmoil that have changed both the galaxy and their lives.");
			}));
	return buttons;
}

GameMenu.prototype.getBattleMenuButtons = function () {
	var buttons = [];
	buttons.push(new Button(this, this.ctx, "Attack",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*0 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openItems = function () {
				console.log("Run Attack");
				//gm.ui.battleMenu.moveMenu(300, 300);
			}));
	buttons.push(new Button(this, this.ctx, "Move",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*1 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openMagic = function () {
				console.log("Run Move");
			}));
	buttons.push(new Button(this, this.ctx, "Tech",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*2 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openMagic = function () {
				console.log("Run Tech");
			}));
	buttons.push(new Button(this, this.ctx, "Items",
			this.x + this.VERT_PADDING,
			this.y + (this.BUTTON_HEIGHT*3 + this.TOP_BOT_PADDING),
			this.MENU_WIDTH - this.VERT_PADDING*2,
			this.BUTTON_HEIGHT,
			openMagic = function () {
				console.log("Run Items");
			}));
	return buttons;
}






/* +------------------------------------------+ */
/* |            ===  Button  ===              | */
/* +------------------------------------------+ */

function Button(parent, ctx, text, x, y, width, height, onClickEvent) {
	this.parent = parent;
	this.ctx = ctx;
	this.text = text;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.hovered = false;
	this.onClickEvent = onClickEvent;
}

Button.prototype.moveButton = function (x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
}

Button.prototype.update = function (canvas) {
    
    if (gm.im.checkMouse() && gm.im.getMouse() != null) {
    	if (gm.im.getMouse().x > this.x && 
				gm.im.currentgroup.mouse.y > this.y &&
				gm.im.currentgroup.mouse.x < this.x + this.width &&
				gm.im.currentgroup.mouse.y < this.y + this.height) {
			this.hovered = true;
		} else {
			this.hovered = false;
		}
    }
    if (gm.im.checkMouse() && gm.im.getClick() != null) {
    	if (gm.im.getMouse().x > this.x && 
				gm.im.currentgroup.mouse.y > this.y &&
				gm.im.currentgroup.mouse.x < this.x + this.width &&
				gm.im.currentgroup.mouse.y < this.y + this.height) {
    		//console.log(this.text + " menu option was clicked");
    		this.onClickEvent();
    	}
    }
}

Button.prototype.draw = function(ctx) {
	// Button color
	if (this.hovered) {
		ctx.fillStyle = 'rgba(255,165,0,0.5)';
	} else {
		ctx.fillStyle = 'rgba(0,0,0,0)';
	}
	
	// Draw button frame
	ctx.fillRect(this.x, this.y, this.width, this.height);
	
	// Font options
	var fontSize = 20;
	ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = fontSize + "px sans-serif";
	
	// Text position
	var textSize = ctx.measureText(this.text);
	var textX = this.x + (this.width/2) - (textSize.width/2);
	var textY = this.y + (this.height) - (fontSize/2);
	
	// Draw text
	ctx.fillText(this.text, textX, textY);
}


/* +------------------------------------------+ */
/* |         ===  Dialogue Box  ===           | */
/* +------------------------------------------+ */
function DialogueBox(uimanager, ctx) {
	this.ui = uimanager;
	this.BORDER_PADDING = 5;
	this.VERT_PADDING = this.ui.screenWidth / 50;
	this.LINE_HEIGHT = this.ui.screenHeight / 19;
	this.MENU_WIDTH = this.ui.screenWidth - (this.BORDER_PADDING * 2);
	this.TOP_BOT_PADDING = this.ui.screenHeight / 42;
	this.PAGE_SIZE = 4; // lines per page.
	this.LINE_SIZE = 50; // characters per line.
	
	// Text values
	this.targetName = "";
	this.pages = 0;
	this.lineCount = 0;
	this.parsedText = []; // pages array of lines array that contains characters.
	this.lastPage = false;
	this.arrowCount = 0;
	
	this.x = this.BORDER_PADDING;
	this.y = this.ui.screenHeight - (this.PAGE_SIZE * this.LINE_HEIGHT) - (this.TOP_BOT_PADDING * 2) - this.BORDER_PADDING;
	this.ctx = ctx;
	this.buttonMsg = "";
	this.buttons = [];
}
DialogueBox.prototype.update = function () {
	
	if (gm.im.checkInput("confirm")) {
		if (this.lastPage) {
			gm.closeDialogueBox();
		} else {
			gm.im.setAllFalse();
			this.lineCount += this.PAGE_SIZE;
			
			if (this.lineCount + this.PAGE_SIZE >= this.parsedText.length) {
				this.lastPage = true;
			}
		}
	}
	if (this.arrowCount < 100) {
		this.arrowCount++;
	} else {
		this.arrowCount = 0;
	}
	
}

DialogueBox.prototype.draw = function () {
	// Draw the backdrop and border
	this.ctx.strokeStyle = "rgb(255, 255, 255)";
	this.ctx.fillStyle = "rgba(0, 98, 130, 0.7)";
	
	// Name Box
	roundRect(this.ctx, this.x + 10, this.y - this.LINE_HEIGHT - this.TOP_BOT_PADDING, this.MENU_WIDTH / 3, this.LINE_HEIGHT + (this.TOP_BOT_PADDING), 5, true, true);
	// Dialogue Box
	roundRect(this.ctx, this.x, this.y, this.MENU_WIDTH, ((this.LINE_HEIGHT * this.PAGE_SIZE) + (this.TOP_BOT_PADDING*2)), 15, true, true);
	
	// Font options
	var fontSize = 20;
	this.ctx.fillStyle = "rgb(255, 255, 255)";
	this.ctx.font = fontSize + "px sans-serif";
	var textY = null;
	
	this.ctx.fillText(this.targetName, this.x + 18, this.y - 10);
	
	for (var i = 0; i < this.PAGE_SIZE; i++) {
		textY =  (this.y + this.TOP_BOT_PADDING + (i * this.LINE_HEIGHT)) + (this.LINE_HEIGHT/2);
		if (this.lineCount + 1 + i <= this.parsedText.length) {
			this.ctx.fillText(this.parsedText[this.lineCount + i], (this.x + this.VERT_PADDING), textY);
		}
	}
	if (!this.lastPage && this.arrowCount < 50) {
		this.ctx.fillRect(this.x + this.MENU_WIDTH - this.VERT_PADDING - 10,
				this.y + this.TOP_BOT_PADDING + (this.PAGE_SIZE * this.LINE_HEIGHT) - 10,
				10, 10);
	}
}

/* Parses Dialogue string into format for UI display. */
DialogueBox.prototype.newDialogue = function (name, string) {
	this.dialogue = string;
	this.targetName = name;
	this.parsedText.length = 0;
	//this.pages = string.length / (this.LINE_SIZE * this.PAGE_SIZE);
	
	// Parse the dialogue text into lines of text.
	var index = 0;
	var line = 0;
	while (index < string.length) {
		line = index + this.LINE_SIZE - 1;
		while (line < string.length && string.charAt(line) != ' ') {
			line--;
		}
		if (line >= string.length) {
			line = string.length - 1;
		}
		this.parsedText.push(string.substring(index, line + 1));
		index = line + 1;
	}
	
	this.lineCount = 0;
	if (this.lineCount + this.PAGE_SIZE >= this.parsedText.length) {
		this.lastPage = true;
	} else {
		this.lastPage = false;
	}
	gm.im.setAllFalse();
	this.ui.showDialogue = true;
}






function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
	  if (typeof stroke === 'undefined') {
	    stroke = true;
	  }
	  if (typeof radius === 'undefined') {
	    radius = 5;
	  }
	  if (typeof radius === 'number') {
	    radius = {tl: radius, tr: radius, br: radius, bl: radius};
	  } else {
	    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
	    for (var side in defaultRadius) {
	      radius[side] = radius[side] || defaultRadius[side];
	    }
	  }
	  ctx.beginPath();
	  ctx.moveTo(x + radius.tl, y);
	  ctx.lineTo(x + width - radius.tr, y);
	  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
	  ctx.lineTo(x + width, y + height - radius.br);
	  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
	  ctx.lineTo(x + radius.bl, y + height);
	  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
	  ctx.lineTo(x, y + radius.tl);
	  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
	  ctx.closePath();
	  if (fill) {
	    ctx.fill();
	  }
	  if (stroke) {
	    ctx.stroke();
	  }

	}