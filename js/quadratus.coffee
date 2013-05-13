
class Quadratus
    constructor: (@scene, @camera) ->
        radius = 50
        segments = 16
        rings = 16

        sphereMaterial = new THREE.MeshLambertMaterial { color: 0xCC0000 }

        sphere = new THREE.Mesh (new THREE.SphereGeometry radius, segments, rings), sphereMaterial

        @scene.add sphere
    
    
    update: (ms) ->


