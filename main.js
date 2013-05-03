/* 	Quadratus – Experimental Cube Map Using Three.JS
 *  Parts written by 
 *  	Jeffrey Drake
 *      Chris Droulliard
 *      Original Three.JS team (based on a demo)
 *   
 * 	Licensed under the original MIT license of the original code.
 */

function CreateGrid(scene, width, depth, square)
{
	var geometry = new THREE.Geometry();
	
	for (var i = 0; i <= width; i++)
	{
		geometry.vertices.push( new THREE.Vector3( 0, 0, i * square ) );
		geometry.vertices.push( new THREE.Vector3( width * square, 0, i * square ) );
	}
	
	for (var i = 0; i <= depth; i++)
	{
		geometry.vertices.push( new THREE.Vector3( i * square, 0, 0 ) );
		geometry.vertices.push( new THREE.Vector3( i * square, 0,   depth * square ) );
	}

	var material = new THREE.LineBasicMaterial( { color: 0x000000, opacity: 0.2 } );

	var line = new THREE.Line( geometry, material );
	line.type = THREE.LinePieces;
	scene.add( line );
}

function CreateLand(scene, x, y, height, square)
{
	var geometry = new THREE.CubeGeometry( square, height * square, square );
	
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true } );

	var cube = new THREE.Mesh(geometry, material);
	
	cube.position.x = x * square + square / 2;
	cube.position.y = height * square / 2;
	cube.position.z = y * square + square / 2;
				
    scene.add(cube);
}

// type 0: along x, type 1: along y
function CreateRamp(scene, x1, y1, height1, height2, type, square)
{
	var geometry = new THREE.Geometry();
	
	if (type == 0)
	{
		geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		geometry.vertices.push( new THREE.Vector3( 0, height1 * square, 0 ) );
		geometry.vertices.push( new THREE.Vector3( square, height1 * square, 0) );
		geometry.vertices.push( new THREE.Vector3( square, 0, 0));
	
		geometry.vertices.push( new THREE.Vector3( 0, height2 * square, square ) );
		geometry.vertices.push( new THREE.Vector3( square, height2 * square, square ) );
	
	
		geometry.faces.push( new THREE.Face4(0, 1, 2, 3) );
		geometry.faces.push( new THREE.Face4(0, 3, 5, 4) );
		geometry.faces.push( new THREE.Face3(0, 4, 1) );
		geometry.faces.push( new THREE.Face3(3, 2, 5) );
		geometry.faces.push( new THREE.Face4(1, 4, 5, 2) );
	}
	else {
		geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
		geometry.vertices.push( new THREE.Vector3( 0, 0, square ) );
		geometry.vertices.push( new THREE.Vector3( 0, height1 * square, 0) );
		geometry.vertices.push( new THREE.Vector3( 0, height1 * square, square));
	
		geometry.vertices.push( new THREE.Vector3( square, height2 * square, 0 ) );
		geometry.vertices.push( new THREE.Vector3( square, height2 * square, square ) );
	
	
		geometry.faces.push( new THREE.Face4(1, 3, 2, 0) );
		geometry.faces.push( new THREE.Face4(3, 5, 4, 2) );
		geometry.faces.push( new THREE.Face3(0, 2, 4) );
		geometry.faces.push( new THREE.Face3(5, 3, 1) );
		geometry.faces.push( new THREE.Face4(0, 4, 5, 1) );
		
	}
	
	
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true } );
	
	var ramp = new THREE.Mesh(geometry, material);
	ramp.position.x = x1 * square;
	ramp.position.y = 0;
	ramp.position.z = y1 * square;
	
	scene.add(ramp);
} 

// type 0: along x, type 1: along y
function CreateRamp2(scene, x, y, start_height, height1, height2, type, square)
{
	var geometry = new THREE.Geometry();
	
	geometry.vertices.push( new THREE.Vector3( 0, height1 * square, 0 ) );
	geometry.vertices.push( new THREE.Vector3( square, height1 * square, 0 ) );
	geometry.vertices.push( new THREE.Vector3( square, height1 * square, square) );
	geometry.vertices.push( new THREE.Vector3( 0, height1 * square, square) );
	
	geometry.faces.push( new THREE.Face4(0, 3, 2, 1));
	
	if (type == 0)
	{
		geometry.vertices.push( new THREE.Vector3( 0, height2 * square, 0 ) );
		geometry.vertices.push( new THREE.Vector3( square, height2 * square, 0 ) );
		
		geometry.faces.push( new THREE.Face3(0, 4, 3) );
		geometry.faces.push( new THREE.Face4(0, 1, 5, 4) );
		geometry.faces.push( new THREE.Face3(1, 2, 5) );
		geometry.faces.push( new THREE.Face4(4, 5, 2, 3) );
	}
	else {
		geometry.vertices.push( new THREE.Vector3( 0, height2 * square, 0 ) );
		geometry.vertices.push( new THREE.Vector3( 0, height2 * square, square ) );

		geometry.faces.push( new THREE.Face3(0, 1, 4) );
		geometry.faces.push( new THREE.Face4(4, 1, 2, 5) );
		geometry.faces.push( new THREE.Face3(2, 3, 5) );
		geometry.faces.push( new THREE.Face4(0, 4, 5, 3) );

	}
	
	var material = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true } );
	
	var ramp = new THREE.Mesh(geometry, material);
	ramp.position.x = x * square;
	ramp.position.y = start_height;
	ramp.position.z = y * square;
	
	scene.add(ramp);
	
	CreateLand(scene, x, y, height1, square);
	
	
	

}