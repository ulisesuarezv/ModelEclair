import { useState, useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { ShowcaseScene } from '../components/3d/ShowcaseScene';
import { ShowcaseControls } from '../components/3d/ShowcaseControls';
import { ShowcaseGUI } from '../components/3d/ShowcaseGUI';
import styles from './ModelShowcase.module.css';

const ModelShowcase = () => {
  const { t } = useTranslation();
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [metrics, setMetrics] = useState(null);

  const sceneRef = useRef();
  const pageRef = useRef();
  const titleRef = useRef();
  const subtitleRef = useRef();
  const dividerRef = useRef();
  const canvasAreaRef = useRef();
  const metricsRef = useRef();
  const bottomBarRef = useRef();
  const hintRef = useRef();
  const debugPanelRef = useRef();

  const handleMetrics = useCallback((data) => {
    setMetrics(data);
  }, []);

  // Entrance animation timeline
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // Initial states
    gsap.set([titleRef.current, subtitleRef.current, dividerRef.current], {
      opacity: 0,
      y: 20,
    });
    gsap.set(canvasAreaRef.current, { opacity: 0, scale: 0.95 });
    gsap.set(bottomBarRef.current, { opacity: 0 });
    gsap.set(debugPanelRef.current, { opacity: 0, x: 20 });

    // Sequence
    tl.to(titleRef.current, { opacity: 1, y: 0, duration: 0.8 }, 0.1);
    tl.to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.3);
    tl.to(dividerRef.current, { opacity: 1, y: 0, duration: 0.4 }, 0.4);
    tl.to(canvasAreaRef.current, { opacity: 1, scale: 1, duration: 0.8 }, 0.5);
    tl.to(bottomBarRef.current, { opacity: 1, duration: 0.4 }, 2.0);
    tl.to(debugPanelRef.current, { opacity: 1, x: 0, duration: 0.6 }, 1.8);

    return () => tl.kill();
  }, { scope: pageRef });

  // Metrics stagger animation
  useGSAP(() => {
    if (!metrics || !metricsRef.current) return;

    const rows = metricsRef.current.querySelectorAll('[data-metric]');
    gsap.set(rows, { opacity: 0, x: -10 });
    gsap.to(rows, {
      opacity: 1,
      x: 0,
      duration: 0.4,
      stagger: 0.06,
      ease: 'power3.out',
      delay: 1.5,
    });
  }, { dependencies: [metrics], scope: pageRef });

  // Hint auto-hide
  useGSAP(() => {
    if (!hintRef.current) return;
    gsap.set(hintRef.current, { opacity: 0 });
    gsap.to(hintRef.current, { opacity: 1, duration: 0.4, delay: 2.5 });
    gsap.to(hintRef.current, { opacity: 0, duration: 0.4, delay: 7.5 });
  }, { scope: pageRef });

  const formatNumber = (n) => n?.toLocaleString() ?? '—';

  const metricsData = [
    { label: 'TRI', value: formatNumber(metrics?.triangles) },
    { label: 'VTX', value: formatNumber(metrics?.vertices) },
    { label: 'MAT', value: String(metrics?.materials ?? '—') },
    { label: 'TEX', value: String(metrics?.textures ?? '—') },
    { label: 'FMT', value: 'glTF 2.0 (.glb)' },
    { label: 'SIZE', value: '11.2 MB' },
    {
      label: 'DIM',
      value: metrics
        ? `${metrics.dimensions.x} × ${metrics.dimensions.y} × ${metrics.dimensions.z}`
        : '—',
    },
  ];

  return (
    <div className={styles.page} ref={pageRef}>

      <div className={styles.sidebar}>
        <div className={styles.titleBlock}>
          <h1 className={styles.title} ref={titleRef}>
            {t('showcase.title', 'ECLAIR')}
          </h1>
          <div className={styles.divider} ref={dividerRef} />
          <p className={styles.subtitle} ref={subtitleRef}>
            {t('showcase.subtitle', 'MODEL SHOWCASE')}
          </p>
        </div>

        <div className={styles.metrics} ref={metricsRef}>
          {metricsData.map((m) => (
            <div key={m.label} className={styles.metricRow} data-metric>
              <span className={styles.metricLabel}>{m.label}</span>
              <span className={styles.metricValue}>{m.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.canvasArea} ref={canvasAreaRef}>
        <div className={styles.canvasWrapper}>
          <ShowcaseScene
            ref={sceneRef}
            wireframe={wireframe}
            autoRotate={autoRotate}
            showGrid={showGrid}
            onMetrics={handleMetrics}
            onModelReady={() => {}}
          />
        </div>
      </div>

      <div className={styles.debugPanel} ref={debugPanelRef}>
        <ShowcaseGUI sceneRef={sceneRef} />
      </div>

      <div className={styles.bottomBar} ref={bottomBarRef}>
        <span className={styles.hint} ref={hintRef}>
          {t('showcase.hint', 'Drag to rotate · Scroll to zoom · Right-click to pan')}
        </span>
        <ShowcaseControls
          wireframe={wireframe}
          autoRotate={autoRotate}
          showGrid={showGrid}
          onToggleWireframe={() => setWireframe((v) => !v)}
          onToggleAutoRotate={() => setAutoRotate((v) => !v)}
          onToggleGrid={() => setShowGrid((v) => !v)}
          onResetCamera={() => sceneRef.current?.resetCamera()}
        />
      </div>
    </div>
  );
};

export default ModelShowcase;
