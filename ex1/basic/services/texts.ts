import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export type Level = "easy" | "medium" | "hard";

export interface TypingText {
  id: string;
  content: string;
  level: Level;
}

const dataFile = path.join(__dirname, "../../data/texts.json");

export class TextService {
  private readTexts(): TypingText[] {
    try {
      const data = fs.readFileSync(dataFile, "utf-8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private writeTexts(texts: TypingText[]) {
    fs.writeFileSync(dataFile, JSON.stringify(texts, null, 2), "utf-8");
  }

  getAll(level?: Level): TypingText[] {
    const texts = this.readTexts();
    return level ? texts.filter(t => t.level === level) : texts;
  }

  getById(id: string): TypingText | null {
    const texts = this.readTexts();
    return texts.find(t => t.id === id) || null;
  }

  create(content: string, level: Level): TypingText {
    const texts = this.readTexts();
    const newText: TypingText = { id: uuidv4(), content, level };
    texts.push(newText);
    this.writeTexts(texts);
    return newText;
  }

  replace(id: string, content: string, level: Level): TypingText | null {
    const texts = this.readTexts();
    const index = texts.findIndex(t => t.id === id);
    const newText: TypingText = { id, content, level };

    if (index !== -1) {
      texts[index] = newText;
    } else {
      texts.push(newText);
    }

    this.writeTexts(texts);
    return newText;
  }

  delete(id: string): TypingText | null {
    const texts = this.readTexts();
    const index = texts.findIndex(t => t.id === id);
    if (index === -1) return null;

    const deleted = texts.splice(index, 1)[0];
    this.writeTexts(texts);
    return deleted;
  }
}
