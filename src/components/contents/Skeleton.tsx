import React from 'react';
import './Skeleton.scss';

interface SkeletonProps {
  variant?: 'circle' | 'rect' | 'text';
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

const Skeleton = ({ 
  variant = 'rect', 
  width, 
  height, 
  borderRadius,
  className = '' 
}: SkeletonProps) => {
  const style: React.CSSProperties = {
    width: width,
    height: height,
    borderRadius: borderRadius,
  };

  return (
    <div 
      className={`skeleton-base skeleton-${variant} ${className}`} 
      style={style}
    />
  );
};

export default Skeleton;
