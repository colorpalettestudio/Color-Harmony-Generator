import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import chroma from 'chroma-js';
import { copyToClipboard as copyToClipboardUtil } from '@/lib/clipboard';

interface PaletteDisplayProps {
  colors: string[];
  title: string;
  paletteSize: number;
  onPaletteSizeChange: (size: number) => void;
  minSize?: number;
  maxSize?: number;
}

export default function PaletteDisplay({ 
  colors, 
  title, 
  paletteSize,
  onPaletteSizeChange,
  minSize = 2,
  maxSize = 8
}: PaletteDisplayProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const copyToClipboard = async (color: string, index: number) => {
    const success = await copyToClipboardUtil(color);
    
    if (success) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
      toast({
        description: `Copied ${color} to clipboard`,
      });
      console.log('Copied color:', color);
    } else {
      toast({
        description: 'Failed to copy color',
        variant: 'destructive',
      });
    }
  };

  const copyAllColors = async () => {
    const colorString = colors.join(', ');
    const success = await copyToClipboardUtil(colorString);
    
    if (success) {
      toast({
        description: `Copied ${colors.length} colors to clipboard`,
      });
      console.log('Copied all colors:', colorString);
    } else {
      toast({
        description: 'Failed to copy colors',
        variant: 'destructive',
      });
    }
  };

  const getContrastText = (color: string) => {
    try {
      const contrast = chroma.contrast(color, '#ffffff');
      return contrast > 4.5 ? '#ffffff' : '#000000';
    } catch {
      return '#000000';
    }
  };

  if (colors.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Select a base color to generate palette
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {colors.length} colors generated
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Palette Size Control */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPaletteSizeChange(Math.max(minSize, paletteSize - 1))}
                disabled={paletteSize <= minSize}
                className="h-8 w-8"
                data-testid="button-decrease-size"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium w-8 text-center">
                {paletteSize}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPaletteSizeChange(Math.min(maxSize, paletteSize + 1))}
                disabled={paletteSize >= maxSize}
                className="h-8 w-8"
                data-testid="button-increase-size"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={copyAllColors}
              className="gap-2"
              data-testid="button-copy-all"
            >
              <Copy className="w-4 h-4" />
              Copy All
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {colors.map((color, index) => (
            <div
              key={index}
              className="group relative rounded-md overflow-hidden border"
              data-testid={`color-swatch-${index}`}
            >
              <div
                className="h-16 w-full flex items-center justify-between px-4 transition-all duration-200"
                style={{ 
                  backgroundColor: color,
                  color: getContrastText(color)
                }}
              >
                <div className="flex items-center space-x-3">
                  <Badge 
                    variant="secondary" 
                    className="bg-black/20 text-current border-current/30"
                  >
                    #{index + 1}
                  </Badge>
                  <span className="font-mono text-sm font-medium">
                    {color.toUpperCase()}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-black/20 text-current opacity-80 hover:opacity-100 transition-opacity"
                  onClick={() => copyToClipboard(color, index)}
                  data-testid={`button-copy-${index}`}
                >
                  {copiedIndex === index ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t text-xs text-muted-foreground">
          Click any color to copy to clipboard
        </div>
      </CardContent>
    </Card>
  );
}