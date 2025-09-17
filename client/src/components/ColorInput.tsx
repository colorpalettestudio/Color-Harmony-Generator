import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Pipette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import chroma from 'chroma-js';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorInput({ value, onChange }: ColorInputProps) {
  const [hexValue, setHexValue] = useState('');
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 });
  const [hslValues, setHslValues] = useState({ h: 0, s: 0, l: 0 });
  const [rgbString, setRgbString] = useState('0, 0, 0');
  const [hslString, setHslString] = useState('0, 0%, 0%');
  const [currentTab, setCurrentTab] = useState('hex');
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const color = chroma(value);
      const newHex = color.hex().toLowerCase();
      
      // Only update hex value if user is not currently editing
      // This prevents overriding user input during typing/formatting
      if (!isEditing) {
        setHexValue(newHex);
      }
      
      const [r, g, b] = color.rgb();
      const rgbVals = { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
      setRgbValues(rgbVals);
      setRgbString(`${rgbVals.r}, ${rgbVals.g}, ${rgbVals.b}`);
      
      const [h, s, l] = color.hsl();
      const hslVals = { 
        h: isNaN(h) ? 0 : Math.round(h), 
        s: Math.round((s || 0) * 100), 
        l: Math.round(l * 100) 
      };
      setHslValues(hslVals);
      setHslString(`${hslVals.h}, ${hslVals.s}%, ${hslVals.l}%`);
    } catch {
      // Invalid color, keep current values
    }
  }, [value, isEditing]);

  const updateColor = (newColor: string) => {
    try {
      const color = chroma(newColor);
      onChange(color.hex());
      console.log('Color input changed to:', color.hex());
    } catch {
      // Invalid color, don't update
    }
  };

  const handleHexChange = (hex: string) => {
    // Always update the local state immediately for responsive typing
    setHexValue(hex);
    
    // Clean up the hex value - remove spaces and convert to lowercase
    let cleanHex = hex.trim().toLowerCase();
    
    // Add # if missing
    if (cleanHex && !cleanHex.startsWith('#')) {
      cleanHex = '#' + cleanHex;
    }
    
    // Check for valid hex patterns (3 or 6 characters after #)
    const validHexPattern = /^#[0-9a-f]{3}$|^#[0-9a-f]{6}$/;
    
    if (cleanHex.match(validHexPattern)) {
      try {
        // Let chroma handle the conversion (it supports 3-char hex)
        const color = chroma(cleanHex);
        const fullHex = color.hex();
        onChange(fullHex);
        console.log('Color input changed to:', fullHex);
        
        // Don't auto-format while user is still typing
        // Only format when they blur or complete a valid hex
      } catch (error) {
        // Invalid color even though it matched pattern
        console.log('Invalid hex color:', cleanHex);
      }
    }
  };

  const handleHexFocus = () => {
    setIsEditing(true);
  };

  const handleHexBlur = () => {
    // On blur, format the hex properly
    try {
      let cleanHex = hexValue.trim().toLowerCase();
      
      // Add # if missing
      if (cleanHex && !cleanHex.startsWith('#')) {
        cleanHex = '#' + cleanHex;
      }
      
      const validHexPattern = /^#[0-9a-f]{3}$|^#[0-9a-f]{6}$/;
      
      if (cleanHex.match(validHexPattern)) {
        const color = chroma(cleanHex);
        const fullHex = color.hex().toLowerCase();
        setHexValue(fullHex); // Format to full 6-character hex
        
        // Make sure the color is applied
        if (fullHex !== value.toLowerCase()) {
          onChange(fullHex);
          console.log('Color input formatted and changed to:', fullHex);
        }
      }
    } catch (error) {
      // If invalid, revert to current value
      try {
        const color = chroma(value);
        setHexValue(color.hex().toLowerCase());
      } catch {
        // Last resort
        setHexValue('#000000');
      }
    } finally {
      // Always stop editing on blur
      setIsEditing(false);
    }
  };

  const handleRgbStringChange = (rgbStr: string) => {
    setRgbString(rgbStr);
    
    // Parse RGB string like "255, 0, 0" or "255,0,0"
    const values = rgbStr.split(',').map(v => v.trim());
    if (values.length === 3) {
      const [r, g, b] = values.map(v => {
        const num = parseInt(v) || 0;
        return Math.max(0, Math.min(255, num));
      });
      
      try {
        const newRgb = { r, g, b };
        setRgbValues(newRgb);
        updateColor(`rgb(${r}, ${g}, ${b})`);
      } catch (error) {
        console.log('Invalid RGB values:', rgbStr);
      }
    }
  };

  const handleHslStringChange = (hslStr: string) => {
    setHslString(hslStr);
    
    // Parse HSL string like "360, 100%, 50%" or "360,100%,50%"
    const values = hslStr.split(',').map(v => v.trim().replace('%', ''));
    if (values.length === 3) {
      const [h, s, l] = values.map((v, i) => {
        const num = parseInt(v) || 0;
        if (i === 0) return Math.max(0, Math.min(360, num)); // H
        return Math.max(0, Math.min(100, num)); // S, L
      });
      
      try {
        const newHsl = { h, s, l };
        setHslValues(newHsl);
        updateColor(`hsl(${h}, ${s}%, ${l}%)`);
      } catch (error) {
        console.log('Invalid HSL values:', hslStr);
      }
    }
  };

  const activateEyedropper = async () => {
    // Check if EyeDropper API is supported
    if (!('EyeDropper' in window)) {
      toast({
        description: 'Eyedropper not supported in this browser. Try Chrome or Edge.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // @ts-ignore - EyeDropper API is experimental
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      
      if (result.sRGBHex) {
        onChange(result.sRGBHex);
        toast({
          description: `Picked color: ${result.sRGBHex}`,
        });
        console.log('Eyedropper picked color:', result.sRGBHex);
      }
    } catch (error) {
      // User cancelled or error occurred
      console.log('Eyedropper cancelled or error:', error);
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Color Input</Label>
            <p className="text-xs text-muted-foreground">
              Enter color in HEX, RGB, or HSL format
            </p>
          </div>

          <div 
            className="w-full h-12 rounded-md border"
            style={{ backgroundColor: value }}
            data-testid="color-preview"
          />

          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="hex" data-testid="tab-hex">HEX</TabsTrigger>
              <TabsTrigger value="rgb" data-testid="tab-rgb">RGB</TabsTrigger>
              <TabsTrigger value="hsl" data-testid="tab-hsl">HSL</TabsTrigger>
            </TabsList>

            <TabsContent value="hex" className="space-y-2">
              <Label htmlFor="hex-input" className="text-xs">Hexadecimal</Label>
              <div className="flex gap-2">
                <Input
                  id="hex-input"
                  value={hexValue}
                  onChange={(e) => handleHexChange(e.target.value)}
                  onFocus={handleHexFocus}
                  onBlur={handleHexBlur}
                  placeholder="#FF6B6B"
                  className="font-mono flex-1"
                  data-testid="input-hex"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={activateEyedropper}
                      className="shrink-0"
                      data-testid="button-eyedropper-hex"
                    >
                      <Pipette className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pick color from screen</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TabsContent>

            <TabsContent value="rgb" className="space-y-2">
              <Label htmlFor="rgb-input" className="text-xs">RGB Values</Label>
              <div className="flex gap-2">
                <Input
                  id="rgb-input"
                  value={rgbString}
                  onChange={(e) => handleRgbStringChange(e.target.value)}
                  placeholder="255, 0, 0"
                  className="font-mono flex-1"
                  data-testid="input-rgb"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={activateEyedropper}
                      className="shrink-0"
                      data-testid="button-eyedropper-rgb"
                    >
                      <Pipette className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pick color from screen</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TabsContent>

            <TabsContent value="hsl" className="space-y-2">
              <Label htmlFor="hsl-input" className="text-xs">HSL Values</Label>
              <div className="flex gap-2">
                <Input
                  id="hsl-input"
                  value={hslString}
                  onChange={(e) => handleHslStringChange(e.target.value)}
                  placeholder="360, 100%, 50%"
                  className="font-mono flex-1"
                  data-testid="input-hsl"
                />
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={activateEyedropper}
                      className="shrink-0"
                      data-testid="button-eyedropper-hsl"
                    >
                      <Pipette className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pick color from screen</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}