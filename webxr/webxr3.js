import * as THREE from "https://unpkg.com/three/build/three.module.js";
import {ARButton} from "https://unpkg.com/three/examples/jsm/webxr/ARButton.js";

document.addEventListener("DOMContentLoaded", () => {
	const initialize = async() => {
		// three.js scene
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera();

		const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		document.body.appendChild(renderer.domElement);

		const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
		const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
		const mesh = new THREE.Mesh(geometry, material);
		mesh.position.set(0, 0, -0.3);
		scene.add(mesh);

		const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		scene.add(light);

		//...

		// WebXR
		renderer.xr.enabled = true;

		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
		});

		const arButton = ARButton.createButton(renderer, {optionalFeatures: ["dom-overlay"], domOverlay: {root: document.body}});
		document.body.appendChild(arButton);

		const controller = renderer.xr.getController(0);
		const eventsDiv = document.querySelector("#events");

		controller.addEventListener("selectstart", () => {
			eventsDiv.prepend("Надійшла подія selectstart -- дотик\n");
		});
		controller.addEventListener("selectend", () => {
			eventsDiv.prepend("Надійшла подія selectend -- відпустили\n");
		});
		controller.addEventListener("select", () => {
			eventsDiv.prepend("Надійшла подія select -- жест (ведемо)\n");
		});

	}
	initialize();
});

