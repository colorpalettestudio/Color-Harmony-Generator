import chroma from 'chroma-js';
import type { HarmonyType } from '@/components/HarmonySelector';

export function generateHarmonyColors(baseColor: string, harmonyType: HarmonyType, count: number = 4): string[] {
  try {
    const color = chroma(baseColor);
    const [h, s, l] = color.hsl();
    const hue = isNaN(h) ? 0 : h;
    const saturation = isNaN(s) ? 0.5 : s;
    const lightness = isNaN(l) ? 0.5 : l;

    switch (harmonyType) {
      case 'monochromatic':
        return generateMonochromatic(hue, saturation, lightness, count);
      
      case 'analogous':
        return generateAnalogous(hue, saturation, lightness, count);
      
      case 'complementary':
        return generateComplementary(hue, saturation, lightness, count);
      
      case 'triadic':
        return generateTriadic(hue, saturation, lightness, count);
      
      case 'split-complementary':
        return generateSplitComplementary(hue, saturation, lightness, count);
      
      case 'tetradic':
        return generateTetradic(hue, saturation, lightness, count);
      
      default:
        return [baseColor];
    }
  } catch {
    return [baseColor];
  }
}

export function getHarmonyHues(baseColor: string, harmonyType: HarmonyType): number[] {
  try {
    const color = chroma(baseColor);
    const [h] = color.hsl();
    const hue = isNaN(h) ? 0 : h;

    switch (harmonyType) {
      case 'monochromatic':
        return [hue];
      
      case 'analogous':
        return [hue, (hue + 30) % 360, (hue - 30 + 360) % 360, (hue + 60) % 360];
      
      case 'complementary':
        return [hue, (hue + 180) % 360];
      
      case 'triadic':
        return [hue, (hue + 120) % 360, (hue + 240) % 360];
      
      case 'split-complementary':
        const complementaryHue = (hue + 180) % 360;
        return [hue, (complementaryHue + 30) % 360, (complementaryHue - 30 + 360) % 360];
      
      case 'tetradic':
        return [hue, (hue + 90) % 360, (hue + 180) % 360, (hue + 270) % 360];
      
      default:
        return [hue];
    }
  } catch {
    return [0];
  }
}

function generateMonochromatic(h: number, s: number, l: number, count: number): string[] {
  const colors = [];
  
  // Always start with the exact base color as #1
  colors.push(chroma.hsl(h, s, l).hex());
  
  // If we need more colors, generate variations
  if (count > 1) {
    // Create a range of lightness values excluding the base color's lightness
    const lightnessRange = [0.15, 0.35, 0.5, 0.7, 0.85]; // Dark to light spectrum
    const saturationRange = [0.8, 0.9, 1.0, 0.7, 0.5]; // Vary saturation for interest
    
    // Remove the lightness value closest to the base color to avoid duplicates
    const baseIndex = lightnessRange.reduce((closest, curr, idx) => 
      Math.abs(curr - l) < Math.abs(lightnessRange[closest] - l) ? idx : closest, 0);
    
    if (count <= 5) {
      // For 5 or fewer colors, use predefined good positions (excluding base)
      const availablePositions = lightnessRange.filter((_, idx) => idx !== baseIndex);
      const availableSaturations = saturationRange.filter((_, idx) => idx !== baseIndex);
      
      for (let i = 1; i < count && i - 1 < availablePositions.length; i++) {
        const adjustedSaturation = Math.min(1.0, s * availableSaturations[i - 1]);
        colors.push(chroma.hsl(h, adjustedSaturation, availablePositions[i - 1]).hex());
      }
    } else {
      // For more colors, distribute evenly across the lightness spectrum (excluding base)
      for (let i = 1; i < count; i++) {
        const lightnessFactor = i / count; // Adjust distribution
        const targetLightness = 0.15 + (lightnessFactor * 0.7);
        
        // Skip if too close to base lightness
        if (Math.abs(targetLightness - l) > 0.1) {
          const saturationVariation = 1.0 - (Math.abs(lightnessFactor - 0.5) * 0.3);
          const adjustedSaturation = Math.min(1.0, s * saturationVariation);
          colors.push(chroma.hsl(h, adjustedSaturation, targetLightness).hex());
        }
      }
    }
  }
  
  return colors.map(clampColor);
}

function generateAnalogous(h: number, s: number, l: number, count: number): string[] {
  const colors = [chroma.hsl(h, s, l).hex()]; // Base color
  const step = 30;
  
  for (let i = 1; i < count; i++) {
    const offset = Math.ceil(i / 2) * step * (i % 2 === 1 ? 1 : -1);
    const newHue = (h + offset + 360) % 360;
    colors.push(chroma.hsl(newHue, s * (1 - Math.abs(offset) / 180 * 0.2), l).hex());
  }
  
  return colors.map(clampColor);
}

function generateComplementary(h: number, s: number, l: number, count: number): string[] {
  const complementaryHue = (h + 180) % 360;
  const colors = [chroma.hsl(h, s, l).hex()]; // Base
  
  if (count > 1) {
    colors.push(chroma.hsl(complementaryHue, s, l).hex()); // Complement
  }
  
  for (let i = 2; i < count; i++) {
    const factor = (i - 1) / Math.max(1, count - 2);
    if (i % 2 === 0) {
      colors.push(chroma.hsl(h, s * (1 - factor * 0.3), l * (1 + factor * 0.3)).hex());
    } else {
      colors.push(chroma.hsl(complementaryHue, s * (1 - factor * 0.3), l * (1 + factor * 0.3)).hex());
    }
  }
  
  return colors.map(clampColor);
}

function generateTriadic(h: number, s: number, l: number, count: number): string[] {
  const hues = [h, (h + 120) % 360, (h + 240) % 360];
  const colors = [chroma.hsl(h, s, l).hex()]; // Base
  
  for (let i = 1; i < count; i++) {
    const hueIndex = i % 3;
    const variation = Math.floor((i - 1) / 3) * 0.2;
    const currentHue = hues[hueIndex];
    colors.push(chroma.hsl(currentHue, s * (1 - variation), l * (1 + variation * 0.3)).hex());
  }
  
  return colors.map(clampColor);
}

function generateSplitComplementary(h: number, s: number, l: number, count: number): string[] {
  const complementaryHue = (h + 180) % 360;
  const hues = [h, (complementaryHue + 30) % 360, (complementaryHue - 30 + 360) % 360];
  const colors = [chroma.hsl(h, s, l).hex()]; // Base
  
  for (let i = 1; i < count; i++) {
    const hueIndex = i % 3;
    const variation = Math.floor((i - 1) / 3) * 0.15;
    const currentHue = hues[hueIndex];
    colors.push(chroma.hsl(currentHue, s * (1 - variation), l * (1 + variation * 0.2)).hex());
  }
  
  return colors.map(clampColor);
}

function generateTetradic(h: number, s: number, l: number, count: number): string[] {
  const hues = [h, (h + 90) % 360, (h + 180) % 360, (h + 270) % 360];
  const colors = [chroma.hsl(h, s, l).hex()]; // Base
  
  for (let i = 1; i < count; i++) {
    const hueIndex = i % 4;
    const variation = Math.floor((i - 1) / 4) * 0.1;
    const currentHue = hues[hueIndex];
    colors.push(chroma.hsl(currentHue, s * (1 - variation), l * (1 + variation * 0.2)).hex());
  }
  
  return colors.map(clampColor);
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