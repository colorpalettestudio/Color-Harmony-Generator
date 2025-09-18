import { useState, useEffect } from 'react';
import ColorWheel from '@/components/ColorWheel';
import HarmonySelector, { type HarmonyType } from '@/components/HarmonySelector';
import ColorInput from '@/components/ColorInput';
import PaletteDisplay from '@/components/PaletteDisplay';
import PaletteSizeControl from '@/components/PaletteSizeControl';
import LightnessControl from '@/components/LightnessControl';
import ThemeToggle from '@/components/ThemeToggle';
import { generateHarmonyColors, getHarmonyHues } from '@/lib/colorHarmony';
import { Palette } from 'lucide-react';
import chroma from 'chroma-js';

export default function Home() {
  const [selectedColor, setSelectedColor] = useState('#fc3649');
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType>('analogous');
  const [paletteSize, setPaletteSize] = useState(4); // Start with 4 for analogous
  const [colorLightness, setColorLightness] = useState(50); // 60% actual lightness (110-50=60)
  const [wheelSize, setWheelSize] = useState(240);

  // Handle responsive wheel sizing
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width < 640) {
          setWheelSize(240);
        } else if (width < 1024) {
          setWheelSize(280);
        } else {
          setWheelSize(320);
        }
      }
    };

    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Invert the lightness value so left (low values) = light colors and right (high values) = dark colors
  const actualLightness = 110 - colorLightness;
  
  // Apply lightness to the selected color
  const adjustedSelectedColor = (() => {
    try {
      const hsl = chroma(selectedColor).hsl();
      return chroma.hsl(hsl[0] || 0, hsl[1] || 0, actualLightness / 100).hex();
    } catch {
      return selectedColor;
    }
  })();
  
  // Generate colors with the current harmony
  const baseGeneratedColors = generateHarmonyColors(selectedColor, selectedHarmony, paletteSize);
  
  // For monochromatic palettes, apply lightness to color #1 but let others span the full range
  // For all other harmonies, apply lightness to ALL colors for consistency with the lightness slider
  const generatedColors = selectedHarmony === 'monochromatic' 
    ? baseGeneratedColors.map((color, index) => {
        // Apply lightness to color #1 for consistency, let others span full range
        if (index === 0) {
          try {
            const hsl = chroma(color).hsl();
            return chroma.hsl(hsl[0] || 0, hsl[1] || 0, actualLightness / 100).hex();
          } catch {
            return color;
          }
        }
        return color; // Colors #2-5 keep their original lightness for variety
      })
    : baseGeneratedColors.map(color => {
        try {
          const hsl = chroma(color).hsl();
          return chroma.hsl(hsl[0] || 0, hsl[1] || 0, actualLightness / 100).hex();
        } catch {
          return color;
        }
      });
  
  const harmonyHues = getHarmonyHues(selectedColor, selectedHarmony);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    
    // Update lightness control to match the inputted color's lightness
    try {
      const inputColor = chroma(color);
      const [, , l] = inputColor.hsl();
      const inputLightness = isNaN(l) ? 0.5 : l;
      // Convert lightness to slider value (invert because slider is inverted)
      const sliderValue = Math.round(110 - (inputLightness * 100));
      setColorLightness(sliderValue);
      console.log('Base color changed to:', color, 'lightness updated to:', Math.round(inputLightness * 100));
    } catch {
      console.log('Base color changed to:', color);
    }
  };

  const getDefaultPaletteSize = (harmony: HarmonyType): number => {
    switch (harmony) {
      case 'complementary':
        return 2; // Base color + complement
      case 'triadic':
        return 3; // 3 colors evenly spaced
      case 'rainbow':
        return 6; // Colors across entire spectrum
      case 'tetradic':
        return 4; // 4 colors forming square/rectangle
      case 'analogous':
        return 4; // Adjacent colors (3-5 typical)
      case 'monochromatic':
        return 5; // Variations of same hue
      default:
        return 4;
    }
  };

  const handleHarmonyChange = (harmony: HarmonyType) => {
    setSelectedHarmony(harmony);
    setPaletteSize(getDefaultPaletteSize(harmony));
    console.log('Harmony changed to:', harmony, 'with', getDefaultPaletteSize(harmony), 'colors');
  };

  const getHarmonyTitle = (harmony: HarmonyType) => {
    const titles = {
      monochromatic: 'Monochromatic Palette',
      analogous: 'Analogous Harmony',
      complementary: 'Complementary Colors',
      triadic: 'Triadic Harmony',
      rainbow: 'Rainbow Spectrum',
      tetradic: 'Tetradic Square'
    };
    return titles[harmony];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-lg">
                <span className="text-lg sm:text-2xl">🎨</span>
              </div>
              <div>
                <h1 className="text-xl sm:text-3xl font-semibold text-foreground">Color Harmony Generator</h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-8">
          {/* Mobile: Compact Color Wheel + Controls */}
          <div className="lg:col-span-2 space-y-4 lg:space-y-8">
            {/* Color Wheel */}
            <div className="flex flex-col items-center space-y-3 lg:space-y-6">
              <div className="text-center">
                <h2 className="text-base lg:text-lg font-semibold mb-1 lg:mb-2">Select Base Color</h2>
                <p className="text-xs lg:text-sm text-muted-foreground">
                  Drag the picker or use the eyedropper tool
                </p>
              </div>
              <ColorWheel
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
                size={wheelSize}
                harmonyHues={harmonyHues}
                lightness={selectedHarmony === 'monochromatic' ? (chroma(selectedColor).hsl()[2] || 0.5) * 100 : actualLightness}
              />
            </div>

            {/* Compact Controls Row on Mobile */}
            <div className="space-y-3 lg:space-y-6">
              <LightnessControl
                value={colorLightness}
                onChange={setColorLightness}
                displayValue={actualLightness}
              />
              <ColorInput
                value={adjustedSelectedColor}
                onChange={handleColorChange}
              />
            </div>
          </div>

          {/* Right Panel - Mobile: Show Palette First, Then Harmony Controls */}
          <div className="lg:col-span-3 space-y-4 lg:space-y-8 lg:order-last">
            {/* Generated Palette - Show Results First on Mobile */}
            <div>
              <PaletteDisplay
                colors={generatedColors}
                title={getHarmonyTitle(selectedHarmony)}
                paletteSize={paletteSize}
                onPaletteSizeChange={setPaletteSize}
                minSize={2}
                maxSize={8}
              />
            </div>

            {/* Harmony Selector - Controls Below Results on Mobile */}
            <div>
              <HarmonySelector
                selectedHarmony={selectedHarmony}
                onHarmonyChange={handleHarmonyChange}
              />
            </div>

            {/* Instructions - Hidden on Small Mobile, Compact on Larger */}
            <div className="hidden sm:block bg-muted/50 rounded-lg p-4 lg:p-6">
              <h3 className="font-medium mb-2 lg:mb-3">How to Use</h3>
              <ul className="space-y-1 lg:space-y-2 text-xs lg:text-sm text-muted-foreground">
                <li>• Drag the picker on the color wheel to select your base color</li>
                <li>• Adjust lightness to create pastels (light) or deep tones (dark)</li>
                <li>• Use the eyedropper tool to pick colors from your screen</li>
                <li>• Choose a harmony rule to generate complementary colors</li>
                <li>• Set your preferred palette size (2-8 colors)</li>
                <li>• Click any color in the palette to copy it to your clipboard</li>
                <li>• Switch between light and dark themes using the toggle</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}