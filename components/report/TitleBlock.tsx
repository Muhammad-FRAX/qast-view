
import React from 'react';
import { TitleBlockData } from '@/types';

const TitleBlock: React.FC<TitleBlockData> = ({ level, content, author, date, logoSrc, logoAlt }) => {
  if (level === 'h1') {
    // Render as a full Report Header
    return (
      <div className="bg-secondary/30 p-6 rounded-lg border">
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground">{content}</h1>
            {author && <p className="text-md text-muted-foreground mt-2">By {author}</p>}
            {date && <p className="text-sm text-muted-foreground">Generated on {new Date(date).toLocaleDateString()}</p>}
          </div>
          {logoSrc && <img src={logoSrc} alt={logoAlt || 'Company Logo'} className="max-h-16 object-contain" />}
        </div>
      </div>
    );
  }

  // Render as a Section Title
  return (
    <div className="pb-2 border-b-2 border-primary/20">
      <h2 className="text-2xl font-semibold text-foreground">{content}</h2>
    </div>
  );
};

export default TitleBlock;