// ------------------------------------------------ input control ------------------------------------------------
let keystate = [];
function Input(screen) {
	this.screen = screen;
	this.target;
	this.keyboardinputtimer;
	this.havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;
	this.InitInput = () => {
		if (this.havePointerLock){
			  this.screen.onclick = () => { // requestPointerLock must be in callback
				  this.screen.requestPointerLock = this.screen.requestPointerLock || this.screen.mozRequestPointerLock || this.screen.webkitRequestPointerLock;
				  // Ask the browser to lock the pointer
				  this.screen.requestPointerLock();
			  }
			  // Hook pointer lock state change events
			  
			  document.addEventListener('pointerlockchange', this.changeCallback, false);
			  document.addEventListener('mozpointerlockchange', this.changeCallback, false);
			  document.addEventListener('webkitpointerlockchange', this.changeCallback, false);
			  
			  document.addEventListener('pointerlockerror', this.errorCallback, false);
			  document.addEventListener('mozpointerlockerror', this.errorCallback, false);
			  document.addEventListener('webkitpointerlockerror', this.errorCallback, false);
		}
		return;
	}
	 // ----------------------mouse management----------------------------------
	this.GrabInput = (target) => {
		this.target = target;
		this.keyboardinputtimer = setInterval(this.target.moveSomething, 10);
		return;
	};
	this.manageKeyboardInputDown = () => {
			if (event.keyCode === 65 || event.keyCode === 97) //a
				keystate[0] = true;
			if (event.keyCode === 68 || event.keyCode === 100) //d
				keystate[1] = true;
			if (event.keyCode === 83 || event.keyCode === 115) //s
				keystate[2] = true;
			if (event.keyCode === 87 || event.keyCode === 119) // w
				keystate[3] = true;
			if (event.keyCode === 81 || event.keyCode === 113) // q
				keystate[4] = true;
			if (event.keyCode === 69 || event.keyCode === 101) //e
				keystate[5] = true;
			if (event.keyCode === 82 || event.keyCode === 114) //r
				keystate[6] = true;
			if (event.keyCode === 70 || event.keyCode === 102) // f
				keystate[7] = true;
	  };
	  this.manageKeyboardInputUp = () => {
			if (event.keyCode === 65 || event.keyCode === 97) // a
				keystate[0] = false;
			if (event.keyCode === 68 || event.keyCode === 100) //d
				keystate[1] = false;
			if (event.keyCode === 83 || event.keyCode === 115) //s
				keystate[2] = false;
			if (event.keyCode === 87 || event.keyCode === 119) //w
				keystate[3] = false;
			if (event.keyCode === 81 || event.keyCode === 113) //q
				keystate[4] = false;
			if (event.keyCode === 69 || event.keyCode === 101) //e
				keystate[5] = false;
			if (event.keyCode === 82 || event.keyCode === 114) //r
				keystate[6] = false;
			if (event.keyCode === 70 || event.keyCode === 102) // f
				keystate[7] = false;
	  };
	  this.errorCallback = (e) => {
		  alert( "Fail to initialize point lock process" );
	  }
	  this.moveCallback = (e) => {
		  let movementX = 0;
		  let movementY = 0;
		  movementX = e.movementX ||
			  e.mozMovementX          ||
			  e.webkitMovementX       ||
			  0,
		  movementY = e.movementY ||
			  e.mozMovementY      ||
			  e.webkitMovementY   ||
			  0;
		  if (this.target != undefined) {
			  this.target.direction = this.target.direction + degToRad(movementX);
			  ws.send(JSON.stringify({
				type:5,
				id: this.target.playerID,
				pos: this.target.pos,
				direction: this.target.direction
			  }));
		  }
	  }
	  this.ReleasePlayer = () => {
		clearInterval(this.keyboardinputtimer);
		return;
	  }
	  
	  this.changeCallback = (e) => {
		if (document.pointerLockElement === this.screen ||
		  document.mozPointerLockElement === this.screen ||
		  document.webkitPointerLockElement === this.screen) {
		  // Pointer was just locked
		  // Enable the mousemove listener
		  document.addEventListener("mousemove", this.moveCallback);
		  document.addEventListener("keydown", this.manageKeyboardInputDown);
		  document.addEventListener("keyup", this.manageKeyboardInputUp);
		  document.onmousedown = () => {
			switch(event.button) {
				case 0:
					this.target.FireWeapon();
					break;
				case 2:
					this.target.DoSpecialSkill();
					break;
				default:
					break;
			}
		  }
		  document.onmouseup = () => {
			  if (event.button === 0) this.target.ReleaseFire();
			  return;
		  }
		} else {
		  // Disable the mousemove listener
		  document.removeEventListener("mousemove", this.moveCallback);
		  document.removeEventListener("keydown", this.manageKeyboardInputDown);
		  document.removeEventListener("keyup", this.manageKeyboardInputUp);
		  document.onmousedown = () => {
			return;
		  }
		  document.onmouseup = () => {
			return;
		  }
		}
	  }
	  
}

let inputhandler;