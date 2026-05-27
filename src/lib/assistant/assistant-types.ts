export type ResidentState = 
  | "idle" 
  | "walking" 
  | "sneaking"
  | "inspecting" 
  | "reacting" 
  | "speaking" 
  | "chatting" 
  | "sleepy" 
  | "jumping" 
  | "wiggling" 
  | "stretching" 
  | "startled" 
  | "resting" 
  | "thinking";

export type ResidentMood = 
  | "curious" 
  | "bored" 
  | "excited" 
  | "confused" 
  | "neutral" 
  | "sleepy" 
  | "calm" 
  | "playful" 
  | "surprised"
  | "shy";

export type FacingDirection = "left" | "right";

export type AssistantContext = {
  page: string;
  section?: string;
};

export type AssistantResponse = {
  text: string;
  action?: string;
};

export type NinoOption = {
  id: string;
  label: string;
  intent: string;
};
