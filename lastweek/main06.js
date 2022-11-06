import {GLTFLoader} from "./GLTFLoader.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {

		const AR = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: "abc.mind",
//			maxTrack: 3,
		});

		const {renderer, scene, camera} = AR;

		const anchor_altabor = AR.addAnchor(0); // altabor
		const anchor_bear = AR.addAnchor(1); // bear
		const anchor_raccoon = AR.addAnchor(2); // raccoon

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
		scene.add( light );

		const loader = new GLTFLoader();

		loader.load("https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/raccoon/scene.gltf", (gltf) => {
			gltf.scene.scale.set(0.1, 0.1, 0.1);
			gltf.scene.position.set(0, -0.4, 0);
			anchor_raccoon.group.add(gltf.scene);
		});

		loader.load("https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/bear/scene.gltf", (gltf) => {
			gltf.scene.scale.set(0.1, 0.1, 0.1);
			gltf.scene.position.set(0, -0.4, 0);
			anchor_bear.group.add(gltf.scene);
		});


		const geometry = new THREE.PlaneGeometry( 1.0, 1.0 );
		const material = new THREE.MeshBasicMaterial( { 
			color: 0x00ffff,
			transparent: true,
			opacity: 0.5
		 } );
		const plane = new THREE.Mesh( geometry, material );

		anchor_altabor.group.add(plane);

		await AR.start();

		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}
	start();
});
