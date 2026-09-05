'use client';

import React, { useState, useEffect } from 'react';
import { User as UserIcon } from 'lucide-react';
import './UserAvatar.scss';

export type UserAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'huge' | number;

export interface UserAvatarProps {
  src?: string | null;
  name?: string;
  size?: UserAvatarSize;
  className?: string;
  alt?: string;
}

export default function UserAvatar({
  src,
  name = '',
  size = 'md',
  className = '',
  alt,
}: UserAvatarProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const displayName = name.trim();
  const initialChar = displayName ? displayName.charAt(0) : '';
  const altText = alt || displayName || '프로필';

  const sizeStyle: React.CSSProperties = typeof size === 'number'
    ? { width: `${size}px`, height: `${size}px`, minWidth: `${size}px`, fontSize: `${Math.max(11, Math.round(size * 0.4))}px` }
    : {};

  const sizeClass = typeof size === 'string' ? `size-${size}` : 'size-custom';

  return (
    <div
      className={`user-avatar-comp ${sizeClass} ${className}`.trim()}
      style={sizeStyle}
      aria-label={altText}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={altText}
          className="user-avatar-img"
          onError={() => setHasError(true)}
        />
      ) : initialChar ? (
        <span className="user-avatar-initial">{initialChar}</span>
      ) : (
        <UserIcon className="user-avatar-icon" />
      )}
    </div>
  );
}
