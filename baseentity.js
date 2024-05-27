//---------------------------------- object definition------------------------------
// Objects must also be defined in server-side javascript

function GameObject (pos, size, direction, team, collidetype, flag, health = 100) { 
	// pos: array[x, y], size: array(cube)[x, y]/integer(cylinder), direction: integer(degree)
	this.pos = pos;
	this.size = size;
	this.rotation = [0, 0 ,0];
	this.direction = direction; // define camera angle
	this.height = 0;
	this.scale = [1, 1, 1];
	this.collidetype = collidetype; // 0: statical cubic(no direction), 1: cylinder
	this.flag = flag; // free flag
	this.team = team; // team : integer(0: not defined, 1: Red Yangachi, 2: Blue Yingeo, 3: Neutral)
	this.state = 0; // state depends on type of Game Object(0 is usually initial state)
	this.healthpoint = health;
	this.maxhealthpoint = health;
	this.canbedamaged = false;
	this.cameraMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	this.cameraAngleRadians = 0;
	this.updateCameraAngle = (event, value) => {
		this.cameraAngleRadians = degToRad(value);
	 };
	this.updatePosition = (index, value)=> {
		switch (index) {
			case 0:
				this.pos[0] = value;
				break;
			case 2:
				this.pos[1] = value;
				break;
			case 1:
				this.height = value;
				break;
			default:
				break;
		}
	  };
	this.vertexlist = createEntityVertex(pos);
	this.updateRotation = (index, value) => {
		var angleInDegrees = value;
		var angleInRadians = (angleInDegree % 360) * Math.PI / 180;
		this.rotation[index] = angleInRadians;
	  };

	this.updatescale = (index, value) =>{
		  this.scale[index] = value;
	  };
	this.GetCenterPosition = () => {
		if (this.collidetype === 0) {
			return [this.pos[0] + this.size[0] /2, this.pos[1] + this.size[1] / 2];
		} else {
			return [this.pos[0] + this.size, this.pos[1] + this.size];
		}
	};
	this.SetCenterPosition = (position) => {
		if (this.collidetype === 0) {
			this.pos = [position[0] -this.size[0] /2, position[1] -this.size[1] / 2];
		} else {
			this.pos = [position[0] -this.size, position[1] - this.size];
		}
	};
	this.IsColliding = (target) => {
		if (this.collidetype === 0 && target.collidetype === 0) { // cube vs cube
			if (this.GetCenterPosition()[0] + this.size[0]/2 >= target.GetCenterPosition()[0] - target.size[0]/2 && this.GetCenterPosition()[0] - this.size[0]/2 <= target.GetCenterPosition()[0] + target.size[0]/2 && this.GetCenterPosition()[1] + this.size[1]/2 >= target.GetCenterPosition()[1] - target.size[1]/2 && this.GetCenterPosition()[1] - this.size[1]/2 <= target.GetCenterPosition()[1] + target.size[1]/2) return true;
			else return false;
		} else if (this.collidetype === 0 && target.collidetype === 1) {
			if (target.GetCenterPosition()[0] + target.size >= this.GetCenterPosition()[0] - this.size[0] / 2 && target.GetCenterPosition()[0] - target.size <= this.GetCenterPosition()[0] + this.size[0] / 2) { // horizontal collision
				if (target.GetCenterPosition()[1] >= this.GetCenterPosition()[1] - this.size[1]/2 - target.size && target.GetCenterPosition()[1] <= this.GetCenterPosition()[1] + this.size[1]/2 + target.size ) 	return true;
			}
			if (target.GetCenterPosition()[1] + target.size >= this.GetCenterPosition()[1] - this.size[1] /2 && target.GetCenterPosition()[1] - target.size <= this.GetCenterPosition()[1] + this.size[1] /2) {
				// vertical collision
				if (target.GetCenterPosition()[0]+ target.size >= this.GetCenterPosition()[0] - this.size[0]/2 && target.GetCenterPosition()[0] - target.size <= this.GetCenterPosition()[0] + this.size[0] /2) {
					return true;
				}
			}
			// corner collision
			let equation1 = (target.GetCenterPosition()[0]-(this.GetCenterPosition()[0] - this.size[0] / 2)) * (target.GetCenterPosition()[0]-(this.GetCenterPosition()[0]- this.size[0] / 2))+ (target.GetCenterPosition()[1]-(this.GetCenterPosition()[1]- this.size[1] / 2)) * (target.GetCenterPosition()[1]-(this.GetCenterPosition()[1]- this.size[1] / 2));
			let equation2 = (target.GetCenterPosition()[0]-(this.GetCenterPosition()[0] - this.size[0] / 2)) * (target.GetCenterPosition()[0]-(this.GetCenterPosition()[0]- this.size[0] / 2))+ (target.GetCenterPosition()[1]-(this.GetCenterPosition()[1]+this.size[1]/2)) * (target.GetCenterPosition()[1]-(this.GetCenterPosition()[1]+this.size[1]/2));
			let equation3 = (target.GetCenterPosition()[0]-(this.GetCenterPosition()[0]+this.size[0]/2)) * (target.GetCenterPosition()[0]-(this.GetCenterPosition()[0]+this.size[0]/2))+ (target.GetCenterPosition()[1]-(this.GetCenterPosition()[1]- this.size[1] / 2)) * (target.GetCenterPosition()[1]-(this.GetCenterPosition()[1]- this.size[1] / 2));
			let equation4 = (target.GetCenterPosition()[0]-this.GetCenterPosition()[0]-this.size[0]/2) * (target.GetCenterPosition()[0]-this.GetCenterPosition()[0]-this.size[0]/2)+ (target.GetCenterPosition()[1]-this.GetCenterPosition()[1]-this.size[1]/2) * (target.GetCenterPosition()[1]-this.GetCenterPosition()[1]-this.size[1]/2);
			if (equation1 <= target.size* target.size || equation2 <= target.size* target.size || equation3 <= target.size* target.size || equation4 <= target.size* target.size) {
				return true;
			} else {
				return false;
			}
		} else if (this.collidetype === 1 && target.collidetype === 0) {
			if (this.GetCenterPosition()[0] + this.size >= target.GetCenterPosition()[0] - target.size[0] / 2 && this.GetCenterPosition()[0] - this.size <= target.GetCenterPosition()[0] + target.size[0]/2) { // horizontal collision
				if (this.GetCenterPosition()[1] + this.size>= target.GetCenterPosition()[1] - target.size[1] / 2 && this.GetCenterPosition()[1] - this.size <= target.GetCenterPosition()[1] + target.size[1]/2 ) return true;
			}
			if (this.GetCenterPosition()[1] + this.size >= target.GetCenterPosition()[1] - target.size[1] / 2 && this.GetCenterPosition()[1] - this.size <= target.GetCenterPosition()[1] + target.size[1]/2 ) {
				// vertical collision
				if (this.GetCenterPosition()[0] + this.size>= target.GetCenterPosition()[0] - target.size[0] / 2  && this.GetCenterPosition()[0]- this.size <= target.GetCenterPosition()[0] + target.size[0] /2) {
					return true;
				}
			}
			// corner collision
			let equation1 = (this.GetCenterPosition()[0]-(target.GetCenterPosition()[0]+target.size[0]/2)) * (this.GetCenterPosition()[0]-(target.GetCenterPosition()[0]+target.size[0]/2))+ (this.GetCenterPosition()[1]-(target.GetCenterPosition()[1]+target.size[1]/2)) * (this.GetCenterPosition()[1]-(target.GetCenterPosition()[1]+target.size[1]/2));
			let equation2 = (this.GetCenterPosition()[0]-(target.GetCenterPosition()[0] - target.size[0] / 2)) * (this.GetCenterPosition()[0]-(target.GetCenterPosition()[0]- target.size[0] / 2))+ (this.GetCenterPosition()[1]-(target.GetCenterPosition()[1]+target.size[1]/2)) * (this.GetCenterPosition()[1]-(target.GetCenterPosition()[1]+target.size[1]/2));
			let equation3 = (this.GetCenterPosition()[0]-(target.GetCenterPosition()[0]+target.size[0]/2)) * (this.GetCenterPosition()[0]-(target.GetCenterPosition()[0]+target.size[0]/2))+ (this.GetCenterPosition()[1]-(target.GetCenterPosition()[1] - target.size[1] / 2)) * (this.GetCenterPosition()[1]-(target.GetCenterPosition()[1] - target.size[1] / 2));
			let equation4 = (this.GetCenterPosition()[0]-(target.GetCenterPosition()[0] - target.size[0] / 2)) * (this.GetCenterPosition()[0]-(target.GetCenterPosition()[0] - target.size[0] / 2))+ (this.GetCenterPosition()[1]-(target.GetCenterPosition()[1]- target.size[1] / 2)) * (this.GetCenterPosition()[1]-(target.GetCenterPosition()[1]- target.size[1] / 2));
			if (equation1 <= this.size* this.size || equation2 <= this.size* this.size || equation3 <= this.size* this.size || equation4 <= this.size* this.size) {
				return true;
			} else {
				return false;
			}
		} else { // cylinder vs cylinder
			if ((this.GetCenterPosition()[0] - target.GetCenterPosition()[0])*(this.GetCenterPosition()[0] - target.GetCenterPosition()[0]) + (this.GetCenterPosition()[1] - target.GetCenterPosition()[1])*(this.GetCenterPosition()[1] - target.GetCenterPosition()[1]) <= (this.size + target.size) * (this.size + target.size)) return true;
			else return false;
		}
		return false; // this could not be happened
	};
}

function Projectile(pos, size, direction, team,  shooter, imgsrc, type = 0) {
	GameObject.call(this, pos, size, direction, team, 1, 0, 1);
	this.movespeed = 4;
	this.shooter = shooter;
	this.imgsrc = imgsrc;
	this.visible = false;
	this.type = type;
	this.cameraMatrix = m4.lookAt([this.GetCenterPosition()[0],0,this.GetCenterPosition()[1]],[this.GetCenterPosition()[0]+Math.cos(this.direction), 0, this.GetCenterPosition()[1]+Math.sin(this.direction)], up );
	this.vertexlist = [
	];
}
Projectile.prototype = Object.create(GameObject.prototype);
Projectile.prototype.constructor = Projectile;
const MAX_PROJECTILE_PER_PLAYER = 100;
const MAX_PROJECTILE_NUMBER = 100 * MAX_PROJECTILE_PER_PLAYER;
let projectilelist = [];

function Explosion(pos, size, type = 0) {
	GameObject.call(this, pos, size, 0, 0, 1, 0, 1);
	this.type = type;
	this.counter = 0;
	this.active = true;
	this.cameraMatrix = m4.lookAt([this.GetCenterPosition()[0],0,this.GetCenterPosition()[1]],[this.GetCenterPosition()[0]+Math.cos(this.direction), 0, this.GetCenterPosition()[1]+Math.sin(this.direction)], up );
	this.vertexlist = GeneratePlaneVertex(this.GetCenterPosition(), size * 2, this.cameraMatrix);
}
Explosion.prototype = Object.create(GameObject.prototype);
Explosion.prototype.constructor = Explosion;

const MAX_EXPLOSION_NUMBER = 100 * MAX_PROJECTILE_PER_PLAYER;
let explosionlist = [];