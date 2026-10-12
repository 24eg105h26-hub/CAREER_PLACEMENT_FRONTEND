import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

export const Badge = ({ children, variant = 'default', className = '' }) => {
  return <span className={`badge badge-${variant} ${className}`}>{children}</span>;
};

export const SkillBadge = ({ skill, matched = true, preferred = false }) => {
  const variantClass = matched
    ? 'skill-badge-matched'
    : preferred
    ? 'skill-badge-preferred'
    : 'skill-badge-missing';

  return (
    <span className={`skill-badge ${variantClass}`}>
      {matched ? <Check size={12} /> : <AlertCircle size={12} />}
      {typeof skill === 'string' ? skill : skill.name}
    </span>
  );
};

export default Badge;
