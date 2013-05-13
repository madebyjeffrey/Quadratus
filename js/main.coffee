
$j = jQuery

jQuery ->
    ($j '#newmap').click ->
        console.log "new map needed"
    
    main()
  


main = () ->
    console.log "Main executing"

    container = $j '<div>'
    ($j 'body').append container
    
    view_angle = 90
    aspect = window.innerWidth / window.innerHeight
    near = 0.1
    far = 10000
    
    renderer = new THREE.WebGLRenderer()
    camera = new THREE.PerspectiveCamera view_angle, aspect, near, far
    
    camera.position.z = 300
    
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
    
    animate()
    
animate = () ->
    requestAnimationFrame animate
#    controls.update()
    game = window.game
    game.update()
    window.renderer.render game.scene, game.camera
    window.stats.update()
    

    
