let ip = "";
let playername = "";
let ws;
let killloglist = [];

function killlog_Timeout() {
	if (killloglist.length > 0) {
		killloglist.splice(0, 1);
	}
	return;
}

function closeHandler() {
	alert(serverclosereason);
}

///////////////////////////////////////////////////////////////////////////////////////////////
// ---------------------------------Client-side message----------------------------------------
// --------------------------------------------------------------------------------------------
// -------------------------------type of receiving message------------------------------------
// 0: list of players (has heavy net load, do not use this frequently)
// 1: connection notice
// 2: disconnection notice
// 3: connection rejected(due to server player number limit or else)
// 4: reserved for chat
// 5: player's current status renewal
// 6: received fired ray
// 7: received fired projectilelist
// 8: initial player information
// 9: reserved for game objective(GameRule related)
// 10: kill log event
// 11: damaging event
// 12: explosion event
// 13: reserved for list of building
// 14: map version request
// 15: player name change event
// 16: reply to teammate number request
// 17: Healthkit touch event
// 18: sound play request
// 19: sound stop request
// 20: respawn event
// 21: scriptversion request
// 22: weapon change notice
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// -------------------------------type of sending message--------------------------------------
// 0: request for all player's status
// 1: map version
// 2: player name set request
// 3: class change request
// 4: reserved for chat
// 5: player current position, looking direction info
// 6: fired ray info
// 7: fired projectile info
// 8: reserved for all building's current status
// 9: reserved for building repair
// 10: reserved for building destruction
// 11: heal event request
// 12: teammate number request
// 13: reload request
// 14: script version
// 15: Special skill request(include building construction, zoom in, etc.)
// 16: Weapon change request
// --------------------------------------------------------------------------------------------

let serverclosereason = "서버로부터 연결이 끊겼습니다";


function messageHandler(message) {
	let messageinfo = JSON.parse(message.data);
	switch (messageinfo.type) {
		case 0:
			playerlist = [];
			for (let playeritem of messageinfo.playerlist){
				playerlist.push(new Player(playeritem.pos, 12, playeritem.direction, playeritem.team, playeritem.health, playeritem.id, playeritem.isdead, playeritem.playername, playeritem.classnumber));
			}
			break;
		case 1:
			if (player.playerID != messageinfo.id) { // other player is connected
				playerlist.push(new Player(messageinfo.pos, 12, messageinfo.direction, messageinfo.team, messageinfo.health, messageinfo.id));
			} else { // ok, this is same with my player information, I have to set a reference of player variable to specific element of playerlist
				playerlist[messageinfo.id] = player;
			}
			if (messageinfo.team === 1) {
				redteamnum += 1;
			}
			else if (messageinfo.team  === 2) {
				blueteamnum += 1;
			}
			break;
		case 2:
			var index = messageinfo.id;
			let teamnumber = playerlist[index].team;
			playerlist.splice(index, 1);
			if (teamnumber === 1) {
				redteamnum -= 1;
			}
			else if (teamnumber === 2) {
				blueteamnum -= 1;
			}
			//arrange the new playerlist
			for (let i in playerlist) {
				playerlist[i].PlayerID = i;
			}
			break;
		case 3:
			serverclosereason = messageinfo.message;
			ws.close();
			break;
		case 5:
			if (messageinfo.id === player.playerID){
				player.pos = messageinfo.pos;
				player.direction = messageinfo.direction;
				player.team = messageinfo.team;
				player.healthpoint = messageinfo.health;
				player.canbedamaged = messageinfo.canbedamaged;
				player.classnumber = messageinfo.classnum;
				player.isdead = messageinfo.isdead;
			}
			playerlist[messageinfo.id].pos = messageinfo.pos;
			playerlist[messageinfo.id].direction = messageinfo.direction;
			playerlist[messageinfo.id].team = messageinfo.team;
			playerlist[messageinfo.id].healthpoint = messageinfo.health;
			playerlist[messageinfo.id].canbedamaged = messageinfo.canbedamaged;
			playerlist[messageinfo.id].classnumber = messageinfo.classnum;
			playerlist[messageinfo.id].isdead = messageinfo.isdead;
			break;
		case 6:
			playerlist[messageinfo.id].raylist = [];
			for (let rayinfo of messageinfo.raylist) {
				playerlist[messageinfo.id].raylist.push(new Ray(rayinfo.startpos, rayinfo.endpos));
			}
			for (let ray of playerlist[messageinfo.id].raylist){
				ray.DrawRay();
			}
			break;
		case 7:
			projectilelist = [];
			for (let projectile of messageinfo.projectilelist) {
				switch (projectile.type) {
					case 0:
						projectilelist.push(new Projectile_Rocket (projectile.pos, 8, projectile.direction, projectile.team, playerlist[projectile.shooterid], "http://libertyga.me/images/4/46/UF_Healthkit.png", projectile.type));
						break;
					default:
						break;
				}
			}
			break;
		case 8:
			player = new Player(messageinfo.pos, 12, messageinfo.direction, messageinfo.team, messageinfo.health, messageinfo.id, true, playername, 0);
			player.canbedamaged = messageinfo.canbedamaged;
			player.classnumber = messageinfo.classnum;
			player.isdead = messageinfo.isdead;
			ws.send(JSON.stringify({
				type: 2,
				id: messageinfo.id,
				newname: playername
			}));
			break;
		case 9:
			// reserved for gamerule control
			break;
		case 10:
			let killtext = playerlist[messageinfo.attackerID].playername + " killed " + playerlist[messageinfo.victimID].playername + " with ";
			switch (messageinfo.killtype) {
				case -1: // suicide
					killtext = playerlist[messageinfo.attackerID].playername + " suicided";
					break;
				case 0: // killed by pistol
					killtext = killtext + "pistol";
					break;
				case 1: // reserved for nail gun
					break;
				case 2: // reserved for short shotgun
					break;
				case 3: // reserved
					break;
				case 4: // killed by power shotgun
					killtext = killtext + "power shotgun";
					break;
				case 5: // killed by minigun
					killtext = killtext + "minigun";
					break;
				case 6: // killed by rocket launcher explosion
					killtext = killtext + "rocket launcher";
					break;
				default:
					killtext = playerlist[messageinfo.attackerID].playername + " killed " + playerlist[messageinfo.victimID].playername;
					console.log("unknown type kill event" + messageinfo.killtype);
					break;
			}
			if (killloglist.length >= 10) {
				killloglist.splice(0, 1);
			}
			killloglist.push(killtext);
			setTimeout(killlog_Timeout, 4000);
			break;
		case 11: // damaging event
			if (player.playerID === messageinfo.victimID){
				player.healthpoint -= messageinfo.damage;
				player.isdead = messageinfo.isdead;
				if (messageinfo.isdead) { // if player is dead
					player.healthpoint = 0;
					inputhandler.ReleasePlayer();
					player.ReloadWeapon = () => {
						return;
					};
					player.FireWeapon = () =>{
						return;
					};
					player.DoSpecialSkill = () => {
						return;
					};
					player.ReleaseFire = () => {
						return;
					};
					clearTimeout(player.deadtimer);
					player.deadtimer = setTimeout(deadStateHandler, 4000);
				}
			} else {
				playerlist[messageinfo.victimID].healthpoint -= messageinfo.damage;
				playerlist[messageinfo.victimID].isdead = messageinfo.isdead;
				if (messageinfo.isdead) {
					playerlist[messageinfo.victimID].healthpoint = 0;
				}
			}
			break;
		case 12: // reserved for explosion draw
			// explosiontype 0: damaging explosion, 1:healing explosion
			explosionlist.push(new Explosion(messageinfo.pos, messageinfo.radius, messageinfo.explosiontype));
			break;
		case 13: // reserved for the list of buildings
			break;
		case 14:
			ws.send(JSON.stringify({type:1, id:player.playerID, mapversion:mapinfo.mapversion}));
			break;
		case 15:
			playerlist[messageinfo.id].playername = messageinfo.newname;
			console.log("client "+ messageinfo.id +" changed name to "+ messageinfo.newname);
			break;
		case 16:
			redteamnum = messageinfo.redteamnum;
			blueteamnum = messageinfo.blueteamnum;
			break;
		case 17:
			if (messageinfo.id === player.playerID) {
				player.healthpoint = player.maxhealthpoint;
			}
			mapinfo.maphealthkitlist[messageinfo.healthkitid].isSpawned = messageinfo.isSpawned;
			break;
		case 18: // soundplay start
			break;
		case 19: // soundplay stop
			break;
		case 20: // respawn
			if (player.playerID === messageinfo.id) {
				player.pos = messageinfo.respawnpos;
				player.isdead = false;
			} else {
				playerlist[messageinfo.id].pos = messageinfo.respawnpos;
				playerlist[messageinfo.id].isdead = false;
			}
			break;
		case 21:
			ws.send(JSON.stringify({ type: 14, id: player.playerID, version: scriptversion}));
			break;
		case 22:
			if (player.playerID != messageinfo.id) {
				playerlist[messageinfo.id].currentweapon = messageinfo.currentweapon;
			}
			break;
		default:
			console.log("received message type "+ messageinfo.type);
			break;
	}
}