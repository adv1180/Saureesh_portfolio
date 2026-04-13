import * as THREE from "three";
const setAnimations = (gltf: any) => {
    const mixer = new THREE.AnimationMixer(gltf.scene);
    let introAction: THREE.AnimationAction | null = null;
    let hoverAction: THREE.AnimationAction | null = null;
    if (gltf.animations && gltf.animations.length > 0) {
        introAction = mixer.clipAction(gltf.animations[0]);
        if (gltf.animations[1]) hoverAction = mixer.clipAction(gltf.animations[1]);
    }
    return {
        mixer,
        startIntro: () => {
            if (introAction) introAction.play();
        },
        hover: (_gltfContext: unknown, element: HTMLElement) => {
            element.addEventListener('mouseenter', () => { if (hoverAction) hoverAction.play(); });
            element.addEventListener('mouseleave', () => { if (hoverAction) hoverAction.stop(); });
        }
    }
}
export default setAnimations;
