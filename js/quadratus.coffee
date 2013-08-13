class Quadratus
    constructor: (@scene, @camera) ->
        radius = 50
        segments = 16
        rings = 16

        sphereMaterial = new THREE.MeshLambertMaterial { color: 0xCC0000 }
        @mouse2d = new THREE.Vector3 0, 0, 0

        #        sphere = new THREE.Mesh (new THREE.SphereGeometry radius, segments, rings), sphereMaterial

        #        @scene.add sphere

        @plane = new THREE.Mesh (new THREE.PlaneGeometry 400, 400, 10, 10), (new THREE.MeshBasicMaterial(color: 0x555555, wireframe: true))
#        @plane.rotation.x = -Math.PI / 2
        reportPos @plane.position

        @scene.add @plane

        @projector = new THREE.Projector()

        indicatorBlock = new THREE.CubeGeometry 40, 10, 40
        indicatorBlockMat = new THREE.MeshBasicMaterial(color: 0xff0000, opacity: 0.5, transparent: true)
        @indicatorMesh = new THREE.Mesh indicatorBlock, indicatorBlockMat
        @indicatorMesh.position = new THREE.Vector3 0, 0, 0
        reportPos @indicatorMesh.position

        @scene.add @indicatorMesh

        @normalMatrix = new THREE.Matrix3()
        @voxelPosition = new THREE.Vector3()



    update: () ->
#        raycaster = @projector.pickingRay @mouse2d.clone(), @camera
##        console.log ''+@camera.position.x + ',' + @camera.position.y + ',' + @camera.position.z
#        intersects = raycaster.intersectObjects @scene.children
#
#        if intersects.length > 0
#            intersector = @getRealIntersector intersects
#            if intersector
#                # set voxel position
#                @normalMatrix.getNormalMatrix intersector.object.matrixWorld
#                tmpVec = new THREE.Vector3()
#                tmpVec.copy intersector.face.normal
#                tmpVec.applyMatrix3(@normalMatrix).normalize()
#
#                @voxelPosition.addVectors intersector.point, tmpVec
#
#                reportPos @voxelPosition

#                @voxelPosition.x = Math.floor (@voxelPosition.x / 400) * 50 + 25
#                @voxelPosition.y = Math.floor (@voxelPosition.y / 400) * 50 + 25
#                @voxelPosition.z = Math.floor (@voxelPosition.z / 400) * 400 + 25
                # update position
#                @indicatorMesh.position = @voxelPosition
#                console.log 'x: ' + @voxelPosition.x + ' y: ' + @voxelPosition.y + ' z: ' + @voxelPosition.z

    getRealIntersector: (intersects) ->
        for intersector in intersects
            if intersector.object != @inspectorPlatformMesh
                return intersector

        return null

    updatePosition: (x, y) ->
        vector = new THREE.Vector3 (x / window.container.width()) * 2 - 1, -(y / window.container.height()) * 2 + 1, 0.5
        @projector.unprojectVector vector, @camera

        ray = new THREE.Raycaster @camera.position, vector.sub(@camera.position).normalize()

        intersects = ray.intersectObject @plane
        if intersects.length > 0
            vecobj = intersects[0].point
            @plane.worldToLocal(vecobj)

#                .applyMatrix4(new THREE.Matrix4().getInverse(@plane.matrixWorld))
#            vecobj = new THREE.Matrix4().getInverse(@plane.matrixWorld).multiplyVector3(intersects[0].point)
            reportPos vecobj

