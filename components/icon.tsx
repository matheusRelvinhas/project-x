import { Icon as IconifyIcon } from '@iconify/react';

interface IconProps {
  name: string;
  className?: string;
}

const Icon = ({ name, className }: IconProps) => {
  return <IconifyIcon icon={name} className={className} />;
};

export default Icon;