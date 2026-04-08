import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const FloatingShape = ({ position, color, speed, size }: { position: [number, number, number], color: string, speed: number, size: number }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01 * speed;
      meshRef.current.rotation.y += 0.01 * speed;
      meshRef.current.position.y += Math.sin(state.clock.getElapsedTime() * speed) * 0.002;
      
      // Mouse follow effect
      const mouseX = (state.mouse.x * 2);
      const mouseY = (state.mouse.y * 2);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, position[0] + mouseX * 0.5, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, position[1] + mouseY * 0.5, 0.1);
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={meshRef} args={[size, 32, 32]} position={position}>
        <MeshDistortMaterial
          color={color}
          speed={speed * 2}
          distort={0.4}
          radius={1}
        />
      </Sphere>
    </Float>
  );
};

const Particles = ({ count = 50 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#3D405B" transparent opacity={0.2} />
    </points>
  );
};

const HeroCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        
        <FloatingShape position={[-2, 1, 0]} color="#E07A5F" speed={0.5} size={0.6} />
        <FloatingShape position={[2, -1, -1]} color="#8BA88F" speed={0.7} size={0.4} />
        <FloatingShape position={[1.5, 1.5, -2]} color="#F2C94C" speed={0.4} size={0.3} />
        
        <Particles count={100} />
      </Canvas>
    </div>
  );
};

export default HeroCanvas;
