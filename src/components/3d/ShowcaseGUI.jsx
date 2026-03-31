import { useEffect, useRef } from 'react';
import { GUI } from 'lil-gui';

export const ShowcaseGUI = ({ sceneRef }) => {
  const containerRef = useRef();
  const guiRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !sceneRef?.current) return;

    // Wait for refs to be populated inside Canvas
    const timer = setTimeout(() => {
      const {
        modelRef,
        ambientLightRef,
        dirLight1Ref,
        dirLight2Ref,
        dirLight3Ref,
      } = sceneRef.current;

      if (!modelRef?.current?.current) return;

      if (guiRef.current) {
        guiRef.current.destroy();
      }

      const gui = new GUI({ container: containerRef.current, width: 260 });
      guiRef.current = gui;
      gui.title('Controls');

      // --- Model color ---
      const materials = [];
      modelRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          const mats = Array.isArray(child.material) ? child.material : [child.material];
          materials.push(...mats);
        }
      });

      if (materials.length > 0) {
        const modelFolder = gui.addFolder('Model');
        const colorProxy = {
          color: materials[0].color ? `#${materials[0].color.getHexString()}` : '#ffffff',
          metalness: materials[0].metalness ?? 0,
          roughness: materials[0].roughness ?? 1,
        };

        modelFolder.addColor(colorProxy, 'color').name('Color').onChange((v) => {
          materials.forEach((m) => m.color?.set(v));
        });
        modelFolder.add(colorProxy, 'metalness', 0, 1, 0.01).name('Metalness').onChange((v) => {
          materials.forEach((m) => { if (m.metalness !== undefined) m.metalness = v; });
        });
        modelFolder.add(colorProxy, 'roughness', 0, 1, 0.01).name('Roughness').onChange((v) => {
          materials.forEach((m) => { if (m.roughness !== undefined) m.roughness = v; });
        });
      }

      // --- Lights ---
      const lightsFolder = gui.addFolder('Lights');

      if (ambientLightRef?.current) {
        const af = lightsFolder.addFolder('Ambient');
        af.add(ambientLightRef.current, 'intensity', 0, 3, 0.01).name('Intensity');
      }

      if (dirLight1Ref?.current) {
        const d1 = lightsFolder.addFolder('Key Light');
        d1.add(dirLight1Ref.current, 'intensity', 0, 4, 0.01).name('Intensity');
        d1.add(dirLight1Ref.current.position, 'x', -10, 10, 0.1).name('X');
        d1.add(dirLight1Ref.current.position, 'y', -10, 10, 0.1).name('Y');
        d1.add(dirLight1Ref.current.position, 'z', -10, 10, 0.1).name('Z');
        const d1Color = { color: `#${dirLight1Ref.current.color.getHexString()}` };
        d1.addColor(d1Color, 'color').name('Color').onChange((v) => {
          dirLight1Ref.current.color.set(v);
        });
      }

      if (dirLight2Ref?.current) {
        const d2 = lightsFolder.addFolder('Fill Light');
        d2.add(dirLight2Ref.current, 'intensity', 0, 4, 0.01).name('Intensity');
        d2.add(dirLight2Ref.current.position, 'x', -10, 10, 0.1).name('X');
        d2.add(dirLight2Ref.current.position, 'y', -10, 10, 0.1).name('Y');
        d2.add(dirLight2Ref.current.position, 'z', -10, 10, 0.1).name('Z');
        const d2Color = { color: `#${dirLight2Ref.current.color.getHexString()}` };
        d2.addColor(d2Color, 'color').name('Color').onChange((v) => {
          dirLight2Ref.current.color.set(v);
        });
      }

      if (dirLight3Ref?.current) {
        const d3 = lightsFolder.addFolder('Rim Light');
        d3.add(dirLight3Ref.current, 'intensity', 0, 4, 0.01).name('Intensity');
        d3.add(dirLight3Ref.current.position, 'x', -10, 10, 0.1).name('X');
        d3.add(dirLight3Ref.current.position, 'y', -10, 10, 0.1).name('Y');
        d3.add(dirLight3Ref.current.position, 'z', -10, 10, 0.1).name('Z');
        const d3Color = { color: `#${dirLight3Ref.current.color.getHexString()}` };
        d3.addColor(d3Color, 'color').name('Color').onChange((v) => {
          dirLight3Ref.current.color.set(v);
        });
      }

      // Style overrides for dark theme
      const root = gui.domElement;
      root.style.position = 'relative';
      root.style.top = '0';
      root.style.right = '0';
    }, 500);

    return () => {
      clearTimeout(timer);
      if (guiRef.current) {
        guiRef.current.destroy();
        guiRef.current = null;
      }
    };
  }, [sceneRef]);

  return <div ref={containerRef} />;
};
