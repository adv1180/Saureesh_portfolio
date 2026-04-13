import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";
import "./styles/TechStack.css";

const skillsGroup = [
  {
    category: "Languages",
    items: ["Python", "SAS", "R", "GraphQL", "SQL", "GoLang", "JAVA"]
  },
  {
    category: "Frameworks",
    items: ["Django", "FastAPI", "Flask", "PySpark"]
  },
  {
    category: "Databases",
    items: ["AlloyDB", "PostgreSQL", "MySQL", "MongoDB", "Apache Cassandra"]
  },
  {
    category: "Tools",
    items: ["AWS", "Databricks", "Docker", "Git"]
  },
  {
    category: "Technologies",
    items: [
      "Agentic AI",
      "LLM",
      "RAG",
      "Google AI SDK",
      "ELK Stack (Elasticsearch, Logstash, Kibana)",
      "Tableau"
    ]
  }
];

const textSkills = [
  "Python", "PyTorch", "GNNs", "FastAPI",
  "RAG", "Vertex AI", "AlloyDB", "Scikit",
  "SQL", "BERT", "LLMs", "Pandas"
];

function createTextTexture(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext("2d");

  if (context) {
    // Fill background with a dark techy color
    context.fillStyle = "#0a0e17";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text with the purple accent color
    context.font = "bold 100px sans-serif";
    context.fillStyle = "#a855f7";
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Draw the text on both sides of the sphere map
    context.fillText(text, canvas.width / 4, canvas.height / 2);
    context.fillText(text, (canvas.width / 4) * 3, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

const textures = textSkills.map((skill) => createTextTexture(skill));

const sphereGeometry = new THREE.SphereGeometry(1, 28, 28);

const spheres = [...Array(30)].map(() => ({
  scale: [1.1, 1.4, 1.2, 1.3, 1.5][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  r = THREE.MathUtils.randFloatSpread,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[r(20), r(20) - 25, r(20) - 10]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow
        receiveShadow
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        rotation={[0.3, 1, 1]}
      />
    </RigidBody>
  );
}

type PointerProps = {
  vec?: THREE.Vector3;
  isActive: boolean;
};

function Pointer({ vec = new THREE.Vector3(), isActive }: PointerProps) {
  const ref = useRef<RapierRigidBody>(null);

  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      ScrollSmoother.refresh(true);
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const threshold = document
        .getElementById("work")!
        .getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const materials = useMemo(() => {
    return textures.map(
      (texture) =>
        new THREE.MeshPhysicalMaterial({
          map: texture,
          emissive: "#ffffff",
          emissiveMap: texture,
          emissiveIntensity: 0.3,
          metalness: 0.5,
          roughness: 1,
          clearcoat: 0.1,
        })
    );
  }, []);

  return (
    <>
      <div className="techstack">
        <h2> My Techstack</h2>

        <Canvas
          shadows
          gl={{ alpha: true, stencil: false, depth: false, antialias: false }}
          camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
          onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
          className="tech-canvas"
        >
          <ambientLight intensity={1} />
          <spotLight
            position={[20, 20, 25]}
            penumbra={1}
            angle={0.2}
            color="white"
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <directionalLight position={[0, 5, -4]} intensity={2} />
          <Physics gravity={[0, 0, 0]}>
            <Pointer isActive={isActive} />
            {spheres.map((props, i) => (
              <SphereGeo
                key={i}
                {...props}
                material={materials[Math.floor(Math.random() * materials.length)]}
                isActive={isActive}
              />
            ))}
          </Physics>
          <Environment
            files="/models/char_enviorment.hdr"
            environmentIntensity={0.5}
            environmentRotation={[0, 4, 2]}
          />
          <EffectComposer enableNormalPass={false}>
            <N8AO color="#0f002c" aoRadius={2} intensity={1.15} />
          </EffectComposer>
        </Canvas>
      </div>

      <div className="techstack-modern">
        <div className="tech-grid">
          {skillsGroup.map((group, index) => (
            <div className="tech-category" key={index}>
              <h3>{group.category}</h3>
              <div className="tech-items">
                {group.items.map((item, idx) => (
                  <span className="tech-item" key={idx}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TechStack;
