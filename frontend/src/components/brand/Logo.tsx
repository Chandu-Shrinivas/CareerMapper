import React from 'react';

interface LogoProps {
  variant?: 'full' | 'mark';
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  imgClassName?: string;
  textClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  showText,
  size = 'md',
  className = '',
  imgClassName = '',
  textClassName = '',
}) => {
  const isMark = variant === 'mark';
  const renderText = showText !== undefined ? showText : !isMark;

  let imgSizeClass = 'h-8 w-auto';
  if (typeof size === 'string') {
    switch (size) {
      case 'sm':
        imgSizeClass = 'h-6 w-auto';
        break;
      case 'md':
        imgSizeClass = 'h-8 w-auto';
        break;
      case 'lg':
        imgSizeClass = 'h-10 w-auto';
        break;
      case 'xl':
        imgSizeClass = 'h-12 w-auto';
        break;
    }
  }

  const inlineStyle: React.CSSProperties =
    typeof size === 'number'
      ? { height: `${size}px`, maxHeight: `${size}px`, width: 'auto', objectFit: 'contain' }
      : { objectFit: 'contain' };

  return (
    <div className={`inline-flex items-center gap-2.5 shrink-0 max-h-full overflow-hidden ${className}`}>
      <img
        src="/careermapper-logo.svg"
        alt="CareerMapper Logo"
        className={`object-contain shrink-0 max-h-full max-w-full ${typeof size === 'string' ? imgSizeClass : ''} ${imgClassName}`}
        style={inlineStyle}
      />
      {renderText && (
        <span className={`font-display font-black tracking-widest uppercase select-none ${textClassName}`}>
          CareerMapper
        </span>
      )}
    </div>
  );
};

export default Logo;
