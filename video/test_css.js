import {CSS3DObject} from "http://unpkg.com/three/examples/jsm/renderers/CSS3DRenderer.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {

		const AR = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: "altabor2.mind"
		});

		const {renderer, cssRenderer, scene, cssScene, camera} = AR;

		const div = new CSS3DObject(document.querySelector("#ar-div"));

		const anchor = AR.addCSSAnchor(0);
		anchor.group.add(div);

		await AR.start();

		renderer.setAnimationLoop( () => {
			cssRenderer.render(cssScene, camera);
		});
	}
	start();
});

