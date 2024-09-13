import db from 'src/server/data/db';
import { GenerateContent, GenerateContentStream } from 'src/common/type/ai';
import { generateGeminiContent, generateGeminiContentStream } from './gemini';
import { generateOpenaiContent, generateOpenaiContentStream } from './openai';

export const generateContent: GenerateContent = (...params) => {
  const isGemini = db().get().settings.ai.engine === 'gemini';
  const fn = isGemini ? generateGeminiContent : generateOpenaiContent;
  return fn(...params);
};

export const generateContentStream: GenerateContentStream = (...params) => {
  const isGemini = db().get().settings.ai.engine === 'gemini';
  const fn = isGemini
    ? generateGeminiContentStream
    : generateOpenaiContentStream;
  return fn(...params);
};
