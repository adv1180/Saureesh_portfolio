import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

const InteractiveStars = () => {
  const parallaxGroupRef = useRef<THREE.Group>(null);
  const spinGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (spinGroupRef.current) {
      // Slow, infinite celestial background rotation
      spinGroupRef.current.rotation.y += delta * 0.02;
      spinGroupRef.current.rotation.x -= delta * 0.01;
    }

    if (parallaxGroupRef.current) {
      // Dynamic parallax
      const targetX = -(state.pointer.x * Math.PI) / 10;
      const targetY = -(state.pointer.y * Math.PI) / 12;
      parallaxGroupRef.current.rotation.x = THREE.MathUtils.lerp(parallaxGroupRef.current.rotation.x, targetY, 0.05);
      parallaxGroupRef.current.rotation.y = THREE.MathUtils.lerp(parallaxGroupRef.current.rotation.y, targetX, 0.05);
    }
  });

  return (
    <group ref={parallaxGroupRef}>
      <group ref={spinGroupRef}>
        <Stars radius={40} depth={50} count={8000} factor={4} saturation={0.5} fade speed={1.5} />
      </group>
    </group>
  );
};

const Background = () => {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100vh", zIndex: 0, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 10], fov: 40 }}>
        <InteractiveStars />
      </Canvas>
    </div>
  );
};

export default Background;
