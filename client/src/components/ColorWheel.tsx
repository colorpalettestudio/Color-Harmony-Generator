import { useEffect, useRef, useState } from 'react';
import chroma from 'chroma-js';

interface ColorWheelProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
  size?: number;
  harmonyHues?: number[];
  lightness?: number;
}

export default function ColorWheel({ selectedColor, onColorChange, size = 300, harmonyHues = [], lightness = 50 }: ColorWheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentHue, setCurrentHue] = useState(0);
  const [currentSaturation, setSaturation] = useState(100);

  const center = size / 2;
  const radius = (size - 40) / 2;

  useEffect(() => {
    try {
      const color = chroma(selectedColor);
      const [h, s] = color.hsl();
      setCurrentHue(isNaN(h) ? 0 : h);
      setSaturation(isNaN(s) ? 0 : s * 100);
    } catch {
      setCurrentHue(0);
      setSaturation(100);
    }
  }, [selectedColor]);

  useEffect(() => {
    drawColorWheel();
  }, [currentHue, currentSaturation, harmonyHues, lightness]);

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
          const lightnessDecimal = lightness / 100;
          
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

    // Draw harmony indicators (smaller circles)
    harmonyHues.forEach((hue, index) => {
      if (Math.abs(hue - currentHue) > 5) { // Don't draw if too close to main picker
        const angle = (hue * Math.PI) / 180;
        const indicatorRadius = (currentSaturation / 100) * radius;
        const x = center + indicatorRadius * Math.cos(angle);
        const y = center + indicatorRadius * Math.sin(angle);
        
        // Outer ring (white)
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Inner circle (black border + color fill)
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.stroke();
        const harmonyColor = chroma.hsl(hue, currentSaturation / 100, lightness / 100).hex();
        ctx.fillStyle = harmonyColor;
        ctx.fill();
      }
    });

    // Draw main picker handle (largest)
    const pickerAngle = (currentHue * Math.PI) / 180;
    const pickerRadius = (currentSaturation / 100) * radius;
    const pickerX = center + pickerRadius * Math.cos(pickerAngle);
    const pickerY = center + pickerRadius * Math.sin(pickerAngle);

    // Outer ring
    ctx.beginPath();
    ctx.arc(pickerX, pickerY, 12, 0, 2 * Math.PI);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner circle
    ctx.beginPath();
    ctx.arc(pickerX, pickerY, 8, 0, 2 * Math.PI);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = selectedColor;
    ctx.fill();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    updateColor(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    updateColor(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch event handlers for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && touch) {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setIsDragging(true);
      updateColor(x, y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    if (!isDragging) return;
    const touch = e.touches[0];
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect && touch) {
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      updateColor(x, y);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    setIsDragging(false);
  };

  const updateColor = (x: number, y: number) => {
    const dx = x - center;
    const dy = y - center;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > radius) return;

    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    const hue = (angle + 360) % 360;
    const saturation = Math.min((distance / radius) * 100, 100);

    setCurrentHue(hue);
    setSaturation(saturation);

    const newColor = chroma.hsl(hue, saturation / 100, lightness / 100).hex();
    onColorChange(newColor);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="rounded-full cursor-crosshair border-2 border-border shadow-lg"
          data-testid="color-wheel-canvas"
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
      <div className="text-center">
        <div className="text-sm text-muted-foreground">
          H: {Math.round(currentHue)}° S: {Math.round(currentSaturation)}%
        </div>
      </div>
    </div>
  );
}