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
	
	var material = new THREE.MeshLambertMaterial( { color: 0xff00ff, shading: THREE.FlatShading, overdraw: true, wireframe: false } );

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
	var s = square;
	var h1 = square * height1;
	var h2 = square * height2;
	
  // Base vertices
	geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );
	geometry.vertices.push( new THREE.Vector3( 0, 0, s ) );
	geometry.vertices.push( new THREE.Vector3( s, 0, s) );
	geometry.vertices.push( new THREE.Vector3( s, 0, 0));

	// Base face
	geometry.faces.push( new THREE.Face4(3, 2, 1, 0) );
		
	if ( type == 1 || type == 2 )
	{
	  // Ramp vertices
	  if ( type == 1 )
	  {
		  geometry.vertices.push( new THREE.Vector3( 0, h2, s ) );
	    geometry.vertices.push( new THREE.Vector3( s, h2, s ) );
    }	
    else if ( type == 2 )
    {
		  geometry.vertices.push( new THREE.Vector3( 0, h2, 0 ) );
	    geometry.vertices.push( new THREE.Vector3( s, h2, 0 ) );
    }

    // Back/ramp faces
	  geometry.faces.push( new THREE.Face4(2, 5, 4, 1) );
	  geometry.faces.push( new THREE.Face4(4, 5, 3, 0) );
	  
		// Side faces
		geometry.faces.push( new THREE.Face3(1, 4, 0) );
		geometry.faces.push( new THREE.Face3(5, 2, 3) );

	}
	else 
	{
		// Ramp vertices
	  if ( type == 3 )
	  {
		  geometry.vertices.push( new THREE.Vector3( s, h2, 0 ) );
	    geometry.vertices.push( new THREE.Vector3( s, h2, s ) );
    }	
    else if ( type == 4 )
    {
		  geometry.vertices.push( new THREE.Vector3( 0, h2, 0 ) );
	    geometry.vertices.push( new THREE.Vector3( 0, h2, s ) );
    }

    // Back/ramp faces
	  geometry.faces.push( new THREE.Face4(2, 3, 4, 5) );
	  geometry.faces.push( new THREE.Face4(0, 1, 5, 4) );
	  
		// Side faces
		geometry.faces.push( new THREE.Face3(4, 3, 0) );
		geometry.faces.push( new THREE.Face3(1, 2, 5) );
	}
	
	// Randomize face colours
	for ( var i = 0; i < geometry.faces.length; ++i )
    geometry.faces[i].color.setRGB( Math.random()/2, Math.random()/2, Math.random()/2 );
	
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true, vertexColors: THREE.FaceColors, wireframe: false } );
//	geometry.__dirtyColors = true;
	
	var ramp = new THREE.Mesh(geometry, material);
	ramp.position.x = x1 * square;
	ramp.position.y = 0;
	ramp.position.z = y1 * square;
	
	scene.add(ramp);
	
} 

