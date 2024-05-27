// ---------------------------------------HTML document managing function-------------------------------------


function createIPInputBox () {
	let gamedisplay = document.getElementById("mw-content-text");
	gamedisplay.style.height = "1080px";
	let paragraph = document.createElement("p");
	paragraph.setAttribute("id", "infoparagraph");
	paragraph.innerHTML = "IP주소와 포트를 쓰고 그 오른쪽 칸에 닉네임를 입력해주세요."
	gamedisplay.appendChild(paragraph);
	let mainInputBox = document.createElement("input");
	mainInputBox.setAttribute("id", "input");
	mainInputBox.setAttribute("placeholder", "(ex: 127.0.0.1:8080)");
	mainInputBox.addEventListener("keydown", CheckInputBox);
	gamedisplay.appendChild(mainInputBox);
	let nameInputBox = document.createElement("input");
	nameInputBox.setAttribute("id", "playername");
	nameInputBox.setAttribute("placeholder", "Game Nickname");
	nameInputBox.addEventListener("keydown", CheckInputBox);
	gamedisplay.appendChild(nameInputBox);
	
	function CheckInputBox(e) {
		if (e.keyCode === 13) { // Pressing Enter key
			if (document.getElementById("input").value === "" || document.getElementById("playername").value === "" ) {
				alert("데이터가 없습니다! 빈칸을 내버려두지 마세요!")
				return;
			}
			ip = document.getElementById("input").value;
			playername = document.getElementById("playername").value;
			document.getElementById("input").value = "";
			document.getElementById("playername").value = "";
			document.getElementById("mw-content-text").removeChild(document.getElementById("input"));
			document.getElementById("mw-content-text").removeChild(document.getElementById("playername"));
			document.getElementById("mw-content-text").removeChild(document.getElementById("infoparagraph"));
			DoInitialJob();
		}
	}
}

function DrawUI () {
	if (player != undefined && player.secondweapon != undefined && player.firstweapon != undefined){
		let ctx = document.getElementById("UICanvas").getContext("2d");
		ctx.canvas.width = 800; // reset the ui canvas
		ctx.beginPath();
		ctx.rect(0, 500, 800, 100);
		ctx.fillStyle = "rgba(125, 125, 5, 1)";
		ctx.fill();
		ctx.font = "18px Arial, sans-serif";
		ctx.fillStyle = "rgba(255, 255, 0, 1)";
		if (player.currentweapon === 0)ctx.fillText("Current Weapon: "+ player.secondweapon.weaponname,20,20);
		else ctx.fillText("Current Weapon: "+ player.firstweapon.weaponname,20,20);
		ctx.fillStyle = "rgba(255, 0, 0, 1)";
		ctx.fillText(String.format("{0}:{1}", Math.floor(gamerule.RedClock /60), gamerule.RedClock % 60),400-90,20 );
		ctx.fillStyle = "rgba(25, 125, 255, 1)";
		ctx.fillText(String.format("{0}:{1}", Math.floor(gamerule.BlueClock /60), gamerule.BlueClock % 60),400,20 );
		// reserved for kill log
		
		ctx.fillStyle = "rgba(255, 255, 0, 1)";
		ctx.fillText("Health: "+player.healthpoint, 20, 580);
		if (player.currentweapon === 0) {
			if (player.secondweapon.isReloading) {
				ctx.fillStyle = "rgba(255, 25, 0, 1)";
				ctx.fillText("Reloading", 700, 560);
			}
			ctx.fillText("Ammo: "+player.secondweapon.loadedbullet, 700, 580);
		} else {
			if (player.firstweapon.isReloading) {
				ctx.fillStyle = "rgba(255, 25, 0, 1)";
				ctx.fillText("Reloading", 700, 560);
			}
			ctx.fillText("Ammo: "+player.firstweapon.loadedbullet, 700, 580);
		}
		ctx.closePath();
		ctx.beginPath();
		ctx.arc(400, 300, 10, 0, 2*Math.PI, true);
		ctx.closePath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = "#FFFF00";
		ctx.stroke();
		ctx.beginPath();
		ctx.font = "12px Arial, sans-serif";
		for (let killlog of killloglist){
			ctx.fillStyle = "rgba(0, 255, 0, 1)";
			ctx.fillText(killlog, 760 - 5*killlog.length, 40+8*killloglist.indexOf(killlog));
		}
		ctx.closePath();
		if (keystate[7]){
			//draw player list board
			ctx.beginPath();
			ctx.rect(100, 100, 600, 600);
			ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
			ctx.fill();
			ctx.font = "18px Arial, sans-serif";
			ctx.fillStyle = "rgba(0, 255, 0, 1)";
			ctx.fillText("Players", 400 - "Players".length / 2, 110);
			let blueteamplayer = 0;
			let redteamplayer = 0;
			for (let playeritem of playerlist) {
				if (playeritem.team === 1 ) {
					ctx.fillStyle = "rgba(255, 0, 0, 1)";
					ctx.fillText(playeritem.playername, 660 - 8*playeritem.playername.length, 140+9*redteamplayer);
					redteamplayer += 1;
				} else if (playeritem.team === 2) {
					ctx.fillStyle = "rgba(0, 0, 255, 1)";
					ctx.fillText(playeritem.playername, 140, 140+9*blueteamplayer);
					blueteamplayer += 1;
				}
			}
			ctx.closePath();
		}
	}
	return;
}

createIPInputBox();