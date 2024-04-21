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

	//#region [[ INITIAL SCENE SET UP ]]
	//#region [[ DEFAULT CAMERA STATS ]] 
	const fov = 40; // field of view
	const aspect = 2; // the canvas default
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

	//#region [[MATERIAL AND OBJECT LOADER]]
	{

		const mtlLoader = new MTLLoader();
		mtlLoader.load( 'obj/froggy.mtl', ( mtl ) => {

			mtl.preload();
			const objLoader = new OBJLoader();
			objLoader.setMaterials( mtl );
			objLoader.load( 'obj/froggy.obj', ( root ) => {

				scene.add( root );
				// compute the box that contains all the stuff
				// from root and below
				const box = new THREE.Box3().setFromObject( root );

				const boxSize = box.getSize( new THREE.Vector3() ).length();
				const boxCenter = box.getCenter( new THREE.Vector3() );

				// set the camera to frame the box
				frameArea( boxSize * 1.2, boxSize, boxCenter, camera );

				// update the Trackball controls to handle the new size
				controls.maxDistance = boxSize * 10;
				controls.target.copy( boxCenter );
				controls.update();
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
	function render() {

		if ( resizeRendererToDisplaySize( renderer ) ) {

			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();

		}

		renderer.render( scene, camera );

		requestAnimationFrame( render );

	}

	requestAnimationFrame( render );
	//#endregion
}
	
main();