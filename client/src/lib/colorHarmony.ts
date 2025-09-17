import chroma from 'chroma-js';
import type { HarmonyType } from '@/components/HarmonySelector';

export function generateHarmonyColors(baseColor: string, harmonyType: HarmonyType): string[] {
  try {
    const color = chroma(baseColor);
    const [h, s, l] = color.hsl();
    const hue = isNaN(h) ? 0 : h;
    const saturation = isNaN(s) ? 0.5 : s;
    const lightness = isNaN(l) ? 0.5 : l;

    switch (harmonyType) {
      case 'monochromatic':
        return generateMonochromatic(hue, saturation, lightness);
      
      case 'analogous':
        return generateAnalogous(hue, saturation, lightness);
      
      case 'complementary':
        return generateComplementary(hue, saturation, lightness);
      
      case 'triadic':
        return generateTriadic(hue, saturation, lightness);
      
      case 'split-complementary':
        return generateSplitComplementary(hue, saturation, lightness);
      
      case 'tetradic':
        return generateTetradic(hue, saturation, lightness);
      
      default:
        return [baseColor];
    }
  } catch {
    return [baseColor];
  }
}

function generateMonochromatic(h: number, s: number, l: number): string[] {
  return [
    chroma.hsl(h, s, l).hex(), // Base
    chroma.hsl(h, s * 0.7, l * 1.2).hex(), // Lighter
    chroma.hsl(h, s * 1.1, l * 0.8).hex(), // Darker
    chroma.hsl(h, s * 0.5, l * 1.4).hex(), // Much lighter
    chroma.hsl(h, s * 1.3, l * 0.6).hex(), // Much darker
  ].map(clampColor);
}

function generateAnalogous(h: number, s: number, l: number): string[] {
  return [
    chroma.hsl(h, s, l).hex(), // Base
    chroma.hsl((h + 30) % 360, s, l).hex(), // +30°
    chroma.hsl((h - 30 + 360) % 360, s, l).hex(), // -30°
    chroma.hsl((h + 60) % 360, s * 0.8, l).hex(), // +60°
    chroma.hsl((h - 60 + 360) % 360, s * 0.8, l).hex(), // -60°
  ].map(clampColor);
}

function generateComplementary(h: number, s: number, l: number): string[] {
  const complementaryHue = (h + 180) % 360;
  return [
    chroma.hsl(h, s, l).hex(), // Base
    chroma.hsl(complementaryHue, s, l).hex(), // Complement
    chroma.hsl(h, s * 0.6, l * 1.2).hex(), // Base lighter
    chroma.hsl(complementaryHue, s * 0.6, l * 1.2).hex(), // Complement lighter
    chroma.hsl(h, s * 1.2, l * 0.8).hex(), // Base darker
  ].map(clampColor);
}

function generateTriadic(h: number, s: number, l: number): string[] {
  return [
    chroma.hsl(h, s, l).hex(), // Base
    chroma.hsl((h + 120) % 360, s, l).hex(), // +120°
    chroma.hsl((h + 240) % 360, s, l).hex(), // +240°
    chroma.hsl(h, s * 0.7, l * 1.1).hex(), // Base variation
    chroma.hsl((h + 120) % 360, s * 0.7, l * 1.1).hex(), // +120° variation
  ].map(clampColor);
}

function generateSplitComplementary(h: number, s: number, l: number): string[] {
  const complementaryHue = (h + 180) % 360;
  return [
    chroma.hsl(h, s, l).hex(), // Base
    chroma.hsl((complementaryHue + 30) % 360, s, l).hex(), // Complement +30°
    chroma.hsl((complementaryHue - 30 + 360) % 360, s, l).hex(), // Complement -30°
    chroma.hsl(h, s * 0.8, l * 1.1).hex(), // Base lighter
    chroma.hsl(h, s * 1.2, l * 0.9).hex(), // Base darker
  ].map(clampColor);
}

function generateTetradic(h: number, s: number, l: number): string[] {
  return [
    chroma.hsl(h, s, l).hex(), // Base
    chroma.hsl((h + 90) % 360, s, l).hex(), // +90°
    chroma.hsl((h + 180) % 360, s, l).hex(), // +180°
    chroma.hsl((h + 270) % 360, s, l).hex(), // +270°
    chroma.hsl(h, s * 0.6, l * 1.2).hex(), // Base lighter
  ].map(clampColor);
}

function clampColor(color: string): string {
  try {
    // Ensure color is valid and within bounds
    const c = chroma(color);
    const [h, s, l] = c.hsl();
    return chroma.hsl(
      isNaN(h) ? 0 : h,
      Math.max(0, Math.min(1, isNaN(s) ? 0 : s)),
      Math.max(0.1, Math.min(0.9, isNaN(l) ? 0.5 : l))
    ).hex();
  } catch {
    return color;
  }
}