import { useState } from 'react';
import LightnessControl from '../LightnessControl';

export default function LightnessControlExample() {
  const [lightness, setLightness] = useState(50);

  return (
    <div className="p-6 bg-background max-w-sm">
      <LightnessControl 
        value={lightness}
        onChange={setLightness}
      />
      <div className="mt-4 text-center text-sm text-muted-foreground">
        Selected: {lightness}% lightness
      </div>
    </div>
  );
}