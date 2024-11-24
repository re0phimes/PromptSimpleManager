import yaml from 'js-yaml';
import { BasePromptStructure, TextPromptStructure, JsonPromptStructure, YamlPromptStructure } from '../models/promptStructures';

export function toTextStructure(prompt: BasePromptStructure): TextPromptStructure {
  let result = '';
  for (const [key, value] of Object.entries(prompt.variables)) {
    result += `${key}: ${value}\n`;
  }
  result += `\nInstruction: ${prompt.instruction}\n`;
  if (prompt.inputContent) {
    result += `\nInput Content:\n\`\`\`\n${prompt.inputContent}\n\`\`\`\n`;
  }
  return {
    ...prompt,
    format: 'text'
  };
}

export function toJsonStructure(prompt: BasePromptStructure): JsonPromptStructure {
  return {
    ...prompt,
    format: 'json'
  };
}

export function toYamlStructure(prompt: BasePromptStructure): YamlPromptStructure {
  return {
    ...prompt,
    format: 'yaml'
  };
}

export function convertPromptStructure(prompt: PromptStructure, targetFormat: 'text' | 'json' | 'yaml'): PromptStructure {
  switch (targetFormat) {
    case 'text':
      return toTextStructure(prompt);
    case 'json':
      return toJsonStructure(prompt);
    case 'yaml':
      return toYamlStructure(prompt);
    default:
      throw new Error(`Unsupported format: ${targetFormat}`);
  }
}

export function serializePromptStructure(prompt: PromptStructure): string {
  switch (prompt.format) {
    case 'text': {
      const parts = [
        // 只有当variables不为空时才添加
        Object.entries(prompt.variables).length > 0
          ? Object.entries(prompt.variables).map(([key, value]) => `${key}: ${value}`).join('\n')
          : null,
        `Instruction: ${prompt.instruction}`,
        // 只有当inputContent存在时才添加
        prompt.inputContent
          ? `Input Content:\n\`\`\`\n${prompt.inputContent}\n\`\`\`\n`
          : null
      ].filter(Boolean); // 过滤掉null值

      return parts.join('\n\n');
    }
    case 'json':
      return JSON.stringify(prompt, null, 2);
    case 'yaml':
      return yaml.dump(prompt);
  }
}

export function deserializePromptStructure(serialized: string, format: 'text' | 'json' | 'yaml'): PromptStructure {
  let baseStructure: BasePromptStructure;

  switch (format) {
    case 'text':
      const lines = serialized.split('\n');
      const variables: Record<string, string> = {};
      let instruction = '';
      let inputContent = '';
      let isInputContent = false;

      for (const line of lines) {
        if (line.startsWith('Instruction:')) {
          instruction = line.substring('Instruction:'.length).trim();
        } else if (line.startsWith('Input Content:')) {
          isInputContent = true;
        } else if (isInputContent) {
          inputContent += line + '\n';
        } else {
          const [key, value] = line.split(':').map(s => s.trim());
          if (key && value) {
            variables[key] = value;
          }
        }
      }

      baseStructure = {
        variables,
        instruction,
        inputContent: inputContent.trim() || undefined
      };
      break;

    case 'json':
      baseStructure = JSON.parse(serialized);
      break;

    case 'yaml':
      baseStructure = yaml.load(serialized) as BasePromptStructure;
      break;

    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  return convertPromptStructure(baseStructure, format);
}

