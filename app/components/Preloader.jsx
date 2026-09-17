// app/components/Preloader.jsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && sessionStorage.getItem('portfolio_loaded')) {
      setIsLoading(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsLoading(false);
      try {
        sessionStorage.setItem('portfolio_loaded', 'true');
      } catch (e) {}
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            backgroundColor: '#050308',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: 'center' }}
          >
            {/* The Animated Ring Box */}
            <div style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 30px' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{
                  position: 'absolute', inset: 0,
                  border: '2px solid rgba(167, 139, 250, 0.25)',
                  borderRadius: '50%',
                  clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)'
                }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{
                  position: 'absolute', inset: 0,
                  border: '2px solid var(--teal)',
                  borderRadius: '50%',
                  clipPath: 'polygon(50% 50%, 100% 0, 100% 100%, 50% 100%)'
                }}
              />
              {/* Inner dot */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  position: 'absolute', top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '8px', height: '8px',
                  backgroundColor: 'var(--text)',
                  borderRadius: '50%',
                  boxShadow: '0 0 10px var(--text)'
                }}
              />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                fontFamily: "var(--font-heading)",
                color: 'var(--text)',
                fontSize: '1.25rem',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                fontWeight: 800,
                marginBottom: '10px'
              }}
            >
              Biswajit Panda
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{
                color: 'var(--primary)',
                letterSpacing: '2px',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                fontWeight: 600
              }}
            >
              Initializing Core Frameworks...
            </motion.p>

            {/* Loading Bar */}
            <div style={{
              width: '200px', height: '2px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              margin: '20px auto 0',
              overflow: 'hidden',
              borderRadius: '2px'
            }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
                style={{
                  height: '100%',
                  backgroundColor: 'var(--primary)',
                  boxShadow: '0 0 10px var(--primary)'
                }}
              />
            </div>
            
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
