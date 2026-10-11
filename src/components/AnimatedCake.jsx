import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import './AnimatedCake.css';

export default function AnimatedCake({
  blows = 0,
  onBlow,
  recipientName = 'Sofi'
}) {
  const [animKey, setAnimKey] = useState(0);
  const isLit = blows < 3;

  const handleReplay = (e) => {
    e.stopPropagation();
    setAnimKey((prev) => prev + 1);
  };

  return (
    <div className="cake-scene animated" key={animKey}>
      <motion.div
        className="cake-card"
        onClick={onBlow}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className="cake-card-ambient" />

        {/* Cake Assembly Stage */}
        <div className="cake-stage">
          {/* Candle & Flame - Firmly planted directly on top of cake */}
          <div className="candle-wrapper">
            <div className="flame-container">
              <AnimatePresence>
                {isLit ? (
                  <motion.div
                    key="flame"
                    className="flame lit"
                    animate={{
                      scale: blows === 1 ? 0.75 : blows === 2 ? 0.45 : 1,
                      opacity: blows === 2 ? 0.7 : 1
                    }}
                    transition={{ duration: 0.2 }}
                  />
                ) : (
                  <div key="smoke" className="smoke-puff" />
                )}
              </AnimatePresence>
            </div>
            <div className="candle-wick" />
            <div className="candle" />
          </div>

          {/* Cake Tower: Layer 3 (with Frosting) -> Cream 2 -> Layer 2 -> Cream 1 -> Layer 1 */}
          <div className="cake-tower">
            {/* Layer 3 (Top Sponge) with White Drip Frosting */}
            <div className="cake-layer layer-3">
              <div className="cake-frosting">
                <div className="frosting-drips">
                  <span className="drip drip-1" />
                  <span className="drip drip-2" />
                  <span className="drip drip-3" />
                  <span className="drip drip-4" />
                  <span className="drip drip-5" />
                  <span className="drip drip-6" />
                  <span className="drip drip-7" />
                  <span className="drip drip-8" />
                  <span className="drip drip-9" />
                </div>
              </div>
            </div>

            {/* Cream Filling 2 */}
            <div className="cake-cream cream-2" />

            {/* Layer 2 (Middle Sponge) */}
            <div className="cake-layer layer-2" />

            {/* Cream Filling 1 */}
            <div className="cake-cream cream-1" />

            {/* Layer 1 (Bottom Sponge) */}
            <div className="cake-layer layer-1" />
          </div>

          {/* Plate / Base at Bottom */}
          <div className="cake-plate" />
        </div>

        {/* Wishes text below cake */}
        <div className="cake-wishes">
          <h2 className="cake-title">happy birthday!</h2>
          <p className="cake-name">{recipientName} ✨</p>
        </div>
      </motion.div>

      {/* Replay Button to re-watch the drop animation */}
      <div className="cake-controls">
        <button
          type="button"
          className="btn-replay"
          onClick={handleReplay}
          title="Tonton animasi kue tersusun lagi"
        >
          <RotateCcw size={13} />
          Ulangi Animasi Kue
        </button>
      </div>
    </div>
  );
}
