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

		const glasses = await loadGLTF("https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js/examples/face-tracking/assets/glasses/scene.gltf");

		glasses.scene.scale.set(0.008, 0.008, 0.008);
		glasses.scene.position.set(0, 0.0, -0.3);

		anchor.group.add(glasses.scene);

		const occluder = await loadGLTF("headOccluder.glb");

		occluder.scene.scale.set(0.071, 0.071, 0.07);
		occluder.scene.position.set(0.0, -0.3, 0.065);


		const occluderMaterial = new THREE.MeshBasicMaterial({colorWrite: false });

		occluder.scene.traverse((obj) => {
			if(obj.isMesh)
				obj.material = occluderMaterial;
		});


		const anchorHead = mindarThree.addAnchor(168);

		anchorHead.group.add(occluder.scene);

		occluder.scene.renderOrder = 0;
		glasses.scene.renderOrder = 1;
			

		await mindarThree.start();
		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
		});
	}
	start();
});
