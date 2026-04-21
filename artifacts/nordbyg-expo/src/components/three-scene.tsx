import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, Float } from "@react-three/drei";
import { useRef, Suspense, useState, useEffect } from "react";
import * as THREE from "three";
import { isWebGLAvailable } from "./webgl-boundary";

function useWebGL() {
  const [ok, setOk] = useState<boolean | null>(null);
  useEffect(() => {
    setOk(isWebGLAvailable());
  }, []);
  return ok;
}

function WireBuilding() {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.15;
  });

  const floors = 14;
  const floorH = 0.45;
  const w = 2.4;
  const d = 1.6;

  return (
    <group ref={group} position={[0, -1.5, 0]}>
      {Array.from({ length: floors }).map((_, i) => (
        <mesh key={i} position={[0, i * floorH, 0]}>
          <boxGeometry args={[w, floorH * 0.92, d]} />
          <meshBasicMaterial color="#f59e0b" wireframe />
        </mesh>
      ))}
      <mesh position={[0, floors * floorH, 0]}>
        <coneGeometry args={[0.4, 0.8, 4]} />
        <meshBasicMaterial color="#f59e0b" wireframe />
      </mesh>
      {/* crane */}
      <group position={[2.4, 0, 0]}>
        <mesh position={[0, 4, 0]}>
          <boxGeometry args={[0.12, 8, 0.12]} />
          <meshBasicMaterial color="#fbbf24" wireframe />
        </mesh>
        <mesh position={[-1.5, 7.5, 0]}>
          <boxGeometry args={[3.5, 0.15, 0.15]} />
          <meshBasicMaterial color="#fbbf24" wireframe />
        </mesh>
        <mesh position={[1, 7.5, 0]}>
          <boxGeometry args={[2, 0.1, 0.1]} />
          <meshBasicMaterial color="#fbbf24" wireframe />
        </mesh>
      </group>
    </group>
  );
}

export function HeroScene() {
  const ok = useWebGL();
  if (!ok) return null;
  return (
    <Canvas camera={{ position: [6, 4, 8], fov: 45 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#f59e0b" />
        <pointLight position={[-10, 5, -10]} intensity={0.5} color="#3b82f6" />
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.4}>
          <WireBuilding />
        </Float>
        <Grid
          position={[0, -1.5, 0]}
          args={[20, 20]}
          cellColor="#1e293b"
          sectionColor="#f59e0b"
          fadeDistance={20}
          infiniteGrid
        />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

function HallBox({
  position,
  size,
  color,
  label,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  label: string;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshStandardMaterial;
      m.emissiveIntensity = 0.3 + Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
    }
  });
  return (
    <group position={position}>
      <mesh ref={ref} castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, size[1] / 2 + 0.05, 0]}>
        <boxGeometry args={[size[0] * 1.05, 0.05, size[2] * 1.05]} />
        <meshStandardMaterial color="#f59e0b" />
      </mesh>
      <mesh position={[0, size[1] + 0.4, 0]}>
        <planeGeometry args={[1, 0.4]} />
        <meshBasicMaterial color="#f8fafc" transparent opacity={0} />
      </mesh>
    </group>
  );
}

export function FloorPlanScene() {
  const ok = useWebGL();
  if (!ok) return null;
  return (
    <Canvas camera={{ position: [10, 9, 10], fov: 40 }} dpr={[1, 2]} shadows>
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[8, 10, 5]}
          intensity={1.2}
          color="#fde68a"
          castShadow
        />
        <pointLight position={[-5, 5, -5]} intensity={0.4} color="#60a5fa" />

        <HallBox position={[-2.5, 0.5, -2]} size={[3, 1, 2]} color="#1e3a5f" label="Hall A" />
        <HallBox position={[1.5, 0.6, -2]} size={[3, 1.2, 2]} color="#1e293b" label="Hall B" />
        <HallBox position={[-2.5, 0.5, 1.5]} size={[3, 1, 2.5]} color="#0f172a" label="Hall C" />
        <HallBox position={[1.5, 0.7, 1.5]} size={[3, 1.4, 2.5]} color="#1e3a5f" label="Hall D" />

        {/* Concourse */}
        <mesh position={[-0.5, 0.05, 0]} receiveShadow>
          <boxGeometry args={[8, 0.05, 6]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.15} />
        </mesh>

        <Grid
          position={[0, 0, 0]}
          args={[30, 30]}
          cellColor="#1e293b"
          sectionColor="#334155"
          fadeDistance={25}
          infiniteGrid
        />
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.6}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.4}
        />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}
