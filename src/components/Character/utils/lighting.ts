import * as THREE from "three";
const setLighting = (scene: THREE.Scene) => {
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(2, 5, 5);
    scene.add(dir);
    
    let currentPointLight: THREE.PointLight | null = null;
    return {
        turnOnLights: () => {},
        setPointLight: (object: any) => {
            if (object && !currentPointLight) {
                currentPointLight = new THREE.PointLight(0xB0F5EA, 1, 5);
                object.add(currentPointLight);
            }
        }
    }
}
export default setLighting;
