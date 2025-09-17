import PaletteDisplay from '../PaletteDisplay';
import { Toaster } from '@/components/ui/toaster';

export default function PaletteDisplayExample() {
  // Mock triadic color palette
  const mockColors = [
    '#ff6b6b', // Base red
    '#4ecdc4', // Triadic cyan
    '#45b7d1', // Triadic blue
    '#96ceb4', // Variation
    '#ffeaa7'  // Variation
  ];

  return (
    <div className="p-6 bg-background max-w-md">
      <PaletteDisplay 
        colors={mockColors}
        title="Triadic Harmony"
      />
      <Toaster />
    </div>
  );
}