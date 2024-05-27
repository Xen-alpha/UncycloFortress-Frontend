function Building(pos, size, direction, team, health, id = 0) {
	Player.call(this, pos, size, direction, team, health, id)
}
Building.prototype = Object.create(Player.prototype);
Building.prototype.constructor = Building;

function Healthkit(pos, size, id) {
	GameObject.call(this, pos, size, 0, 0, 1, 1, 0);
	this.id = id;
	this.respawntime = 8000;
	this.isSpawned = true;
	this.respawntimer = undefined;
	this.vertexlist = GenerateProjectile(this.GetCenterPosition(), size, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
	this.respawn = () => {
		this.isSpawned = true;
		return;
	}
}
Healthkit.prototype = Object.create(GameObject.prototype);
Healthkit.prototype.constructor = Healthkit;