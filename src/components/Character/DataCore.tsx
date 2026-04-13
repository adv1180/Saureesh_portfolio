import { useEffect, useRef, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, useGLTF, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { setCharTimeline, setAllTimeline } from "../utils/GsapScroll";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";

// Handles injecting the GSAP ScrollTimeline against the 3D React components
const ScrollCoordinator = ({ modelRef }: { modelRef: React.RefObject<THREE.Group> }) => {
  const { camera } = useThree();
  useEffect(() => {
    if (modelRef.current && camera) {
      // Re-use the exact GSAP timeline that original Scene used to shift the camera & mesh on Scroll
      setCharTimeline(modelRef.current, camera as THREE.PerspectiveCamera);
      setAllTimeline();
    }
  }, [camera, modelRef]);
  return null;
};

// Generates an interactive field of stars that spins natively but reacts to cursor
const InteractiveStars = () => {
  const parallaxGroupRef = useRef<THREE.Group>(null);
  const spinGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    // 1. Slow, infinite celestial background rotation
    if (spinGroupRef.current) {
      spinGroupRef.current.rotation.y += delta * 0.02;
      spinGroupRef.current.rotation.x -= delta * 0.01;
    }

    // 2. Dynamic parallax based on mouse mapping
    if (parallaxGroupRef.current) {
      const targetX = -(state.pointer.x * Math.PI) / 10;
      const targetY = -(state.pointer.y * Math.PI) / 12;
      
      // Lerp mouse look for smooth universe tilting
      parallaxGroupRef.current.rotation.x = THREE.MathUtils.lerp(parallaxGroupRef.current.rotation.x, targetY, 0.05);
      parallaxGroupRef.current.rotation.y = THREE.MathUtils.lerp(parallaxGroupRef.current.rotation.y, targetX, 0.05);
    }
  });

  return (
    <group ref={parallaxGroupRef}>
      <group ref={spinGroupRef}>
        <Stars radius={40} depth={50} count={6000} factor={4} saturation={0.5} fade speed={1.5} />
      </group>
    </group>
  );
};

// Floating Brain Hologram Model
const BrainModel = ({ modelRef }: { modelRef: React.RefObject<THREE.Group> }) => {
  const { scene } = useGLTF("/models/brain_hologram.glb");

  useFrame((state, delta) => {
    if (modelRef.current) {
      // Gentle floating and spinning
      modelRef.current.rotation.y += delta * 0.2;
      modelRef.current.position.y = -1.0 + Math.sin(state.clock.elapsedTime * 2) * 0.1;

      // Dynamic mouse tracking (parallax tilt) so the Brain leans with your cursor
      const targetX = -(state.pointer.x * Math.PI) / 6;
      const targetY = -(state.pointer.y * Math.PI) / 8;
      modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetY, 0.05);
      modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, targetX, 0.05);
    }
  });

  useEffect(() => {
    if (scene) {
      // Just ensure it's centered without deleting meshes which corrupts the bounding box calculation!
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      scene.position.sub(center);
      
      // Fix potential glass shell overlap bugs by ensuring depthWrite handles transparencies correctly
      scene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh && (child as THREE.Mesh).material) {
           const mat = (child as THREE.Mesh).material as THREE.Material;
           mat.depthWrite = !mat.transparent;
        }
      });
    }
  }, [scene]);

  // Command to Hero scale!
  return (
    <group ref={modelRef} scale={4.5}>
      <primitive object={scene} />
    </group>
  );
};

useGLTF.preload("/models/brain_hologram.glb");

const DataCore = () => {
  const { setLoading } = useLoading();
  const brainRef = useRef<THREE.Group>(null);

  useEffect(() => {
    // Initiate the loading progress bar logic
    let progress = setProgress((value) => setLoading(value));

    progress.loaded().then(() => {
      // Nothing extra needed here, canvas handles its own load seamlessly
    });
  }, [setLoading]);

  // Keep character-container classes empty of positioning so it follows document flow implicitly!
  return (
    <div className="character-container" style={{ width: "100%", height: "100vh", position: "absolute", zIndex: 1, pointerEvents: "none" }}>
      <div className="character-model datacore-model" style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
          <ambientLight intensity={0.2} />
          <directionalLight position={[10, 10, 5]} intensity={0.5} color="#e2e8f0" />
          <directionalLight position={[-10, -5, -5]} intensity={0.8} color="#a855f7" />
          
          <InteractiveStars />
          
          <Suspense fallback={null}>
            <ScrollCoordinator modelRef={brainRef} />
            <Float speed={1.5} rotationIntensity={0} floatIntensity={0.5}>
              <BrainModel modelRef={brainRef} />
            </Float>
          </Suspense>
          
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.8} mipmapBlur intensity={0.3} />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  );
};

export default DataCore;
