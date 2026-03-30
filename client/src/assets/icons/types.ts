export interface IconProps {
  /**
   * Icon size in pixels. Applied to both width and height.
   * Defaults to 20.
   */
  size?: number;

  /**
   * Icon color. Applied to SVG fill.
   * Defaults to `currentColor` so you can also control it via CSS.
   */
  color?: string;

  /**
   * Optional additional CSS classes.
   */
  className?: string;
}
