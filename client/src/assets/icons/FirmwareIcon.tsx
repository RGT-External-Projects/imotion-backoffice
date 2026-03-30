import * as React from 'react';
import type { IconProps } from './types';

/**
 * Firmware/list icon extracted from the SVG you provided.
 *
 * Usage:
 *   <FirmwareIcon />
 *   <FirmwareIcon size={16} color="black" />
 */
const FirmwareIcon: React.FC<IconProps> = ({
  size = 16,
  color = 'currentColor',
  className,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M14 3H5V4H14V3Z" fill={color} />
    <path d="M14 12H5V13H14V12Z" fill={color} />
    <path d="M14 7.5H5V8.5H14V7.5Z" fill={color} />
    <path d="M3 7.5H2V8.5H3V7.5Z" fill={color} />
    <path d="M3 3H2V4H3V3Z" fill={color} />
    <path d="M3 12H2V13H3V12Z" fill={color} />
  </svg>
);

export default FirmwareIcon;
