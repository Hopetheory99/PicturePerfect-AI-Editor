
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { EditingTool, CanvasToolParams } from '../types';

interface CanvasEditorProps {
  imageUrl: string;
  originalImage: { src: string; width: number; height: number };
  activeTool: EditingTool;
  canvasToolParams: CanvasToolParams;
  onMaskUpdate: (maskDataUrl: string | null) => void;
  setEditorInstance: (instance: any) => void;
  brightness: number; // 0-200
  contrast: number; // 0-200
}

export const CanvasEditor: React.FC<CanvasEditorProps> = ({
  imageUrl,
  originalImage,
  activeTool,
  canvasToolParams,
  onMaskUpdate,
  setEditorInstance,
  brightness,
  contrast,
}) => {
  const imageCanvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [currentBrightness, setCurrentBrightness] = useState(100);
  const [currentContrast, setCurrentContrast] = useState(100);

  const MAX_CANVAS_WIDTH = 800;
  const MAX_CANVAS_HEIGHT = 600;

  const getCanvasScale = useCallback(() => {
    if (!originalImage.width || !originalImage.height) return 1;
    const widthScale = MAX_CANVAS_WIDTH / originalImage.width;
    const heightScale = MAX_CANVAS_HEIGHT / originalImage.height;
    return Math.min(1, widthScale, heightScale); // Don't scale up, only down
  }, [originalImage.width, originalImage.height]);


  const drawImage = useCallback((imageToDraw: HTMLImageElement, rotation: number = currentRotation, brightnessVal: number = currentBrightness, contrastVal: number = currentContrast) => {
    const canvas = imageCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !imageToDraw) return;

    const scale = getCanvasScale();
    const canvasWidth = originalImage.width * scale;
    const canvasHeight = originalImage.height * scale;
    
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Clear previous drawing
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.save();
    // Apply transformations (rotation)
    if (rotation !== 0) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.translate(-canvas.width / 2, -canvas.height / 2);
    }
    
    // Apply filters (brightness, contrast)
    ctx.filter = `brightness(${brightnessVal}%) contrast(${contrastVal}%)`;
    
    ctx.drawImage(imageToDraw, 0, 0, canvas.width, canvas.height);
    ctx.restore(); // Restore to remove filter for subsequent drawings if any

  }, [originalImage, getCanvasScale, currentRotation, currentBrightness, currentContrast]);


  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous"; // Important for toDataURL with external images if they were used
    img.onload = () => {
      setImgElement(img);
    };
    img.src = imageUrl; // This is the potentially edited image source
  }, [imageUrl]);

  useEffect(() => {
    if (imgElement) {
        drawImage(imgElement, currentRotation, brightness, contrast);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgElement, drawImage, currentRotation, brightness, contrast]);


  // Setup mask canvas
  useEffect(() => {
    const imgCanvas = imageCanvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    if (imgCanvas && maskCanvas) {
      maskCanvas.width = imgCanvas.width;
      maskCanvas.height = imgCanvas.height;
      const maskCtx = maskCanvas.getContext('2d');
      if (maskCtx) {
        maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      }
    }
  }, [imgElement, getCanvasScale]); // Re-setup if image dimensions change.

  const getMousePos = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } => {
    const canvas = maskCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (activeTool !== EditingTool.Inpaint) return;
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (!maskCtx) return;
    
    setIsDrawing(true);
    const { x, y } = getMousePos(e);
    maskCtx.beginPath();
    maskCtx.moveTo(x, y);
  }, [activeTool]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || activeTool !== EditingTool.Inpaint) return;
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (!maskCtx) return;

    const { x, y } = getMousePos(e);
    maskCtx.lineTo(x, y);
    maskCtx.strokeStyle = canvasToolParams.tool === 'Paint' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0,0,0,1)'; // Semi-transparent red for paint, opaque for erase
    maskCtx.lineWidth = canvasToolParams.brushSize;
    maskCtx.lineCap = 'round';
    maskCtx.lineJoin = 'round';
    maskCtx.globalCompositeOperation = canvasToolParams.tool === 'Paint' ? 'source-over' : 'destination-out';
    maskCtx.stroke();
  }, [isDrawing, activeTool, canvasToolParams]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    if (maskCtx) {
      maskCtx.closePath();
    }
    setIsDrawing(false);

    // Generate mask data URL
    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas && activeTool === EditingTool.Inpaint) {
        // Create a new canvas for the actual mask (black and white)
        const outputMaskCanvas = document.createElement('canvas');
        outputMaskCanvas.width = maskCanvas.width;
        outputMaskCanvas.height = maskCanvas.height;
        const outputCtx = outputMaskCanvas.getContext('2d');

        if (outputCtx) {
            outputCtx.fillStyle = 'black'; // Background is black (area not to be inpainted)
            outputCtx.fillRect(0, 0, outputMaskCanvas.width, outputMaskCanvas.height);
            
            // Draw the visible mask (where brush was red) as white
            outputCtx.globalCompositeOperation = 'source-over'; // ensure drawing on top
            outputCtx.drawImage(maskCanvas, 0, 0); // This draws the red semi-transparent mask
            
            // Convert red to white, and clear transparent areas to ensure they are black
            const imageData = outputCtx.getImageData(0, 0, outputMaskCanvas.width, outputMaskCanvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                // If the pixel on maskCanvas was drawn (i.e., has some alpha from the brush)
                if (data[i+3] > 0) { // Check alpha channel of the drawn red mask
                    data[i] = 255;   // R = white
                    data[i+1] = 255; // G = white
                    data[i+2] = 255; // B = white
                    data[i+3] = 255; // Alpha = opaque
                } else { // if it was transparent (erased or not painted)
                    data[i] = 0;     // R = black
                    data[i+1] = 0;   // G = black
                    data[i+2] = 0;   // B = black
                    data[i+3] = 255; // Alpha = opaque
                }
            }
            outputCtx.putImageData(imageData, 0, 0);
            onMaskUpdate(outputMaskCanvas.toDataURL('image/png'));
        } else {
            onMaskUpdate(null);
        }
    } else {
        onMaskUpdate(null);
    }
  }, [isDrawing, onMaskUpdate, activeTool]);


  const clearMask = () => {
    const maskCtx = maskCanvasRef.current?.getContext('2d');
    const maskCanvas = maskCanvasRef.current;
    if (maskCtx && maskCanvas) {
      maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      onMaskUpdate(null);
    }
  };

  const downloadImage = () => {
    const canvas = imageCanvasRef.current;
    if (canvas && imgElement) {
        // Create a temporary canvas to draw the final image with all transformations
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return;

        const scale = getCanvasScale();
        tempCanvas.width = originalImage.width * scale;
        tempCanvas.height = originalImage.height * scale;
        
        // Draw the image with current rotation and filters
        tempCtx.save();
        if (currentRotation !== 0) {
          tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
          tempCtx.rotate(currentRotation * Math.PI / 180);
          tempCtx.translate(-tempCanvas.width / 2, -tempCanvas.height / 2);
        }
        tempCtx.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
        tempCtx.drawImage(imgElement, 0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.restore();

        const dataURL = tempCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = 'edited-image.png';
        link.href = dataURL;
        link.click();
    }
  };

  const rotateImage = () => {
    const newRotation = (currentRotation + 90) % 360;
    setCurrentRotation(newRotation);
    if(imgElement) drawImage(imgElement, newRotation, brightness, contrast);
  };
  
  const applyBrightness = (value: number) => {
    setCurrentBrightness(value);
    if(imgElement) drawImage(imgElement, currentRotation, value, contrast);
  };

  const applyContrast = (value: number) => {
    setCurrentContrast(value);
    if(imgElement) drawImage(imgElement, currentRotation, brightness, value);
  };

  useEffect(() => {
    setEditorInstance({
      clearMask,
      downloadImage,
      rotateImage,
      applyBrightness,
      applyContrast,
    });
  }, [setEditorInstance, clearMask, downloadImage, rotateImage, applyBrightness, applyContrast]);

  const canvasCursorClass = activeTool === EditingTool.Inpaint ? 'custom-cursor-paint' : 'cursor-default';

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
      <canvas ref={imageCanvasRef} className="max-w-full max-h-full object-contain" />
      <canvas
        ref={maskCanvasRef}
        className={`absolute top-0 left-0 max-w-full max-h-full object-contain ${canvasCursorClass}`}
        style={{ pointerEvents: activeTool === EditingTool.Inpaint ? 'auto' : 'none', touchAction: 'none' }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing} // Stop drawing if mouse leaves canvas
        onTouchStart={(e) => startDrawing(e as unknown as React.MouseEvent)}
        onTouchMove={(e) => draw(e as unknown as React.MouseEvent)}
        onTouchEnd={(e) => stopDrawing()}
      />
    </div>
  );
};

    