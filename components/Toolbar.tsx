
import React from 'react';
import { EditingTool } from '../types';
import { RotateCcwIcon, AdjustmentsIcon, WandIcon, DownloadIcon, SparklesIcon, ImageIcon, EyeIcon, BrushIcon } from '../constants.tsx';

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  tool: EditingTool;
  activeTool: EditingTool;
  onClick: (tool: EditingTool) => void;
  disabled?: boolean;
}

const ToolButton: React.FC<ToolButtonProps> = ({ icon, label, tool, activeTool, onClick, disabled }) => (
  <button
    type="button"
    onClick={() => onClick(tool)}
    disabled={disabled}
    className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-150 ease-in-out
                w-full aspect-square
                ${activeTool === tool ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    title={label}
  >
    {icon}
    <span className="mt-1 text-xs font-medium text-center leading-tight">{label}</span>
  </button>
);

interface ToolbarProps {
  activeTool: EditingTool;
  onToolSelect: (tool: EditingTool) => void;
  onDownload: () => void;
  onRotate: () => void;
  isDisabled?: boolean;
}

interface ToolDefinition {
  id: EditingTool;
  label: string;
  icon: React.ReactNode;
  requiresImage?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onToolSelect, onDownload, onRotate, isDisabled }) => {
  const tools: ToolDefinition[] = [
    { id: EditingTool.Generate, label: 'Generate', icon: <ImageIcon className="w-6 h-6"/>, requiresImage: false },
    { id: EditingTool.Inpaint, label: 'Inpaint', icon: <BrushIcon className="w-6 h-6"/>, requiresImage: true },
    { id: EditingTool.AIEdit, label: 'AI Edit', icon: <SparklesIcon className="w-6 h-6"/>, requiresImage: true },
    { id: EditingTool.Adjust, label: 'Adjust', icon: <AdjustmentsIcon className="w-6 h-6"/>, requiresImage: true },
    { id: EditingTool.Analyze, label: 'Analyze', icon: <EyeIcon className="w-6 h-6"/>, requiresImage: true },
  ];

  return (
    <div className="bg-gray-800 p-3 rounded-lg shadow-xl space-y-3">
      <h3 className="text-lg font-semibold mb-2 text-indigo-400">Tools</h3>
      <div className="grid grid-cols-2 gap-2">
        {tools.map((item) => (
          <ToolButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            tool={item.id}
            activeTool={activeTool}
            onClick={onToolSelect}
            disabled={item.requiresImage && isDisabled}
          />
        ))}
         <button
            type="button"
            onClick={onRotate}
            disabled={isDisabled}
            className={`flex flex-col items-center justify-center p-3 rounded-lg transition-all duration-150 ease-in-out
                        w-full aspect-square
                        bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white
                        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            title="Rotate"
          >
            <RotateCcwIcon className="w-6 h-6"/>
            <span className="mt-1 text-xs font-medium">Rotate</span>
        </button>
      </div>
      <button
        type="button"
        onClick={onDownload}
        disabled={isDisabled}
        className={`w-full flex items-center justify-center mt-3 py-3 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors duration-150
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <DownloadIcon className="w-5 h-5 mr-2"/>
        Download
      </button>
    </div>
  );
};
