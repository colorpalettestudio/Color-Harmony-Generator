import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface PaletteSizeControlProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export default function PaletteSizeControl({ 
  value, 
  onChange, 
  min = 2, 
  max = 8 
}: PaletteSizeControlProps) {
  const options = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <Label className="text-sm font-medium">Palette Size</Label>
          
          <Select
            value={value.toString()}
            onValueChange={(val) => {
              const numValue = parseInt(val);
              onChange(numValue);
              console.log('Palette size changed to:', numValue);
            }}
          >
            <SelectTrigger className="w-full" data-testid="select-palette-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {options.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size} color{size !== 1 ? 's' : ''}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}