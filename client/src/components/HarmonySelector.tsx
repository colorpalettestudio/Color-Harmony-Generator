import { Button } from '@/components/ui/button';

export type HarmonyType = 'monochromatic' | 'analogous' | 'complementary' | 'triadic' | 'rainbow' | 'tetradic';

interface HarmonySelectorProps {
  selectedHarmony: HarmonyType;
  onHarmonyChange: (harmony: HarmonyType) => void;
}

const harmonyOptions = [
  { value: 'monochromatic' as const, label: 'Monochromatic', description: 'Same hue, different lightness' },
  { value: 'analogous' as const, label: 'Analogous', description: 'Adjacent hues on color wheel' },
  { value: 'complementary' as const, label: 'Complementary', description: 'Opposite hues' },
  { value: 'triadic' as const, label: 'Triadic', description: 'Three evenly spaced hues' },
  { value: 'rainbow' as const, label: 'Rainbow', description: 'Vibrant colors across entire spectrum' },
  { value: 'tetradic' as const, label: 'Tetradic', description: 'Four evenly spaced hues' },
];

export default function HarmonySelector({ selectedHarmony, onHarmonyChange }: HarmonySelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Color Harmony</h3>
        <p className="text-sm text-muted-foreground">
          Choose a harmony rule to generate complementary colors
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {harmonyOptions.map((option) => (
          <Button
            key={option.value}
            variant={selectedHarmony === option.value ? 'default' : 'outline'}
            className={`h-auto p-3 text-left flex flex-col items-start space-y-1 ${
              selectedHarmony === option.value 
                ? 'bg-black hover:bg-black/90 text-white border-black' 
                : ''
            }`}
            data-testid={`harmony-${option.value}`}
            onClick={() => {
              onHarmonyChange(option.value);
              console.log('Harmony changed to:', option.value);
            }}
          >
            <span className="font-medium text-sm">{option.label}</span>
            <span className="text-xs text-muted-foreground leading-tight">
              {option.description}
            </span>
          </Button>
        ))}
      </div>
      
      <div className="text-xs text-muted-foreground">
        Current: <span className="font-mono">{selectedHarmony}</span>
      </div>
    </div>
  );
}