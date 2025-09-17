import { useState } from 'react';
import EyedropperTool from '../EyedropperTool';
import { Toaster } from '@/components/ui/toaster';

export default function EyedropperToolExample() {
  const [pickedColor, setPickedColor] = useState<string | null>(null);

  return (
    <div className="p-6 bg-background min-h-96 relative">
      <div className="text-center space-y-4">
        <h3 className="text-lg font-semibold">Eyedropper Tool</h3>
        <p className="text-muted-foreground">
          Click the eyedropper button to pick a color from anywhere on your screen
        </p>
        
        {pickedColor && (
          <div className="space-y-2">
            <div 
              className="w-16 h-16 mx-auto rounded-md border"
              style={{ backgroundColor: pickedColor }}
            />
            <div className="font-mono text-sm">{pickedColor}</div>
          </div>
        )}
      </div>
      
      <EyedropperTool 
        onColorPick={(color) => {
          setPickedColor(color);
          console.log('Picked color:', color);
        }}
      />
      <Toaster />
    </div>
  );
}