import {CSS3DObject} from "http://unpkg.com/three/examples/jsm/renderers/CSS3DRenderer.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
	const start = async() => {
		var tag = document.createElement('script');

      		tag.src = "https://www.youtube.com/iframe_api";
      		var firstScriptTag = document.getElementsByTagName('script')[0];
      		firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

		var player = null;
		function onYouTubeIframeAPIReady() {
			player = new YT.Player('player', {
				height: '390',
				width: '640',
				videoId: 'OFPRY6su9KA',
				playerVars: {
					'playsinline': 1
				},
				events: {
					'onReady': () => {},
				}
			});
      		}

		window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

		const AR = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: "altabor2.mind"
		});

		const {renderer, cssRenderer, scene, cssScene, camera} = AR;

		const div = new CSS3DObject(document.querySelector("#ar-div"));

		const anchor = AR.addCSSAnchor(0);
		anchor.group.add(div);

		if(player) player.seekTo(0);

		anchor.onTargetFound = () => {
			if(player) player.playVideo();
		}

		anchor.onTargetLost = () => {
			if(player) player.pauseVideo();
		}

		await AR.start();

		renderer.setAnimationLoop( () => {
			cssRenderer.render(cssScene, camera);
		});
	}
	start();
});

