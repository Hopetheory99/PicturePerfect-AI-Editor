
export const UserTier = {
  Free: 'Free',
  VIP: 'VIP',
} as const;
export type UserTier = typeof UserTier[keyof typeof UserTier];

export const EditingTool = {
  None: 'None',
  Crop: 'Crop',
  Rotate: 'Rotate',
  Adjust: 'Adjust', // For brightness, contrast, saturation etc.
  Filters: 'Filters',
  Inpaint: 'Inpaint',
  AIEdit: 'AIEdit',
  Generate: 'Generate',
  Analyze: 'Analyze',
} as const;
export type EditingTool = typeof EditingTool[keyof typeof EditingTool];

export const CanvasTool = {
  Paint: 'Paint',
  Eraser: 'Eraser',
} as const;
export type CanvasTool = typeof CanvasTool[keyof typeof CanvasTool];

export type ImageState = {
  src: string; // Current image data URL
  originalSrc: string; // Original uploaded image data URL
  width: number;
  height: number;
  // history?: string[]; // For undo/redo, optional
};

export type CanvasToolParams = {
  tool: CanvasTool;
  brushSize: number;
  // color?: string; // If we add color selection for brush
};

export type GroundingChunkWeb = {
  uri: string;
  title: string;
};

export type GroundingChunk = {
  web?: GroundingChunkWeb;
  // other types of chunks can be added here if needed
};

export type GroundingMetadata = {
  groundingChunks?: GroundingChunk[];
  // other grounding metadata fields
};
