'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, Cylinder, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface StageData {
  name: string;
  count: number;
  position: [number, number, number];
  color: string;
}

function PipelineStage({ stage, index, total }: { stage: StageData; index: number; total: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      const scale = hovered ? 1.1 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }
  });
  
  // Calculer la hauteur basée sur le nombre
  const height = (stage.count / 100) * 3 + 0.5;
  
  return (
    <group position={stage.position}>
      {/* Cylindre principal */}
      <Cylinder
        ref={meshRef}
        args={[0.8, 0.8, height, 32]}
        position={[0, height / 2, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={stage.color}
          emissive={stage.color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
          metalness={0.5}
          roughness={0.3}
        />
      </Cylinder>
      
      {/* Texte du nom */}
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {stage.name}
      </Text>
      
      {/* Nombre */}
      <Text
        position={[0, height + 0.5, 0]}
        fontSize={0.4}
        color={stage.color}
        anchorX="center"
        anchorY="middle"
      >
        {stage.count}
      </Text>
      
      {/* Ligne de connexion vers le prochain stage */}
      {index < total - 1 && (
        <Line
          points={[[0.8, height / 2, 0], [2.7, height / 2, 0]]}
          color="#666666"
          lineWidth={2}
          dashed
          dashScale={5}
        />
      )}
    </group>
  );
}

function Pipeline() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });
  
  const stages: StageData[] = [
    { name: 'Candidatures', count: 150, position: [-4.5, 0, 0], color: '#3b82f6' },
    { name: 'Présélection', count: 80, position: [-1.5, 0, 0], color: '#8b5cf6' },
    { name: 'Entretiens', count: 40, position: [1.5, 0, 0], color: '#f59e0b' },
    { name: 'Décision', count: 15, position: [4.5, 0, 0], color: '#10b981' }
  ];
  
  return (
    <group ref={groupRef}>
      {/* Fond avec particules */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#0f172a" opacity={0.5} transparent />
      </mesh>
      
      {/* Stages du pipeline */}
      {stages.map((stage, index) => (
        <PipelineStage
          key={stage.name}
          stage={stage}
          index={index}
          total={stages.length}
        />
      ))}
      
      {/* Titre */}
      <Text
        position={[0, 4, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Pipeline de Recrutement
      </Text>
      
      {/* Taux de conversion */}
      <group position={[0, -2, 0]}>
        <Text
          fontSize={0.25}
          color="#666666"
          anchorX="center"
          anchorY="middle"
        >
          Taux de conversion global: 10%
        </Text>
      </group>
    </group>
  );
}

export function RecruitmentPipeline3D() {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 2, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Pipeline />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={8}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}