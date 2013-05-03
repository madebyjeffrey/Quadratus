/* 	Quadratus – Experimental Cube Map Using Three.JS
 *  Parts written by 
 *  	Jeffrey Drake
 *      Chris Droulliard
 *      Original Three.JS team (based on a demo)
 *   
 * 	Licensed under the original MIT license of the original code.
 */
 


function loadMap(scene) {
  function show(c,x,y) {
    console.log("(%d,%d) %d %d %d",x,y,c.type,c.h1,c.h2);
  }
  function loadCell(c, x, y) {
    if (c.type == 0) {
      CreateLand(scene, x, y, c.h1, 50);
    }
    else if (c.type == 1) {
      CreateRamp(scene, x, y, c.h1, c.h2, 0, 50);
    }
    else if (c.type == 2) {
      CreateRamp(scene, x, y, c.h2, c.h1, 0, 50);
    }
    else if (c.type == 3) {
      CreateRamp(scene, x, y, c.h1, c.h2, 1, 50);
    }
    else if (c.type == 4) {
      CreateRamp(scene, x, y, c.h2, c.h1, 1, 50);
    }
  }
  var oReq = new XMLHttpRequest();
  oReq.open("GET", "data.dat", true);
  oReq.responseType = "arraybuffer";
  oReq.onload = function (oEvent) {
    var arrayBuffer = oReq.response;
    if (arrayBuffer) {
      var byteArray = new Uint8Array(arrayBuffer);
      console.log(byteArray);
      var w = byteArray[0];
      var h = byteArray[1];
      var p = 2;
      for (var i = 0; i < w; ++i) {
        for (var j = 0; j < h; ++j) { 
          var c = {
            type: byteArray[p+4],
            h1: (byteArray[p] + byteArray[p+1]*256)/4,
            h2: (byteArray[p+2] + byteArray[p+3]*256)/4,
          };
          loadCell(c, i, j);
          p += 6;
        }
      }
    }
  };
  oReq.send(null);
}
