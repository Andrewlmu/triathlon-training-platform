'use client';

import React from 'react';
import { LabelLegendProps } from '../types';

/**
 * LabelLegend Component
 * 
 * Displays a legend for all training intensity labels used in the week
 * Shows color swatches with label names
 * 
 * @param labels - Array of label objects with name and color
 */
const LabelLegend: React.FC<LabelLegendProps> = ({ labels }) => {
  if (labels.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-2 pt-1 flex flex-wrap gap-2">
      {labels.map((item, index) => (
        <div key={index} className="flex items-center gap-1 text-xs">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: item.color }}
          ></div>
          <span className="text-[#A0A0A0]">{item.name}</span>
        </div>
      ))}
    </div>
  );
};

export default LabelLegend;