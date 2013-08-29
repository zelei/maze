var Stats = Stats || {};
var Detector = Detector || {};
var THREE = THREE || {};
var THREEx = THREEx || {};

// MAIN

// standard global variables
var keyboard = new THREEx.KeyboardState();


var Updater = function(controls, stats) {
    
    this.update = function() {
        if ( keyboard.pressed("z") ) { 
            // do something
        }
        
        controls.update();
        stats.update();
    };
    
};


var Main = function(screenWidth, screenHeight, container) {

    var _screenWidth = screenWidth; 
    
    var _screenHeight = screenHeight;
    
    var _container = container;

    var _viewAngle = 45;
    
    var _aspect = _screenWidth / _screenHeight;
    
    var _near = 0.1;
    
    var _far = 20000;

    this.init = function() {
   
        // RENDERER
        var	renderer = this.getRenderer(_screenWidth, _screenHeight);
        
        _container.appendChild( renderer.domElement );
         
        var camera = new THREE.PerspectiveCamera( _viewAngle, _aspect, _near, _far);
        var scene = new THREE.Scene();
        
        camera.position.set(0,150,400);
        scene.add(camera);
        
        camera.lookAt(scene.position);

        // EVENTS
        THREEx.WindowResize(renderer, camera);
        
        // CONTROLS
        var controls = new THREE.OrbitControls( camera, renderer.domElement );
        

        // FLOOR
        this.showFlor(scene);

        scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

        
        // LIGHT
        var light = new THREE.PointLight(0xffffff);
        light.position.set(0,50,100);
        scene.add(light);

        
        var light2 = new THREE.AmbientLight(0x444444);
        scene.add(light2);
        
        // create a small sphere to show position of light
        var lightbulb = new THREE.Mesh( 
            new THREE.SphereGeometry( 10, 16, 8 ), 
            new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
        );
        scene.add( lightbulb );
        lightbulb.position = light.position;
        

        // Crate
        var cubeGeometry = new THREE.CubeGeometry( 85, 85, 85 );
        var crateTexture = new THREE.ImageUtils.loadTexture( 'static/img/crate.gif' );
        var crateMaterial = new THREE.MeshLambertMaterial( { map: crateTexture, ambient: 0x0000ff} );
        
        var crate = new THREE.Mesh( cubeGeometry.clone(), crateMaterial );
        crate.position.set(-60, 50, 0);
        scene.add( crate );	
        
        crate = new THREE.Mesh( cubeGeometry.clone(), crateMaterial );
        crate.position.set(-160, 50, 0);
        scene.add( crate );	
    
        crate = new THREE.Mesh( cubeGeometry.clone(), crateMaterial );
        crate.position.set(40, 50, 0);
        scene.add( crate );
        
        rendererLoop(scene, camera, renderer, new Updater(controls, this.showStats(_container)));
    };
    

    this.getRenderer = function(screenWidth, screenHeight) {
        var renderer = Detector.webgl ? new THREE.WebGLRenderer( {antialias:true} ) : new THREE.CanvasRenderer();
        renderer.setSize(screenWidth, screenHeight);
        return renderer;
    };
    
    this.showStats = function(container) {
        var stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.bottom = '0px';
        stats.domElement.style.zIndex = 100;
        
        container.appendChild( stats.domElement );
        
        return stats;
    };
    
    this.showFlor = function(scene) {
        var floorTexture = new THREE.ImageUtils.loadTexture( 'static/img/checkerboard.jpg' );
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
        floorTexture.repeat.set( 10, 10 );
        var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(1000, 1000, 10, 10);
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = -0.5;
        floor.rotation.x = Math.PI / 2;
        scene.add(floor);
    }

};


function rendererLoop(scene, camera, renderer, updater) {

    var _scene = scene;
    var _camera = camera;
    var _renderer = renderer;
    var _updater = updater;

    function loop() {
        requestAnimationFrame( loop );
        _renderer.render( _scene, _camera );	
        _updater.update();
    }
    
    loop();

}

new Main(1170, window.innerHeight, document.getElementById( 'ThreeJS' )).init();