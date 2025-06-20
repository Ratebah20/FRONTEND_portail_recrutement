'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedLogo() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
    }
  });
  
  return (
    <Box ref={meshRef} args={[1, 1, 1]}>
      <meshStandardMaterial color="#3b82f6" />
    </Box>
  );
}

export function Logo3D() {
  return (
    <div className="h-32 w-32">
      <Canvas camera={{ position: [0, 0, 5], fov: 25 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <AnimatedLogo />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}