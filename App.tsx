
import React, { useState, useCallback, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ImageUploader } from './components/ImageUploader';
import { CanvasEditor } from './components/CanvasEditor';
import { Toolbar } from './components/Toolbar';
import { AIPanel } from './components/AIPanel';
import { TierModal } from './components/TierModal';
import { UserTier, EditingTool, ImageState, CanvasTool } from './types';
import { geminiService } from './services/geminiService';
import { MAX_FREE_GENERATIONS, BrightnessIcon, ContrastIcon } from './constants.tsx';

const App: React.FC = () => {
  const [userTier, setUserTier] = useState<UserTier>(UserTier.Free);
  const [imageState, setImageState] = useState<ImageState | null>(null);
  const [activeTool, setActiveTool] = useState<EditingTool>(EditingTool.None);
  const [activeCanvasTool, setActiveCanvasTool] = useState<CanvasTool>(CanvasTool.Paint);
  
  const [brushSize, setBrushSize] = useState<number>(20);
  const [brightness, setBrightness] = useState<number>(100); // Percentage
  const [contrast, setContrast] = useState<number>(100); // Percentage

  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isTierModalOpen, setIsTierModalOpen] = useState<boolean>(false);
  const [generationsCount, setGenerationsCount] = useState<number>(0);

  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
  const [editorInstance, setEditorInstance] = useState<any>(null); // To call CanvasEditor methods
  
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setError("Gemini API Key not found. AI features will be disabled. Please set the API_KEY environment variable.");
    }
  }, []);

  const handleImageUpload = useCallback((imageDataUrl: string) => {
    const img = new Image();
    img.onload = () => {
      setImageState({
        src: imageDataUrl,
        width: img.width,
        height: img.height,
        originalSrc: imageDataUrl,
      });
      setActiveTool(EditingTool.None);
      setError(null);
      setGenerationsCount(0); // Reset count on new image
      setAnalysisResult(null);
    };
    img.src = imageDataUrl;
  }, []);

  const handleToolSelect = useCallback((tool: EditingTool) => {
    setActiveTool(tool);
    if (tool !== EditingTool.Inpaint) {
       editorInstance?.clearMask();
       setMaskDataUrl(null);
    }
    setAnalysisResult(null); // Clear analysis when switching tools
  }, [editorInstance]);
  
  const handleCanvasToolSelect = useCallback((tool: CanvasTool) => {
    setActiveCanvasTool(tool);
  }, []);

  const handleUpgradeToVIP = useCallback(() => {
    setUserTier(UserTier.VIP);
    setIsTierModalOpen(false);
    setError(null);
  }, []);

  const handleAIAction = useCallback(async (prompt: string, options: any) => {
    const isFreeLimitReached = userTier === UserTier.Free && generationsCount >= MAX_FREE_GENERATIONS;
    
    // Analyze and Generate don't strictly require an existing image upload in same way (Generate creates one, Analyze reads one)
    if (activeTool !== EditingTool.Generate && !imageState?.src) {
        setError("Please upload an image first.");
        return;
    }

    if (activeTool === EditingTool.Inpaint && !maskDataUrl) {
        setError("Please draw a mask on the image for inpainting.");
        return;
    }

    if (isFreeLimitReached) {
      setError("You have reached the maximum number of free generations. Please upgrade to VIP.");
      setIsTierModalOpen(true);
      return;
    }
    if (!process.env.API_KEY) {
      setError("API Key is not configured. AI features are disabled.");
      return;
    }

    setIsLoadingAI(true);
    setError(null);
    setAnalysisResult(null);

    try {
      let resultImage: string | null = null;
      let resultText: string | null = null;

      if (activeTool === EditingTool.Inpaint && imageState) {
        resultImage = await geminiService.inpaintImage(imageState.src, maskDataUrl!, prompt, options.nsfw && userTier === UserTier.VIP);
      } else if (activeTool === EditingTool.AIEdit && imageState) {
        resultImage = await geminiService.editImage(imageState.src, prompt);
      } else if (activeTool === EditingTool.Generate) {
        resultImage = await geminiService.generateImage(prompt, options.imageSize);
      } else if (activeTool === EditingTool.Analyze && imageState) {
        if (options.fastAnalysis) {
             resultText = await geminiService.quickAnalyzeImage(imageState.src, prompt);
        } else {
             resultText = await geminiService.analyzeImage(imageState.src, prompt);
        }
      }

      // Update state based on result
      if (resultImage) {
        const img = new Image();
        img.onload = () => {
            setImageState({
                src: resultImage!,
                width: img.width,
                height: img.height,
                originalSrc: activeTool === EditingTool.Generate ? resultImage! : imageState?.originalSrc!, // If generated, it becomes the new original
            });
             // Clear mask if we did inpainting
            editorInstance?.clearMask();
            setMaskDataUrl(null);
        }
        img.src = resultImage;
      }
      
      if (resultText) {
          setAnalysisResult(resultText);
      }

      if (userTier === UserTier.Free) {
        setGenerationsCount(prev => prev + 1);
      }

    } catch (err: any) {
      console.error("AI Action Error:", err);
      setError(err.message || "Failed to process request. Check console for details.");
    } finally {
      setIsLoadingAI(false);
    }
  }, [imageState, maskDataUrl, userTier, generationsCount, editorInstance, activeTool]);

  const handleDownload = () => {
    if (editorInstance) {
      editorInstance.downloadImage();
    }
  };
  
  const handleRotate = () => editorInstance?.rotateImage();
  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    editorInstance?.applyBrightness(value);
  };
  const handleContrastChange = (value: number) => {
    setContrast(value);
    editorInstance?.applyContrast(value);
  };

  const isAIGenerationDisabled = 
    (userTier === UserTier.Free && generationsCount >= MAX_FREE_GENERATIONS) || 
    isLoadingAI || 
    !process.env.API_KEY ||
    (activeTool === EditingTool.Inpaint && !maskDataUrl);

    // AI Panel is visible for Inpaint, AI Edit, Generate, Analyze
  const showAIPanel = [EditingTool.Inpaint, EditingTool.AIEdit, EditingTool.Generate, EditingTool.Analyze].includes(activeTool);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <Navbar userTier={userTier} onUpgrade={() => setIsTierModalOpen(true)} />
      
      <main className="flex-grow flex flex-col md:flex-row p-4 gap-4">
        <div className="w-full md:w-1/4 flex flex-col gap-4 order-2 md:order-1">
          <Toolbar
            activeTool={activeTool}
            onToolSelect={handleToolSelect}
            onDownload={handleDownload}
            onRotate={handleRotate}
            isDisabled={!imageState && activeTool !== EditingTool.Generate} // Enable toolbar for Generate even without image
          />
          {showAIPanel && (
            <AIPanel
              userTier={userTier}
              activeTool={activeTool}
              onSubmit={handleAIAction}
              isLoading={isLoadingAI}
              generationsLeft={userTier === UserTier.Free ? MAX_FREE_GENERATIONS - generationsCount : undefined}
              isGenerationDisabled={isAIGenerationDisabled}
              activeCanvasTool={activeCanvasTool}
              onCanvasToolChange={handleCanvasToolSelect}
              brushSize={brushSize}
              onBrushSizeChange={setBrushSize}
              analysisResult={analysisResult}
            />
          )}
          {activeTool === EditingTool.Adjust && imageState && (
            <div className="bg-gray-800 p-4 rounded-lg shadow-xl">
              <h3 className="text-lg font-semibold mb-3 text-indigo-400">Adjustments</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="brightness" className="block text-sm font-medium text-gray-300 mb-1">Brightness: {brightness}%</label>
                  <div className="flex items-center gap-2">
                    <BrightnessIcon className="w-5 h-5 text-gray-400"/>
                    <input type="range" id="brightness" min="0" max="200" value={brightness} onChange={(e) => handleBrightnessChange(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                  </div>
                </div>
                <div>
                  <label htmlFor="contrast" className="block text-sm font-medium text-gray-300 mb-1">Contrast: {contrast}%</label>
                  <div className="flex items-center gap-2">
                    <ContrastIcon className="w-5 h-5 text-gray-400"/>
                    <input type="range" id="contrast" min="0" max="200" value={contrast} onChange={(e) => handleContrastChange(parseInt(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-500" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-3/4 flex-grow flex items-center justify-center bg-gray-800 rounded-lg shadow-xl order-1 md:order-2 p-2 min-h-[300px] md:min-h-0 relative">
          {imageState?.src ? (
            <CanvasEditor
              imageUrl={imageState.src}
              originalImage={{src: imageState.originalSrc, width: imageState.width, height: imageState.height}}
              activeTool={activeTool}
              canvasToolParams={{ tool: activeCanvasTool, brushSize }}
              onMaskUpdate={setMaskDataUrl}
              setEditorInstance={setEditorInstance}
              brightness={brightness}
              contrast={contrast}
            />
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full">
                {activeTool === EditingTool.Generate ? (
                    <div className="text-center p-8">
                         <div className="text-indigo-400 text-6xl mb-4">✨</div>
                         <h2 className="text-2xl font-bold text-gray-300 mb-2">AI Image Generator</h2>
                         <p className="text-gray-400">Enter a prompt on the left to generate a new image.</p>
                    </div>
                ) : (
                    <ImageUploader onImageUpload={handleImageUpload} />
                )}
            </div>
          )}
        </div>
      </main>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-xl max-w-sm z-50">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
          <button onClick={() => setError(null)} className="absolute top-2 right-2 text-red-200 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {isTierModalOpen && (
        <TierModal
          onClose={() => setIsTierModalOpen(false)}
          onUpgrade={handleUpgradeToVIP}
        />
      )}
    </div>
  );
};

export default App;
