//#region [[ THREE.JS IMPORTS]]
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
//#endregion

function main() {

	// [[ WEBGL CANVAS SET UP ]]
	const canvas = document.querySelector( '#c' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );
	var cylinder = 0;
	//#region [[ INITIAL SCENE SET UP ]]
	//#region [[ DEFAULT CAMERA STATS ]] 
	const fov = 40; // field of view
	const aspect = 600/400; // the canvas default
	const near = 0.1; 
	const far = 50;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 10, 20 );
	//#endregion

	//#region [[ ORBIT CONTROLS FOR CAMERA ]]
	const controls = new OrbitControls( camera, canvas );
	controls.target.set( 0, 5, 0 );
	controls.update();
	//#endregion

	//#region [[ SCENE STUFF]]
	// [[ NEW SCENE ]]
	const scene = new THREE.Scene();
	// [[ SKY COLOR ]]
	scene.background = new THREE.Color( 'lightblue' ); 
	const cones = [] // array to animate the cone 
	//#endregion

	//#endregion

	//#region [[ SETTING UP THE GROUND PLANE ]] 
	{
	
		const planeSize = 40;

		const loader = new THREE.TextureLoader();
		const texture = loader.load( './textures/floor.png' );
		// this stuff just makes sure the texture wraps and scales well
		texture.colorSpace = THREE.SRGBColorSpace;
		texture.wrapS = THREE.RepeatWrapping; 
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter; // this reduces blurriness when textures are too big/small
		const repeats = planeSize / 2; 
		texture.repeat.set( repeats, repeats );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshPhongMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

	}
	//#endregion

	//#region [[ SKYBOX LIGHTING ]]
	{

		const skyColor = 0xB1E1FF; // light blue
		const groundColor = 0xB97A20; // brownish orange
		const intensity = 2;
		const light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		scene.add( light ); // w/out this the models would have dark black shadows

	}
	//#endregion

	//#region [[ DIRECTIONAL LIGHTING ]]
	{

		const color = 0xFFFFFF;
		const intensity = 2.5;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 0, 10, 0 );
		light.target.position.set( - 5, 0, 0 );
		scene.add( light );
		scene.add( light.target );

	}
	//#endregion 

	//#region [[ CENTER THE MODEL IN CAMERA VIEW ]] 
	function frameArea(sizeToFitOnScreen, boxSize, boxCenter, camera) {
		const halfSizeToFitOnScreen = sizeToFitOnScreen * 0.5;
		const halfFovY = THREE.MathUtils.degToRad(camera.fov * .5);
		const distance = halfSizeToFitOnScreen / Math.tan(halfFovY);
	   
		// compute a unit vector that points in the direction the camera is now
		// from the center of the box
		const direction = (new THREE.Vector3()).subVectors(camera.position, boxCenter).normalize();
	   
		// move the camera to a position distance units way from the center
		// in whatever direction the camera was from the center already
		camera.position.copy(direction.multiplyScalar(distance).add(boxCenter));
	   
		// pick some near and far values for the frustum that
		// will contain the box.
		camera.near = boxSize / 100;
		camera.far = boxSize * 100;
	   
		camera.updateProjectionMatrix();
	   
		// point the camera to look at the center of the box
		camera.lookAt(boxCenter.x, boxCenter.y, boxCenter.z);
	}
	//#endregion

	//#region [[ TEXTURE LOADER ]]
	// Texture Loader
	const loader = new THREE.TextureLoader();
	const first = [
		  new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		  new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		  new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		  new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		  new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/1.png')}),
		  new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
	];
	const second = [
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/2.png')}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
  	];
	const third = [
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/3.png')}),
		new THREE.MeshBasicMaterial({map: loadColorTexture('./textures/basse.png')}),
	];
	
	function loadColorTexture( path ) {
        const texture = loader.load( path );
        texture.colorSpace = THREE.SRGBColorSpace;
        //texture.minFilter = THREE.LinearMipmapLinearFilter;
        return texture;
      }

	//#endregion

	//#region [[ PRIMARY SHAPE LOADER ]]
	{
		//#region base box sizes
		const boxWidth = 1;
		const boxHeight = 1;
		const boxDepth = 1;
		
		//#endregion
		//#region base cylinder sizes
		const cylinderHeight = 2;
		const cylinderRadTop = 10;
		const cylinderRadBot = 10;
		const cylinderSegFaces = 10;
		//#endregion
		//#region base cone sizes
		const coneRad = 0.5;
		const coneHeight = 1.5;
		const coneRadSeg = 10;
		
		//#endregion

		// make instances of all shapes and put them in this array
	
		const cube3 = makeCube(boxWidth+1,boxHeight,boxDepth+0.5,4,2.5,third); // 3rd place
		const cube2 = makeCube(boxWidth+1,boxHeight+1,boxDepth+0.5,-4,2.5,second); // 2nd place
		const cube1 = makeCube(boxWidth+1,boxHeight+2,boxDepth+0.5,0,2.5,first); // 1st place
		cylinder = makeCylinder(cylinderRadTop,cylinderRadBot,cylinderHeight,cylinderSegFaces,0,0, 0x8844aa ); // microphone
		const cone = makeCone(coneRad,coneHeight,coneRadSeg,1,+5, 0xc9c441); // trophy 

		// Add cube and cone objects as children of the cylinder
		cylinder.add(cube1);
		cylinder.add(cube2);
		cylinder.add(cube3);
		cylinder.add(cone);

		// create instances of cube objects
		function makeCube(w, h, d, x, y, materials) {
			// make dat cube 
			const geometry = new THREE.BoxGeometry( w, h, d );
			//const material = new THREE.MeshPhongMaterial( { color } );
			const cube = new THREE.Mesh(geometry, materials);
			// add shape to the scene
			scene.add(cube);
			cube.position.x = x;
			cube.position.y = y
			
			return cube;
		}
		function makeCylinder(rT, rB, h, s, x, y, color) {
			// make dat cube 
			const geometry = new THREE.CylinderGeometry( rT, rB, h, s ); 
			const material = new THREE.MeshPhongMaterial( { color } );
			const cylinder = new THREE.Mesh(geometry, material);
			// add shape to the scene
			scene.add(cylinder);
			cylinder.position.x = x;
			cylinder.position.y = y
			
			return cylinder;
		}
		function makeCone(r, h, s, x, y, color) {
			// make dat cube 
			const geometry = new THREE.ConeGeometry( r, h, s);
			const material = new THREE.MeshPhongMaterial( { color } );
			const cone = new THREE.Mesh(geometry, material);
			// add shape to the scene
			scene.add(cone);
			cone.position.x = x;
			cone.position.y = y		
			return cone;
		}
	}
	//#endregion

	//#region [[ 3D MATERIAL AND 3D OBJECT LOADER]]
	{
		// [[ FIRST PLACE FROG]]
		const mtlLoader = new MTLLoader();
		mtlLoader.load( 'obj/froggy.mtl', ( mtl ) => {

			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials( mtl );
			objLoader.load( 'obj/froggy.obj', ( root ) => {
			root.position.y += 4;			
			scene.add( root );
			cylinder.add(root);
			//root.posiiton.z +=3;
			// compute the box that contains all the stuff
			// from root and below
			const box = new THREE.Box3().setFromObject( root );

			const boxSize = box.getSize( new THREE.Vector3() ).length();
			const boxCenter = box.getCenter( new THREE.Vector3() );

			// set the camera to frame the box
			frameArea( boxSize * 2.5, boxSize, boxCenter, camera );

			// update the Trackball controls to handle the new size
			controls.maxDistance = boxSize * 10;
			controls.target.copy( boxCenter );
			controls.update();
			} );

		} );
		// [[ SECOND PLACE FROG]]
		const mtlLoader2 = new MTLLoader();
		mtlLoader2.load( 'obj/froggy2.mtl', ( mtl ) => {

			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials( mtl );
			objLoader.load( 'obj/froggy2.obj', ( root ) => {
				root.position.y += 3.5;
				root.position.x -=4;	
				scene.add( root );
				cylinder.add(root);
			} );
		} );

		// [[ THIRD PLACE FROG ]]
		const mtlLoader3 = new MTLLoader();
		mtlLoader3.load( 'obj/froggy3.mtl', ( mtl ) => {

			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials( mtl );
			objLoader.load( 'obj/froggy3.obj', ( root ) => {
				root.position.y += 3;
				root.position.x +=4;
				scene.add( root );
				cylinder.add(root);
			} );
		} );
	}
	//#endregion
	
	//#region [[ RENDER JUST THE CANVAS SIZE ]] 
	function resizeRendererToDisplaySize( renderer ) {

		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {

			renderer.setSize( width, height, false );

		}

		return needResize;

	}
	//#endregion

	//#region [[ RENDER THE SCENE ]]
	function render( time ) {

		time *= 0.001;

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		// ADD ROTATING CYLINDER HERE
		cylinder.rotation.y += 0.01;

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );
	//#endregion
}
	
main();