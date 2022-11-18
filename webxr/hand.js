const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {

		const AR = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: "altabor2.mind"
		});

		const {renderer, scene, camera} = AR;

		const geometry = new THREE.PlaneGeometry(1, 1);
		const material = new THREE.MeshBasicMaterial( { 
			color: 0x00ffff,
			transparent: true,
			opacity: 0.5
		 } );
		const plane = new THREE.Mesh( geometry, material );

		const anchor = AR.addAnchor(0);
		anchor.group.add(plane);

		const model = await handpose.load();

		await AR.start();

		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
		});

		const video = AR.video;
		
		let frameCount = 1;

		const detect = async () => {
			if(frameCount % 10 == 0) {
				const hands = await model.estimateHands(video);
				if (hands.length > 0) {
					const x1 = hands[0].boundingBox.topLeft[0];
					const y1 = hands[0].boundingBox.topLeft[1];
					const x2 = hands[0].boundingBox.bottomRight[0];
					const y2 = hands[0].boundingBox.bottomRight[1];
					const w = (x2 - x1) / window.innerWidth; // w in [0; 1]
					const h = (y2 - y1) / window.innerHeight; // h in [0; 1]
					plane.visible = true;			
					plane.scale.set(w, h, 1);
					plane.position.set(x1/window.innerWidth, y1 / window.innerHeight, 1);
				}
				else
					plane.visible = false;			

			}
			frameCount++;
			window.requestAnimationFrame(detect);
		}

		window.requestAnimationFrame(detect);
	}
	start();
});
