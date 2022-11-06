import {GLTFLoader} from "./GLTFLoader.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {

		const AR = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: "altabor2.mind"
		});

		const {renderer, scene, camera} = AR;

		const anchor = AR.addAnchor(0);

		let isFound = false;

		anchor.onTargetFound = () => {
			console.log("Знайдена ціль");
			isFound = true;
		}

		anchor.onTargetLost = () => {
			console.log("Втрачена ціль");
			isFound = false;
		}

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
		scene.add( light );

		const loader = new GLTFLoader();

		var mixer, model;

		loader.load("https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/raccoon/scene.gltf", (gltf) => {
			gltf.scene.scale.set(0.2, 0.2, 0.2);
			gltf.scene.position.set(0, -0.8, 0);
			anchor.group.add(gltf.scene);
//			console.log(gltf);
			mixer = new THREE.AnimationMixer(gltf.scene);

			if(gltf.animations.length != 0)
			{
				const clip = mixer.clipAction(gltf.animations[0]);
				clip.play();
			}
			model = gltf;
		});

		
		const timer = new THREE.Clock();

		await AR.start();

		renderer.setAnimationLoop( () => {
			const delta = timer.getDelta ();
			mixer.update(delta);
			if (isFound)
				model.scene.rotation.y += delta;
			renderer.render(scene, camera);
		});
	}
	start();
});

