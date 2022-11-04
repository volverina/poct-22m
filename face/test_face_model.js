import {mockWithVideo, mockWithImage} from "./camera-mock.js";

import {loadGLTF} from "./loader.js";

const THREE = window.MINDAR.FACE.THREE;

document.addEventListener('DOMContentLoaded', () => {
	//mockWithVideo("Sokka_on_Fortune.mkv");

	const start = async() => {
	  const mindarThree = new window.MINDAR.FACE.MindARThree({
	    container: document.body,
	  });
	  const {renderer, scene, camera} = mindarThree;

	const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
	scene.add( light );

	const anchor = mindarThree.addAnchor(6);

	//const gltf = await loadGLTF("17892_Hypno_Glasses_v1_NEW.glb");

	const gltf = await loadGLTF("https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js/examples/face-tracking/assets/glasses/scene.gltf");

	gltf.scene.scale.set(0.008, 0.008, 0.008);
	gltf.scene.position.set(0, 0.0, -0.3);


	//gltf.scene.scale.set(0.2, 0.2, 0.2);
	//gltf.scene.position.set(0, -0.8, 0);

	anchor.group.add(gltf.scene);
		
	await mindarThree.start();
	renderer.setAnimationLoop(() => {
		renderer.render(scene, camera);
	});
	}
	start();
});
