import {loadGLTF, loadAudio} from "./loader.js";


const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {

		const AR = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: "altabor2.mind"
		});

		const {renderer, scene, camera} = AR;

		const anchor = AR.addAnchor(0);

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
		scene.add( light );

		const gltf = await loadGLTF("https://raw.githubusercontent.com/hiukim/mind-ar-js/master/examples/image-tracking/assets/band-example/raccoon/scene.gltf");

		gltf.scene.scale.set(0.2, 0.2, 0.2);
		gltf.scene.position.set(0, -0.8, 0);
		anchor.group.add(gltf.scene);
		const mixer = new THREE.AnimationMixer(gltf.scene);

		if(gltf.animations.length != 0)
		{
			const clip = mixer.clipAction(gltf.animations[0]);
			clip.play();
		}
		

		const audioClip = await loadAudio("https://archive.org/download/southside2009-09-12.flac16/southside2009-09-12t02.mp3");

		const listener = new THREE.AudioListener();
		camera.add( listener );

		const audio = new THREE.PositionalAudio( listener );
		anchor.group.add(audio);

		audio.setBuffer(audioClip);
		audio.setRefDistance(100);

		audio.setLoop(true);
		audio.setVolume(3);


		anchor.onTargetFound = () => {
			audio.play();
			//console.log("Знайдена ціль");
		}

		anchor.onTargetLost = () => {
			audio.pause();
			//console.log("Втрачена ціль");
		}


		const timer = new THREE.Clock();

		await AR.start();

		renderer.setAnimationLoop( () => {
			const delta = timer.getDelta ();
			mixer.update(delta);
			gltf.scene.rotation.y += delta;
			renderer.render(scene, camera);
		});
	}
	start();
});

