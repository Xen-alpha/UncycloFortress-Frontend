// ----------------------------------------------------------------------------------------------------
// --------------------------- UncycloFortress client-side Script -------------------------------------
// ----------------------------------------------------------------------------------------------------

let scriptversion = 0.1;

// -----------------------------------------------global data-------------------------------------------

let heightcount = 0;

let player;
function InitPlayer() {
	// spawn initial player
	player = new Player([mapinfo.RedSpawn[0], mapinfo.RedSpawn[1]], 8, [degToRad(0), degToRad(0), degToRad(0)], degToRad(0), 1, 0);
	player.secondweapon = new Weapon(0, player); // weapon 0
	player.firstweapon = new Weapon(4, player); // weapon 1
	player.currentweapon = 0;
	player.ReloadWeapon = () => {
	};
	player.FireWeapon = () => {
	};
	player.DoSpecialSkill = () => {
	};
	player.ReleaseFire = () => {
	};
}

function deadStateHandler() {
	player.isdead = false;
	player.healthpoint = player.maxhealthpoint;
	inputhandler.GrabInput(player);
	player.ReloadWeapon = () => {
		if (player.currentweapon === 0) {
			player.secondweapon.ReloadWeapon();
		} else {
			player.firstweapon.ReloadWeapon();
		}
	};
	player.FireWeapon = () =>{
		if (player.currentweapon === 0) {
			player.secondweapon.FireWeapon();
		} else {
			player.firstweapon.FireWeapon();
		}
	};
	player.DoSpecialSkill = () => {
		if (player.currentweapon === 0) {
			player.secondweapon.DoSpecialSkill();
		} else {
			player.firstweapon.DoSpecialSkill();
		}
	};
	player.ReleaseFire = () => {
		if (player.currentweapon === 0) {
			player.secondweapon.ReleaseFire();
		} else {
			player.firstweapon.ReleaseFire();
		}
	};
	if (player.team === 1) {
		player.pos = [mapinfo.RedSpawn[0] + 4 , mapinfo.RedSpawn[1] + 4 ];
	} else {
		player.pos = [mapinfo.BlueSpawn[0] + 4 , mapinfo.BlueSpawn[1] + 4 ];
	}
}

// ------------------------------------------------------------------------------------------------------------
// ----------------------------------------- put your own code here -------------------------------------------
// ------------------------------------------------------------------------------------------------------------


function Projectile_Rocket(pos, size, direction, team, shooter, imgsrc) {
	Projectile.call(this, pos, size, direction, team, shooter, imgsrc);
	this.vertexlist = GenerateProjectile(this.GetCenterPosition(), this.size, this.cameraMatrix);
}
Projectile_Rocket.prototype = Object.create(Projectile.prototype);
Projectile_Rocket.prototype.constructor = Projectile_Rocket;

function Weapon (type, owner) {
	this.type = type;
	this.owner = owner;
	this.timerhandler;
	this.loadedbullet = 1;
	this.firedelay = 1000;
	this.reloaddelay = 1000;
	this.isReloading = false;
	this.isFiring = false;
	this.MaxAmmo = this.loadedbullet;
	this.weaponname = "?";
	this.ReloadWeapon = () => {
		this.isFiring = false; 
		if (!this.isReloading && this.loadedbullet != this.MaxAmmo){
			clearTimeout(this.timerhandler);
			this.timerhandler = setTimeout(this.ReloadWeapon_sub, this.reloaddelay);
			this.isReloading = true;
		}
	};
	this.ReloadWeapon_sub = () => {
		// use fetch to fire event and get result
		// apply the result
			// if result failed(due to timing or else)
			// if result is success
			this.loadedbullet = this.MaxAmmo;
			this.isReloading = false;
			ws.send(JSON.stringify({
				type: 13,
				id: player.playerID,
				currentweapon: player.currentweapon
			}));
		return;
	}
	this.FireWeapon = () =>{
		if (this.type != 9 && this.loadedbullet === 0 && !this.isReloading) {
			this.ReloadWeapon();
		} else if (!this.isReloading && !this.isFiring) {
			// use fetch to fire event and get result
			// apply the result
				// if result failed(due to timing or else)
				// if result is success
			clearTimeout(this.timerhandler);
			this.timerhandler = setTimeout(this.FireWeapon_sub, this.firedelay);
			this.isFiring = true;
		}
	};
	this.FireWeapon_sub = () => {
		this.isFiring = false;
	};
	this.ReleaseFire = () => {
		return;
	};
	this.DoSpecialSkill = () => {
		// use fetch to fire event and get result
		// apply the result
			// if result failed(due to timing or else)
			// if result is success
	};
}
function Weapon_Pistol (type, owner) {
	Weapon.call(this, type, owner);
	this.loadedbullet = 6;
	this.firedelay = 300;
	this.reloaddelay = 1000;
	this.MaxAmmo = this.loadedbullet;
	this.weaponname = "Pistol";
	this.FireWeapon = () =>{
		if (this.type != 9 && this.loadedbullet === 0 && !this.isReloading) {
			this.ReloadWeapon();
		} else if (!this.isReloading && !this.isFiring) {
			// use fetch to fire event and get result
			// apply the result
				// if result failed(due to timing or else)
				// if result is success
				if (this.type != 9 && this.loadedbullet > 0)this.loadedbullet -= 1;
				this.owner.raylist = new Array(1);
				let randomNum = Math.random();
				this.owner.raylist[0] = new Ray ([this.owner.GetCenterPosition()[0], this.owner.GetCenterPosition()[1], -18], [this.owner.GetCenterPosition()[0]- 10000* Math.cos(this.owner.direction+Math.PI/2- Math.PI/360+randomNum* Math.PI/180), this.owner.GetCenterPosition()[1] - 10000*  Math.sin(this.owner.direction +Math.PI/2 - Math.PI/360+randomNum* Math.PI/180), 0]);
				ws.send(JSON.stringify({
					type:6,
					id:player.playerID,
					raylist: [{startpos:[this.owner.GetCenterPosition()[0], this.owner.GetCenterPosition()[1], -18], endpos: [this.owner.GetCenterPosition()[0]- 10000* Math.cos(this.owner.direction+Math.PI/2- Math.PI/360+randomNum* Math.PI/180), this.owner.GetCenterPosition()[1] - 10000*  Math.sin(this.owner.direction +Math.PI/2 - Math.PI/360+randomNum* Math.PI/180), 0]}]
				}));
				this.owner.raylist[0].AddPenetratingObjects(mapinfo.mapobjectlist);
				this.owner.raylist[0].endpos = this.owner.raylist[0].GetClosestCollidedPosition();
				this.owner.raylist[0].DrawRay();
			clearTimeout(this.timerhandler);
			this.timerhandler = setTimeout(this.FireWeapon_sub, this.firedelay);
			this.isFiring = true;
		}
	};
	this.FireWeapon_sub = () => {
		this.isFiring = false;
	};
	this.ReleaseFire = () => {
		return;
	}
}
Weapon_Pistol.prototype = Object.create(Weapon.prototype);
Weapon_Pistol.prototype.constructor = Weapon_Pistol;

function Weapon_PowerShotgun (type, owner) {
	Weapon.call(this, type, owner);
	this.loadedbullet = 4;
	this.firedelay = 800;
	this.reloaddelay = 1000;
	this.MaxAmmo = this.loadedbullet;
	this.weaponname = "Power Shotgun";
	this.FireWeapon = () =>{
		if (this.type != 9 && this.loadedbullet === 0 && !this.isReloading) {
			this.ReloadWeapon();
		} else if (!this.isReloading && !this.isFiring) {
			// use fetch to fire event and get result
			// apply the result
				// if result failed(due to timing or else)
				// if result is success
				if (this.type != 9 && this.loadedbullet > 0)this.loadedbullet -= 1;
				this.owner.raylist = new Array(9);
				let raylist = [];
				for (let i = 0 ; i < 9; i++) { // 9 < MAX_RAY_PER_PERSON
					this.owner.raylist[i] = new Ray ([this.owner.GetCenterPosition()[0], this.owner.GetCenterPosition()[1], -18], [this.owner.GetCenterPosition()[0]- 10000* Math.cos(this.owner.direction+Math.PI/2- Math.PI/12+i* Math.PI/48), this.owner.GetCenterPosition()[1] - 10000*  Math.sin(this.owner.direction +Math.PI/2- Math.PI/12+i* Math.PI/48), 0]);
					raylist.push({startpos:[this.owner.GetCenterPosition()[0], this.owner.GetCenterPosition()[1], -18], endpos: [this.owner.GetCenterPosition()[0]- 10000* Math.cos(this.owner.direction+Math.PI/2- Math.PI/12+i* Math.PI/48), this.owner.GetCenterPosition()[1] - 10000*  Math.sin(this.owner.direction +Math.PI/2- Math.PI/12+i* Math.PI/48), 0]});
				}
				ws.send(JSON.stringify({
					type:6,
					id:player.playerID,
					raylist: raylist
				}));
				for (let i = 0 ; i < 9 ; i++) {
					this.owner.raylist[i].AddPenetratingObjects(mapinfo.mapobjectlist);
					this.owner.raylist[i].endpos = this.owner.raylist[i].GetClosestCollidedPosition();
					this.owner.raylist[i].DrawRay();
				}
			clearTimeout(this.timerhandler);
			this.timerhandler = setTimeout(this.FireWeapon_sub, this.firedelay);
			this.isFiring = true;
		}
	};
	this.FireWeapon_sub = () => {
		this.isFiring = false;
	};
	this.ReleaseFire = () => {
		return;
	}
}
Weapon_PowerShotgun.prototype = Object.create(Weapon.prototype);
Weapon_PowerShotgun.prototype.constructor = Weapon_PowerShotgun;
function Weapon_Minigun (type, owner) {
	Weapon.call(this, type, owner);
	this.loadedbullet = 200;
	this.firedelay = 100;
	this.reloaddelay = 5000;
	this.MaxAmmo = this.loadedbullet;
	this.weaponname = "Minigun";
	this.FireWeapon = () =>{
		if (this.type != 9 && this.loadedbullet === 0 && !this.isReloading) {
			this.ReloadWeapon();
		} else if (!this.isReloading && !this.isFiring) {
			// use fetch to fire event and get result
			// apply the result
				// if result failed(due to timing or else)
				// if result is success
				if (this.type != 9 && this.loadedbullet > 0)this.loadedbullet -= 1;
				this.owner.raylist = new Array(2);
				let raylist = [];
				for (let i = 0 ; i < 2; i++) { // 2 < MAX_RAY_PER_PERSON
					let randomNum = Math.random();
					this.owner.raylist[i] = new Ray ([this.owner.GetCenterPosition()[0], this.owner.GetCenterPosition()[1], -18], [this.owner.GetCenterPosition()[0]- 10000* Math.cos(this.owner.direction+Math.PI/2- Math.PI/24+randomNum* Math.PI/12), this.owner.GetCenterPosition()[1] - 10000*  Math.sin(this.owner.direction +Math.PI/2 - Math.PI/24+randomNum* Math.PI/12), 0]);
					raylist.push({startpos:[this.owner.GetCenterPosition()[0], this.owner.GetCenterPosition()[1], -18], endpos: [this.owner.GetCenterPosition()[0]- 10000* Math.cos(this.owner.direction+Math.PI/2- Math.PI/24+randomNum* Math.PI/12), this.owner.GetCenterPosition()[1] - 10000*  Math.sin(this.owner.direction +Math.PI/2 - Math.PI/24+randomNum* Math.PI/12), 0]});
				}
				ws.send(JSON.stringify({
					type:6,
					id:player.playerID,
					raylist: raylist
				}));
				for (let i = 0 ; i < 2; i++) { // 2 < MAX_RAY_PER_PERSON
					this.owner.raylist[i].AddPenetratingObjects(mapinfo.mapobjectlist);
					this.owner.raylist[i].endpos = this.owner.raylist[i].GetClosestCollidedPosition();
					this.owner.raylist[i].DrawRay();
				}
			clearTimeout(this.timerhandler);
			this.timerhandler = setTimeout(this.FireWeapon_sub, this.firedelay);
			this.isFiring = true;
		}
	};
	this.FireWeapon_sub = () => {
		if (this.loadedbullet > 0 ){
			// use fetch to fire event and get result
			// apply the result
				// if result failed(due to timing or else)
				// if result is success
				this.loadedbullet -= 1;
				this.owner.raylist = new Array(2);
				let raylist = [];
				for (let i = 0 ; i < 2; i++) { // 2 < MAX_RAY_PER_PERSON
					let randomNum = Math.random();
					this.owner.raylist[i] = new Ray ([this.owner.GetCenterPosition()[0], this.owner.GetCenterPosition()[1], -18], [this.owner.GetCenterPosition()[0]- 10000* Math.cos(this.owner.direction+Math.PI/2- Math.PI/24+randomNum* Math.PI/12), this.owner.GetCenterPosition()[1] - 10000*  Math.sin(this.owner.direction +Math.PI/2 - Math.PI/24+randomNum* Math.PI/12), 0]);
					raylist.push({startpos:[this.owner.GetCenterPosition()[0], this.owner.GetCenterPosition()[1], -18], endpos: [this.owner.GetCenterPosition()[0]- 10000* Math.cos(this.owner.direction+Math.PI/2- Math.PI/24+randomNum* Math.PI/12), this.owner.GetCenterPosition()[1] - 10000*  Math.sin(this.owner.direction +Math.PI/2 - Math.PI/24+randomNum* Math.PI/12), 0]});
				}
				ws.send(JSON.stringify({
					type:6,
					id:player.playerID,
					raylist: raylist
				}));
				for (let i = 0 ; i < 2; i++) { // 2 < MAX_RAY_PER_PERSON
					this.owner.raylist[i].AddPenetratingObjects(mapinfo.mapobjectlist);
					this.owner.raylist[i].endpos = this.owner.raylist[i].GetClosestCollidedPosition();
					this.owner.raylist[i].DrawRay();
				}
			this.timerhandler = setTimeout(this.FireWeapon_sub, this.firedelay);
		}
	};
	this.ReleaseFire = () => {
		if (this.isFiring) {
			clearTimeout(this.timerhandler);
			this.isFiring = false;
		}
		return;
	}
}
Weapon_Minigun.prototype = Object.create(Weapon.prototype);
Weapon_Minigun.prototype.constructor = Weapon_Minigun;
function Weapon_RocketLauncher (type, owner) {
	Weapon.call(this, type, owner);
	this.loadedbullet = 6;
	this.firedelay = 800;
	this.reloaddelay = 1000;
	this.MaxAmmo = this.loadedbullet;
	this.weaponname = "Rocket Launcher";
	this.FireWeapon = () =>{
		if (this.type != 9 && this.loadedbullet === 0 && !this.isReloading) {
			this.ReloadWeapon();
		} else if (!this.isReloading && !this.isFiring) {
			// use fetch to fire event and get result
			// apply the result
				// if result failed(due to timing or else)
				// if result is success
				if (this.type != 9 && this.loadedbullet > 0)this.loadedbullet -= 1;
				let tempprojectile = new Projectile_Rocket([this.owner.GetCenterPosition()[0] - 8, this.owner.GetCenterPosition()[1] - 8], 1, this.owner.direction, 1, this.owner, "UF_Rocket_Red.png");
				tempprojectile.visible = true;
				if (projectilelist.length < MAX_PROJECTILE_NUMBER)projectilelist.push(tempprojectile);
				ws.send(JSON.stringify({
					type:7,
					id:player.playerID,
					pos: [this.owner.GetCenterPosition()[0] - 8, this.owner.GetCenterPosition()[1] - 8],
					direction:this.owner.direction,
					shooterid: this.owner.playerID,
					projectiletype: 0
				}));
			clearTimeout(this.timerhandler);
			this.timerhandler = setTimeout(this.FireWeapon_sub, this.firedelay);
			this.isFiring = true;
		}
	};
	this.FireWeapon_sub = () => {
		this.isFiring = false;
	};
	this.ReleaseFire = () => {
		return;
	}
}
Weapon_RocketLauncher.prototype = Object.create(Weapon.prototype);
Weapon_RocketLauncher.prototype.constructor = Weapon_RocketLauncher;

function GetMyNewWeapon(type) {
	let newweapon = new Weapon(type,player);
	switch (type) {
		case 0: // pistol
			newweapon = new Weapon_Pistol(type, player);
			break;
		case 1: // nail gun
			newweapon.loadedbullet = 30;
			newweapon.firedelay = 200;
			newweapon.reloaddelay = 1000;
			break;
		case 2: // short shotgun
			newweapon.loadedbullet = 8;
			newweapon.firedelay = 400;
			newweapon.reloaddelay = 2000;
			break;
		case 4: // power shotgun
			newweapon = new Weapon_PowerShotgun(type, player);
			break;
		case 5: // minigun
			newweapon = new Weapon_Minigun (type, player);
			break;
		case 6: // rocket shooter
			newweapon = new Weapon_RocketLauncher (type, player);
			break;
		case 7: // medibeam shooter
			newweapon.loadedbullet = -1;
			newweapon.firedelay = 200;
			newweapon.reloaddelay = 0;
			break;
		case 8: // watershooter
			newweapon.loadedbullet = -1;
			newweapon.firedelay = 200;
			newweapon.reloaddelay = 0;
			break;
		case 9: // wrench
			newweapon.loadedbullet = 200;
			newweapon.firedelay = 800;
			newweapon.reloaddelay = 1000;
			break;
		case 10: // pipe shooter
			newweapon.loadedbullet = 8;
			newweapon.firedelay = 400;
			newweapon.reloaddelay = 2000;
			break;
		case 11: // sniper rifle
			newweapon.loadedbullet = 1;
			newweapon.firedelay = 400;
			newweapon.reloaddelay = 2000;
			break;
		case 12: // knife
			newweapon.loadedbullet = -1;
			newweapon.firedelay = 800;
			newweapon.reloaddelay = 1000;
			break;
		default:
			newweapon.loadedbullet = 1;
			newweapon.firedelay = 400;
			newweapon.reloaddelay = 1000;
			break;
	}
	newweapon.MaxAmmo = newweapon.loadedbullet;
	return newweapon;
}

function ChangeMyCharacter(event) {
	inputhandler.ReleasePlayer();
	switch(event.target.value) {
		case "1":
			if (player.team === 1) {
				player = new Player(player.pos, 12, degToRad(0), player.team, 100, player.playerID, true, player.playername, 1);
			} else {
				player = new Player(player.pos, 12, degToRad(180), player.team, 100, player.playerID, true, player.playername, 1);
			}
			player.secondweapon = GetMyNewWeapon(0); // weapon 0
			player.firstweapon = GetMyNewWeapon(4); // weapon 1
			player.movespeed = 2;
			break;
		case "2":
			if (player.team === 1) {
				player = new Player(player.pos, 12, degToRad(0), player.team, 300, player.playerID, true, player.playername, 2);
			} else {
				player = new Player(player.pos, 12, degToRad(180), player.team, 300, player.playerID, true, player.playername, 2);
			}
			player.secondweapon = GetMyNewWeapon(0); // weapon 0
			player.firstweapon = GetMyNewWeapon(5); // weapon 1
			player.movespeed = 0.5;
			break;
		case "3":
			if (player.team === 1) {
				player = new Player(player.pos, 12, degToRad(0), player.team, 200, player.playerID, true, player.playername, 3);
			} else {
				player = new Player(player.pos, 12, degToRad(180), player.team, 200, player.playerID, true, player.playername, 3);
			}
			player.secondweapon = GetMyNewWeapon(0); // weapon 0
			player.firstweapon = GetMyNewWeapon(6); // weapon 1
			player.movespeed = 1;
			break;
		default:
			//only possible in initial entrance
			break;
	}
	if (player.team === 1) {
	player.SetCenterPosition([mapinfo.RedSpawn[0] + mapobjectsizeconstant/2, mapinfo.RedSpawn[1] + mapobjectsizeconstant/2]);
	} else {
		player.SetCenterPosition([mapinfo.BlueSpawn[0] + mapobjectsizeconstant/2, mapinfo.BlueSpawn[1] + mapobjectsizeconstant/2]);
	}
	player.currentweapon = 0;
	ws.send(JSON.stringify({
		type:3,
		id:player.playerID,
		classnum:player.classnumber,
		team: player.team
	}));
	clearTimeout(player.deadtimer);
	player.deadtimer = setTimeout(deadStateHandler, 4000);
	return;
}

// ------------------------------------------ Game Main ----------------------------------------------
