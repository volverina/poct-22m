import {mockWithVideo, mockWithImage} from "./camera-mock.js";

import {loadGLTF, loadTexture} from "./loader.js";

const THREE = window.MINDAR.FACE.THREE;

const capture = (mindarThree) => {
	const {video, renderer, scene, camera} = mindarThree;
	
	const renderCanvas = renderer.domElement; // glasses canvas
	const canvas = document.createElement("canvas"); // buffer canvas
	const context = canvas.getContext("2d"); // 2d context buffer
	canvas.width = renderCanvas.width;
	canvas.height = renderCanvas.height;

	const sx = (video.clientWidth - renderCanvas.clientWidth) / 2 * video.videoWidth / video.videoHeight;
	const sy = (video.clientHeight - renderCanvas.clientHeight) / 2 * video.videoHeight / video.videoWidth;
	const sWidth = video.videoWidth - sx*2; 
	const sHeight = video.videoHeight - sy*2;

	context.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height); // video -> buffer

	renderer.preserveDrawingBuffer = true;
	renderer.render(scene, camera);
	context.drawImage(renderCanvas, 0, 0, canvas.width, canvas.height); // canvas -> buffer
	renderer.preserveDrawingBuffer = false;
	
	const data = canvas.toDataURL("image/png");
	/*
	const link = document.createElement("a");
	link.download = "ar-photo.png";
	link.href = data;
	link.click();
	*/
	return data;
}

document.addEventListener('DOMContentLoaded', () => {
	//mockWithVideo("Sokka_on_Fortune.mkv");

	const start = async() => {
		const mindarThree = new window.MINDAR.FACE.MindARThree({
		    container: document.body,
		  });
		const {renderer, scene, camera} = mindarThree;

		const light = new THREE.HemisphereLight( 0xffffff, 0xbbbbff, 1 );
		scene.add( light );

		const faceMesh = mindarThree.addFaceMesh();

		const anchor = mindarThree.addAnchor(6);

		const glasses = await loadGLTF("https://cdn.jsdelivr.net/gh/hiukim/mind-ar-js/examples/face-tracking/assets/glasses/scene.gltf");

		glasses.scene.scale.set(0.008, 0.008, 0.008);
		glasses.scene.position.set(0, 0.0, -0.3);

		anchor.group.add(glasses.scene);

		const occluder = await loadGLTF("headOccluder.glb");

		occluder.scene.scale.set(0.071, 0.071, 0.07);
		occluder.scene.position.set(0.0, -0.3, 0.065);


		const occluderMaterial = new THREE.MeshBasicMaterial({colorWrite: false });

		occluder.scene.traverse((obj) => {
			if(obj.isMesh)
				obj.material = occluderMaterial;
		});


		const anchorHead = mindarThree.addAnchor(168);

		anchorHead.group.add(occluder.scene);

		occluder.scene.renderOrder = 0;
		glasses.scene.renderOrder = 1;
			
		const preview = document.querySelector("#preview");
		const previewClose = document.querySelector("#preview-close");
		const previewImage = document.querySelector("#preview-image");
		const previewShare = document.querySelector("#preview-share");

		document.querySelector("#capture").addEventListener("click", () => {
			const data = capture(mindarThree);
			preview.style.visibility = "visible";
			previewImage.src = data;
			//console.log(data);
		});

		previewClose.addEventListener("click", () => {
			preview.style.visibility = "hidden";
		});


		previewShare.addEventListener("click", () => {

			const canvas = document.createElement("canvas"); // buffer canvas
			const context = canvas.getContext("2d"); // 2d context buffer
			canvas.width = previewImage.width;
			canvas.height = previewImage.height;
			context.drawImage(previewImage, 0, 0, canvas.width, canvas.height); // canvas -> buffer

			canvas.toBlob((blob) => {
				const file = new File([blob], "ar-photo.png", {type: "image/png"});
				const files = [file];
				if (navigator.canShare && navigator.canShare({files}))
				{
					navigator.share({files: files, title: "AR photo"});
				}
				else
				{
					const link = document.createElement("a");
					link.download = "ar-photo.png";
					link.href = previewImage.src;
					link.click();
				}
			});
		});

		await mindarThree.start();
		renderer.setAnimationLoop(() => {
			renderer.render(scene, camera);
		});
	}
	start();
});
