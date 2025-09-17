import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Pipette } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EyedropperToolProps {
  onColorPick: (color: string) => void;
}

export default function EyedropperTool({ onColorPick }: EyedropperToolProps) {
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

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
      setIsActive(true);
      // @ts-ignore - EyeDropper API is experimental
      const eyeDropper = new EyeDropper();
      const result = await eyeDropper.open();
      
      if (result.sRGBHex) {
        onColorPick(result.sRGBHex);
        toast({
          description: `Picked color: ${result.sRGBHex}`,
        });
        console.log('Eyedropper picked color:', result.sRGBHex);
      }
    } catch (error) {
      // User cancelled or error occurred
      console.log('Eyedropper cancelled or error:', error);
    } finally {
      setIsActive(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className={`fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-50 ${
            isActive ? 'bg-primary text-primary-foreground' : ''
          }`}
          onClick={activateEyedropper}
          disabled={isActive}
          data-testid="button-eyedropper"
        >
          <Pipette className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Pick color from screen</p>
      </TooltipContent>
    </Tooltip>
  );
}