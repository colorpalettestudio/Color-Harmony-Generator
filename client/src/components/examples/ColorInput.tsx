import { useState } from 'react';
import ColorInput from '../ColorInput';

export default function ColorInputExample() {
  const [color, setColor] = useState('#ff6b6b');

  return (
    <div className="p-6 bg-background max-w-md">
      <ColorInput 
        value={color}
        onChange={setColor}
      />
      <div className="mt-4 text-center">
        <div className="text-sm font-mono">{color}</div>
      </div>
    </div>
  );
}