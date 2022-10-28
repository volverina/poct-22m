import {mockWithVideo, mockWithImage} from "./camera-mock.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {
		//mockWithImage("mock-image.png");
		//mockWithVideo("mock-video.mp4");

		const AR = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: "face.mind"
		});

		const {renderer, scene, camera} = AR;

		const geometry = new THREE.PlaneGeometry( 1.3, 1.5 );
		const material = new THREE.MeshBasicMaterial( { 
			color: 0x00ffff,
			transparent: true,
			opacity: 0.5
		 } );
		const plane = new THREE.Mesh( geometry, material );
		plane.position.y=0.2;

		const anchor = AR.addAnchor(0);
		anchor.group.add(plane);

		await AR.start();

		let angle = 0;
		renderer.setAnimationLoop( () => {
			//plane.rotation.x+=0.1;
			plane.scale.set(Math.sin(angle)+1, Math.sin(angle)+1, Math.sin(angle)+1);
			angle += 0.01;
			renderer.render(scene, camera);
		});
	}
	start();
});
