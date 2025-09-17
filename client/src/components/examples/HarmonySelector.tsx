import { useState } from 'react';
import HarmonySelector, { type HarmonyType } from '../HarmonySelector';

export default function HarmonySelectorExample() {
  const [selectedHarmony, setSelectedHarmony] = useState<HarmonyType>('triadic');

  return (
    <div className="p-6 bg-background max-w-2xl">
      <HarmonySelector 
        selectedHarmony={selectedHarmony}
        onHarmonyChange={setSelectedHarmony}
      />
    </div>
  );
}