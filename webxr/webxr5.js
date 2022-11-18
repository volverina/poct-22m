import * as THREE from "https://unpkg.com/three/build/three.module.js";
import {ARButton} from "https://unpkg.com/three/examples/jsm/webxr/ARButton.js";

document.addEventListener("DOMContentLoaded", () => {
	const initialize = async() => {
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(/*70, window.innerWidth / window.innerHeight, 0.01, 20*/);

		const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		scene.add(light);

		var loader = new THREE.TextureLoader();
		const reticleGeometry = new THREE.RingGeometry(0.14, 0.20, 32);
		//const reticleGeometry = new THREE.PlaneGeometry(0.4, 0.4);
		reticleGeometry.rotateX(- Math.PI / 2);
		//const reticleMaterial = new THREE.MeshBasicMaterial({map: loader.load("reticle.png")});
		const reticleMaterial = new THREE.MeshBasicMaterial();
		const reticle = new THREE.Mesh(reticleGeometry, reticleMaterial);
		reticle.matrixAutoUpdate = false;
		reticle.visible = false;
		scene.add(reticle);

		const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.xr.enabled = true;

		const arButton = ARButton.createButton(renderer, {
			requiredFeatures: ["hit-test"],
			optionalFeatures: ["dom-overlay"], 
			domOverlay: {root: document.body}
		});
		document.body.appendChild(renderer.domElement);
		document.body.appendChild(arButton);

		const controller = renderer.xr.getController(0);
		scene.add(controller);

		controller.addEventListener("select", () => {
			const geometry = new THREE.BoxGeometry(0.06, 0.06, 0.06);
			const material = new THREE.MeshStandardMaterial({color: 0xffffff * Math.random()});
			const mesh = new THREE.Mesh(geometry, material);

			mesh.position.setFromMatrixPosition(reticle.matrix);
			mesh.scale.y = Math.random() * 2 + 1;
			scene.add(mesh);
		});

		renderer.xr.addEventListener("sessionstart", async (e) => {
			// зміст обробника події початку сесії WebXR
			const session = renderer.xr.getSession();
			const viewerReferenceSpace = await session.requestReferenceSpace("viewer");
			const hitTestSource = await session.requestHitTestSource({space: viewerReferenceSpace});
			renderer.setAnimationLoop((timestamp, frame) => {
				if (!frame) return;
				const hitTestResults = frame.getHitTestResults(hitTestSource);
				if (hitTestResults.length > 0) {
					const hit = hitTestResults[0];
					const referenceSpace = renderer.xr.getReferenceSpace();
					const hitPose = hit.getPose(referenceSpace);
					reticle.visible = true;
					reticle.matrix.fromArray(hitPose.transform.matrix);
				} else {
					reticle.visible = false;
				}
				renderer.render(scene, camera);
			});
		});

		renderer.xr.addEventListener("sessionend", () => {
			console.log("Сесію WebXR завершено");
		});
	}
	initialize();
});

