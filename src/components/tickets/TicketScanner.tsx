import React, { useRef, useState } from 'react';
import { QrScanner } from '@yudiel/react-qr-scanner';
import { Check, X, RotateCcw } from 'lucide-react';

interface TicketScannerProps {
  onScan: (ticketId: string) => Promise<boolean>;
}

export default function TicketScanner({ onScan }: TicketScannerProps) {
  const [scanning, setScanning] = useState(true);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleScan = async (data: string) => {
    if (!scanning || !data) return;
    
    setScanning(false);
    
    try {
      const isValid = await onScan(data);
      setResult({
        success: isValid,
        message: isValid ? 'Ticket validated successfully!' : 'Invalid ticket!'
      });
    } catch (error) {
      setResult({
        success: false,
        message: 'Error validating ticket'
      });
    }

    // Reset after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setResult(null);
      setScanning(true);
    }, 3000);
  };

  const handleError = (error: Error) => {
    console.error('Scanner error:', error);
    setResult({
      success: false,
      message: 'Scanner error: ' + error.message
    });
  };

  const resetScanner = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setResult(null);
    setScanning(true);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="relative">
        {scanning ? (
          <QrScanner
            onDecode={handleScan}
            onError={handleError}
            containerStyle={{ borderRadius: '0.75rem', overflow: 'hidden' }}
          />
        ) : (
          <div className="aspect-square bg-gray-900 rounded-xl flex items-center justify-center">
            {result && (
              <div className={`text-center p-6 ${
                result.success ? 'text-green-500' : 'text-red-500'
              }`}>
                {result.success ? (
                  <Check className="h-16 w-16 mx-auto mb-4" />
                ) : (
                  <X className="h-16 w-16 mx-auto mb-4" />
                )}
                <p className="text-lg font-medium">{result.message}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={resetScanner}
          className="absolute bottom-4 right-4 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          <RotateCcw className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      <div className="mt-4 text-center text-gray-600">
        {scanning ? (
          'Position the QR code within the frame to scan'
        ) : (
          'Processing ticket...'
        )}
      </div>
    </div>
  );
}