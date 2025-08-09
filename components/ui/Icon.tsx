import React from 'react';
import * as icons from 'lucide-react';

interface IconProps extends icons.LucideProps {
  name: string;
}

const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = (icons as any)[name];

  if (!LucideIcon) {
    // Return a default icon or null if the icon name is not found
    return <icons.HelpCircle {...props} />;
  }

  return <LucideIcon {...props} />;
};

export default Icon;
