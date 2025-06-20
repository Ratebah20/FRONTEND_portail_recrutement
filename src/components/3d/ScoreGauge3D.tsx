'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Torus, Cylinder, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';

interface ScoreIndicatorProps {
  score: number;
}

function ScoreIndicator({ score }: ScoreIndicatorProps) {
  const groupRef = useRef<THREE.Group>(null);
  const needleRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  useEffect(() => {
    if (needleRef.current) {
      const angle = (score / 100) * Math.PI - Math.PI / 2;
      gsap.to(needleRef.current.rotation, {
        z: angle,
        duration: 2,
        ease: 'elastic.out(1, 0.3)'
      });
    }
  }, [score]);
  
  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });
  
  // Créer des particules
  const particlesCount = 100;
  const positions = new Float32Array(particlesCount * 3);
  
  for (let i = 0; i < particlesCount; i++) {
    const radius = 2 + Math.random() * 0.5;
    const angle = (i / particlesCount) * Math.PI * 2;
    
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Vert
    if (score >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Rouge
  };
  
  const scoreColor = getScoreColor(score);
  
  return (
    <group ref={groupRef}>
      {/* Arc de fond */}
      <Torus
        args={[2, 0.1, 4, 100, Math.PI]}
        rotation={[0, 0, -Math.PI / 2]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#1f2937" />
      </Torus>
      
      {/* Arc de score */}
      <Torus
        args={[2, 0.15, 4, 100, (score / 100) * Math.PI]}
        rotation={[0, 0, -Math.PI / 2]}
        position={[0, 0, 0.1]}
      >
        <meshStandardMaterial
          color={scoreColor}
          emissive={scoreColor}
          emissiveIntensity={0.5}
        />
      </Torus>
      
      {/* Aiguille */}
      <group ref={needleRef} position={[0, 0, 0.2]}>
        <Cylinder
          args={[0.05, 0.02, 1.8, 8]}
          rotation={[0, 0, Math.PI / 2]}
          position={[0.9, 0, 0]}
        >
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.3}
          />
        </Cylinder>
      </group>
      
      {/* Centre */}
      <Cylinder args={[0.3, 0.3, 0.2, 32]} position={[0, 0, 0.2]}>
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Particules */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color={scoreColor}
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      
      {/* Score text */}
      <Text
        position={[0, -0.7, 0.3]}
        fontSize={0.6}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {score}%
      </Text>
      
      {/* Labels */}
      <Text
        position={[-2.2, 0, 0]}
        fontSize={0.15}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
      >
        0
      </Text>
      
      <Text
        position={[0, 2.2, 0]}
        fontSize={0.15}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
      >
        50
      </Text>
      
      <Text
        position={[2.2, 0, 0]}
        fontSize={0.15}
        color="#6b7280"
        anchorX="center"
        anchorY="middle"
      >
        100
      </Text>
    </group>
  );
}

interface ScoreGauge3DProps {
  score: number;
}

export function ScoreGauge3D({ score }: ScoreGauge3DProps) {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <ScoreIndicator score={score} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}