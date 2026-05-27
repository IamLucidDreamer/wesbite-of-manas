import { AssistantContext, AssistantResponse, NinoOption } from "./assistant-types";

export const ninoOptions: NinoOption[] = [
  { id: "work", label: "What does Manas work on?", intent: "about" },
  { id: "read", label: "What should I read?", intent: "writing" },
  { id: "projects", label: "Show me the projects.", intent: "projects" },
  { id: "tour", label: "Take me through the site.", intent: "tour" },
  { id: "random", label: "Take me somewhere.", intent: "random" }
];

export const contextualMessages: Record<string, string[]> = {
  home: [
    "oh.",
    "you're here.",
    "the beginning.",
    "what's that?"
  ],
  blogs: [
    "quiet place.",
    "lots of words.",
    "interesting.",
    "let's read."
  ],
  projects: [
    "machinery.",
    "so many tools.",
    "building things."
  ],
  footer: [
    "the bottom.",
    "we made it.",
    "nowhere else to go."
  ],
  default: [
    "hmm.",
    "what's this?",
    "wait.",
    "okay.",
    "found something."
  ]
};

export const clickReactionsFirstTime = [
  "Hey, hi. I'm Nino.",
  "Hi, I'm Nino. Welcome."
];

export const clickReactionsReturn = [
  "Hey again.",
  "Oh, you're back.",
  "Where are we going?"
];

export async function askNino(
  message: string,
  context: AssistantContext
): Promise<AssistantResponse> {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate thinking

  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes("who are you") || lowerMsg.includes("nino")) {
    return { text: "I'm Nino. I live here and help people find their way around." };
  }
  
  if (lowerMsg.includes("work") || lowerMsg.includes("about") || lowerMsg.includes("manas")) {
    return { text: "Mostly software, systems, and developer tools. He seems to enjoy figuring out how things work." };
  }
  
  if (lowerMsg.includes("read") || lowerMsg.includes("writing")) {
    return { 
      text: "I know a few good places to start. Come on.",
      action: "navigate_blogs"
    };
  }

  if (lowerMsg.includes("project")) {
    return { 
      text: "Sure. Let's go look at the machinery.",
      action: "navigate_home" 
    };
  }

  return { text: "That's a difficult one. I'm still learning about that." };
}
