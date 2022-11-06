import {loadGLTF, loadAudio, loadVideo} from "./loader.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {

		const AR = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: "altabor2.mind"
		});

		const {renderer, scene, camera} = AR;

		const video = await loadVideo("humo en pantalla verde _ croma key.mp4");

		video.addEventListener("play", () => {
			video.currentTime = 15;
		});

		const texture = new THREE.VideoTexture( video );

		const geometry = new THREE.PlaneGeometry( 1.0, video.videoHeight / video.videoWidth);

		let customUniforms = {
			mytexture : {
				type: "t",
				value: texture
			},
			color :	{
				type: "c",
				value: new THREE.Color( 0x00ff00)
			},
		};

		const material = new THREE.ShaderMaterial( {
			uniforms: customUniforms,
			vertexShader: document.getElementById( 'vertexShader' ).textContent,
			fragmentShader: document.getElementById( 'fragmentShader' ).textContent
		} );

		const loader = new THREE.TextureLoader();

		const material_img = new THREE.MeshBasicMaterial( { map: loader.load("Screenshot from 2022-11-04 11-40-04.png") } );

		const plane = new THREE.Mesh( geometry, material );
		const plane_img = new THREE.Mesh( geometry, material_img );
		plane.position.z = 0;
		plane_img.position.z = -0.1;

/*
		plane.rotation.x = 30 * Math.PI / 180;
		plane.position.y = 0.7;
		plane.scale.multiplyScalar(3.5);
*/

		const anchor = AR.addAnchor(0);
		anchor.group.add(plane);
		anchor.group.add(plane_img);

		anchor.onTargetFound = () => {
			video.currentTime = 15;
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

