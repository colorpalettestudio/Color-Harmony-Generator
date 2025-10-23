import { Card, CardContent } from '@/components/ui/card';
import { generateHarmonyColors } from '@/lib/colorHarmony';
import type { HarmonyType } from './HarmonySelector';

interface HarmonyExampleProps {
  title: string;
  description: string;
  harmonyType: HarmonyType;
  exampleColor: string;
}

function HarmonyExample({ title, description, harmonyType, exampleColor }: HarmonyExampleProps) {
  const colors = generateHarmonyColors(exampleColor, harmonyType, harmonyType === 'complementary' ? 2 : harmonyType === 'triadic' ? 3 : harmonyType === 'tetradic' ? 4 : harmonyType === 'rainbow' ? 6 : 5);

  return (
    <Card data-testid={`harmony-example-${harmonyType}`}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          
          {/* Color Palette Preview */}
          <div className="flex gap-2 h-20">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex-1 rounded-md border border-border"
                style={{ backgroundColor: color }}
                data-testid={`palette-color-${index}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ColorHarmonyGuide() {
  // Use the same base color for all examples to make comparisons easier
  const baseColor = '#3b82f6';
  
  const harmonyExamples = [
    {
      title: 'Monochromatic',
      description: 'Uses a single hue with variations in lightness and saturation. Perfect for elegant, cohesive designs with a unified feel.',
      harmonyType: 'monochromatic' as HarmonyType,
      exampleColor: baseColor,
    },
    {
      title: 'Analogous',
      description: 'Uses colors that are adjacent on the color wheel. Creates harmonious, comfortable designs that are pleasing to the eye.',
      harmonyType: 'analogous' as HarmonyType,
      exampleColor: baseColor,
    },
    {
      title: 'Complementary',
      description: 'Uses colors opposite each other on the color wheel. Creates high contrast and vibrant, energetic designs.',
      harmonyType: 'complementary' as HarmonyType,
      exampleColor: baseColor,
    },
    {
      title: 'Triadic',
      description: 'Uses three colors evenly spaced around the color wheel. Provides vibrant contrast while remaining balanced.',
      harmonyType: 'triadic' as HarmonyType,
      exampleColor: baseColor,
    },
    {
      title: 'Tetradic',
      description: 'Uses four colors arranged into two complementary pairs. Offers rich color diversity with many variations.',
      harmonyType: 'tetradic' as HarmonyType,
      exampleColor: baseColor,
    },
    {
      title: 'Rainbow',
      description: 'Uses colors spread across the entire spectrum. Creates vibrant, energetic palettes perfect for playful designs.',
      harmonyType: 'rainbow' as HarmonyType,
      exampleColor: baseColor,
    },
  ];

  return (
    <section className="border-b border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Understanding Color Harmony Rules
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Each harmony rule uses color theory to create palettes that naturally work together. Choose the rule that best fits your design goals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {harmonyExamples.map((example) => (
            <HarmonyExample
              key={example.harmonyType}
              title={example.title}
              description={example.description}
              harmonyType={example.harmonyType}
              exampleColor={example.exampleColor}
            />
          ))}
        </div>

        <div className="mt-8 p-6 bg-background border border-border rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Choosing the Right Harmony</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">For subtle, professional designs:</p>
              <p>Use Monochromatic or Analogous harmonies</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">For bold, attention-grabbing designs:</p>
              <p>Use Complementary or Triadic harmonies</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">For complex, rich palettes:</p>
              <p>Use Tetradic harmonies</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">For playful, energetic designs:</p>
              <p>Use Rainbow harmonies</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
