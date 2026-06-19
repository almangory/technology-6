import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedIconProps {
  children: React.ReactNode;
  active?: boolean;
  type?: 'default' | 'spin' | 'bounce' | 'pulse' | 'float' | 'shake';
  className?: string;
}

export const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  children,
  active = false,
  type = 'default',
  className = ''
}) => {
  let animateOption = {};
  
  if (type === 'spin') {
    animateOption = { rotate: 360 };
  } else if (type === 'bounce') {
    animateOption = { y: [0, -5, 0] };
  } else if (type === 'pulse') {
    animateOption = { scale: [1, 1.12, 1] };
  } else if (type === 'float') {
    animateOption = { y: [0, -3, 0] };
  } else if (type === 'shake') {
    animateOption = { rotate: [0, -10, 10, -10, 10, 0] };
  } else {
    // default active triggers micro-scale and rotation
    animateOption = active ? { scale: [1, 1.1, 1], rotate: [0, 4, -4, 0] } : {};
  }

  const transitionOption = type === 'default' && !active 
    ? { type: 'spring', stiffness: 350, damping: 15 } 
    : {
        repeat: Infinity,
        duration: type === 'spin' ? 6 : type === 'bounce' ? 1.4 : type === 'pulse' ? 1.8 : type === 'float' ? 2.5 : type === 'shake' ? 1.2 : 2,
        ease: "easeInOut"
      };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.22, 
        rotate: type === 'spin' ? 45 : 8, 
        y: type === 'bounce' ? 0 : -2,
        transition: { type: 'spring', stiffness: 400, damping: 12 }
      }}
      whileTap={{ scale: 0.92 }}
      animate={animateOption}
      transition={transitionOption}
      className={`inline-flex items-center justify-center shrink-0 ${className}`}
    >
      {children}
    </motion.div>
  );
};
