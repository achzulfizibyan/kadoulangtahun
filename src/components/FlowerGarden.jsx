import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, ArrowLeft } from 'lucide-react';
import './FlowerGarden.css';

// 4 Romantic Floral Palettes: Pastel Pink, Lavender, Putih, Rose Gold
const FLOWER_PALETTES = [
  {
    type: 'sakura',
    name: 'Sakura Pink',
    petals: '#fbcfe8',
    petalsDeep: '#f472b6',
    center: '#fef08a',
    stem: '#86efac',
    leaf: '#bbf7d0',
    sparkle: '#fbcfe8',
  },
  {
    type: 'lavender',
    name: 'Lavender Blossom',
    petals: '#e9d5ff',
    petalsDeep: '#c084fc',
    center: '#fde047',
    stem: '#86efac',
    leaf: '#a7f3d0',
    sparkle: '#e9d5ff',
  },
  {
    type: 'whiteRose',
    name: 'White Camellia',
    petals: '#ffffff',
    petalsDeep: '#fdf2f8',
    center: '#e2a89f',
    stem: '#a3e635',
    leaf: '#bbf7d0',
    sparkle: '#ffffff',
  },
  {
    type: 'roseGold',
    name: 'Rose Gold Peony',
    petals: '#e2a89f',
    petalsDeep: '#b76e79',
    center: '#fef08a',
    stem: '#86efac',
    leaf: '#dcfce7',
    sparkle: '#e2a89f',
  },
];

export default function FlowerGarden({ onBack, recipientName = 'Sofi' }) {
  const [flowers, setFlowers] = useState([]);
  const containerRef = useRef(null);

  // Click or touch anywhere on the blank screen to bloom a flower
  const handleScreenClick = useCallback((e) => {
    // Avoid triggering if clicking on bottom control buttons
    if (e.target.closest('.garden-controls')) return;

    const rect = containerRef.current?.getBoundingClientRect();
    const x = e.clientX ?? e.touches?.[0]?.clientX ?? (rect ? rect.width / 2 : 200);
    const y = e.clientY ?? e.touches?.[0]?.clientY ?? (rect ? rect.height / 2 : 200);

    const palette = FLOWER_PALETTES[Math.floor(Math.random() * FLOWER_PALETTES.length)];
    const stemHeight = Math.floor(Math.random() * 50) + 110; // 110px to 160px
    const curveX = (Math.random() - 0.5) * 32;
    const rotation = (Math.random() - 0.5) * 26;
    const scale = Math.random() * 0.3 + 0.88;

    // Generate 8 sparkle coordinates radiating from click
    const sparkles = Array.from({ length: 8 }, (_, i) => {
      const angle = (i * Math.PI) / 4 + Math.random() * 0.4 - 0.2;
      const distance = Math.random() * 45 + 35;
      return {
        tx: Math.cos(angle) * distance,
        ty: Math.sin(angle) * distance,
        color: i % 2 === 0 ? palette.sparkle : '#ffffff',
        size: Math.random() * 4 + 3,
      };
    });

    const newFlower = {
      id: Date.now() + Math.random(),
      x,
      y,
      palette,
      stemHeight,
      curveX,
      rotation,
      scale,
      sparkles,
    };

    setFlowers((prev) => [...prev, newFlower]);
  }, []);

  const handleClear = (e) => {
    e.stopPropagation();
    setFlowers([]);
  };

  return (
    <div
      ref={containerRef}
      className="flower-garden-container"
      onClick={handleScreenClick}
      onTouchStart={handleScreenClick}
    >
      {/* Initial Hint (Fades out when first flower blooms) */}
      <div className={`garden-hint ${flowers.length > 0 ? 'hidden' : ''}`}>
        <h2 className="garden-hint-title">Sentuh di mana saja... 🌸</h2>
        <p className="garden-hint-sub">Setiap sentuhanmu akan menumbuhkan sekuntum bunga</p>
      </div>

      {/* Sweet Counter / Love Message at the top */}
      <AnimatePresence>
        {flowers.length > 0 && (
          <motion.div
            className="garden-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <div className="garden-badge">
              {flowers.length < 5 && `🌸 ${flowers.length} Bunga Mekar`}
              {flowers.length >= 5 && flowers.length < 12 && `✨ Taman Bunga Untuk ${recipientName}`}
              {flowers.length >= 12 && `💐 Setiap Bunga Mekar Khusus Untukmu, ${recipientName} ❤️`}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render All Bloomed Flowers */}
      {flowers.map((fl) => (
        <div
          key={fl.id}
          className="flower-item"
          style={{
            left: `${fl.x}px`,
            top: `${fl.y}px`,
            transform: `translate(-60px, -50px) scale(${fl.scale}) rotate(${fl.rotation}deg)`,
            transformOrigin: '60px 50px',
          }}
        >
          {/* Sparkles Burst Centered on Blossom Head */}
          <div style={{ position: 'absolute', top: 50, left: 60 }}>
            {fl.sparkles.map((sp, idx) => (
              <span
                key={idx}
                className="sparkle-particle"
                style={{
                  '--tx': `${sp.tx}px`,
                  '--ty': `${sp.ty}px`,
                  background: sp.color,
                  width: `${sp.size}px`,
                  height: `${sp.size}px`,
                  boxShadow: `0 0 10px ${sp.color}`,
                }}
              />
            ))}
          </div>

          {/* Flower SVG: Stem, Leaves, Calyx, and Perfectly Anchored Blossom */}
          <svg
            width="120"
            height={fl.stemHeight + 70}
            viewBox={`0 0 120 ${fl.stemHeight + 70}`}
            style={{ overflow: 'visible' }}
          >
            {/* Curved Stem: Grows up from bottom to (60, 50) */}
            <path
              d={`M 60 ${fl.stemHeight + 50} Q ${60 + fl.curveX} ${fl.stemHeight / 2 + 50} 60 50`}
              fill="none"
              stroke={fl.palette.stem}
              strokeWidth="4"
              strokeLinecap="round"
              className="flower-stem"
            />

            {/* Left Leaf firmly anchored to stem */}
            <g transform={`translate(${60 + fl.curveX * 0.45}, ${fl.stemHeight * 0.6 + 50})`}>
              <g className="flower-leaf" style={{ animationDelay: '0.2s' }}>
                <path
                  d="M 0 0 C -15 -6 -24 4 -28 14 C -19 20 -7 14 0 0"
                  fill={fl.palette.leaf}
                  stroke={fl.palette.stem}
                  strokeWidth="0.8"
                />
              </g>
            </g>

            {/* Right Leaf firmly anchored to stem */}
            <g transform={`translate(${60 + fl.curveX * 0.65}, ${fl.stemHeight * 0.35 + 50})`}>
              <g className="flower-leaf" style={{ animationDelay: '0.3s' }}>
                <path
                  d="M 0 0 C 15 -6 24 4 28 14 C 19 20 7 14 0 0"
                  fill={fl.palette.leaf}
                  stroke={fl.palette.stem}
                  strokeWidth="0.8"
                />
              </g>
            </g>

            {/* Receptacle / Calyx: Joins stem directly to the petals */}
            <g transform="translate(60, 50)">
              <path
                d="M -7 1 Q 0 8 7 1 Q 4 11 0 13 Q -4 11 -7 1"
                fill={fl.palette.stem}
              />
            </g>

            {/* Flower Blossom Head: Permanently anchored at (60, 50) */}
            <g transform="translate(60, 50)">
              <g className="flower-blossom">
                {/* Outer Petals with soft petal notch */}
                {[0, 60, 120, 180, 240, 300].map((deg, i) => (
                  <path
                    key={i}
                    d="M 0 0 C -12 -18, -16 -28, -6 -34 C -1 -31, 1 -31, 6 -34 C 16 -28, 12 -18, 0 0"
                    fill={fl.palette.petals}
                    stroke={fl.palette.petalsDeep}
                    strokeWidth="1"
                    transform={`rotate(${deg})`}
                    style={{
                      filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.1))',
                    }}
                  />
                ))}

                {/* Inner Petals Layer for Rich Floral Texture */}
                {[30, 90, 150, 210, 270, 330].map((deg, i) => (
                  <path
                    key={`inner-${i}`}
                    d="M 0 0 C -8 -14, -10 -22, 0 -25 C 10 -22, 8 -14, 0 0"
                    fill={fl.palette.petalsDeep}
                    opacity="0.9"
                    transform={`rotate(${deg}) scale(0.85)`}
                  />
                ))}

                {/* Pistil Center / Golden Pollen Glow */}
                <circle
                  cx="0"
                  cy="0"
                  r="9"
                  fill={fl.palette.center}
                  style={{
                    filter: 'drop-shadow(0 0 6px rgba(254, 240, 138, 0.9))',
                  }}
                />
                <circle cx="0" cy="0" r="5" fill="#f59e0b" opacity="0.65" />
              </g>
            </g>
          </svg>
        </div>
      ))}

      {/* Floating Bottom Navigation Controls */}
      <div className="garden-controls">
        {onBack && (
          <button
            type="button"
            className="garden-btn"
            onClick={(e) => {
              e.stopPropagation();
              onBack();
            }}
          >
            <ArrowLeft size={15} />
            Kembali ke Surat 💌
          </button>
        )}

        {flowers.length > 0 && (
          <button
            type="button"
            className="garden-btn"
            onClick={handleClear}
          >
            <RotateCcw size={15} />
            Tanam Ulang 🌸
          </button>
        )}
      </div>
    </div>
  );
}
