//---------------------------------------------------------------------------------------------
// UncycloEngine 1 by Epic Ungames, 2019-2020
//---------------------------------------------------------------------------------------------
let gamerule_handle = undefined;
// ---------------------------- Initialization ---------------------------------
function createCanvas(size) {
	let gamedisplay = document.getElementById("mw-content-text");
	gamedisplay.height = "1080px";
	let baseDiv = document.createElement("div");
	baseDiv.setAttribute("id", "baseDiv");
	baseDiv.style = "z-index:0;display:block;";
	baseDiv.style.position = "absolute";
	baseDiv.width = "1440px";
	baseDiv.height = "1080px";
	baseDiv.style.top = "0px";
	baseDiv.style.left = "0px";
	gamedisplay.appendChild(baseDiv);
	let baseDiv2 = document.createElement("div");
	baseDiv2.setAttribute("id", "baseDiv2");
	baseDiv2.style = "z-index:10;display:block;";
	baseDiv2.style.position = "absolute";
	baseDiv2.width = "1440px";
	baseDiv2.height = "1080px";
	baseDiv2.style.top = "0px";
	baseDiv2.style.left = "0px";
	gamedisplay.appendChild(baseDiv2);
	//create canvases
	let mainCanvas = document.createElement("canvas");
	mainCanvas.setAttribute("id", "MainCanvas");
	mainCanvas.style.border = "none";
	mainCanvas.style.align = "center";
	mainCanvas.setAttribute("width", size[0].toString());
	mainCanvas.setAttribute("height", size[1].toString());
	baseDiv.appendChild(mainCanvas);
	let uiCanvas = document.createElement("canvas");
	uiCanvas.setAttribute("id", "UICanvas");
	uiCanvas.style.border = "none";
	uiCanvas.style.align = "center";
	uiCanvas.setAttribute("width", size[0].toString());
	uiCanvas.setAttribute("height", size[1].toString());
	baseDiv2.appendChild(uiCanvas);
}

// fetch GLSL handle script
// return value: -1 -> wrong param type, -2 -> cannot find web page tag
function fetchhandleData(id, filename) {
	if (typeof (filename) != 'String') return -1; // wrong parameter
	// create handle script(GLSL)
	let handle = undefined;
	if (document.getElementById(id) !== undefined) {
		handle = document.getElementById(id);
		handle.setAttribute("src", "engine/handle/" + filename); // handle txt must be in engine/handle folder
	} else {
		handle = document.createElement("script");
		handle.setAttribute("id", id);
		handle.setAttribute("type", "notjs");
		handle.setAttribute("src", "engine/handle/" + filename); // handle txt must be in engine/handle folder
		let gamedisplay = document.getElementById("mw-content-text");
		if (gamedisplay !== undefined) return -2;
		gamedisplay.appendChild(handle);
	}
}

function LoadOuterUI() {
	// add class selection button
	let gamedisplay = document.getElementById("mw-content-text");

	let classbutton1 = document.createElement("button");
	classbutton1.setAttribute("name", "classbutton1");
	classbutton1.setAttribute("type", "button");
	classbutton1.setAttribute("value", "1");
	classbutton1.innerText = "Speedster";
	classbutton1.onclick = ChangeMyCharacter;
	gamedisplay.appendChild(classbutton1);
	let classbutton2 = document.createElement("button");
	classbutton2.setAttribute("name", "classbutton2");
	classbutton2.setAttribute("type", "button");
	classbutton2.setAttribute("value", "2");
	classbutton2.innerText = "Tank";
	classbutton2.onclick = ChangeMyCharacter;
	gamedisplay.appendChild(classbutton2);
	let classbutton3 = document.createElement("button");
	classbutton3.setAttribute("name", "classbutton3");
	classbutton3.setAttribute("type", "button");
	classbutton3.setAttribute("value", "3");
	classbutton3.innerText = "Tankbuster";
	classbutton3.onclick = ChangeMyCharacter;
	gamedisplay.appendChild(classbutton3);
	return;
}

function NET_Init(ip) {
	// -------------------------- initialize web socket ----------------------------------------
	ws = new WebSocket("ws://" + ip);
	ws.addEventListener("error", function () {
		alert("서버 접속 실패");
	})
	ws.addEventListener("open", function () {

	});
	ws.addEventListener("message", messageHandler);
	ws.addEventListener("close", closeHandler);

	return ws;
}

// ---------------------------- Per-frame action ---------------------------------

// Draw the scene.
function drawScene() {

	// Tell WebGL how to convert from clip space to pixels
	gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
	
	gl.enable(gl.CULL_FACE);
	
	gl.enable(gl.BLEND);
	
	gl.enable(gl.DEPTH_TEST);
	
	gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	// Clear the canvas.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	// Tell it to use our program (pair of handles)
	gl.useProgram(program);

	// Turn on the attribute
	gl.enableVertexAttribArray(positionLocation);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 3;          // 3 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the beginning of the buffer
	gl.vertexAttribPointer( positionLocation, size, type, normalize, stride, offset);

	// Turn on the color attribute
	gl.enableVertexAttribArray(colorLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	
	// Tell the attribute how to get data out of colorBuffer (ARRAY_BUFFER)
	var size = 3;                 // 3 components per iteration
	var type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
	var normalize = true;         // normalize the data (convert from 0-255 to 0-1)
	var stride = 0;               // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;               // start at the beginning of the buffer
	gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);
	
	// Compute the matrix
	var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
	var zNear = 1;
	var zFar = 10000;
	var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);
	
	projectionMatrix = m4.xRotate(projectionMatrix, player.rotation[0]);
	projectionMatrix = m4.yRotate(projectionMatrix, player.rotation[1]);
	projectionMatrix = m4.zRotate(projectionMatrix, player.rotation[2]);
	projectionMatrix = m4.scale(projectionMatrix, player.scale[0], player.scale[1], player.scale[2]);
	
	// Compute a matrix for the camera
	player.cameraMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	player.cameraMatrix = m4.yRotation(player.direction);
	player.cameraMatrix = m4.translate(player.cameraMatrix, -player.GetCenterPosition()[0], player.height, -player.GetCenterPosition()[1]);

	// Compute a view projection matrix
	var viewProjectionMatrix = m4.multiply(projectionMatrix, player.cameraMatrix);

	var matrix = m4.translate(viewProjectionMatrix, -player.GetCenterPosition()[0], player.height, -player.GetCenterPosition()[1]);
	// Set the matrix.
	gl.uniformMatrix4fv(matrixLocation, false, matrix);
	// --------------------------------------------------------draw!!!!-------------------------------------------------
	// Draw map objects
	// Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
	offset = 0;
	var count = (2+mapinfo.mapwallcounter) * 6;
	
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	let tempArray = mapinfo.polygons;
	
	let polygonArray = new Float32Array(tempArray);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, polygonArray);
	// Bind the color buffer.
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	tempArray = mapinfo.mapColors;
	let mapColorArray = new Uint8Array( tempArray );
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, mapColorArray);
	
	gl.drawArrays(gl.TRIANGLES, offset, count);
	
	// Draw rays
	for (let playeritem of playerlist) {
		for (let ray of playeritem.raylist) {
			if (playeritem.raylist.indexOf(ray) > 10) continue;
			else if (ray.visible) {
				tempArray = [];
				gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
				tempArray = tempArray.concat([2*ray.startpos[0], ray.startpos[2], 2*ray.startpos[1]]);
				tempArray = tempArray.concat([2*ray.endpos[0], 0, 2*ray.endpos[1]]);
				polygonArray = new Float32Array(tempArray);
				gl.bufferSubData(gl.ARRAY_BUFFER, 0, polygonArray);
				gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
				tempArray =[255, 255, 0, 255, 255, 0];
				mapColorArray = new Uint8Array( tempArray );
				gl.bufferSubData(gl.ARRAY_BUFFER, 0, mapColorArray);
				// we have already set the matrix, so directly draw
				gl.drawArrays(gl.LINES, 0, 2);
			}
		}
	}
	// Draw projectiles
	// Tell WebGL to use our handle program pair
	gl.useProgram(textureprogram);
	gl.enableVertexAttribArray(texpositionLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	// Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
	var size = 3;          // 3 components per iteration
	var type = gl.FLOAT;   // the data is 32bit floats
	var normalize = false; // don't normalize the data
	var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
	var offset = 0;        // start at the current position
	gl.vertexAttribPointer( texpositionLocation, size, type, normalize, stride, offset);
	
	// Setup the attributes to pull data from our buffers
	gl.enableVertexAttribArray(texcoordLocation);
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);
	
	// fill the polygon buffer
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	tempArray = [];
	count = 0;
	for (let proj of projectilelist) {
		tempArray = tempArray.concat(proj.vertexlist);
		count += 4*6;
	}
	polygonArray = new Float32Array(tempArray);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, polygonArray);
	// Tell the handle to get the texture from texture unit 0
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	tempArray = [];
	for (let proj of projectilelist) {
		tempArray = tempArray.concat([0.5, 0, 0.5, 0.5, 1, 0.5, 0.5, 0, 1, 0.5, 1, 0]);
		tempArray = tempArray.concat([0.5, 0.5, 0.5, 1.0, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5]);
		tempArray = tempArray.concat([0, 0, 0.5, 0, 0, 0.5, 0, 0.5, 0.5, 0, 0.5, 0.5]);
		tempArray = tempArray.concat([0, 0.5, 0, 1, 0.5, 1, 0, 0.5, 0.5, 1, 0.5, 0.5]);
	}
	let texcoordinates = new Float32Array( tempArray );
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, texcoordinates);
	
	// Set the matrix.
	gl.uniformMatrix4fv(texmatrixLocation, false, matrix);
	gl.uniform1i(textureLocation, 0);
	gl.drawArrays(gl.TRIANGLES, 0, count);
	
	// Draw Player
	
	for (let playeritem of playerlist) {
		if (playeritem.playerID === player.playerID) continue;
		tempArray = [];
		count = 4*6;
		// vertex
		if (playeritem.team === 1) {
			if (playeritem.isdead) gl.bindTexture(gl.TEXTURE_2D, redplayerdeadtex);
			else gl.bindTexture(gl.TEXTURE_2D, redplayertex);
		} else {
			if (playeritem.isdead) gl.bindTexture(gl.TEXTURE_2D, blueplayerdeadtex);
			else gl.bindTexture(gl.TEXTURE_2D, blueplayertex);
		}
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		playeritem.vertexlist = GeneratePlaneVertex(playeritem.GetCenterPosition(), 32, m4.lookAt([playeritem.GetCenterPosition()[0], playeritem.height, playeritem.GetCenterPosition()[1]], [player.GetCenterPosition()[0], player.height, player.GetCenterPosition()[1]], up));
		tempArray = tempArray.concat(playeritem.vertexlist);
		polygonArray = new Float32Array(tempArray);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, polygonArray);
		// texture coordinate
		gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
		tempArray = [];
		if (radToDeg(playeritem.direction - player.direction) % 360 >= 315 || ( radToDeg(playeritem.direction - player.direction) % 360 >= -45 && radToDeg(playeritem.direction - player.direction) % 360 < 45 ) || radToDeg(playeritem.direction - player.direction) % 360 < -315 ) {
			tempArray = tempArray.concat([0.5, 0, 0.5, 0.5, 1, 0.5, 0.5, 0, 1, 0.5, 1, 0]);
			tempArray = tempArray.concat([0.5, 0, 0.5, 0.5, 1, 0.5, 0.5, 0, 1, 0.5, 1, 0]);
			tempArray = tempArray.concat([0.5, 0, 0.5, 0.5, 1, 0.5, 0.5, 0, 1, 0.5, 1, 0]);
			tempArray = tempArray.concat([0.5, 0, 0.5, 0.5, 1, 0.5, 0.5, 0, 1, 0.5, 1, 0]);
		} else if ((radToDeg(playeritem.direction - player.direction) % 360 >= 45 && radToDeg(playeritem.direction - player.direction) % 360 < 135) ||(radToDeg(playeritem.direction - player.direction) % 360 < -225 && radToDeg(playeritem.direction - player.direction) % 360 >= -315)) {
			tempArray = tempArray.concat([0, 0.5, 0, 1, 0.5, 1, 0, 0.5, 0.5, 1, 0.5, 0.5]);
			tempArray = tempArray.concat([0, 0.5, 0, 1, 0.5, 1, 0, 0.5, 0.5, 1, 0.5, 0.5]);
			tempArray = tempArray.concat([0, 0.5, 0, 1, 0.5, 1, 0, 0.5, 0.5, 1, 0.5, 0.5]);
			tempArray = tempArray.concat([0, 0.5, 0, 1, 0.5, 1, 0, 0.5, 0.5, 1, 0.5, 0.5]);
		} else if ((radToDeg(playeritem.direction - player.direction) % 360 >= 135 && radToDeg(playeritem.direction - player.direction) % 360 < 225) || (radToDeg(playeritem.direction - player.direction) % 360  < -135 && radToDeg(playeritem.direction - player.direction) % 360 >= -225)) {
			tempArray = tempArray.concat([0, 0, 0, 0.5, 0.5, 0.5, 0, 0, 0.5, 0.5, 0.5, 0]);
			tempArray = tempArray.concat([0, 0, 0, 0.5, 0.5, 0.5, 0, 0, 0.5, 0.5, 0.5, 0]);
			tempArray = tempArray.concat([0, 0, 0, 0.5, 0.5, 0.5, 0, 0, 0.5, 0.5, 0.5, 0]);
			tempArray = tempArray.concat([0, 0, 0, 0.5, 0.5, 0.5, 0, 0, 0.5, 0.5, 0.5, 0]);
		} else {
			tempArray = tempArray.concat([0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5]);
			tempArray = tempArray.concat([0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5]);
			tempArray = tempArray.concat([0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5]);
			tempArray = tempArray.concat([0.5, 0.5, 0.5, 1, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5]);
		}
		texcoordinates = new Float32Array( tempArray );
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, texcoordinates);
		// Set the matrix and draw.
		gl.drawArrays(gl.TRIANGLES, 0, count);
	}
	
	// Draw Healthkit
	gl.bindTexture(gl.TEXTURE_2D, healthkittex);
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	tempArray = [];
	count = 0;
	for (let kit of mapinfo.maphealthkitlist) {
		if (kit.isSpawned) {
			tempArray = tempArray.concat(kit.vertexlist);
			count += 4*6;
		}
	}
	polygonArray = new Float32Array(tempArray);
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, polygonArray);
	// Tell the handle to get the texture from texture unit 0
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
	tempArray = [];
	for (let kit of mapinfo.maphealthkitlist) {
		if (kit.isSpawned) {
			tempArray = tempArray.concat([0.5, 0, 0.5, 0.5, 1, 0.5, 0.5, 0, 1, 0.5, 1, 0]);
			tempArray = tempArray.concat([0.5, 0.5, 0.5, 1.0, 1, 1, 0.5, 0.5, 1, 1, 1, 0.5]);
			tempArray = tempArray.concat([0, 0, 0, 0.5, 0.5, 0.5, 0, 0, 0.5, 0.5, 0.5, 0]);
			tempArray = tempArray.concat([0, 0.5, 0, 1, 0.5, 1, 0, 0.5, 0.5, 1, 0.5, 0.5]);
		}
	}
	texcoordinates = new Float32Array( tempArray );
	gl.bufferSubData(gl.ARRAY_BUFFER, 0, texcoordinates);
	
	// Set the matrix.
	gl.uniformMatrix4fv(texmatrixLocation, false, matrix);
	gl.uniform1i(textureLocation, 0);
	gl.drawArrays(gl.TRIANGLES, 0, count);
	
	// Draw Explosion
	for (let explosion of explosionlist) {
		if (explosion.active === false) {
			continue;
		}
		tempArray = [];
		count = 4*6;
		gl.bindTexture(gl.TEXTURE_2D, explosiontex);
		// vertex
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		explosion.vertexlist = GeneratePlaneVertex(explosion.GetCenterPosition(), 32, m4.lookAt([explosion.GetCenterPosition()[0], explosion.height, explosion.GetCenterPosition()[1]], [player.GetCenterPosition()[0], player.height, player.GetCenterPosition()[1]], up));
		tempArray = tempArray.concat(explosion.vertexlist);
		polygonArray = new Float32Array(tempArray);
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, polygonArray);
		// texture coordinate
		gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
		tempArray = [];
		if ( explosion.counter === 0 ) {
			tempArray = tempArray.concat([0, 0, 0, 1, 0.25, 1, 0, 0, 0.25, 1, 0.25, 0]);
			tempArray = tempArray.concat([0, 0, 0, 1, 0.25, 1, 0, 0, 0.25, 1, 0.25, 0]);
			tempArray = tempArray.concat([0, 0, 0, 1, 0.25, 1, 0, 0, 0.25, 1, 0.25, 0]);
			tempArray = tempArray.concat([0, 0, 0, 1, 0.25, 1, 0, 0, 0.25, 1, 0.25, 0]);
		} else if (explosion.counter === 1) {
			tempArray = tempArray.concat([0.25, 0, 0.25, 1, 0.5, 1, 0.25, 0, 0.5, 1, 0.5, 0]);
			tempArray = tempArray.concat([0.25, 0, 0.25, 1, 0.5, 1, 0.25, 0, 0.5, 1, 0.5, 0]);
			tempArray = tempArray.concat([0.25, 0, 0.25, 1, 0.5, 1, 0.25, 0, 0.5, 1, 0.5, 0]);
			tempArray = tempArray.concat([0.25, 0, 0.25, 1, 0.5, 1, 0.25, 0, 0.5, 1, 0.5, 0]);
		} else if (explosion.counter === 2) {
			tempArray = tempArray.concat([0.5, 0, 0.5, 1, 0.75, 1, 0.5, 0, 0.75, 1, 0.75, 0]);
			tempArray = tempArray.concat([0.5, 0, 0.5, 1, 0.75, 1, 0.5, 0, 0.75, 1, 0.75, 0]);
			tempArray = tempArray.concat([0.5, 0, 0.5, 1, 0.75, 1, 0.5, 0, 0.75, 1, 0.75, 0]);
			tempArray = tempArray.concat([0.5, 0, 0.5, 1, 0.75, 1, 0.5, 0, 0.75, 1, 0.75, 0]);
		} else {
			tempArray = tempArray.concat([0.75, 0, 0.75, 1, 1, 1, 0.75, 0, 1, 1, 1, 0]);
			tempArray = tempArray.concat([0.75, 0, 0.75, 1, 1, 1, 0.75, 0, 1, 1, 1, 0]);
			tempArray = tempArray.concat([0.75, 0, 0.75, 1, 1, 1, 0.75, 0, 1, 1, 1, 0]);
			tempArray = tempArray.concat([0.75, 0, 0.75, 1, 1, 1, 0.75, 0, 1, 1, 1, 0]);
			explosion.active = false;
		}
		explosion.counter += 1;
		texcoordinates = new Float32Array( tempArray );
		gl.bufferSubData(gl.ARRAY_BUFFER, 0, texcoordinates);
		// Set the matrix and draw.
		gl.drawArrays(gl.TRIANGLES, 0, count);
	}
	for (let explosion of explosionlist) {
		if (explosion.active === false) explosionlist.splice(explosionlist.indexOf(explosion), 1);
	}
	// draw ui
	DrawUI();
	
}

// Main loop
function Loop_Main() {
	// input

	// render
	drawScene();

	requestAnimationFrame(Loop_Main);
}

//---------------------------------- function used inside the procedure -----------------------------------------
function loadDefaultResources () {
  //------------------------ get attribute from 3D handle program ----------------------------
  // look up where the vertex, color data needs to go.
  var positionLocation = gl.getAttribLocation(program, "a_position");
  let colorLocation = gl.getAttribLocation(program, "a_color");

  // lookup uniforms
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  
  //------------------------ get attribute from 2D handle program ----------------------------
  // look up where the vertex, color data needs to go.
  let texpositionLocation = gl.getAttribLocation(textureprogram, "a_position");
  let texcoordLocation = gl.getAttribLocation(textureprogram, "a_texcoord");

  // lookup uniforms
  let texmatrixLocation = gl.getUniformLocation(textureprogram, "u_matrix");
  let textureLocation = gl.getUniformLocation(textureprogram, "u_texture");
  
  // ----------------------- Create Buffer ------------------------------
  let positionBuffer = gl.createBuffer();
  // Put geometry data into buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setMapGeometry(gl, mapinfo);
  
  // Put color data into buffer
  let colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  setMapColors(gl, mapinfo);
  
  // Put coordinate for texture
  let texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  let texcoords = new Array(2* 6 * 32* MAX_PROJECTILE_PER_PLAYER);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);
  
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
 
  let img = new Image();
  img.src = "https://libertyga.me/images/7/7e/UF_Rocket_Red.png";
  img.crossOrigin = "anonymous";
  img.addEventListener('load', function() {
	gl.bindTexture(gl.TEXTURE_2D, tex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  });
  
  let redplayertex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, redplayertex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));
  let redplayerimg = new Image();
  redplayerimg.src = "https://libertyga.me/images/c/c7/UF_Player_Red.png";
  redplayerimg.crossOrigin = "anonymous";
  redplayerimg.addEventListener('load', function() {
	gl.bindTexture(gl.TEXTURE_2D, redplayertex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, redplayerimg);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  });
  
  let blueplayertex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, blueplayertex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  let blueplayerimg = new Image();
  blueplayerimg.src = "https://libertyga.me/images/d/d7/UF_Player_Blue.png";
  blueplayerimg.crossOrigin = "anonymous";
  blueplayerimg.addEventListener('load', function() {
	gl.bindTexture(gl.TEXTURE_2D, blueplayertex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, blueplayerimg);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  });
   // dead image
  let redplayerdeadtex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, redplayerdeadtex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 0, 0, 255]));
  let redplayerdeadimg = new Image();
  redplayerdeadimg.src = "https://libertyga.me/images/f/f4/UF_Player_Dead_Red.png";
  redplayerdeadimg.crossOrigin = "anonymous";
  redplayerdeadimg.addEventListener('load', function() {
	gl.bindTexture(gl.TEXTURE_2D, redplayerdeadtex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, redplayerdeadimg);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  });
  
  let blueplayerdeadtex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, blueplayerdeadtex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  let blueplayerdeadimg = new Image();
  blueplayerdeadimg.crossOrigin = "anonymous";
  blueplayerdeadimg.src = "https://libertyga.me/images/6/6a/UF_Player_Dead_Blue.png";
  blueplayerdeadimg.addEventListener('load', function() {
	gl.bindTexture(gl.TEXTURE_2D, blueplayerdeadtex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, blueplayerdeadimg);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  });
  
  let explosiontex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, explosiontex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
  let explosionimg = new Image();
  explosionimg.src = "https://libertyga.me/images/f/f0/UF_Explosion.png";
  explosionimg.crossOrigin = "anonymous";
  explosionimg.addEventListener('load', function() {
	gl.bindTexture(gl.TEXTURE_2D, explosiontex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, explosionimg);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  });
  
  var healthkittex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, healthkittex);
  let healthkitimg = new Image();
  healthkitimg.src = "https://libertyga.me/images/4/46/UF_Healthkit.png";
  healthkitimg.crossOrigin = "anonymous";
  healthkitimg.addEventListener('load', function() {
	gl.bindTexture(gl.TEXTURE_2D, healthkittex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, healthkitimg);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  });
  
}

// ----------- Engine Init --------------

let mapdataurl = "http://libertyga.me/index.php?title=%EC%82%AC%EC%9A%A9%EC%9E%90:Senouis/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8/%ED%85%8C%EC%8A%A4%ED%8A%B8%EB%A7%B5&action=raw";

function EngineMain() {
	// init player
	// TODO: move this in per-frame actions
	// player = new Player([0, 0], 8, degToRad(0), 1);
	// gamerule_handle = new GameRule(0, 0, 0);
	// ----------------------------Procedure Start--------------------------------
	// Get A WebGL context
	let canvas = document.getElementById("MainCanvas");

	let gl = canvas.getContext("webgl");
	if (!gl) {
		return;
	}

	// create handle script(GLSL)
	// 3D Map Model
	fetchhandleData("3d-vertex-handle", "vertex_default.txt");
	fetchhandleData("3d-fragment-handle", "fragment_default.txt");
	// 2D Particle / Object
	fetchhandleData("2d-vertex-handle", "vertex_2d_default.txt");
	fetchhandleData("2d-fragment-handle", "fragment_2d_default.txt")
	// setup GLSL program
	let vertexhandle = createhandle(gl, gl.VERTEX_handle, document.getElementById("3d-vertex-handle").text);
	let fragmenthandle = createhandle(gl, gl.FRAGMENT_handle, document.getElementById("3d-fragment-handle").text);

	let program = createProgram(gl, vertexhandle, fragmenthandle);

	let planevertexhandle = createhandle(gl, gl.VERTEX_handle, document.getElementById("2d-vertex-handle").text);
	let planefragmenthandle = createhandle(gl, gl.FRAGMENT_handle, document.getElementById("2d-fragment-handle").text);

	let textureprogram = createProgram(gl, planevertexhandle, planefragmenthandle);

	// load map data
	mapinfo = new MapInfo (""); 
	loadDefaultResources();
	LoadOuterUI();
	gamerule_handle = new GameRule(180, 180, 0);
	inputhandler = new Input(document.getElementById("UICanvas"));
	inputhandler.InitInput();

	let ws = NET_Init(ip);

	// Draw screen

	requestAnimationFrame(Loop_Main);
	// ----------------------Procedure End--------------------------------------
}

function DoInitialJob() { // Engine Initializer Wrapper
	createCanvas([800, 600]);
	EngineMain();
}


// ---------End----------