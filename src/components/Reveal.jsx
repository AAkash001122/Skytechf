import { motion } from 'framer-motion';

/** Light scroll reveal. Reduced-motion is handled globally by <MotionConfig reducedMotion="user">. */
export default function Reveal({ children, delay = 0, className = '', as = 'div' }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
    >
      {children}
    </Tag>
  );
}
