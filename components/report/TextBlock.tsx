
import React from 'react';
import { TextBlockData } from '@/types';

const TextBlock: React.FC<TextBlockData> = ({ label, content }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{label}</h3>
      <div className="prose prose-slate max-w-none text-muted-foreground whitespace-pre-line">
          {content}
      </div>
    </div>
  );
};

export default TextBlock;