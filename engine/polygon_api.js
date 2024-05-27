function createEntityVertex(pos){
	// this generate a pillar
	return [ 
			// wall 1
			2*pos[0],   32,  2*pos[1],
			2*pos[0],   -32,  2*pos[1],
			2*pos[0],   -32,  2*pos[1] + 2*size[1],
			2*pos[0],   32,  2*pos[1],
			2*pos[0],   -32,  2*pos[1] + 2*size[1],
			2*pos[0],   32, 2*pos[1] + 2*size[1],
			// wall 2
			2*pos[0]+ 2*size[0],   32,  2*pos[1],
			2*pos[0]+ 2*size[0],   -32,  2*pos[1] + 2*size[1],
			2*pos[0]+ 2*size[0],   -32,  2*pos[1],
			2*pos[0]+ 2*size[0],   32,  2*pos[1],
			2*pos[0]+ 2*size[0],   32,  2*pos[1] + 2*size[1],
			2*pos[0]+ 2*size[0],   -32,  2*pos[1] + 2*size[1],
			// wall 3
			2*pos[0],		32,  2*pos[1],
			2*pos[0]+ 2*size[0],	-32,  2*pos[1],
			2*pos[0],		-32,  2*pos[1],
			2*pos[0],		32,  2*pos[1],
			2*pos[0]+ 2*size[0],	32,  2*pos[1],
			2*pos[0]+ 2*size[0], -32,  2*pos[1],
			// wall 4
			2*pos[0],		32,  2*pos[1] + 2*size[1],
			2*pos[0],		-32,  2*pos[1] + 2*size[1],
			2*pos[0]+ 2*size[0],	-32,  2*pos[1] + 2*size[1],
			2*pos[0],		32,  2*pos[1] + 2*size[1],
			2*pos[0]+ 2*size[0], -32,  2*pos[1] + 2*size[1],
			2*pos[0]+ 2*size[0],	32,  2*pos[1] + 2*size[1]
		];
}

function GeneratePlaneVertex(pos, size, cameraMatrix) { // pos: [x, y](center), size: integer, height: interger, cameraMatrix: 4x4 matrix
	return [
		//plane
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2],
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2],
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2],
		
		//plane 2
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2],
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2],
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2],
		
		// plane 3
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2],
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]-size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]-size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]-size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2],
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2],
		
		// plane 4
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2],
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] -size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		-size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] -size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2],
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] - size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] - size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] - size *m4.getUp(cameraMatrix)[2],
		2*pos[0] +size* m4.getForward(cameraMatrix)[0]+size* m4.getRight(cameraMatrix)[0] + size *m4.getUp(cameraMatrix)[0],
		size* m4.getForward(cameraMatrix)[1]+size* m4.getRight(cameraMatrix)[1] + size *m4.getUp(cameraMatrix)[1],
		2*pos[1] +size* m4.getForward(cameraMatrix)[2]+size* m4.getRight(cameraMatrix)[2] + size *m4.getUp(cameraMatrix)[2]
	];
}