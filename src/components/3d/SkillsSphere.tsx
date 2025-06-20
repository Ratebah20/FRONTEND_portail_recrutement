'use client';

import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Skill {
  name: string;
  score: number;
  category?: string;
}

interface SkillNodeProps {
  skill: Skill;
  position: [number, number, number];
  color: string;
}

function SkillNode({ skill, position, color }: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const scaleRef = useRef(1);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      
      // Animation de scale avec lerp
      const targetScale = hovered ? 1.2 : 1;
      scaleRef.current += (targetScale - scaleRef.current) * 0.1;
      meshRef.current.scale.setScalar(scaleRef.current);
    }
  });
  
  const size = skill.score / 100 * 0.5 + 0.3;
  
  return (
    <group position={position}>
      <Sphere
        ref={meshRef}
        args={[size, 32, 16]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Sphere>
      
      <Text
        position={[0, size + 0.3, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {skill.name}
      </Text>
      
      {hovered && (
        <Text
          position={[0, size + 0.6, 0]}
          fontSize={0.15}
          color="#fbbf24"
          anchorX="center"
          anchorY="middle"
        >
          {skill.score}%
        </Text>
      )}
    </group>
  );
}

interface SkillsSphereProps {
  skills: Skill[];
}

export function SkillsSphere({ skills }: SkillsSphereProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });
  
  const positions = useMemo(() => {
    const points: [number, number, number][] = [];
    const radius = 3;
    
    skills.forEach((_, i) => {
      const phi = Math.acos(-1 + (2 * i) / skills.length);
      const theta = Math.sqrt(skills.length * Math.PI) * phi;
      
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      
      points.push([x, y, z]);
    });
    
    return points;
  }, [skills.length]);
  
  const categoryColors: Record<string, string> = {
    'Frontend': '#3b82f6',
    'Backend': '#10b981',
    'Database': '#f59e0b',
    'DevOps': '#ef4444',
    'Soft Skills': '#8b5cf6',
    'Other': '#6b7280'
  };
  
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <group ref={groupRef}>
          {skills.map((skill, index) => (
            <SkillNode
              key={skill.name}
              skill={skill}
              position={positions[index]}
              color={categoryColors[skill.category || 'Other'] || categoryColors.Other}
            />
          ))}
        </group>
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={5}
          maxDistance={15}
        />
      </Canvas>
    </div>
  );
}