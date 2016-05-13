function BattleManager() {
    this.cursor = new Cursor();
    this.grid = new Grid();
    this.currentBattle = undefined;
}

BattleManager.prototype.createBattle = function (spec) {
    //do some things to create cool battles
    var spec = {
        validLocations: [
            {x: 0,
            y: 2},
            {x: 0,
            y: 3},
            {x: 0,
            y: 4}
        ],
        maxPlayers: 3,
        playerUnits: [],
        enemyUnits: [],
        enemyType: spec.enemyType
    }
    this.currentBattle = new Battle(spec);
    
}

BattleManager.prototype.controls = function () {
    gm.im.addGroup("battle", gm.ctx);
    gm.im.currentgroup.addMouse();
}

BattleManager.prototype.startBattle = function (spec) {
    this.controls();
    this.createBattle(spec);
    gm.em.addEntity(this.cursor);
    gm.em.addEntity(this.grid);
    // this.currentPhase = this.currentBattle.setupPhase;     
}

BattleManager.prototype.draw = function (ctx)
{
    this.currentBattle.draw(ctx);
}



BattleManager.prototype.update = function () {
    this.currentBattle.currentPhase();
}
