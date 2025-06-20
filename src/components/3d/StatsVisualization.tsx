'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Box, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

interface StatBarProps {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
  value: number;
}

function StatBar({ position, height, color, label, value }: StatBarProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });
  
  return (
    <group position={position}>
      <Box ref={meshRef} args={[1, height, 1]} position={[0, height / 2, 0]}>
        <meshStandardMaterial color={color} metalness={0.6} roughness={0.4} />
      </Box>
      
      <Text
        position={[0, height + 1, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
      
      <Text
        position={[0, -0.5, 1]}
        fontSize={0.3}
        color="#666"
        anchorX="center"
        anchorY="middle"
        rotation={[-Math.PI / 4, 0, 0]}
      >
        {label}
      </Text>
    </group>
  );
}

interface StatsVisualizationProps {
  stats: Array<{
    label: string;
    value: number;
    color?: string;
  }>;
}

export function StatsVisualization({ stats }: StatsVisualizationProps) {
  const maxValue = useMemo(() => Math.max(...stats.map(s => s.value)), [stats]);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  return (
    <div className="h-[400px] w-full">
      <Canvas camera={{ position: [0, 5, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <group>
            {stats.map((stat, index) => {
              const spacing = 3;
              const xPos = (index - (stats.length - 1) / 2) * spacing;
              const normalizedHeight = (stat.value / maxValue) * 5 + 0.5;
              
              return (
                <StatBar
                  key={stat.label}
                  position={[xPos, 0, 0]}
                  height={normalizedHeight}
                  color={stat.color || colors[index % colors.length]}
                  label={stat.label}
                  value={stat.value}
                />
              );
            })}
          </group>
        </Float>
        
        {/* Grille de base */}
        <gridHelper args={[20, 20, '#444', '#222']} position={[0, 0, 0]} />
        
        <OrbitControls 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}