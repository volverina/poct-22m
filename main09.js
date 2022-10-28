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
		gltf.scene.userData.clickable = true;

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
			//audio.play();
			//console.log("Знайдена ціль");
		}

		anchor.onTargetLost = () => {
			audio.pause();
			//console.log("Втрачена ціль");
		}


		document.body.addEventListener("click", (event) => {
			//console.log("Натиснуто на кнопку миші");
			const mouseX = ( event.clientX / window.innerWidth ) * 2 - 1;
			const mouseY = - ( event.clientY / window.innerHeight ) * 2 + 1;
			const mouse = new THREE.Vector2(mouseX, mouseY);
			//alert("["+mouseX + " " + mouseY+"]");
			const raycaster = new THREE.Raycaster();
			raycaster.setFromCamera(mouse, camera);
			const intersects = raycaster.intersectObjects(scene.children, true);
			
			if(intersects.length > 0)
			{
				let obj = intersects[0].object;

				while(obj.parent && !obj.userData.clickable)
					obj = obj.parent;
				
				if(obj.userData.clickable && obj == gltf.scene)
					audio.play();
			}
		});


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
/*
	const startButton = document.createElement("button");
	startButton.textContent = "Натисни на мене";
	startButton.addEventListener("click", start);
	document.body.appendChild(startButton);
*/
});

