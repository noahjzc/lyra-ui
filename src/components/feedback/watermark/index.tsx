import * as React from 'react';
import { cn } from '../../../internal/cn';

export interface WatermarkProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  color?: string;
  content?: string | string[];
  fontSize?: number;
  fullPage?: boolean;
  gap?: [number, number];
  opacity?: number;
  rotate?: number;
  zIndex?: number;
}

function escapeSvgText(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function createWatermarkImage({
  color,
  content,
  fontSize,
  gap,
  rotate,
}: Required<
  Pick<WatermarkProps, 'color' | 'content' | 'fontSize' | 'gap' | 'rotate'>
>) {
  const [width, height] = gap;
  const lines = Array.isArray(content) ? content : [content];
  const lineHeight = fontSize + 6;
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  const text = lines
    .map(
      (line, index) =>
        `<text x="50%" y="${startY + index * lineHeight}" text-anchor="middle" dominant-baseline="middle">${escapeSvgText(line)}</text>`,
    )
    .join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><g transform="rotate(${rotate} ${width / 2} ${height / 2})" fill="${color}" font-family="Inter, Arial, sans-serif" font-size="${fontSize}" font-weight="700">${text}</g></svg>`;

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function Watermark({
  children,
  className,
  color = 'var(--ui-watermark-foreground)',
  content = 'lyra-ui',
  fontSize = 14,
  fullPage = false,
  gap = [180, 120],
  opacity = 0.08,
  rotate = -24,
  style,
  zIndex = 10,
  ...props
}: WatermarkProps) {
  const backgroundImage = React.useMemo(
    () =>
      createWatermarkImage({
        color,
        content,
        fontSize,
        gap,
        rotate,
      }),
    [color, content, fontSize, gap, rotate],
  );
  const [gapX, gapY] = gap;
  const contentText = Array.isArray(content) ? content.join(' ') : content;

  return (
    <div
      className={cn(
        'relative min-w-0',
        fullPage && 'pointer-events-none fixed inset-0',
        className,
      )}
      data-slot="watermark"
      style={style}
      {...props}
    >
      {fullPage && children ? (
        <div className="pointer-events-auto" data-slot="watermark-children">
          {children}
        </div>
      ) : (
        children
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 select-none overflow-hidden"
        data-content={contentText}
        data-slot="watermark-layer"
        style={{
          backgroundImage,
          backgroundRepeat: 'repeat',
          backgroundSize: `${gapX}px ${gapY}px`,
          opacity,
          zIndex,
        }}
      >
        <span
          className="sr-only"
          data-slot="watermark-content"
          style={{
            color,
            fontSize,
            transform: `rotate(${rotate}deg)`,
          }}
        >
          {contentText}
        </span>
      </div>
    </div>
  );
}
