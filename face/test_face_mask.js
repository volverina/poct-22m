import {mockWithVideo, mockWithImage} from "./camera-mock.js";

import {loadGLTF, loadTexture} from "./loader.js";

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

		const faceMesh = mindarThree.addFaceMesh();

		const texture = await loadTexture("cc.png");

		faceMesh.material.map = texture;
		faceMesh.material.transparent = true;
		faceMesh.material.needsUpdate = true;
		scene.add( faceMesh );

		document.querySelector("#switch").addEventListener("click", () => {
			mindarThree.switchCamera();
		});

		await mindarThree.start();
		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
		});
	}
	start();
});
