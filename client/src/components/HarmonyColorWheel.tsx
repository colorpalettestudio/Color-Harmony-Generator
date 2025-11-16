import { useEffect, useRef } from 'react';
import chroma from 'chroma-js';
import type { HarmonyType } from './HarmonySelector';
import { getHarmonyHues } from '@/lib/colorHarmony';

interface HarmonyColorWheelProps {
  baseColor: string;
  harmonyType: HarmonyType;
  size?: number;
}

export default function HarmonyColorWheel({ baseColor, harmonyType, size = 120 }: HarmonyColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const center = size / 2;
  const radius = (size - 20) / 2;

  useEffect(() => {
    drawColorWheel();
  }, [baseColor, harmonyType, size]);

  const drawColorWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);

    // Draw color wheel with smooth gradient
    const imageData = ctx.createImageData(size, size);
    const data = imageData.data;
    
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        const dx = x - center;
        const dy = y - center;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= radius) {
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          const hue = (angle + 360) % 360;
          const saturation = distance / radius;
          const lightnessDecimal = 0.5; // Fixed lightness for preview
          
          const color = chroma.hsl(hue, saturation, lightnessDecimal);
          const [r, g, b] = color.rgb();
          
          const index = (y * size + x) * 4;
          data[index] = r;     // Red
          data[index + 1] = g; // Green
          data[index + 2] = b; // Blue
          data[index + 3] = 255; // Alpha
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);

    // Get harmony hues for this type
    const harmonyHues = getHarmonyHues(baseColor, harmonyType);

    // Draw markers for each harmony color
    harmonyHues.forEach((hue) => {
      const angle = (hue * Math.PI) / 180;
      const markerRadius = radius * 0.85; // Place markers near the edge
      const x = center + markerRadius * Math.cos(angle);
      const y = center + markerRadius * Math.sin(angle);
      
      // Outer ring (white)
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, 2 * Math.PI);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Inner circle (black border + color fill)
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, 2 * Math.PI);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.stroke();
      const markerColor = chroma.hsl(hue, 0.85, 0.5).hex();
      ctx.fillStyle = markerColor;
      ctx.fill();
    });
  };

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="rounded-md"
      data-testid="harmony-color-wheel"
    />
  );
}
