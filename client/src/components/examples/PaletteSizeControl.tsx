import { useState } from 'react';
import PaletteSizeControl from '../PaletteSizeControl';

export default function PaletteSizeControlExample() {
  const [paletteSize, setPaletteSize] = useState(4);

  return (
    <div className="p-6 bg-background max-w-sm">
      <PaletteSizeControl 
        value={paletteSize}
        onChange={setPaletteSize}
        min={2}
        max={8}
      />
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Selected: {paletteSize} colors
      </div>
    </div>
  );
}