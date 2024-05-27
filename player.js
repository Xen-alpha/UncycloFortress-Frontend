function Player(pos, size, direction, team, health, id = 0, isdead = false, playername = "unknown player", classnum = 0) {
	GameObject.call(this, pos, size, direction, team, 1, 0, health);
	this.playername = playername;
	this.playerID = id;
	this.movespeed = 1;
	this.classnumber = classnum;
	this.canbedamaged = true;
	this.isdead = isdead;
	this.deadtimer;
	this.secondweapon = undefined; // weapon 0
	this.firstweapon = undefined; // weapon 1
	this.currentweapon = 0;
	this.ReloadWeapon = () => {
		console.log("Reloaded");
	};
	this.FireWeapon = () =>{
		console.log("Fired");
	};
	this.DoSpecialSkill = () => {
		console.log("Did SpecialSkill");
	};
	this.ReleaseFire = () => {
		return;
	}
	this.reloadDelaying = false;
	this.raylist = []; // remember, this only has MAX_RAY_PER_PLAYER number of elements
	this.moveSomething = () => {
		let camMatrix = m4.lookAt([this.GetCenterPosition()[0],this.height,this.GetCenterPosition()[1]],[this.GetCenterPosition()[0]+Math.cos(this.direction), 0, this.GetCenterPosition()[1]+Math.sin(this.direction)], up );
		let forwardvector = m4.getForward(camMatrix);
		let rightvector = m4.getRight(camMatrix);
		if (keystate[0] && keystate[2] || keystate[0] && keystate[3] || keystate[1] && keystate[2] || keystate[1] && keystate[3]) {
			rightvector[0] *= 0.7071;
			rightvector[2] *= 0.7071;
			forwardvector[0] *= 0.7071;
			forwardvector[2] *= 0.7071;
		}
		// remember, the map has reversed axis
		if (keystate[0]){ // a
			let freeToMove = true;
			for (let mapobject of mapinfo.mapobjectlist) {
				let tempmapobject = new GameObject([mapobject.pos[0] - this.movespeed*rightvector[0], mapobject.pos[1] ], mapobject.size, mapobject.direction, mapobject.team, mapobject.collidetype, mapobject.flag, mapobject.healthpoint);
				if (tempmapobject.team != this.team && this.IsColliding(tempmapobject)) freeToMove = false;
			}
			if (freeToMove){
				this.updatePosition(0, this.pos[0] + this.movespeed*rightvector[0]);
				
			}
			freeToMove = true;
			for (let mapobject of mapinfo.mapobjectlist) {
				let tempmapobject = new GameObject([mapobject.pos[0], mapobject.pos[1] - this.movespeed*rightvector[2]], mapobject.size, mapobject.direction, mapobject.team, mapobject.collidetype, mapobject.flag, mapobject.healthpoint);
				if (tempmapobject.team != this.team &&this.IsColliding(tempmapobject)) freeToMove = false;
			}
			if (freeToMove){
				this.updatePosition(2, this.pos[1] + this.movespeed*rightvector[2]);
			}
			ws.send(JSON.stringify({
				type:5,
				id: this.playerID,
				pos: this.pos,
				direction: this.direction
			}));
		}
		if (keystate[1]){ //d
			let freeToMove = true;
			for (let mapobject of mapinfo.mapobjectlist) {
				let tempmapobject = new GameObject([mapobject.pos[0] + this.movespeed*rightvector[0], mapobject.pos[1] ], mapobject.size, mapobject.direction, mapobject.team, mapobject.collidetype, mapobject.flag, mapobject.healthpoint);
				if (tempmapobject.team != this.team &&this.IsColliding(tempmapobject)) freeToMove = false;
			}
			if (freeToMove){
				this.updatePosition(0, this.pos[0] - this.movespeed*rightvector[0]);
				
			}
			freeToMove = true;
			for (let mapobject of mapinfo.mapobjectlist) {
				let tempmapobject = new GameObject([mapobject.pos[0], mapobject.pos[1] + this.movespeed*rightvector[2]], mapobject.size, mapobject.direction, mapobject.team, mapobject.collidetype, mapobject.flag, mapobject.healthpoint);
				if (tempmapobject.team != this.team &&this.IsColliding(tempmapobject)) freeToMove = false;
			}
			if (freeToMove){
				this.updatePosition(2, this.pos[1] - this.movespeed*rightvector[2]);
			}
			ws.send(JSON.stringify({
				type:5,
				id: this.playerID,
				pos: this.pos,
				direction: this.direction
			}));
		}
		if (keystate[2]) { //s
			let freeToMove = true;
			for (let mapobject of mapinfo.mapobjectlist) {
				let tempmapobject = new GameObject([mapobject.pos[0] - this.movespeed*forwardvector[0], mapobject.pos[1] ], mapobject.size, mapobject.direction, mapobject.team, mapobject.collidetype, mapobject.flag, mapobject.healthpoint);
				if (tempmapobject.team != this.team &&this.IsColliding(tempmapobject)) freeToMove = false;
			}
			if (freeToMove){
				this.updatePosition(0, this.pos[0] + this.movespeed*forwardvector[0]);
			}
			freeToMove = true;
			for (let mapobject of mapinfo.mapobjectlist) {
				let tempmapobject = new GameObject([mapobject.pos[0], mapobject.pos[1] - this.movespeed*forwardvector[2]], mapobject.size, mapobject.direction, mapobject.team, mapobject.collidetype, mapobject.flag, mapobject.healthpoint);
				if (tempmapobject.team != this.team &&this.IsColliding(tempmapobject)) freeToMove = false;
			}
			if (freeToMove){
				this.updatePosition(2, this.pos[1] + this.movespeed*forwardvector[2]);
			}
			ws.send(JSON.stringify({
				type:5,
				id: this.playerID,
				pos: this.pos,
				direction: this.direction
			}));
		}
		if (keystate[3]) { // w
			let freeToMove = true;
			for (let mapobject of mapinfo.mapobjectlist) {
				let tempmapobject = new GameObject([mapobject.pos[0] + this.movespeed*forwardvector[0], mapobject.pos[1] ], mapobject.size, mapobject.direction, mapobject.team, mapobject.collidetype, mapobject.flag, mapobject.healthpoint);
				if (tempmapobject.team != this.team &&this.IsColliding(tempmapobject)) freeToMove = false;
			}
			if (freeToMove){
				this.updatePosition(0, this.pos[0] -this.movespeed*forwardvector[0]);
			}
			freeToMove = true;
			for (let mapobject of mapinfo.mapobjectlist) {
				let tempmapobject = new GameObject([mapobject.pos[0], mapobject.pos[1] + this.movespeed*forwardvector[2]], mapobject.size, mapobject.direction, mapobject.team, mapobject.collidetype, mapobject.flag, mapobject.healthpoint);
				if (tempmapobject.team != this.team &&this.IsColliding(tempmapobject)) freeToMove = false;
			}
			if (freeToMove){
				this.updatePosition(2, this.pos[1] - this.movespeed*forwardvector[2]);
			}
			ws.send(JSON.stringify({
				type:5,
				id: this.playerID,
				pos: this.pos,
				direction: this.direction
			}));
		}
		if (keystate[0] || keystate[1] || keystate[2] || keystate[3]) {
			if ( heightcount >= 0 && heightcount <20) this.updatePosition(1, 0.1* heightcount);
			else this.updatePosition(1, 2-0.1*heightcount);
			if (heightcount >= 39) heightcount = 0;
			else heightcount = heightcount +1;
		}
		if (keystate[4] && this.reloadDelaying === false) { // q
			if (this.currentweapon === 0) {
				this.secondweapon.isFiring = false;
				this.currentweapon = 1;
			} else {
				this.firstweapon.isFiring = false;
				this.currentweapon = 0;
			}
			ws.send(JSON.stringify({
				type:16,
				id: this.playerID,
				currentweapon: this.currentweapon
			}));
			this.reloadDelaying = true;
			setTimeout(this.keydelayEnd,400);
		}
		if (keystate[5]) { // e
		}
		if (keystate[6]) { // r
			this.ReloadWeapon();
		}
		if (keystate[7]) { // f
			
		}
	  }
	this.keydelayEnd = () => {
			this.reloadDelaying = false;
		}
	this.vertexlist = GeneratePlaneVertex(this.GetCenterPosition(), 32, this.cameraMatrix);
}
Player.prototype = Object.create(GameObject.prototype);
Player.prototype.constructor = Player;
let playerlist = [];