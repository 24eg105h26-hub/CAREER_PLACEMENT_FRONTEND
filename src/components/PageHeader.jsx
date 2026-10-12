import React from 'react';

export const PageHeader = ({ title, description, actions }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '8px' }}>
      <div>
        <h2 style={{ margin: 0 }}>{title}</h2>
        {description && <p className="text-sm text-muted" style={{ margin: '4px 0 0' }}>{description}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>{actions}</div>}
    </div>
  );
};

export default PageHeader;
