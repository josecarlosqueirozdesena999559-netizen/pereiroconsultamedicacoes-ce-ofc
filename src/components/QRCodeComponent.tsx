import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { QrCode } from 'lucide-react';

interface QRCodeComponentProps {
  value: string;
  size?: number;
  disabled?: boolean;
}

const QRCodeComponent = ({ value, size = 80, disabled = false }: QRCodeComponentProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value && value !== '#' && !disabled) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        scale: 8,
        errorCorrectionLevel: 'M',
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      }).catch(console.error);
    }
  }, [value, size, disabled]);

  if (disabled || !value || value === '#') {
    return (
      <div 
        className="flex items-center justify-center bg-muted rounded border-2 border-dashed border-muted-foreground/30"
        style={{ width: size, height: size }}
      >
        <QrCode className="h-6 w-6 text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="rounded border" />
      <span className="text-xs text-muted-foreground mt-1">QR Code</span>
    </div>
  );
};

export default QRCodeComponent;