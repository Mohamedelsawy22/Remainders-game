export interface GameState {
  dividend: number; // Total items (e.g., 14)
  divisor: number; // Groups (e.g., 4)
  itemsDistributed: number; // How many currently in groups (per group)
  itemsRemaining: number; // How many left in the main pile
  phase: 'setup' | 'distributing' | 'answering' | 'success';
}

export interface ExplanationResponse {
  story: string;
}
