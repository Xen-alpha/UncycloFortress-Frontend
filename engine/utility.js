// --------------------------------------------global function -----------------------------------------------
String.format = function() {
	// The string containing the format items (e.g. "{0}")
	// will and always has to be the first argument.
	var theString = arguments[0];
	// start with the second argument (i = 1)
	for (var i = 1; i < arguments.length; i++) {
		// "gm" = RegEx options for Global search (more than one instance)
		// and for Multiline search
		var regEx = new RegExp("\\{" + (i - 1) + "\\}", "gm");
		theString = theString.replace(regEx, arguments[i]);
	}
	return theString;
}

function radToDeg(r) {
    return r * 180 / Math.PI;
}

function degToRad(d) {
return d * Math.PI / 180;
}

function AreaEquation(centerpos, firstcornerpos, secondcornerpos) { // 3 dimensional position
	this.point = centerpos;
	this.normalvector = m4.cross([centerpos[0]-firstcornerpos[0],centerpos[1]-firstcornerpos[1],centerpos[2]-firstcornerpos[2]], [centerpos[0]-secondcornerpos[0],centerpos[1]-secondcornerpos[1],centerpos[2]-secondcornerpos[2]]);
}

function LineEquation(startpos, endpos) { // 3 dimensional position
	this.point = startpos;
	this.linevector = [endpos[0] - startpos[0],endpos[1] - startpos[1],endpos[2] - startpos[2]];
}

function CylinderEquation(center, radius) {
	this.centerpos = center;
	this.radius = radius;
}