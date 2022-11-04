import {mockWithVideo, mockWithImage} from "./camera-mock.js";

const THREE = window.MINDAR.FACE.THREE;

document.addEventListener('DOMContentLoaded', () => {
	mockWithVideo("Sokka_on_Fortune.mkv");

	const start = async() => {
	  const mindarThree = new window.MINDAR.FACE.MindARThree({
	    container: document.body,
	  });
	  const {renderer, scene, camera} = mindarThree;

	const geometry = new THREE.SphereGeometry(0.1, 32, 16);
	const material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity:0.5});
	const sphere = new THREE.Mesh(geometry, material);

	const anchor = mindarThree.addAnchor(10);
	anchor.group.add(sphere);

	sphere.position.y = 0.2;
		
	  await mindarThree.start();
	  renderer.setAnimationLoop(() => {
	    renderer.render(scene, camera);
	  });
	}
	start();
});
