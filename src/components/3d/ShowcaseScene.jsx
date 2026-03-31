import { Suspense, useRef, forwardRef, useImperativeHandle } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useProgress, Html } from '@react-three/drei';
import * as THREE from 'three';
import { ShowcaseModel } from './ShowcaseModel';

const Loader = () => {
  const { progress } = useProgress();
  return (
    <Html center>
      <div style={{
        width: '200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{
          width: '100%',
          height: '1px',
          background: '#222',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: '#666',
            transition: 'width 0.3s ease',
          }} />
        </div>
        <span style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: '10px',
          fontWeight: 300,
          color: '#555',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          {Math.round(progress)}%
        </span>
      </div>
    </Html>
  );
};

const Grid = ({ visible }) => {
  if (!visible) return null;
  return <gridHelper args={[10, 10, '#333333', '#1a1a1a']} />;
};

export const ShowcaseScene = forwardRef(({
  wireframe,
  autoRotate,
  showGrid,
  onMetrics,
  onModelReady,
}, ref) => {
  const controlsRef = useRef();
  const modelRef = useRef();
  const ambientLightRef = useRef();
  const dirLight1Ref = useRef();
  const dirLight2Ref = useRef();
  const dirLight3Ref = useRef();

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (!controlsRef.current) return;
      controlsRef.current.reset();
    },
    modelRef,
    ambientLightRef,
    dirLight1Ref,
    dirLight2Ref,
    dirLight3Ref,
  }));

  return (
    <Canvas
      camera={{ position: [0, 0.5, 4], fov: 40 }}
      gl={{
        antialias: true,
        alpha: false,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.1,
      }}
      dpr={[1, 2]}
      shadows
      style={{ background: '#0A0A0A' }}
    >
      <Suspense fallback={<Loader />}>
        <ambientLight ref={ambientLightRef} intensity={0} />
        <directionalLight
          ref={dirLight1Ref}
          position={[5, 8, 5]}
          intensity={0}
          castShadow
          shadow-mapSize={1024}
        />
        <directionalLight ref={dirLight2Ref} position={[-5, 3, -3]} intensity={0} />
        <directionalLight ref={dirLight3Ref} position={[0, -3, 5]} intensity={0} />

        <ShowcaseModel
          ref={modelRef}
          wireframe={wireframe}
          onMetrics={onMetrics}
          onReady={onModelReady}
        />

        <ContactShadows
          position={[0, -0.8, 0]}
          opacity={0.25}
          scale={8}
          blur={2.5}
          far={3}
        />

        <Grid visible={showGrid} />

        <Environment preset="city" />

        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan
          enableDamping
          dampingFactor={0.05}
          minDistance={1.5}
          maxDistance={10}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          autoRotate={autoRotate}
          autoRotateSpeed={1.5}
          makeDefault
        />
      </Suspense>
    </Canvas>
  );
});

ShowcaseScene.displayName = 'ShowcaseScene';
