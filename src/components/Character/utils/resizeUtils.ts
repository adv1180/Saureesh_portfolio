import * as THREE from "three";
const handleResize = (renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera, canvasDiv: React.MutableRefObject<HTMLDivElement | null>, _character: THREE.Object3D) => {
    if (canvasDiv.current) {
        camera.aspect = canvasDiv.current.clientWidth / canvasDiv.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvasDiv.current.clientWidth, canvasDiv.current.clientHeight);
    }
}
export default handleResize;
