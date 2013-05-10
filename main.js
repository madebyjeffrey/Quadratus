/* 	Quadratus – Experimental Cube Map Using Three.JS
 *  Parts written by 
 *  	Jeffrey Drake
 *      Chris Drouillard
 *      Adam Heinermann
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

function IsValid(x, y, map)
{
  // Bounds check
  if ( x < 0 || y < 0 || y >= map.length || x >= map[y].length )
    return false;
  
  // Valid block check
  if ( map[y][x] == -1 )
    return false;

  return true;
}

function GetHeightForThreshold(x, y, map, threshold, height)
{
  if ( !IsValid(x, y, map) )
    return height;
    
  var newheight = map[y][x]%256;
  if ( newheight - height < 0 ) // hack
    return height;
  return Math.abs(newheight - height) > threshold ? height : newheight;
}

function GetGreatestHeightDist(h1, h2, h3, hBase)
{
  var hInter = Math.abs(h1-hBase) > Math.abs(h2-hBase) ? h1 : h2;
  return Math.abs(hInter-hBase) > Math.abs(h3-hBase) ? hInter : h3;
}

function CreateBlock(x, y, map, gridSize)
{
  if ( !IsValid(x, y, map) )  // Initial validity check
    return;

  // Localize for ease of use
  var g = gridSize;           // grid
  var h = (map[y][x] % 256);  // height
  var t = map[y][x] / 256;    // threshold

  // Get attachment points
  var lefth   = GetHeightForThreshold(x-1, y, map, t, h);
  var toph    = GetHeightForThreshold(x, y-1, map, t, h);
  var righth  = GetHeightForThreshold(x+1, y, map, t, h);
  var bottomh = GetHeightForThreshold(x, y+1, map, t, h);
  
  var leftToph = GetHeightForThreshold(x-1,y-1,map,t,h);
  var leftBoth = GetHeightForThreshold(x-1,y+1,map,t,h);
  var rightToph = GetHeightForThreshold(x+1,y-1,map,t,h);
  var rightBoth = GetHeightForThreshold(x+1,y+1,map,t,h);
  
  // Get min height for top of base cube
  var minh = Math.min(h, lefth, toph, righth, bottomh, leftToph, leftBoth, rightToph, rightBoth);

  // -----------> Create base cube
	var geometry  = new THREE.CubeGeometry( g, minh*g, g );
	var material  = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true, wireframe: false } );
	var cube      = new THREE.Mesh(geometry, material);
	
	cube.position.x = x * g + g / 2;
	cube.position.y = minh*g / 2;
	cube.position.z = y * g + g / 2;
	
	scene.add(cube);
	
	if ( lefth == h && toph == h && righth == h && bottomh == h &&
	      leftToph == h && leftBoth == h && rightToph == h && rightBoth == h) // no ramp
	  return;
	
  // -----------> Create Ramp thing
	var geometry = new THREE.Geometry();

  // Base vertices (don't need base face since it is an attachment)
	geometry.vertices.push( new THREE.Vector3(0, minh*g, 0));
	geometry.vertices.push( new THREE.Vector3(0, minh*g, g));
	geometry.vertices.push( new THREE.Vector3(g, minh*g, g));
	geometry.vertices.push( new THREE.Vector3(g, minh*g, 0));
	
	// Calculate slope vertex heights
	var leftbot  = GetGreatestHeightDist(lefth, toph, leftToph, h);
	var lefttop  = GetGreatestHeightDist(lefth, bottomh, leftBoth, h);
	var righttop = GetGreatestHeightDist(righth, bottomh, rightBoth, h);
	var rightbot = GetGreatestHeightDist(righth, toph, rightToph, h);
	
	// Create slope vertices
	geometry.vertices.push( new THREE.Vector3(0, leftbot*g, 0));
	geometry.vertices.push( new THREE.Vector3(0, lefttop*g, g));
	geometry.vertices.push( new THREE.Vector3(g, righttop*g, g));
	geometry.vertices.push( new THREE.Vector3(g, rightbot*g, 0));
	
	// Note: could be a for loop with: (i, (i+1)%4, 4+(i+1)%4, 4+i)
	geometry.faces.push( new THREE.Face4(0, 1, 5, 4) );
	geometry.faces.push( new THREE.Face4(1, 2, 6, 5) );
	geometry.faces.push( new THREE.Face4(2, 3, 7, 6) );
	geometry.faces.push( new THREE.Face4(3, 0, 4, 7) );
	
	geometry.faces.push( new THREE.Face4(4, 5, 6, 7) ); // top
	
	// Randomize face colours
	for ( var i = 0; i < geometry.faces.length; ++i )
    geometry.faces[i].color.setRGB( Math.random()/2, Math.random()/2, Math.random()/2 );
	
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true, vertexColors: THREE.FaceColors, wireframe: false } );
	
	var ramp = new THREE.Mesh(geometry, material);
	ramp.position.x = x * g;
	ramp.position.y = 0;
	ramp.position.z = y * g;
	
	scene.add(ramp);
}

