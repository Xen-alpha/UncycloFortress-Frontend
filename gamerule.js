function GameRule(RedClock, BlueClock, initialstate) {
	this.state = initialstate; // 0: game ceased, 1: game setup, 2: game on!, 3: round end
	this.RedClock = RedClock;
	this.BlueClock = BlueClock;
	this.currentdominating = 0; // 0: neutral, 1: red, 2:blue
	this.reddominatingprogress = 0;
	this.bluedominatingprogress = 0;
}

let redteamnum = 0;
let blueteamnum = 0;