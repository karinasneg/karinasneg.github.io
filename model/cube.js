var camera;
var scene;
var renderer;
var controls;
var params = {
			color: '#ffffff',
			scale: 4,
			flowX: 1,
			flowY: 1
		};


function init() {
    
	// Create a scene
    scene = new THREE.Scene();
    
	// Add the camera
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(-0, 10, 30);

    // Add a light
	var light = new THREE.DirectionalLight(0xaaaae5, 2);
	light.position.set(9, 13, -40);
    scene.add(light);
	//scene.add(new THREE.PointLightHelper(light, 3));
    
	// Create the sky box
	loadSkyBox();
    
    // Create Sea
    //createSea();

	// Create the WebGL Renderer
	renderer = new THREE.WebGLRenderer( { antialias:true} );
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    // Append the renderer to the body
    document.body.appendChild( renderer.domElement );

    // Add a resize event listener
    window.addEventListener( 'resize', onWindowResize, false );
    
    // Add the orbit controls to the camera
    controls = new THREE.OrbitControls(camera, renderer.domElement);
	
	// Set the point at which we will orbit around
    controls.target = new THREE.Vector3(0, 0, 0);     
}
init();

function loadSkyBox() {
	
		// Load the skybox images and create list of materials
		var materials = [
			createMaterial( 'https://alenale.github.io/pic/skyX55+x.png' ), // right
			createMaterial( 'https://alenale.github.io/pic/skyX55-x.png' ), // left
			createMaterial( 'https://alenale.github.io/pic/skyX55+y.png' ), // top
			createMaterial( 'https://alenale.github.io/pic/seabed_ny.png' ), // bottom
			createMaterial( 'https://alenale.github.io/pic/skyX55+z.png' ), // back
			createMaterial( 'https://alenale.github.io/pic/skyX55-z.png' )  // front
		];
		
		// Create a large cube
		var mesh = new THREE.Mesh( new THREE.BoxGeometry( 300, 300, 300, 1, 1, 1 ), new THREE.MeshFaceMaterial( materials ) );
		
		// Set the x scale to be -1, this will turn the cube inside out
		mesh.scale.set(-1,1,1);
		scene.add( mesh );	
}

function createMaterial( path ) {
	var texture = THREE.ImageUtils.loadTexture(path);
	var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: 0.5 } );

	return material; 
}

var bmap =  THREE.ImageUtils.loadTexture("https://alenale.github.io/pic/seabed.png", {}, function(){});

var planeGeometry = new THREE.PlaneGeometry(300, 300, 300, 300);
var planeMaterial = new THREE.MeshPhongMaterial({  color: 0x1A528F, shading: THREE.FlatShading, transparent: true, map: bmap });
var mesh = new THREE.Mesh(planeGeometry, planeMaterial);

//geometry.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
//planeGeometry.mergeVertices();
mesh.rotation.x = -1.6;

mesh.position.set(0, 0, 0);

scene.add(mesh);


function animate(ts) {
	
	// Update the orbit controls
	if(controls != null) {
		controls.update();
	}
	
	// Render the scene
	renderer.render( scene, camera );
	
	// Repeat
    requestAnimationFrame( animate );
    
    // Animate waves    
    var center = new THREE.Vector2(0,0);
    //window.requestAnimationFrame(animate);
    var vLength = mesh.geometry.vertices.length;

    for (var i = 0; i < vLength; i++) {
    	var v = mesh.geometry.vertices[i];
    	var dist = new THREE.Vector2(v.x, v.y).sub(center);
    	var size = 7.0;
    	var magnitude = 3;
    	v.z = Math.sin(dist.length()/-size + (ts/500)) * magnitude;
  	}
  	mesh.geometry.verticesNeedUpdate = true;
  	renderer.render(scene, camera);
    
}
animate();

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
