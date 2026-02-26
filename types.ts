
export interface PortalItem {
  id: string;
  title: string;
  prompt: string;
  url: string;
  imageUrl: string;
  rotation: number;
  zIndex: number;
}

export interface ImageGenerationState {
  isGenerating: boolean;
  error: string | null;
}
