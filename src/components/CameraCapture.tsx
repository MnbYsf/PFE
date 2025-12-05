import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Camera, X, RotateCcw, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onCancel: () => void;
  existingImage?: string | null;
}

export function CameraCapture({ onCapture, onCancel, existingImage }: CameraCaptureProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(existingImage || null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!capturedImage) {
      console.log("CameraCapture mounted, starting camera...");
      startCamera();
    }
    return () => {
      console.log("CameraCapture unmounting, stopping camera...");
      stopCamera();
    };
  }, [capturedImage]);

  const startCamera = async () => {
    try {
      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false,
      });
      console.log("Camera access granted");
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(err => {
          console.error("Video play error:", err);
        });
      }
      setError(null);
    } catch (err: any) {
      const errorMessage = err.name === 'NotAllowedError' 
        ? "Camera permission denied. Please allow camera access and try again."
        : err.name === 'NotFoundError'
        ? "No camera found. Please connect a camera and try again."
        : "Unable to access camera. Please check permissions.";
      setError(errorMessage);
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);

        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  const handleCancel = () => {
    stopCamera();
    onCancel();
  };

  console.log("CameraCapture component rendering, stream:", !!stream, "error:", error);
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        zIndex: 99999, 
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-card rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border-4 border-primary"
        style={{ zIndex: 100000 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Capture Your Photo</h3>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="relative bg-black rounded-lg overflow-hidden mb-4 aspect-video min-h-[300px] flex items-center justify-center">
          {capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: "scaleX(-1)" }}
            />
          ) : error ? (
            <div className="text-white p-4 text-center">
              <p className="text-sm">{error}</p>
              <Button
                onClick={startCamera}
                className="mt-4"
                variant="outline"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="text-white p-4 text-center">
              <p className="text-sm">Initializing camera...</p>
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex gap-3">
          {capturedImage ? (
            <>
              <Button
                onClick={retakePhoto}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button
                onClick={confirmPhoto}
                className="flex-1 gradient-primary"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirm
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={capturePhoto}
                className="flex-1 gradient-primary"
                disabled={!stream}
              >
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
            </>
          )}
        </div>

        {!capturedImage && !error && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Position your face in the center and click Capture
          </p>
        )}
      </motion.div>
    </div>
  );
}

