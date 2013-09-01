var Stats = Stats || {};
var Detector = Detector || {};
var THREE = THREE || {};
var THREEx = THREEx || {};
var MazeGenerator = MazeGenerator || {};

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


var Main = function(screenWidth, screenHeight, container, maze) {

    var _screenWidth = screenWidth; 
    
    var _screenHeight = screenHeight;
    
    var _container = container;

    var _maze = maze;

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
        
        camera.position.set(0, 1000, 0);
        scene.add(camera);
        
        camera.lookAt(scene.position);

        // EVENTS
        THREEx.WindowResize(renderer, camera);
        
        // CONTROLS
        var controls = new THREE.OrbitControls( camera, renderer.domElement );
        

        // FLOOR
     
        scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

        
        // LIGHT
        var light = new THREE.PointLight(0xffffff, 1, 200);
        light.position.set(50 ,25 ,50);
        scene.add(light);

        var light2 = new THREE.AmbientLight(0x404040);
        scene.add(light2);
        
        // create a small sphere to show position of light
        var lightbulb = new THREE.Mesh( 
            new THREE.SphereGeometry( 10, 16, 8 ), 
            new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
        );
        scene.add( lightbulb );
        lightbulb.position = light.position;
        

        this.showFlor(scene, _maze[0].length, _maze.length);
 
        var materiaData = this.loadWallBlockMateriaData();
       
        var i, j;
        
        for (i = 0; i < _maze[0].length ; i++) {
            for (j = 0; j  < _maze.length; j++) {
                if(_maze[j][i] === 0) {
                     scene.add( this.createWallBlock(materiaData, j * 50,  0,  i * 50) );    
                }
            }
        }
        
        rendererLoop(scene, camera, renderer, new Updater(controls, this.showStats(_container)));
    };
    
    this.createWallBlock = function(material, x, y, z) {
        var cubeGeometry = new THREE.CubeGeometry( 50, 50, 50 );
        var block = new THREE.Mesh( cubeGeometry.clone(), material );
        block.position.set(x, y + 25, z);
        
        block.castShadow = true;
        block.receiveShadow = true;
        
        return block;
    };
    
    this.loadWallBlockMateriaData = function() {
        var crateTexture = new THREE.ImageUtils.loadTexture( 'static/img/crate.gif' );
        var materia = new THREE.MeshLambertMaterial( { map: crateTexture, ambient: 0xffffff} );
        
        return materia;
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
    
    this.showFlor = function(scene, column, row) {
        var floorTexture = new THREE.ImageUtils.loadTexture( 'static/img/checkerboard.jpg' );
        floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
        floorTexture.repeat.set( 10, 10 );
        
        var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
        var floorGeometry = new THREE.PlaneGeometry(row * 50, column * 50, 10, 10);
        
        var floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.position.y = - 0.5;
        floor.position.z = (column * 50) / 2 - 25;
        floor.position.x = (row * 50) / 2 - 25;
        
        floor.rotation.x = Math.PI / 2;
        
        scene.add(floor);
    };

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

var generator = new MazeGenerator(5, 10);
generator.display();

var maze = generator.getMaze();

new Main(1170, window.innerHeight, document.getElementById( 'ThreeJS' ), maze).init();