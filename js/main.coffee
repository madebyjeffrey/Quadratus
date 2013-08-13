
$j = jQuery

jQuery ->
    ($j '#newmap').click ->
        console.log "new map needed"
    
    main()
  


main = () ->
    console.log "Main executing"

    container = $j '<div>'
    ($j 'body').append container

    window.container = container

    view_angle = 45
    aspect = window.innerWidth / window.innerHeight
    near = 0.1
    far = 10000
    
    renderer = new THREE.WebGLRenderer(antialias: true)
    camera = new THREE.PerspectiveCamera view_angle, aspect, near, far

    camera.position.x = 250
    camera.position.y = 200
    camera.position.z = 250
    
    scene = new THREE.Scene()
    scene.add camera

    
    
    renderer.setSize window.innerWidth, window.innerHeight
    
    container.append renderer.domElement

    stats = new Stats()
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.top = $('.navbar').height() + "px" # place under the bootstrap bar
    
    pointLight = new THREE.PointLight 0xFFFFFF
    pointLight.position.x = 10
    pointLight.position.y = 50
    pointLight.position.z = 130
    scene.add pointLight
    
    window.game = new Quadratus scene, camera
    window.renderer = renderer
    window.stats = stats
    
    container.append stats.domElement

    
    
    
    controls = new THREE.TrackballControls camera
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.noZoom = false;
    controls.noPan = false;
    controls.staticMoving = true;
    controls.dynamicDampingFactor = 0.3;
    controls.keys = [65, 83, 68];
#    controls.addEventListener('change', animate);
    
    window.controls = controls

    #($j 'window').mousemove onDocumentMouseMove
    document.addEventListener 'mousemove', onDocumentMouseMove, false


    animate()
    
animate = () ->
    requestAnimationFrame animate
    window.controls.update()
    game = window.game
    game.update()
    window.renderer.render game.scene, game.camera
    window.stats.update()

onDocumentMouseMove = (e) ->
    e.preventDefault()
    window.game.updatePosition e.clientX, e.clientY



#    console.log 'x: ' + window.game.mouse2d.x + ' y: ' + window.game.mouse2d.y

reportPos = (vec) ->
    console.log '(' + vec.x + ',' + vec.y + ',' + vec.z + ')'