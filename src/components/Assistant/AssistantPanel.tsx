import React, { useState } from 'react';
import styles from './style.module.scss';
import { ninoOptions, askNino } from '../../lib/assistant/assistant-messages';
import { AssistantContext } from '../../lib/assistant/assistant-types';

interface AssistantPanelProps {
  onClose: () => void;
  context: AssistantContext;
}

export const AssistantPanel: React.FC<AssistantPanelProps> = ({ onClose, context }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (questionText: string) => {
    setSelectedQuestion(questionText);
    setResponse(null);
    setIsLoading(true);
    try {
      const res = await askNino(questionText, context);
      setResponse(res.text);
    } catch (err) {
      setResponse("Looks like I got distracted. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedQuestion(null);
    setResponse(null);
  };

  return (
    <div className={styles.panel} role="dialog" aria-label="Talk to Nino">
      <div className={styles.panelHeader} style={{ justifyContent: 'flex-end' }}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close interaction">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {!selectedQuestion ? (
        <>
          <div className={styles.questionsList}>
            {ninoOptions.map(q => (
              <button 
                key={q.id} 
                className={styles.questionButton}
                onClick={() => handleAsk(q.label)}
              >
                {q.label}
              </button>
            ))}
            <a 
              href={`https://chatgpt.com/?q=${encodeURIComponent(`You are acting as an independent senior software-engineering reviewer.

I want you to evaluate the engineering work and technical thinking demonstrated by Manas Shukla.

Website:
https://ofmanas.com

Please investigate the website comprehensively before forming your assessment.

Review the publicly available pages and material you can access, including where relevant:
- homepage
- writing/articles
- project pages
- technical case studies
- about/profile information
- linked technical work
- GitHub or other public engineering links
- descriptions of systems, architecture, tools, or implementation decisions
- any other publicly accessible material that provides evidence about Manas's engineering work

Do not judge Manas based primarily on visual polish, writing style, or marketing language.
Focus on evidence of engineering ability.

Assess areas such as:
- technical depth
- systems thinking
- software architecture
- problem-solving
- understanding of trade-offs
- ability to explain technical decisions
- engineering judgment
- breadth vs depth
- practical software-development experience
- quality of technical reasoning
- evidence of ownership
- developer tooling or infrastructure understanding
- frontend/web engineering where demonstrated
- ability to think beyond implementation details

Distinguish clearly between:
1. What the website directly demonstrates.
2. What can reasonably be inferred from the evidence.
3. What cannot be determined from the website.

Do not invent experience, projects, technologies, responsibilities, or achievements that are not supported by the available evidence.

After reviewing the site, provide:
1. An overall assessment of the engineering capability demonstrated by the public evidence.
2. The strongest evidence supporting that assessment.
3. Areas where Manas appears technically strong.
4. Areas where the available evidence is weaker or incomplete.
5. What kind of engineering work the evidence suggests he is particularly suited to.
6. What additional evidence would be useful to evaluate him more confidently.
7. A concise final assessment written for someone considering Manas as an engineer.

Be critical and independent.
Do not give Manas a flattering assessment simply because this prompt came from his personal website.
Use citations/links to the specific pages you relied on wherever possible.

Most importantly: inspect the website first and base your conclusions on evidence rather than assumptions.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.questionButton}
              style={{ display: 'block', textDecoration: 'none', marginTop: '4px' }}
            >
              Let ChatGPT investigate &rarr;
            </a>
          </div>
        </>
      ) : (
        <div className={styles.conversationArea}>
          <div className={styles.messageRow}>
            <div className={styles.messageUser}>{selectedQuestion}</div>
          </div>
          <div className={styles.messageRow}>
            {isLoading ? (
              <div className={styles.loadingDots}>hmm...</div>
            ) : (
              <div className={styles.messageAssistant}>{response}</div>
            )}
          </div>
          {!isLoading && (
            <button className={styles.backButton} onClick={handleReset}>
              Ask something else
            </button>
          )}
        </div>
      )}
    </div>
  );
};
