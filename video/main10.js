import {loadGLTF, loadAudio, loadVideo} from "./loader.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {

		const AR = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: "altabor2.mind"
		});

		const {renderer, scene, camera} = AR;

		const video = await loadVideo("Cisco_on_21st_century.mkv");
		const texture = new THREE.VideoTexture( video );

		const geometry = new THREE.PlaneGeometry( 1.0, video.videoHeight / video.videoWidth);
		const material = new THREE.MeshBasicMaterial( { map: texture } );
		const plane = new THREE.Mesh( geometry, material );

		const anchor = AR.addAnchor(0);
		anchor.group.add(plane);

		anchor.onTargetFound = () => {
			video.currentTime = 0;
			video.play();
		}

		anchor.onTargetLost = () => {
			video.pause();
		}

		await AR.start();

		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});
	}
	start();
});

