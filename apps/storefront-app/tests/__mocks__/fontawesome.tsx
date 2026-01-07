import React from 'react';

// Mock FontAwesomeIcon component
export const FontAwesomeIcon: React.FC<{
  icon: any;
  className?: string;
  size?: string;
  onClick?: () => void;
}> = ({ icon, className, onClick }) => (
  <span
    data-testid="mock-icon"
    className={className}
    data-icon={icon?.iconName || 'unknown'}
    onClick={onClick}
  />
);

export default { FontAwesomeIcon };
