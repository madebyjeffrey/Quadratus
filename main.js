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

function CompareHeightForThreshold(desiredHeight, threshold, height)
{
  if ( desiredHeight - height < 0 ) // hack
    return height;
  return Math.abs(desiredHeight - height) > threshold ? height : desiredHeight;
}
function GetHeightForThreshold(x, y, map, threshold, height)
{
  if ( !IsValid(x, y, map) )
    return height;
   
  return CompareHeightForThreshold(map[y][x]%256, threshold, height);
}
function GetCornerHeight(x,y,map,corners,cornerId,height)
{
  if ( !IsValid(x,y,map) )
    return height;

  return CompareHeightForThreshold(corners[y][x][cornerId], height);
}
function GetGreatestHeightDist(h1, h2, h3, hBase)
{
  var hInter = Math.abs(h1-hBase) > Math.abs(h2-hBase) ? h1 : h2;
  return Math.abs(hInter-hBase) > Math.abs(h3-hBase) ? hInter : h3;
}

function InitCorners(map, cornerMap)
{
  for ( var y = 0; y < map.length; ++y )
  {
    cornerMap[y] = new Array(map[y].length);
    for ( var x = 0; x < map[y].length; ++x )
    {
      var h = (map[y][x] % 256);  // height

      cornerMap[y][x] = new Array(4);
      cornerMap[y][x][0] = h;
      cornerMap[y][x][1] = h;
      cornerMap[y][x][2] = h;
      cornerMap[y][x][3] = h;

      if ( !IsValid(x, y, map) )  // Initial validity check
        continue;

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

      if ( lefth == h && toph == h && righth == h && bottomh == h &&
            leftToph == h && leftBoth == h && rightToph == h && rightBoth == h) // no ramp
        continue;

      // Calculate slope vertex heights
      cornerMap[y][x][0] = GetGreatestHeightDist(lefth, toph, leftToph, h);
      cornerMap[y][x][1] = GetGreatestHeightDist(lefth, bottomh, leftBoth, h);
      cornerMap[y][x][2] = GetGreatestHeightDist(righth, bottomh, rightBoth, h);
      cornerMap[y][x][3] = GetGreatestHeightDist(righth, toph, rightToph, h);
    }
  }
}

function SmoothCorners(map,cornerMap)
{
  for ( var y = 0; y < map.length; ++y )
  {
    for ( var x = 0; x < map[y].length; ++x )
    {
      if ( !IsValid(x, y, map) )  // Initial validity check
        continue;

      var h = (map[y][x] % 256);  // height
      var t = map[y][x] / 256;    // threshold

      // Calculate new slope vertex heights
      cornerMap[y][x][0] = 
            Math.max( cornerMap[y][x][0],
                      GetCornerHeight(y-1,x,map,cornerMap,1,h),
                      GetCornerHeight(y-1,x-1,map,cornerMap,2,h),
                      GetCornerHeight(y,x-1,map,cornerMap,3,h)
                );

      cornerMap[y][x][1] = 
            Math.max( cornerMap[y][x][1],
                      GetCornerHeight(y+1,x,map,cornerMap,0,h),
                      GetCornerHeight(y+1,x-1,map,cornerMap,3,h),
                      GetCornerHeight(y,x-1,map,cornerMap,2,h)
                );

      cornerMap[y][x][2] = 
            Math.max( cornerMap[y][x][2],
                      GetCornerHeight(y+1,x,map,cornerMap,3,h),
                      GetCornerHeight(y+1,x+1,map,cornerMap,0,h),
                      GetCornerHeight(y,x+1,map,cornerMap,1,h)
                );

      cornerMap[y][x][3] = 
            Math.max( cornerMap[y][x][3],
                      GetCornerHeight(y-1,x,map,cornerMap,2,h),
                      GetCornerHeight(y-1,x+1,map,cornerMap,1,h),
                      GetCornerHeight(y,x+1,map,cornerMap,0,h)
                );
    }
  }
}

function CreateBlock(x, y, map, cornerMap, gridSize)
{
  if ( !IsValid(x, y, map) )  // Initial validity check
    return;

  // Localize for ease of use
  var g = gridSize;           // grid
  var h = (map[y][x] % 256);  // height
  var t = map[y][x] / 256;    // threshold

  // Get min height for top of base cube
  var minh = Math.min(h, 
                      cornerMap[y][x][0],
                      cornerMap[y][x][1],
                      cornerMap[y][x][2],
                      cornerMap[y][x][3]);

  // -----------> Create base cube
	var geometry  = new THREE.CubeGeometry( g, minh*g, g );
	var material  = new THREE.MeshLambertMaterial( { color: 0xffffff, shading: THREE.FlatShading, overdraw: true, wireframe: false } );
	var cube      = new THREE.Mesh(geometry, material);
	
	cube.position.x = x * g + g / 2;
	cube.position.y = minh*g / 2;
	cube.position.z = y * g + g / 2;
	
	scene.add(cube);
	
	if ( cornerMap[y][x][0] == h && cornerMap[y][x][1] == h && cornerMap[y][x][2] == h && cornerMap[y][x][3] == h ) 
	  return;
	
  // -----------> Create Ramp thing
	var geometry = new THREE.Geometry();

  // Base vertices (don't need base face since it is an attachment)
	geometry.vertices.push( new THREE.Vector3(0, minh*g, 0));
	geometry.vertices.push( new THREE.Vector3(0, minh*g, g));
	geometry.vertices.push( new THREE.Vector3(g, minh*g, g));
	geometry.vertices.push( new THREE.Vector3(g, minh*g, 0));
	
	// Create slope vertices
	geometry.vertices.push( new THREE.Vector3(0, cornerMap[y][x][0]*g, 0));
	geometry.vertices.push( new THREE.Vector3(0, cornerMap[y][x][1]*g, g));
	geometry.vertices.push( new THREE.Vector3(g, cornerMap[y][x][2]*g, g));
	geometry.vertices.push( new THREE.Vector3(g, cornerMap[y][x][3]*g, 0));

  // Create geometry faces
	// Note: could be a for loop with: (i, (i+1)%4, 4+(i+1)%4, 4+i)
	geometry.faces.push( new THREE.Face4(0, 1, 5, 4) );
	geometry.faces.push( new THREE.Face4(1, 2, 6, 5) );
	geometry.faces.push( new THREE.Face4(2, 3, 7, 6) );
	geometry.faces.push( new THREE.Face4(3, 0, 4, 7) );
	
	geometry.faces.push( new THREE.Face4(4, 5, 6, 7) ); // top
	
	// Randomize face colours
	for ( var i = 0; i < geometry.faces.length; ++i )
    geometry.faces[i].color.setRGB( Math.random()/2, Math.random()/2, Math.random()/2 );
	
	var material = new THREE.MeshBasicMaterial( { color: 0xffffff, shading: THREE.FlatShading,
                                                overdraw: true, vertexColors: THREE.FaceColors, wireframe: false } );
	
	var ramp = new THREE.Mesh(geometry, material);
	ramp.position.x = x * g;
	ramp.position.y = 0;
	ramp.position.z = y * g;
	
	scene.add(ramp);
}

