import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface LightnessControlProps {
  value: number;
  onChange: (value: number) => void;
}

const lightnessOptions = [
  { value: 25, label: 'Very Dark', description: 'Deep, rich tones' },
  { value: 35, label: 'Dark', description: 'Bold colors' },
  { value: 50, label: 'Standard', description: 'Saturated colors' },
  { value: 65, label: 'Light', description: 'Soft tones' },
  { value: 75, label: 'Pastel', description: 'Light, gentle colors' },
  { value: 85, label: 'Very Light', description: 'Subtle pastels' },
];

export default function LightnessControl({ value, onChange }: LightnessControlProps) {
  const currentOption = lightnessOptions.find(opt => opt.value === value) || lightnessOptions[2];

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-medium">Color Lightness</Label>
            <p className="text-xs text-muted-foreground mt-1">
              {currentOption.description}
            </p>
          </div>
          
          <Select
            value={value.toString()}
            onValueChange={(val) => {
              const numValue = parseInt(val);
              onChange(numValue);
              console.log('Lightness changed to:', numValue);
            }}
          >
            <SelectTrigger className="w-full" data-testid="select-lightness">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {lightnessOptions.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  <div className="flex flex-col">
                    <span>{option.label}</span>
                    <span className="text-xs text-muted-foreground">{option.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}