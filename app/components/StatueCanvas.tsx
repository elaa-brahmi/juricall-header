"use client";

import { Suspense, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Statue() {
  const group = useRef<THREE.Group>(null!);
  const { scene } = useGLTF("/lady-justice.glb");
  const fitted = useRef(false);

  useEffect(() => {
    if (fitted.current) return;
    fitted.current = true;

    const box = new THREE.Box3().setFromObject(scene);
    const size = new THREE.Vector3();
    box.getSize(size);

    // Scale so tallest dimension = 3.2 units — change this to resize
    const TARGET_HEIGHT = 3.2;
    const maxDim = Math.max(size.x, size.y, size.z);
    const scaleFactor = TARGET_HEIGHT / maxDim;
    scene.scale.setScalar(scaleFactor);

    // Re-center after scaling
    const box2 = new THREE.Box3().setFromObject(scene);
    const center2 = new THREE.Vector3();
    const size2 = new THREE.Vector3();
    box2.getSize(size2);
    box2.getCenter(center2);
    scene.position.set(-center2.x, -box2.min.y - size2.y / 2, -center2.z);
  }, [scene]);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const applyMat = (m: THREE.Material) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            m.color.set("#7a5c38");
            m.metalness = 0.6;
            m.roughness = 0.38;
            m.needsUpdate = true;
          }
        };
        if (Array.isArray(mesh.material)) mesh.material.forEach(applyMat);
        else applyMat(mesh.material);
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.16;
  });

  return (
    <group ref={group} position={[0, 0.4, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function Fallback() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.5; });
  return (
    <mesh ref={ref}>
      <cylinderGeometry args={[0.06, 0.06, 2.4, 8]} />
      <meshStandardMaterial color="#8B6F47" metalness={0.6} roughness={0.4} />
    </mesh>
  );
}

export default function StatueCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 7], fov: 36 }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
      shadows
    >
      <ambientLight intensity={1.3} color="#f5e6c8" />
      <directionalLight position={[4, 8, 5]} intensity={2.6} color="#e8d5a3" castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 2, -2]} intensity={0.9} color="#c8b89a" />
      <pointLight position={[0, 4, 3]} intensity={0.8} color="#f0e0c0" />

      <Suspense fallback={<Fallback />}>
        <Statue />
        <ContactShadows position={[0, 0.3, 0]} opacity={0.2} scale={6} blur={3} color="#3a2a10" />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}
