import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

interface LightnessControlProps {
  value: number;
  onChange: (value: number) => void;
}

export default function LightnessControl({ value, onChange }: LightnessControlProps) {
  const getDescription = (lightness: number) => {
    if (lightness <= 30) return 'Very Dark - Deep, rich tones';
    if (lightness <= 40) return 'Dark - Bold colors';
    if (lightness <= 60) return 'Standard - Saturated colors';
    if (lightness <= 70) return 'Light - Soft tones';
    if (lightness <= 80) return 'Pastel - Light, gentle colors';
    return 'Very Light - Subtle pastels';
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Color Lightness</Label>
            <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
              {value}%
            </span>
          </div>
          
          <div className="space-y-3">
            <div className="relative">
              <input
                type="range"
                min="20"
                max="90"
                step="5"
                value={value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value);
                  onChange(newValue);
                  console.log('Lightness changed to:', newValue);
                }}
                className="w-full h-2 bg-gradient-to-r from-gray-900 via-gray-500 to-gray-100 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: 'linear-gradient(to right, #1f2937, #6b7280, #f3f4f6)',
                }}
                data-testid="slider-lightness"
              />
              <style dangerouslySetInnerHTML={{
                __html: `
                  input[type="range"]::-webkit-slider-thumb {
                    appearance: none;
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: hsl(var(--primary));
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    cursor: pointer;
                  }
                  input[type="range"]::-moz-range-thumb {
                    height: 20px;
                    width: 20px;
                    border-radius: 50%;
                    background: hsl(var(--primary));
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    cursor: pointer;
                    border: none;
                  }
                `
              }} />
            </div>
            
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Very Dark</span>
              <span>Very Light</span>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              {getDescription(value)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}