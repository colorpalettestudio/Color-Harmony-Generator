import { useState } from 'react';
import ColorWheel from '@/components/ColorWheel';
import HarmonySelector, { type HarmonyType } from '@/components/HarmonySelector';
import ColorInput from '@/components/ColorInput';
import PaletteDisplay from '@/components/PaletteDisplay';
import EyedropperTool from '@/components/EyedropperTool';
import ThemeToggle from '@/components/ThemeToggle';
import { generateHarmonyColors } from '@/lib/colorHarmony';
import { Palette } from 'lucide-react';

export default function Home() {
  const [selectedColor, setSelectedColor] = useState('#ff6b6b');
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType>('triadic');

  const generatedColors = generateHarmonyColors(selectedColor, selectedHarmony);

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    console.log('Base color changed to:', color);
  };

  const handleHarmonyChange = (harmony: HarmonyType) => {
    setSelectedHarmony(harmony);
    console.log('Harmony changed to:', harmony);
  };

  const getHarmonyTitle = (harmony: HarmonyType) => {
    const titles = {
      monochromatic: 'Monochromatic Palette',
      analogous: 'Analogous Harmony',
      complementary: 'Complementary Colors',
      triadic: 'Triadic Harmony',
      'split-complementary': 'Split Complementary',
      tetradic: 'Tetradic Square'
    };
    return titles[harmony];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Palette className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Palette Pro</h1>
                <p className="text-sm text-muted-foreground">Color Harmony Generator</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left Panel - Color Selection */}
          <div className="lg:col-span-2 space-y-8">
            {/* Color Wheel */}
            <div className="flex flex-col items-center space-y-6">
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Select Base Color</h2>
                <p className="text-sm text-muted-foreground">
                  Drag the picker or use the eyedropper tool
                </p>
              </div>
              <ColorWheel
                selectedColor={selectedColor}
                onColorChange={handleColorChange}
                size={320}
              />
            </div>

            {/* Color Input */}
            <div>
              <ColorInput
                value={selectedColor}
                onChange={handleColorChange}
              />
            </div>
          </div>

          {/* Right Panel - Harmony & Results */}
          <div className="lg:col-span-3 space-y-8">
            {/* Harmony Selector */}
            <div>
              <HarmonySelector
                selectedHarmony={selectedHarmony}
                onHarmonyChange={handleHarmonyChange}
              />
            </div>

            {/* Generated Palette */}
            <div>
              <PaletteDisplay
                colors={generatedColors}
                title={getHarmonyTitle(selectedHarmony)}
              />
            </div>

            {/* Instructions */}
            <div className="bg-muted/50 rounded-lg p-6">
              <h3 className="font-medium mb-3">How to Use</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Drag the picker on the color wheel to select your base color</li>
                <li>• Use the eyedropper tool to pick colors from your screen</li>
                <li>• Choose a harmony rule to generate complementary colors</li>
                <li>• Click any color in the palette to copy it to your clipboard</li>
                <li>• Switch between light and dark themes using the toggle</li>
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Eyedropper */}
      <EyedropperTool onColorPick={handleColorChange} />
    </div>
  );
}