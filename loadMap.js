/* 	Quadratus – Experimental Cube Map Using Three.JS
 *  Parts written by 
 *  	Jeffrey Drake
 *      Chris Drouillard
 *      Adam Heinermann
 *      Original Three.JS team (based on a demo)
 *   
 * 	Licensed under the original MIT license of the original code.
 */
 


function loadMap(scene) {
  function show(c,x,y) {
    console.log("(%d,%d) %d %d", x, y, c % 256, c / 256);
  }
  
  // Format:  threshold * 256 + height
  // threshold = 0 if flat
//  // -1 = doesn't exist
//  var level = [ [ 2*256,  2*256+1, 2*256+2, 2*256+3,  4,  2*256+3,  2*256+2,  2*256+1,  2*256, -1],
//                [ 2*256,  2*256,  2*256+1,  2*256+2,  2*256+3,  2*256+2,  2*256+1,  2*256, 2*256, -1],
//                [ -1,     2*256,  2*256,  2*256+1,  2*256+2,  2*256+1, 2*256, 2*256, -1, -1],
//                [-1, -1, 2*256,  2*256,  2*256+1,  2*256, 2*256, -1, -1, -1],
//                [-1, -1, -1, 2*256,  2*256, 2*256, -1, -1, -1, -1],
//                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
//                [-1, -1, -1, -1, -1, -1, 2*256, 2*256, 256, -1],
//                [-1, -1, -1, -1,  5, 3*256+2,  2, 256+1, 256, -1],
//                [-1, -1, -1, -1, -1, -1, 2*256, 2*256, 256, -1],
//                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
//              ];

var level = [ [0 * 256 + 2, 2 * 256 + 1, 1, 256, 1, -1, -1, -1, -1, -1],
                [-1, -1, 256, 256, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
                [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
              ];

  var cornerHeights = new Array(level.length);
  InitCorners(level, cornerHeights);

  for ( var y = 0; y < level.length; ++y )
  {
    for ( var x = 0; x < level[y].length; ++x )
    {
      CreateBlock(x, y, level, cornerHeights, 50);
    }
  }

}
