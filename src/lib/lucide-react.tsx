import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string };

function Icon({ size = 24, children, ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

function Shape(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="8" />
      <path d="M8 12h8" />
      <path d="M12 8v8" />
    </Icon>
  );
}

export const ArrowUpRight = Shape;
export const Code2 = Shape;
export const Gauge = Shape;
export const Github = Shape;
export const GithubIcon = Shape;
export const Layers3 = Shape;
export const Mail = Shape;
export const MousePointerClick = Shape;
export const Music2 = Shape;
export const Orbit = Shape;
export const Pause = Shape;
export const Play = Shape;
export const Sparkles = Shape;
export const Zap = Shape;
