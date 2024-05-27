// ----------------------------- map handling -----------------------------------

let mapinfo = undefined;
function loadMapData(id, filename) {
	if (typeof (filename) != 'String') return -1; // wrong parameter
	// create handle script(GLSL)
	let handle = undefined;
	if (document.getElementById(id) !== undefined) {
		handle = document.getElementById(id);
		handle.setAttribute("src", "resource/map/" + filename); // handle txt must be in engine/handle folder
	} else {
		handle = document.createElement("script");
		handle.setAttribute("id", id);
		handle.setAttribute("type", "notjs");
		handle.setAttribute("src", "resource/map/" + filename); // handle txt must be in engine/handle folder
		let gamedisplay = document.getElementById("mw-content-text");
		if (gamedisplay !== undefined) return -2;
		gamedisplay.appendChild(handle);
	}
	mapinfo = new MapInfo("");
}

function createBlackSkybox(map, width, height) {
	// map uses counter-clockwise drawing
	map.polygons = [
		// ground
		0,   -32,  0,
		width,   -32,  height,
		width,   -32,  0,
		width,   -32,  height,
		0,   -32,  0,
		0,   -32,  height,

		// ceiling
		0,   32,  0,
		width,   32,  0,
		width,   32,  height,
		width,   32,  height,
		0,   32,  height,
		0,   32,  0

		// walls
	  
	];
	// make it black
	map.mapColors = [
		// ground and ceiling
		0,	0,	0,
		0,	0,	0,
		0,	0,	0,
		0,	0,	0,
		0,	0,	0,
		0,	0,	0,

		0,	0,	0,
		0,	0,	0,
		0,	0,	0,
		0,	0,	0,
		0,	0,	0,
		0,	0,	0
		
		// other wall
	];
}

const mapobjectsizeconstant = 32;
function MapInfo (text) { // map infomation
	  this.rawmapdata = text;
	  let mapdataarray = this.rawmapdata.split('\n');
	  let mapsize = mapdataarray[0].split(' ');
	  this.mapheight = parseInt(mapsize[0]);
	  this.mapwidth = parseInt(mapsize[1]);
	  this.mapversion = parseInt(mapsize[2]);
	  this.mapdata = mapdataarray;
	  this.mapwallcounter = 0;
	  this.mapobjectlist = [];
	  this.maphealthkitlist = [];
	  let mapX = 64* this.mapwidth;
	  let mapY = 64* this.mapheight;
	  createSkybox(this, mapX, mapY);
		for (let i = 1; i <= this.mapheight; i++) {
			var parsedRow = this.mapdata[i].split(' ');
			for (let j = 0; j < this.mapwidth; j++){
				switch (parsedRow[j]) {
					case 'R':
						this.RedSpawn = [ mapobjectsizeconstant*j,  mapobjectsizeconstant*(i-1)];
						break;
					case 'B':
						this.BlueSpawn = [ mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)];
						break;
					case 'W':
						this.mapobjectlist.push(new GameObject([mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)], [mapobjectsizeconstant, mapobjectsizeconstant],0, 0, 0, 0)); 
						break;
					case 'Q':
						this.mapobjectlist.push(new GameObject([mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)], [mapobjectsizeconstant, mapobjectsizeconstant],0, 0, 0, 2)); 
						break;
					case 'A':
						this.mapobjectlist.push(new GameObject([mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)], [mapobjectsizeconstant, mapobjectsizeconstant],0, 0, 0, 1)); 
						break;
					case 'H':
						this.maphealthkitlist.push(new Healthkit([mapobjectsizeconstant*j + 8, mapobjectsizeconstant*(i-1) +8], 8, this.maphealthkitlist.length));
						break;
					case 'Z':
						this.mapobjectlist.push(new Door([mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)], [mapobjectsizeconstant, mapobjectsizeconstant],270, 2));
						break;
					case 'X':
						this.mapobjectlist.push(new Door([mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)], [mapobjectsizeconstant, mapobjectsizeconstant],90, 2));
						break;
					case 'C':
						this.mapobjectlist.push(new Door([mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)], [mapobjectsizeconstant, mapobjectsizeconstant],180, 2));
						break;
					case 'V':
						this.mapobjectlist.push(new Door([mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)], [mapobjectsizeconstant, mapobjectsizeconstant],0, 2));
						break;
					case 'U':
						this.mapobjectlist.push(new Door([mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)], [mapobjectsizeconstant, mapobjectsizeconstant],270, 1));
						break;
					case 'I':
						this.mapobjectlist.push(new Door([mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)], [mapobjectsizeconstant, mapobjectsizeconstant],90, 1));
						break;
					case 'O':
						this.mapobjectlist.push(new Door([mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)], [mapobjectsizeconstant, mapobjectsizeconstant],180, 1));
						break;
					case 'P':
						this.mapobjectlist.push(new Door([mapobjectsizeconstant*j, mapobjectsizeconstant*(i-1)], [mapobjectsizeconstant, mapobjectsizeconstant],0, 1));
						break;
					default:
						break; // do nothing
				}
			}
		}
		for (let object of this.mapobjectlist) {
			if (object.constructor === GameObject) {
				this.mapwallcounter += 4;
			} else if (object.constructor === Door) {
				this.mapwallcounter += 2;
			}
			this.polygons = this.polygons.concat(object.vertexlist);
		}
}

function Door(pos, size, direction, team) {
	GameObject.call(this, pos, size, direction, team, 0, 0, 100000);
	switch (direction) {
		case 0:
			this.vertexlist = [ 
			// wall (right)
			2*pos[0] + 2* size[0],   32,  2*pos[1],
			2*pos[0] + 2* size[0],   -32,  2*pos[1]+2*size[1],
			2*pos[0] + 2* size[0],   -32,  2*pos[1],
			2*pos[0] + 2* size[0],   32,  2*pos[1],
			2*pos[0] + 2* size[0],   32,  2*pos[1]+2*size[1],
			2*pos[0] + 2* size[0],   -32,  2*pos[1]+2*size[1],
			// wall (left)
			2*pos[0] + 2* size[0] - 4,   32,  2*pos[1],
			2*pos[0] + 2* size[0] - 4,   -32,  2*pos[1],
			2*pos[0] + 2* size[0] - 4,   -32,  2*pos[1]+2*size[1],
			2*pos[0] + 2* size[0] - 4,   32,  2*pos[1],
			2*pos[0] + 2* size[0] - 4,   -32,  2*pos[1]+2*size[1],
			2*pos[0] + 2* size[0] - 4,   32,  2*pos[1]+2*size[1]
			];
			break;
		case 90:
			this.vertexlist = [
			// wall (down)
			2*pos[0],		32,  2*pos[1]+2*size[1],
			2*pos[0],		-32,  2*pos[1]+2*size[1],
			2*pos[0] + 2* size[0],	-32,  2*pos[1]+2*size[1],
			2*pos[0],		32,  2*pos[1]+2*size[1],
			2*pos[0] + 2* size[0], -32,  2*pos[1]+2*size[1],
			2*pos[0] + 2* size[0],	32,  2*pos[1]+2*size[1],
			// wall (Up)
			2*pos[0],		32,  2*pos[1]+2*size[1]-4,
			2*pos[0] + 2* size[0],	-32, 2*pos[1]+2*size[1]-4,
			2*pos[0],		-32,  2*pos[1]+2*size[1]-4,
			2*pos[0],		32,  2*pos[1]+2*size[1]-4,
			2*pos[0] + 2* size[0],	32,  2*pos[1]+2*size[1]-4,
			2*pos[0] + 2* size[0], -32,  2*pos[1]+2*size[1]-4
			];
			break;
		case 180:
			this.vertexlist = [
			// wall (left)
			2*pos[0],   32,  2*pos[1],
			2*pos[0],   -32,  2*pos[1],
			2*pos[0],   -32,  2*pos[1]+2*size[1],
			2*pos[0],   32,  2*pos[1],
			2*pos[0],   -32,  2*pos[1]+2*size[1],
			2*pos[0],   32,  2*pos[1]+2*size[1], 
			// wall (right)
			2*pos[0] + 4,   32,  2*pos[1],
			2*pos[0] + 4,   -32,  2*pos[1]+2*size[1],
			2*pos[0] + 4,   -32,  2*pos[1],
			2*pos[0] + 4,   32,  2*pos[1],
			2*pos[0] + 4,   32,  2*pos[1]+2*size[1],
			2*pos[0] + 4,   -32,  2*pos[1]+2*size[1],
			];
			break;
		case 270:
			this.vertexlist = [
			// wall (Up)
			2*pos[0],		32,  2*pos[1],
			2*pos[0] + 2* size[0],	-32,  2*pos[1],
			2*pos[0],		-32,  2*pos[1],
			2*pos[0],		32,  2*pos[1],
			2*pos[0] + 2* size[0],	32,  2*pos[1],
			2*pos[0] + 2* size[0], -32,  2*pos[1],
			// wall (down)
			2*pos[0],		32,  2*pos[1]+4,
			2*pos[0],		-32,  2*pos[1]+4,
			2*pos[0] + 2* size[0],	-32,  2*pos[1]+4,
			2*pos[0],		32,  2*pos[1]+4,
			2*pos[0] + 2* size[0], -32,  2*pos[1]+4,
			2*pos[0] + 2* size[0],	32,  2*pos[1]+4
			];
			break;
		default:
			break;
	}
}
Door.prototype = Object.create(GameObject.prototype);
Door.prototype.constructor = Door;

const MAX_RAY_PER_PLAYER = 10;
const MAX_RAY_NUM = 32 * MAX_RAY_PER_PLAYER;
function Ray (startpos, endpos) {
	this.visible = false;
	this.startpos = startpos; // array
	this.endpos = endpos; // array
	this.collidedobjectsinfo = []; // will contain list of GameObject objects and their penetrated positions
	this.AddPenetratingObjects = (objectlist) => {
		for (let object of objectlist){
			let lineeq = new LineEquation(this.startpos, this.endpos);
			if (object.collidetype === 0) { // cubic -> doing collision check 4 times
				let areaeq1 = new AreaEquation([object.GetCenterPosition()[0]-object.size[0]/2, object.GetCenterPosition()[1],0], [object.GetCenterPosition()[0]-object.size[0]/2, object.GetCenterPosition()[1]-object.size[1]/2,mapobjectsizeconstant/2],[object.GetCenterPosition()[0]-object.size[0]/2, object.GetCenterPosition()[1]-object.size[1]/2,-mapobjectsizeconstant/2]);
				let resultArray = LineTrace_Sub1(lineeq, areaeq1);
				if (resultArray.length > 0 && resultArray[1] >= object.GetCenterPosition()[1]-object.size[1]/2 && resultArray[1] <= object.GetCenterPosition()[1]+object.size[1]/2) this.collidedobjectsinfo.push([object, resultArray]);
				let areaeq2 = new AreaEquation([object.GetCenterPosition()[0], object.GetCenterPosition()[1]-object.size[1]/2,0], [object.GetCenterPosition()[0]-object.size[0]/2, object.GetCenterPosition()[1]-object.size[1]/2,mapobjectsizeconstant/2],[object.GetCenterPosition()[0]-object.size[0]/2, object.GetCenterPosition()[1]-object.size[1]/2,-mapobjectsizeconstant/2]);
				resultArray = LineTrace_Sub1(lineeq, areaeq2);
				if (resultArray.length > 0 && resultArray[0] >= object.GetCenterPosition()[0]-object.size[0]/2 && resultArray[0] <= object.GetCenterPosition()[0]+object.size[0]/2) this.collidedobjectsinfo.push([object, resultArray]);
				let areaeq3 = new AreaEquation([object.GetCenterPosition()[0]+object.size[0]/2, object.GetCenterPosition()[1],0], [object.GetCenterPosition()[0]+object.size[0]/2, object.GetCenterPosition()[1]+object.size[1]/2,mapobjectsizeconstant/2],[object.GetCenterPosition()[0]+object.size[0]/2, object.GetCenterPosition()[1]+object.size[1]/2,-mapobjectsizeconstant/2]);
				resultArray = LineTrace_Sub1(lineeq, areaeq3);
				if (resultArray.length > 0 && resultArray[1] >= object.GetCenterPosition()[1]-object.size[1]/2 && resultArray[1] <= object.GetCenterPosition()[1]+object.size[1]/2) this.collidedobjectsinfo.push([object, resultArray]);
				let areaeq4 = new AreaEquation([object.GetCenterPosition()[0], object.GetCenterPosition()[1]+object.size[1]/2,0], [object.GetCenterPosition()[0]+object.size[0]/2, object.GetCenterPosition()[1]+object.size[1]/2,mapobjectsizeconstant/2],[object.GetCenterPosition()[0]+object.size[0], object.GetCenterPosition()[1]+object.size[1],-mapobjectsizeconstant/2]);
				resultArray = LineTrace_Sub1(lineeq, areaeq4);
				if (resultArray.length > 0 && resultArray[0] >= object.GetCenterPosition()[0]-object.size[0]/2 && resultArray[0] <= object.GetCenterPosition()[0]+object.size[0]/2) this.collidedobjectsinfo.push([object, resultArray]);
			} else if (object.collidetype === 1){ // cylinder -> only find success/fail
				let cylindereq = new CylinderEquation(object.GetCenterPosition(), object.size);
				let hitpoint = LineTrace_Sub2(lineeq, cylindereq);
				if ((hitpoint[0] - this.startpos[0]) * (hitpoint[0] - this.startpos[0]) + (hitpoint[1] - this.startpos[1]) + (hitpoint[2] - this.startpos[2]) * (hitpoint[2] - this.startpos[2]) < (this.endpos[0] - this.startpos[0]) * (this.endpos[0] - this.startpos[0]) + (this.endpos[1] - this.startpos[1]) * (this.endpos[1] - this.startpos[1]) + (this.endpos[2] - this.startpos[2]) * (this.endpos[2] - this.startpos[2]) ) this.collidedobjectsinfo.push([object, hitpoint]);
			}
		}
	}
	this.GetClosestCollidedPosition = () => { // only find cube collided position;
		let collidedposition = this.endpos;
		for (let objectinfo of this.collidedobjectsinfo) {
			if (objectinfo.length > 1) {
				let line1 = new LineEquation(this.startpos, objectinfo[1]);
				let criterionline = new LineEquation(this.startpos, this.endpos);
				if (m4.normalize(criterionline.linevector)[0] * m4.normalize(line1.linevector)[0] >0 && GetLineLength(this.startpos, objectinfo[1]) <= GetLineLength(this.startpos, collidedposition)) collidedposition = objectinfo[1];
			}
		}
		return collidedposition;
	}
	this.GetClosestCollidedObject = (rayownerid = -1) => { // only find cube collided position;
		let collidedposition = this.endpos;
		let collidedobject = undefined;
		for (let objectinfo of this.collidedobjectsinfo) {
			if (objectinfo[0].constructor === Player && objectinfo[0].playerID === rayownerid) continue;
			if (objectinfo.length > 1) {
				let line1 = new LineEquation(this.startpos, objectinfo[1]);
				let criterionline = new LineEquation(this.startpos, this.endpos);
				if (m4.normalize(criterionline.linevector)[0] * m4.normalize(line1.linevector)[0] >0 && GetLineLength(this.startpos, objectinfo[1]) <= GetLineLength(this.startpos, collidedposition)) {
					collidedposition = objectinfo[1];
					collidedobject = objectinfo[0];
				}
			}
		}
		return collidedobject;
	}
	this.DrawRay = () => {
		this.visible = true;
		setTimeout(this.DrawRay_timeout, 50);
		return;
	}
	this.DrawRay_timeout = () => {
		this.visible = false;
		return;
	}
};

// Fill the buffer with the values of "W" and "F".
function setMapGeometry(gl, mapInfo) {
  let temparray = mapInfo.polygons.concat( new Array(6* MAX_RAY_NUM)); // for ray
  temparray = temparray.concat (new Array(3* 6 * 4 * MAX_PROJECTILE_NUMBER )); // for projectile
  temparray = temparray.concat (new Array(3*6*32)); // for player
  temparray = temparray.concat(new Array(3* 6 * MAX_PROJECTILE_NUMBER )); // for explosion
  let polygonArray = new Float32Array(temparray);
  gl.bufferData(
      gl.ARRAY_BUFFER,
      polygonArray,
      gl.STATIC_DRAW);
  return;
}

function setMapColors(gl, mapInfo) {
  for (let object of mapInfo.mapobjectlist){
	  if (object.constructor === Door) {
		  if (object.team === 1) {
				mapInfo.mapColors = mapInfo.mapColors.concat([ 
				146, 25, 14,
				146, 25, 14,
				146, 25, 14,
				146, 25, 14,
				146, 25, 14,
				146, 25, 14,
				//wall 2
				146, 25, 14,
				146, 25, 14,
				146, 25, 14,
				146, 25, 14,
				146, 25, 14,
				146, 25, 14
				]);
		  } else if (object.team === 2) {
			    mapInfo.mapColors = mapInfo.mapColors.concat([ 
				50, 14, 146,
				50, 14, 146,
				50, 14, 146,
				50, 14, 146,
				50, 14, 146,
				50, 14, 146,
				//wall 2
				50, 14, 146,
				50, 14, 146,
				50, 14, 146,
				50, 14, 146,
				50, 14, 146,
				50, 14, 146
				]);
		  } else {
			    mapInfo.mapColors = mapInfo.mapColors.concat([ 
				146, 125, 14,
				146, 125, 14,
				146, 125, 14,
				146, 125, 14,
				146, 125, 14,
				146, 125, 14,
				//wall 2
				146, 125, 14,
				146, 125, 14,
				146, 125, 14,
				146, 125, 14,
				146, 125, 14,
				146, 125, 14
				]);
		  }
	  } else if (object.constructor === GameObject) {
		if (object.flag === 0) {
			mapInfo.mapColors = mapInfo.mapColors.concat([ 
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			//wall 2
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			//wall 3
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			//wall 4
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14,
			50, 146, 14
			]);
		} else if (object.flag === 2) {
			mapInfo.mapColors = mapInfo.mapColors.concat([ 
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			//wall 2
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			//wall 3
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			//wall 4
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146,
			50, 14, 146
			]);
		} else if (object.flag === 1) {
			mapInfo.mapColors = mapInfo.mapColors.concat([ 
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			//wall 2
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			//wall 3
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			//wall 4
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14,
			146, 25, 14
			]);
		}
	  }
  }
  let temparray = mapInfo.mapColors.concat(new Array(2*3* MAX_RAY_NUM));
  temparray = temparray.concat (new Array(3* 6 * 4 * MAX_PROJECTILE_NUMBER )); // for projectile
  temparray = temparray.concat (new Array(3*6*32)); // for player
  temparray = temparray.concat(new Array(3* 6 * MAX_PROJECTILE_NUMBER )); // for explosion
  let mapColorArray = new Uint8Array(temparray);
  gl.bufferData(gl.ARRAY_BUFFER, mapColorArray, gl.STATIC_DRAW);
  return;
}