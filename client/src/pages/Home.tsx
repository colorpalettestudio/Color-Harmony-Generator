import { useState, useEffect } from 'react';
import ColorWheel from '@/components/ColorWheel';
import HarmonySelector, { type HarmonyType } from '@/components/HarmonySelector';
import ColorInput from '@/components/ColorInput';
import PaletteDisplay from '@/components/PaletteDisplay';
import PaletteSizeControl from '@/components/PaletteSizeControl';
import LightnessControl from '@/components/LightnessControl';
import ThemeToggle from '@/components/ThemeToggle';
import ColorHarmonyGuide from '@/components/ColorHarmonyGuide';
import { generateHarmonyColors, getHarmonyHues } from '@/lib/colorHarmony';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import chroma from 'chroma-js';
import paletteFixerImage from '@assets/Color Palette FIXER Product Photos (3)_1763312614628.png';

export default function Home() {
  const [selectedColor, setSelectedColor] = useState('#fc3649');
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType>('analogous');
  const [paletteSize, setPaletteSize] = useState(4);
  const [colorLightness, setColorLightness] = useState(50);
  const [wheelSize, setWheelSize] = useState(240);

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

  const actualLightness = 110 - colorLightness;
  
  const adjustedSelectedColor = (() => {
    try {
      const hsl = chroma(selectedColor).hsl();
      return chroma.hsl(hsl[0] || 0, hsl[1] || 0, actualLightness / 100).hex();
    } catch {
      return selectedColor;
    }
  })();
  
  const baseGeneratedColors = generateHarmonyColors(selectedColor, selectedHarmony, paletteSize);
  
  const generatedColors = selectedHarmony === 'monochromatic' 
    ? baseGeneratedColors.map((color, index) => {
        if (index === 0) {
          try {
            const hsl = chroma(color).hsl();
            return chroma.hsl(hsl[0] || 0, hsl[1] || 0, actualLightness / 100).hex();
          } catch {
            return color;
          }
        }
        return color;
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
    
    try {
      const inputColor = chroma(color);
      const [, , l] = inputColor.hsl();
      const inputLightness = isNaN(l) ? 0.5 : l;
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
        return 2;
      case 'triadic':
        return 3;
      case 'rainbow':
        return 6;
      case 'tetradic':
        return 4;
      case 'analogous':
        return 4;
      case 'monochromatic':
        return 5;
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

  const scrollToGenerator = () => {
    const element = document.getElementById('generator');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tryRandomColor = () => {
    const randomColor = chroma.random().hex();
    handleColorChange(randomColor);
  };

  const resetToDefault = () => {
    handleColorChange('#fc3649');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">Color Harmony Generator</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <div className="mb-6">
            <Badge variant="secondary" className="mb-4" data-testid="badge-free">
              Free, Instant & No Sign-Up
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Generate Perfect Color Palettes Instantly
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Pick a base color and generate harmonious palettes using proven color theory rules. Copy colors instantly, adjust lightness, and create beautiful designs.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <Button 
              size="lg" 
              onClick={scrollToGenerator}
              data-testid="button-start-generating"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Generating
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={tryRandomColor}
              data-testid="button-try-random"
            >
              Try Random Color
            </Button>
          </div>

          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              <span>Free & Instant</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              <span>6 Harmony Rules</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✓</span>
              <span>No Sign-Up Required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tool Section */}
      <section id="generator" className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left Panel - Color Wheel + Controls */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">Select Base Color</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag the picker or use the eyedropper
                  </p>
                </div>
                <ColorWheel
                  selectedColor={selectedColor}
                  onColorChange={handleColorChange}
                  size={wheelSize}
                  harmonyHues={harmonyHues}
                  lightness={selectedHarmony === 'monochromatic' ? (chroma(selectedColor).hsl()[2] || 0.5) * 100 : actualLightness}
                />
                
                {/* Quick Actions */}
                <div className="flex gap-2 w-full max-w-xs">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={tryRandomColor}
                    data-testid="button-random-color"
                  >
                    Random Color
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={resetToDefault}
                    data-testid="button-reset-color"
                  >
                    Reset
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <LightnessControl
                  value={colorLightness}
                  onChange={setColorLightness}
                  displayValue={actualLightness}
                />
                <ColorInput
                  value={selectedColor}
                  onChange={handleColorChange}
                />
              </div>
            </div>

            {/* Right Panel - Harmony Selector + Palette */}
            <div className="lg:col-span-3 space-y-6">
              <div>
                <HarmonySelector
                  selectedHarmony={selectedHarmony}
                  onHarmonyChange={handleHarmonyChange}
                />
              </div>

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
            </div>
          </div>
        </div>
      </section>

      {/* What It Is Section */}
      <section className="border-b border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
            Free Color Harmony Generator
          </h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              The Color Harmony Generator is a free, fast tool for designers, developers, and brand owners to create professional color palettes using color theory. Select a base color and instantly generate harmonious combinations based on proven rules like analogous, complementary, triadic, and more.
            </p>
            <p>
              Unlike basic color pickers, this tool applies real color theory to create palettes that actually work together. Adjust lightness, copy values instantly, and generate 2-8 color palettes for any design project.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">How to Use the Generator</h3>
              <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
                <li>Pick a base color using the color wheel or paste a HEX/RGB/HSL value</li>
                <li>Choose a harmony rule that fits your design needs</li>
                <li>Adjust the lightness slider to create pastels or deep tones</li>
                <li>Click any color in the palette to copy it instantly</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Who It's For</h3>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li><strong>Designers</strong> creating brand palettes and UI color schemes</li>
                <li><strong>Developers</strong> needing harmonious colors for web and app projects</li>
                <li><strong>Brand owners</strong> establishing consistent visual identities</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">What You Can Do</h3>
              <ul className="space-y-2 text-muted-foreground list-disc list-inside">
                <li>Generate palettes using 6 different color harmony rules</li>
                <li>Adjust lightness to create variations from pastels to deep tones</li>
                <li>Copy colors in HEX, RGB, or HSL format instantly</li>
                <li>Use the eyedropper to pick colors from your screen</li>
                <li>Create 2-8 color palettes based on your needs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Color Harmony Guide Section */}
      <ColorHarmonyGuide />

      {/* FAQ Section */}
      <section className="border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
            Color Harmony Generator: FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What harmony rules are available?</h3>
              <p className="text-muted-foreground">
                The tool offers 6 harmony rules: Monochromatic (same hue, different lightness), Analogous (adjacent colors), Complementary (opposite colors), Triadic (three evenly spaced), Tetradic (four evenly spaced), and Rainbow (spectrum colors).
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I adjust the number of colors?</h3>
              <p className="text-muted-foreground">
                Yes. You can generate between 2-8 colors in your palette. Each harmony rule has a recommended default size, but you can adjust it to fit your needs.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">How do I copy colors?</h3>
              <p className="text-muted-foreground">
                Click any color swatch in the generated palette to copy it to your clipboard. You can copy individual colors or the entire palette at once. Colors are available in HEX, RGB, and HSL formats.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What is the eyedropper tool?</h3>
              <p className="text-muted-foreground">
                The eyedropper tool lets you pick any color from your screen to use as your base color. It works in modern browsers like Chrome and Edge.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is the tool free?</h3>
              <p className="text-muted-foreground">
                Yes. The Color Harmony Generator is completely free and works without sign-up or registration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette Fixer Advertisement */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-sky-100 to-sky-200 dark:from-sky-950 dark:to-sky-900 rounded-2xl shadow-lg p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Product Image */}
              <div className="flex-shrink-0 w-full lg:w-1/2">
                <img
                  src={paletteFixerImage}
                  alt="Color Palette Fixer Product Screenshot"
                  className="rounded-lg shadow-lg w-full"
                  data-testid="img-palette-fixer"
                />
              </div>

              {/* Content */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                  Ready to fix your color palette in 60 seconds?
                </h2>
                <p className="text-xl text-muted-foreground mb-6">
                  The Color Palette Fixer uses math, not AI.
                </p>

                <ul className="space-y-3 mb-8">
                  <li className="flex items-center justify-center lg:justify-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-foreground">Diagnoses harmony, saturation & contrast issues</span>
                  </li>
                  <li className="flex items-center justify-center lg:justify-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-foreground">One-click fixes in 60 seconds</span>
                  </li>
                  <li className="flex items-center justify-center lg:justify-start gap-3">
                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-foreground">Export fixed palettes instantly</span>
                  </li>
                </ul>

                <a
                  href="https://thecolorpalettestudio.com/products/color-palette-fixer"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-palette-fixer-cta"
                >
                  <Button
                    size="lg"
                    className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
                  >
                    Fix Your Color Palette
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <span className="text-red-500">❤️</span>
              <span>by</span>
              <a
                href="https://thecolorpalettestudio.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline"
                data-testid="link-footer-studio"
              >
                The Color Palette Studio
              </a>
            </div>
            
            <div className="flex items-center gap-6">
              <a
                href="https://thecolorpalettestudio.com/policies/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                data-testid="link-footer-privacy"
              >
                Privacy
              </a>
              <a
                href="https://thecolorpalettestudio.com/policies/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                data-testid="link-footer-terms"
              >
                Terms
              </a>
              <a
                href="https://thecolorpalettestudio.com/pages/contact"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                data-testid="link-footer-contact"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
