function LineTrace_Sub1(lineeq, areaeq) {
	if (lineeq.linevector[0] * areaeq.normalvector[0] + lineeq.linevector[1] * areaeq.normalvector[1] === 0) return [];
	let t = -(areaeq.normalvector[0]*(lineeq.point[0]-areaeq.point[0]) + areaeq.normalvector[1]*(lineeq.point[1]-areaeq.point[1]) + areaeq.normalvector[2]*(lineeq.point[2]-areaeq.point[2])) / (areaeq.normalvector[0]*lineeq.linevector[0] + areaeq.normalvector[1]*lineeq.linevector[1] +areaeq.normalvector[2]*lineeq.linevector[2]);
	return [lineeq.linevector[0]*t + lineeq.point[0], lineeq.linevector[1]*t + lineeq.point[1],lineeq.linevector[2]*t + lineeq.point[2]];
}

function LineTrace_Sub2(lineeq, cylindereq) {
	let a = lineeq.linevector[0];
	let b = lineeq.linevector[1];
	let c = cylindereq.centerpos[0] - lineeq.point[0];
	let d = cylindereq.centerpos[1] - lineeq.point[1];
	let t1 = (a*c + b* d + Math.sqrt( (a*c + b*d) * (a*c + b*d) - (a*a + b*b) * (c*c + d* d - cylindereq.radius * cylindereq.radius) )) / (a*a + b*b);
	let t2 = (a*c + b* d - Math.sqrt( (a*c + b*d) * (a*c + b*d) - (a*a + b*b) * (c*c + d* d - cylindereq.radius * cylindereq.radius) )) / (a*a + b*b);
	let dx1 = a * t1;
	let dy1 = b * t1;
	let dx2 = a * t2;
	let dy2 = b * t2;
	return dx1*dx1+ dy1*dy1 < dx2*dx2 + dy2*dy2 ? [dx1 + lineeq.point[0], dy1 + lineeq.point[1], lineeq.linevector[2]* t1 + lineeq.point[2]] : [dx2 + lineeq.point[0], dy2 + lineeq.point[1], lineeq.linevector[2]* t2 + lineeq.point[2]];
}

function GetLineLength(startpos, endpos) {
	return Math.sqrt((endpos[0] - startpos[0])* (endpos[0] - startpos[0]) + (endpos[1] - startpos[1]) * (endpos[1] - startpos[1]) + (endpos[2] - startpos[2]) * (endpos[2] - startpos[2]));
}

// TODO List
// 0. optimize algorithm
// 1. Implement BVH traversing algorithm