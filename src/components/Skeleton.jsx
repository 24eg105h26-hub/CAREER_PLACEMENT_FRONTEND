import React from 'react';

export const Skeleton = ({ height = '20px', width = '100%', borderRadius = 'var(--radius-md, 6px)', style = {} }) => {
  return (
    <div
      style={{
        height,
        width,
        borderRadius,
        backgroundColor: 'var(--bg-subtle)',
        animation: 'pulse 1.5s ease-in-out infinite',
        ...style,
      }}
    />
  );
};

export default Skeleton;
