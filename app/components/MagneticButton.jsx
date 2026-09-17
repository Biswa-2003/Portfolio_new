'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';

export default function MagneticButton({ children, className, style = {}, onClick = () => {}, href }) {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // Move the element towards the mouse by 30% of the distance
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const Wrapper = href ? motion.a : motion.button;

  const isExternal = Boolean(href && !href.startsWith('#'));

  return (
    <Wrapper
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
      style={{ ...style, cursor: 'none' }} // Ensure custom cursor takes over
    >
      {/* We uniquely offset the children for an even cooler 3D parallax feel */}
      <motion.div
        animate={{ x: position.x * 0.3, y: position.y * 0.3 }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      >
        {children}
      </motion.div>
    </Wrapper>
  );
}
