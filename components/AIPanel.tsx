
import React, { useState, useEffect } from 'react';
import { UserTier, CanvasTool, EditingTool } from '../types';
import { MAX_FREE_GENERATIONS, BrushIcon, EraserIcon, WandIcon, PlusIcon, MinusIcon, SparklesIcon, ImageIcon, BoltIcon } from '../constants.tsx';

interface AIPanelProps {
  userTier: UserTier;
  activeTool: EditingTool;
  onSubmit: (prompt: string, options?: any) => void;
  isLoading: boolean;
  generationsLeft?: number;
  isGenerationDisabled: boolean;
  activeCanvasTool: CanvasTool;
  onCanvasToolChange: (tool: CanvasTool) => void;
  brushSize: number;
  onBrushSizeChange: (size: number) => void;
  analysisResult?: string | null;
}

export const AIPanel: React.FC<AIPanelProps> = ({
  userTier,
  activeTool,
  onSubmit,
  isLoading,
  generationsLeft,
  isGenerationDisabled,
  activeCanvasTool,
  onCanvasToolChange,
  brushSize,
  onBrushSizeChange,
  analysisResult
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [nsfwEnabled, setNsfwEnabled] = useState<boolean>(false);
  const [imageSize, setImageSize] = useState<'1K' | '2K' | '4K'>('1K');
  const [isFastAnalysis, setIsFastAnalysis] = useState<boolean>(false);

  // Reset prompt when tool changes
  useEffect(() => {
    setPrompt('');
    setIsFastAnalysis(false);
  }, [activeTool]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((activeTool !== EditingTool.Analyze && !prompt.trim()) || isGenerationDisabled) return;
    
    const options: any = { nsfw: nsfwEnabled };
    if (activeTool === EditingTool.Generate) {
      options.imageSize = imageSize;
    }
    if (activeTool === EditingTool.Analyze) {
      options.fastAnalysis = isFastAnalysis;
    }
    
    onSubmit(prompt, options);
  };

  const decreaseBrushSize = () => onBrushSizeChange(Math.max(5, brushSize - 5));
  const increaseBrushSize = () => onBrushSizeChange(Math.min(100, brushSize + 5));

  const getTitle = () => {
    switch (activeTool) {
      case EditingTool.Inpaint: return 'AI Inpaint';
      case EditingTool.AIEdit: return 'AI Edit';
      case EditingTool.Generate: return 'Generate Image';
      case EditingTool.Analyze: return 'Analyze Image';
      default: return 'AI Tools';
    }
  };

  const getDescriptionPlaceholder = () => {
     switch (activeTool) {
      case EditingTool.Inpaint: return 'Describe what to fill in the masked area...';
      case EditingTool.AIEdit: return 'e.g., "Add a retro filter", "Make it look like a painting"';
      case EditingTool.Generate: return 'Describe the image you want to create...';
      case EditingTool.Analyze: return 'Ask a question about the image (optional)...';
      default: return '';
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-xl">
      <h3 className="text-lg font-semibold mb-3 text-indigo-400 flex items-center gap-2">
        {activeTool === EditingTool.Generate && <ImageIcon className="w-5 h-5"/>}
        {activeTool === EditingTool.Inpaint && <BrushIcon className="w-5 h-5"/>}
        {activeTool === EditingTool.AIEdit && <SparklesIcon className="w-5 h-5"/>}
        {getTitle()}
      </h3>
      
      {activeTool === EditingTool.Inpaint && (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Canvas Tool</label>
            <div className="flex space-x-2">
              <button
                onClick={() => onCanvasToolChange(CanvasTool.Paint)}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center w-1/2
                            ${activeCanvasTool === CanvasTool.Paint ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                <BrushIcon className="w-4 h-4 mr-2" /> Mask
              </button>
              <button
                onClick={() => onCanvasToolChange(CanvasTool.Eraser)}
                className={`px-3 py-2 rounded-md text-sm font-medium flex items-center justify-center w-1/2
                            ${activeCanvasTool === CanvasTool.Eraser ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
              >
                <EraserIcon className="w-4 h-4 mr-2" /> Erase
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="brushSize" className="block text-sm font-medium text-gray-300 mb-1">Brush Size: {brushSize}px</label>
            <div className="flex items-center space-x-2">
              <button onClick={decreaseBrushSize} className="p-2 bg-gray-700 rounded hover:bg-gray-600"><MinusIcon className="w-4 h-4" /></button>
              <input
                type="range"
                id="brushSize"
                min="5"
                max="100"
                step="1"
                value={brushSize}
                onChange={(e) => onBrushSizeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
              <button onClick={increaseBrushSize} className="p-2 bg-gray-700 rounded hover:bg-gray-600"><PlusIcon className="w-4 h-4" /></button>
            </div>
          </div>
        </>
      )}

      {activeTool === EditingTool.Generate && (
         <div className="mb-4">
           <label className="block text-sm font-medium text-gray-300 mb-1">Image Size (Quality)</label>
           <select 
             value={imageSize}
             onChange={(e) => setImageSize(e.target.value as any)}
             className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500"
           >
             <option value="1K">1K (Standard)</option>
             <option value="2K">2K (High)</option>
             <option value="4K">4K (Ultra)</option>
           </select>
         </div>
      )}

      {activeTool === EditingTool.Analyze && (
         <div className="mb-4">
            <label className="flex items-center cursor-pointer mb-2">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isFastAnalysis}
                    onChange={() => setIsFastAnalysis(!isFastAnalysis)}
                  />
                  <div className={`block w-10 h-6 rounded-full ${isFastAnalysis ? 'bg-yellow-500' : 'bg-gray-600'}`}></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isFastAnalysis ? 'transform translate-x-full' : ''}`}></div>
                </div>
                <div className="ml-3 text-sm text-gray-300 flex items-center">
                   <BoltIcon className="w-4 h-4 mr-1 text-yellow-400"/> Fast Response Mode
                </div>
            </label>
         </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="ai-prompt" className="block text-sm font-medium text-gray-300 mb-1">
            {activeTool === EditingTool.Analyze ? 'Question (Optional)' : 'Prompt'}
          </label>
          <textarea
            id="ai-prompt"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getDescriptionPlaceholder()}
            className="w-full p-2 border border-gray-600 rounded-md bg-gray-700 text-gray-200 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-500"
            disabled={isLoading}
          />
        </div>

        {userTier === UserTier.VIP && (activeTool === EditingTool.Inpaint || activeTool === EditingTool.Generate || activeTool === EditingTool.AIEdit) && (
          <div className="mb-4">
            <label htmlFor="nsfw-toggle" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="nsfw-toggle"
                  className="sr-only"
                  checked={nsfwEnabled}
                  onChange={() => setNsfwEnabled(!nsfwEnabled)}
                  disabled={isLoading}
                />
                <div className={`block w-10 h-6 rounded-full ${nsfwEnabled ? 'bg-red-500' : 'bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${nsfwEnabled ? 'transform translate-x-full' : ''}`}></div>
              </div>
              <div className="ml-3 text-sm text-gray-300">
                Allow NSFW <span className="text-xs text-red-400">(VIP)</span>
              </div>
            </label>
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerationDisabled || (activeTool !== EditingTool.Analyze && !prompt.trim())}
          className={`w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                      ${isGenerationDisabled || (activeTool !== EditingTool.Analyze && !prompt.trim())
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-gray-800'
                      } transition duration-150 ease-in-out`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <WandIcon className="w-5 h-5 mr-2" />
              {activeTool === EditingTool.Generate ? 'Generate' : activeTool === EditingTool.Analyze ? 'Analyze' : 'Run AI'}
            </>
          )}
        </button>
        {userTier === UserTier.Free && generationsLeft !== undefined && (
          <p className="text-xs text-center text-gray-400 mt-2">
            {Math.max(0, generationsLeft)} / {MAX_FREE_GENERATIONS} credits remaining.
          </p>
        )}
      </form>

      {analysisResult && activeTool === EditingTool.Analyze && (
          <div className="mt-4 p-3 bg-gray-900 rounded border border-gray-700 max-h-60 overflow-y-auto">
              <h4 className="text-sm font-bold text-gray-400 mb-1">Analysis Result:</h4>
              <p className="text-sm text-gray-200 whitespace-pre-wrap">{analysisResult}</p>
          </div>
      )}
    </div>
  );
};
