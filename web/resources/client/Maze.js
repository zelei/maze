var Stats = Stats || {};
var Detector = Detector || {};
var THREE = THREE || {};
var THREEx = THREEx || {};
var TWEEN = TWEEN || {};
var MazeGenerator = MazeGenerator || {};


// MAIN

// standard global variables
var keyboard = new THREEx.KeyboardState();

var PlayerObject = function(object) {

    var _object = object;

    this.moveForward = function() {
        
        var direction = this.getDirection(_object.rotation.getY());
        
        if(direction === 0 || direction === 2) {
            this.moveZ(direction === 0 ? 50 : -50).start();
        }
    
        if(direction === 1 || direction === 3) {
            this.moveX(direction === 1 ? -50 : 50).start();
        }

    };
    
    this.moveBack = function() {

        var direction = this.getDirection(_object.rotation.getY());
        
        if(direction === 0 || direction === 2) {
            this.moveZ(direction === 0 ? -50 : 50).start();
        }
    
        if(direction === 1 || direction === 3) {
            this.moveX(direction === 1 ? 50 : -50).start();
        }

    };

    this.turnRight = function() {
        this.turn({m : _object.rotation.getY() * (180 / Math.PI)}, -90, function(currentRotation) {_object.rotation.setY(currentRotation.m * (Math.PI / 180))}).start();
    };
    
    this.turnLeft = function() {
        this.turn({m : _object.rotation.getY() * (180 / Math.PI)}, 90, function(currentRotation) {_object.rotation.setY(currentRotation.m * (Math.PI / 180))}).start();
    };

    this.moveX = function(move) {
        return this.move({m : object.position.getX()}, + move, function(currentPosition) {_object.position.setX(currentPosition.m)});    
    };

    this.moveZ = function(move) {
        return this.move({m : object.position.getZ()}, + move, function(currentPosition) {_object.position.setZ(currentPosition.m)});    
    };
    
    this.move = function(currentPosition, change, update) {
        
        var move = new TWEEN.Tween(currentPosition)
            .to({m : currentPosition.m + change}, 1000)
            //.easing(TWEEN.Easing.Sinusoidal.Out)
            .onUpdate(function() {
                update(currentPosition);
            });
        
        return move;    
    };
    
    this.turn = function(currentRotation, change, update) {
        
        var targetRotation = {m : currentRotation.m + change};
        
        var turn = new TWEEN.Tween(currentRotation)
            .to(targetRotation, 1000)
            //.easing(TWEEN.Easing.Sinusoidal.Out)
            //.interpolation( TWEEN.Interpolation.Linear )
            .onUpdate(function() {
                update(currentRotation);
            });
        
        return turn;    
    };
    
    this.getDirection = function(rotation) {
        
        var deegres = Math.floor(rotation * (180 / Math.PI)) % 360;
        
        if(deegres === 0) {
            return 0;
        }
        
        if(deegres === 270 || deegres === -90) {
            return 1;
        }
        
        if(Math.abs(deegres) === 180) {
            return 2;
        }
        
        if(deegres === -270 || deegres === 90) {
            return 3;
        }
        
        throw new Error(deegres);
        
    };

};


var Updater = function(controls, stats, scene, player) {
    
    this.update = function() {


        if ( keyboard.pressed("w") && TWEEN.getAll().length < 1) { 
            player.moveForward();
        }
        
        if ( keyboard.pressed("s") && TWEEN.getAll().length < 1) { 
            player.moveBack();
        }
        
        if ( keyboard.pressed("d") && TWEEN.getAll().length < 1) { 
            player.turnRight();
        }
        
        if ( keyboard.pressed("a") && TWEEN.getAll().length < 1) { 
            player.turnLeft();
        }
        
        controls.update();
        stats.update();
    };
    
};



var Character = function(object, camera) {
    
    var _this = this;
  
    var _object = object;
    var _camera = camera;
    
    this.update = function() {
        _camera.position = _object.position;
        _camera.lookAt( new THREE.Vector3(0, 0, 10).applyMatrix4( _object.matrixWorld ) );
    };
    
    this.position = {
        getX : function() {
            return _object.position.x;  
        },
        getZ : function() {
            return _object.position.z;  
        },
        setX : function(x) {
            _object.position.x = x;
            _this.update();
        },
        setZ : function(z) {
            _object.position.z = z;
            _this.update();
        }
    };
    
    this.rotation = {
        getY : function() {
            return _object.rotation.y;  
        },
        setY : function(y) {
            _object.rotation.y = y;
            _this.update();
        }
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
        
        //var a = new THREE.OrbitControls( camera, renderer.domElement );
        
        var controls = {
            update : function() {
                //a.update();
            }
        };

        // FLOOR
     
        scene.fog = new THREE.FogExp2( 0x9999ff, 0.00025 );

        
        // LIGHT
        var light = new THREE.PointLight(0xffffff, 1, 200);
        light.position.set(50 ,25 ,50);
        scene.add(light);

        var light2 = new THREE.AmbientLight(0x404040);
        scene.add(light2);
        
        // create a small sphere to show position of light
        /*
        var lightbulb = new THREE.Mesh(
            new THREE.SphereGeometry( 10, 16, 8 ), 
            new THREE.MeshBasicMaterial( { color: 0xffaa00 } )
        );
        scene.add( lightbulb );
        lightbulb.position = light.position;*/
        

        // tetrahedron
        var shape = new THREE.Mesh( 
            new THREE.CubeGeometry( 10, 10, 10 ),
            new THREE.MeshBasicMaterial( { color: 0xffaa00 } ) );
        shape.position = light.position;
        scene.add( shape );
	
        this.showFlor(scene, _maze[0].length, _maze.length);
 
        this.buildMaze(_maze, scene, this.loadWallBlockMateriaData());    

        rendererLoop(scene, camera, renderer, new Updater(controls, this.showStats(_container), scene, new PlayerObject(new Character(shape, camera))));
    };
    
    this.buildMaze = function(maze, scene, materiaData) {
        var i, j;
        
        for (j = 0; j  < maze.length; j++) {
            for (i = 0; i < maze[j].length ; i++) {    
                if(maze[j][i] === 0) {
                    scene.add( this.createWallBlock(materiaData, j * 50,  0,  i * 50) );    
                }
            }
        }   
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
        var crateTexture = new THREE.ImageUtils.loadTexture( 'static/img/Stone_Blocks_by_AGF81.jpg' );
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
        TWEEN.update();
        _renderer.render( _scene, _camera );	
        _updater.update();
    }
    
    loop();

}

var generator = new MazeGenerator(5, 10);
generator.display();

var maze = generator.getMaze();

new Main(1170, window.innerHeight, document.getElementById( 'ThreeJS' ), maze).init();