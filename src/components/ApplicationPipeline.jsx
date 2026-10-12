import React from 'react';
import { Check, X } from 'lucide-react';

const STAGES = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'SELECTED'];

export const ApplicationPipeline = ({ status = 'APPLIED' }) => {
  const isRejected = status === 'REJECTED';
  const currentIndex = STAGES.indexOf(status);

  return (
    <div className="pipeline-container">
      {STAGES.map((stage, idx) => {
        const isCompleted = !isRejected && currentIndex > idx;
        const isActive = !isRejected && currentIndex === idx;

        return (
          <div
            key={stage}
            className={`pipeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
          >
            <div className="pipeline-circle">
              {isCompleted ? <Check size={16} /> : idx + 1}
            </div>
            <span className="pipeline-label">{stage}</span>
          </div>
        );
      })}
      {isRejected && (
        <div className="pipeline-step active">
          <div className="pipeline-circle" style={{ backgroundColor: 'var(--danger)', color: 'white', borderColor: 'var(--danger)' }}>
            <X size={16} />
          </div>
          <span className="pipeline-label" style={{ color: 'var(--danger)' }}>REJECTED</span>
        </div>
      )}
    </div>
  );
};

export default ApplicationPipeline;
