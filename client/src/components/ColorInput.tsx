import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import chroma from 'chroma-js';

interface ColorInputProps {
  value: string;
  onChange: (color: string) => void;
}

export default function ColorInput({ value, onChange }: ColorInputProps) {
  const [hexValue, setHexValue] = useState('');
  const [rgbValues, setRgbValues] = useState({ r: 0, g: 0, b: 0 });
  const [hslValues, setHslValues] = useState({ h: 0, s: 0, l: 0 });
  const [currentTab, setCurrentTab] = useState('hex');
  const [isEditing, setIsEditing] = useState(false);

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
      setRgbValues({ r: Math.round(r), g: Math.round(g), b: Math.round(b) });
      const [h, s, l] = color.hsl();
      setHslValues({ 
        h: isNaN(h) ? 0 : Math.round(h), 
        s: Math.round((s || 0) * 100), 
        l: Math.round(l * 100) 
      });
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

  const handleRgbChange = (component: 'r' | 'g' | 'b', value: string) => {
    const numValue = Math.max(0, Math.min(255, parseInt(value) || 0));
    const newRgb = { ...rgbValues, [component]: numValue };
    setRgbValues(newRgb);
    updateColor(`rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`);
  };

  const handleHslChange = (component: 'h' | 's' | 'l', value: string) => {
    const numValue = parseInt(value) || 0;
    let clampedValue = numValue;
    
    if (component === 'h') {
      clampedValue = Math.max(0, Math.min(360, numValue));
    } else {
      clampedValue = Math.max(0, Math.min(100, numValue));
    }
    
    const newHsl = { ...hslValues, [component]: clampedValue };
    setHslValues(newHsl);
    updateColor(`hsl(${newHsl.h}, ${newHsl.s}%, ${newHsl.l}%)`);
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
              <Input
                id="hex-input"
                value={hexValue}
                onChange={(e) => handleHexChange(e.target.value)}
                onFocus={handleHexFocus}
                onBlur={handleHexBlur}
                placeholder="#FF6B6B"
                className="font-mono"
                data-testid="input-hex"
              />
            </TabsContent>

            <TabsContent value="rgb" className="space-y-2">
              <Label className="text-xs">RGB Values</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="rgb-r" className="text-xs text-muted-foreground">R</Label>
                  <Input
                    id="rgb-r"
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.r}
                    onChange={(e) => handleRgbChange('r', e.target.value)}
                    className="font-mono text-sm"
                    data-testid="input-rgb-r"
                  />
                </div>
                <div>
                  <Label htmlFor="rgb-g" className="text-xs text-muted-foreground">G</Label>
                  <Input
                    id="rgb-g"
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.g}
                    onChange={(e) => handleRgbChange('g', e.target.value)}
                    className="font-mono text-sm"
                    data-testid="input-rgb-g"
                  />
                </div>
                <div>
                  <Label htmlFor="rgb-b" className="text-xs text-muted-foreground">B</Label>
                  <Input
                    id="rgb-b"
                    type="number"
                    min="0"
                    max="255"
                    value={rgbValues.b}
                    onChange={(e) => handleRgbChange('b', e.target.value)}
                    className="font-mono text-sm"
                    data-testid="input-rgb-b"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="hsl" className="space-y-2">
              <Label className="text-xs">HSL Values</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="hsl-h" className="text-xs text-muted-foreground">H</Label>
                  <Input
                    id="hsl-h"
                    type="number"
                    min="0"
                    max="360"
                    value={hslValues.h}
                    onChange={(e) => handleHslChange('h', e.target.value)}
                    className="font-mono text-sm"
                    data-testid="input-hsl-h"
                  />
                </div>
                <div>
                  <Label htmlFor="hsl-s" className="text-xs text-muted-foreground">S%</Label>
                  <Input
                    id="hsl-s"
                    type="number"
                    min="0"
                    max="100"
                    value={hslValues.s}
                    onChange={(e) => handleHslChange('s', e.target.value)}
                    className="font-mono text-sm"
                    data-testid="input-hsl-s"
                  />
                </div>
                <div>
                  <Label htmlFor="hsl-l" className="text-xs text-muted-foreground">L%</Label>
                  <Input
                    id="hsl-l"
                    type="number"
                    min="0"
                    max="100"
                    value={hslValues.l}
                    onChange={(e) => handleHslChange('l', e.target.value)}
                    className="font-mono text-sm"
                    data-testid="input-hsl-l"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
}