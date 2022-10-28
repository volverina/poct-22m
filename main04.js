import {mockWithVideo, mockWithImage} from "./camera-mock.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {

		const AR = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: "altabor2.mind"
		});

		const {renderer, scene, camera} = AR;

		const loader = new THREE.TextureLoader();

		const geometry = new THREE.PlaneGeometry( 1.0, 0.75 );
		const material = new THREE.MeshBasicMaterial( { 
//			map: loader.load( "https://live.staticflickr.com/3926/15022299147_c400693a6c_b.jpg" ) } );
			map: loader.load( "altabor2.png" ) } );

		const plane = new THREE.Mesh( geometry, material );

		const anchor = AR.addAnchor(0);
		anchor.group.add(plane);

		const spgeometry = new THREE.SphereGeometry( 0.5, 32, 16 );
		const spmaterial = new THREE.MeshBasicMaterial( { 
			map: loader.load("https://live.staticflickr.com/7175/6827381233_26f6a8a595_b.jpg") } );
		const sphere = new THREE.Mesh( spgeometry, spmaterial );
		sphere.position.x=1.5;

		anchor.group.add(sphere);

		const boxgeometry = new THREE.BoxGeometry( 1, 1, 1 );

		const boxmaterials = [
			new THREE.MeshBasicMaterial( { 
				map: loader.load("https://live.staticflickr.com/5516/12065911556_9f83cf14d7_b.jpg")
			} ),
			new THREE.MeshBasicMaterial( { 
				map: loader.load("https://live.staticflickr.com/3670/11278910216_ff8a1340df_b.jpg")
			} ),
			new THREE.MeshBasicMaterial( { 
				map: loader.load("https://live.staticflickr.com/7190/6835502214_3f0c409022_b.jpg")
			} ),
			new THREE.MeshBasicMaterial( { 
				map: loader.load("https://live.staticflickr.com/8398/8670570229_5e51d006ba_b.jpg")
			} ),
			new THREE.MeshBasicMaterial( { 
				map: loader.load("https://live.staticflickr.com/7158/6802411041_17f39a8f44_b.jpg")
			} ),
			new THREE.MeshBasicMaterial( { 
				map: loader.load("https://live.staticflickr.com/4022/4297311398_7eba93b8a6_b.jpg")
			} )
		]

		const box = new THREE.Mesh( boxgeometry,  boxmaterials);
		box.position.x=-1.5;

		anchor.group.add(box);

		await AR.start();

		renderer.setAnimationLoop( () => {
			renderer.render(scene, camera);
			box.rotation.x += 0.01;
			box.rotation.y += 0.02;
			box.rotation.z += 0.015;
		});
	}
	start();
});
