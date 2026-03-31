import { RotateCcw, Box, RefreshCw, Grid3x3 } from 'lucide-react';
import styles from './ShowcaseControls.module.css';

export const ShowcaseControls = ({
  wireframe,
  autoRotate,
  showGrid,
  onToggleWireframe,
  onToggleAutoRotate,
  onToggleGrid,
  onResetCamera,
}) => {
  return (
    <div className={styles.controls}>
      <button
        className={styles.btn}
        onClick={onResetCamera}
        title="Reset camera"
      >
        <RotateCcw size={18} />
      </button>
      <button
        className={`${styles.btn} ${wireframe ? styles.active : ''}`}
        onClick={onToggleWireframe}
        title="Wireframe"
      >
        <Box size={18} />
      </button>
      <button
        className={`${styles.btn} ${autoRotate ? styles.active : ''}`}
        onClick={onToggleAutoRotate}
        title="Auto-rotate"
      >
        <RefreshCw size={18} />
      </button>
      <button
        className={`${styles.btn} ${showGrid ? styles.active : ''}`}
        onClick={onToggleGrid}
        title="Grid"
      >
        <Grid3x3 size={18} />
      </button>
    </div>
  );
};
