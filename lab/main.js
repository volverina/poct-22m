const THREE = window.MINDAR.IMAGE.THREE;

//import {mockWithImage} from "./camera-mock.js";

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {
		//mockWithImage("Screenshot from 2022-11-17 19-31-07.png");

		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: "atlas.mind",
		});
		const {renderer, scene, camera} = mindarThree;

		const r = 0.75;

		const geometry = new THREE.SphereGeometry(0.05, 32, 16);
		const material1 = new THREE.MeshStandardMaterial({color: 0xff0000});
		const material2 = new THREE.MeshStandardMaterial({color: 0x0000ff});
		const sphere1 = new THREE.Mesh(geometry, material1);
		const sphere2 = new THREE.Mesh(geometry, material2);

		const thorus_geometry = new THREE.TorusGeometry(r, 0.05, 16, 100 );
		const thorus_material = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: 0.25});
		const thorus = new THREE.Mesh(thorus_geometry, thorus_material);

		const anchor = mindarThree.addAnchor(0);
		anchor.group.add(sphere1);
		anchor.group.add(sphere2);
		anchor.group.add(thorus);

		var light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		scene.add(light);

		await mindarThree.start();

		const startAngle = - (Math.PI/2 - 3 * Math.PI/180);
		let angle = startAngle;
		const clock = new THREE.Clock();

		renderer.setAnimationLoop(() => {
			sphere1.position.x = r * Math.cos(Math.PI+angle);
			sphere1.position.y = r * Math.sin(Math.PI+angle);

			sphere2.position.x = r * Math.cos(-angle);
			sphere2.position.y = r * Math.sin(-angle);
			const delta = clock.getDelta();
			angle += delta / 5;
			if (angle >= Math.PI/2 - 3 * Math.PI/180)
				angle = startAngle;
			renderer.render(scene, camera);
		});
	}
	start();
});
