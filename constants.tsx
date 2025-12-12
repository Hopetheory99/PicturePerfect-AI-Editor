import React from 'react';

// Updated Model Constants per guidelines
export const MODEL_EDIT_IMAGE = 'gemini-2.5-flash-image'; // Nano banana powered app
export const MODEL_GENERATE_IMAGE = 'gemini-3-pro-image-preview'; // Nano Banana Pro
export const MODEL_ANALYZE = 'gemini-3-pro-preview'; // Analyze images
export const MODEL_FAST = 'gemini-2.5-flash-lite'; // Fast AI responses

export const MAX_FREE_GENERATIONS = 5;
export const VIP_PRICE_PER_MONTH = 10;

// Helper component for SVG icons
export type IconProps = {
  className?: string;
  path: string | string[];
};

export const Icon: React.FC<IconProps> = ({ className = "w-6 h-6", path }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    {Array.isArray(path) ? path.map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={p} />) : <path strokeLinecap="round" strokeLinejoin="round" d={path} />}
  </svg>
);

export const UploadIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />;
export const WandIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M9.53 16.122a3 3 0 00-3.197-2.297 3 3 0 00-3.197 2.297M9.53 16.122a3 3 0 003.197 2.297 3 3 0 003.197-2.297M9.53 16.122V9.309m9.161 5.093a3 3 0 00-3.197-2.297 3 3 0 00-3.197 2.297m5.012 0a3 3 0 003.197 2.297 3 3 0 003.197-2.297M14.25 14.25V5.106q0-1.125-.802-1.933A2.042 2.042 0 0012 2.5H9.75M7.5 15H5.106a2.042 2.042 0 01-1.933-.802C2.5 13.444 2.5 12.682 2.5 11.5V9.25m19 5V5.106M7.5 15a3 3 0 003-3M7.5 15a3 3 0 01-3-3m0 0a3 3 0 013-3m-3 3H2.5m19 0h-5.625M14.25 2.5a3 3 0 00-3-3M14.25 2.5a3 3 0 01-3-3" />;
export const CropIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M7.5 3.75H4.5A2.25 2.25 0 002.25 6v12A2.25 2.25 0 004.5 20.25h12A2.25 2.25 0 0018.75 18V16.5M7.5 3.75v12.75M7.5 3.75L18.75 15M16.5 3.75H12" />;
export const RotateCcwIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M15 15l-6 6m0 0l-6-6m6 6V9a6 6 0 0112 0v3" />;
export const AdjustmentsIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M10.5 6h9.75M10.5 6a2.25 2.25 0 11-4.5 0m4.5 0a2.25 2.25 0 10-4.5 0M3.75 6H7.5m3 12h9.75m-9.75 0a2.25 2.25 0 11-4.5 0m4.5 0a2.25 2.25 0 10-4.5 0m-3.75 0H7.5m9-6h3.75m-3.75 0a2.25 2.25 0 11-4.5 0m4.5 0a2.25 2.25 0 10-4.5 0m-12 0h3.75" />;
export const BrightnessIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />;
export const ContrastIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M12 21a9 9 0 110-18 9 9 0 010 18zm0-16.5A7.5 7.5 0 0012 19.5V4.5z" />;
export const FiltersIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M12 3c-1.1 0-2 .9-2 2v2H8c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h2v2c0 1.1.9 2 2 2h2v2c0 1.1.9 2 2 2s2-.9 2-2v-2h2c1.1 0 2-.9 2-2v-2h2c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2h-2V9c0-1.1-.9-2-2-2h-2V5c0-1.1-.9-2-2-2zm0 2v14M5 12h14" />;
export const DownloadIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />;
export const BrushIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M10.05 4.95a5.625 5.625 0 100 11.25 5.625 5.625 0 000-11.25zM17.25 11.25c0 .966-.217 1.88-.608 2.693M10.5 3.75v-.75a.75.75 0 01.75-.75H13.5m0-1.5H9.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125h4.125c.621 0 1.125-.504 1.125-1.125v-1.5A1.125 1.125 0 0013.5 1.5z"/>;
export const EraserIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M18.364 5.636a2.25 2.25 0 00-3.182 0l-10.5 10.5a2.25 2.25 0 000 3.182L6.818 21.45a2.25 2.25 0 003.182 0l10.5-10.5a2.25 2.25 0 000-3.182l-2.136-2.132zM5.636 17.25L17.25 5.636" />;
export const CheckIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M4.5 12.75l6 6 9-13.5" />;
export const PlusIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M12 4.5v15m7.5-7.5h-15" />;
export const MinusIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M19.5 12h-15" />;
export const SparklesIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"/>;
export const ImageIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />;
export const BoltIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />;
export const EyeIcon: React.FC<{className?: string}> = ({className}) => <Icon className={className} path="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178zM12 15a3 3 0 100-6 3 3 0 000 6z" />;