import { useState } from 'react';
import ColorWheel from '../ColorWheel';

export default function ColorWheelExample() {
  const [selectedColor, setSelectedColor] = useState('#ff6b6b');

  return (
    <div className="p-8 bg-background">
      <ColorWheel 
        selectedColor={selectedColor}
        onColorChange={(color) => {
          setSelectedColor(color);
          console.log('Color changed to:', color);
        }}
        size={300}
      />
      <div className="mt-4 text-center">
        <div className="text-sm font-mono">{selectedColor}</div>
        <div 
          className="w-16 h-16 mx-auto mt-2 rounded-md border"
          style={{ backgroundColor: selectedColor }}
        />
      </div>
    </div>
  );
}