import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useGLTF, Center } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import * as THREE from 'three';

const extractMetrics = (scene) => {
  let triangles = 0;
  let vertices = 0;
  const materialSet = new Set();
  let textures = 0;

  scene.traverse((child) => {
    if (!child.isMesh) return;
    const geo = child.geometry;

    if (geo.index) {
      triangles += geo.index.count / 3;
    } else if (geo.attributes.position) {
      triangles += geo.attributes.position.count / 3;
    }
    vertices += geo.attributes.position?.count || 0;

    const mats = Array.isArray(child.material) ? child.material : [child.material];
    mats.forEach((m) => {
      materialSet.add(m.uuid);
      ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap'].forEach((prop) => {
        if (m[prop]) textures++;
      });
    });
  });

  const box = new THREE.Box3().setFromObject(scene);
  const size = new THREE.Vector3();
  box.getSize(size);

  return {
    triangles: Math.round(triangles),
    vertices,
    materials: materialSet.size,
    textures,
    dimensions: {
      x: size.x.toFixed(2),
      y: size.y.toFixed(2),
      z: size.z.toFixed(2),
    },
  };
};

export const ShowcaseModel = forwardRef(({ wireframe, onMetrics, onReady }, ref) => {
  const groupRef = useRef();
  const { scene } = useGLTF('/models/eclair.glb');

  // Expose the scene for GUI access
  useImperativeHandle(ref, () => ({
    get current() {
      return scene;
    },
    traverse: (fn) => scene.traverse(fn),
  }));

  // Extract metrics on load
  useEffect(() => {
    if (!scene) return;
    const metrics = extractMetrics(scene);
    onMetrics?.(metrics);
  }, [scene, onMetrics]);

  // Wireframe toggle
  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child.isMesh) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          m.wireframe = wireframe;
        });
      }
    });
  }, [wireframe, scene]);

  // Entrance animation
  useGSAP(() => {
    if (!groupRef.current) return;

    gsap.set(groupRef.current.scale, { x: 0, y: 0, z: 0 });
    gsap.set(groupRef.current.position, { y: -0.3 });

    const tl = gsap.timeline({
      delay: 0.7,
      onComplete: () => onReady?.(),
    });

    tl.to(groupRef.current.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 1.2,
      ease: 'power4.out',
    });

    tl.to(groupRef.current.position, {
      y: 0,
      duration: 1,
      ease: 'power3.out',
    }, '<0.1');

    return () => tl.kill();
  }, { dependencies: [] });

  return (
    <Center>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </Center>
  );
});

ShowcaseModel.displayName = 'ShowcaseModel';

useGLTF.preload('/models/eclair.glb');
