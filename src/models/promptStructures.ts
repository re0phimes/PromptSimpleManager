// Base interface for the prompt structure
export interface BasePromptStructure {
    variables: Record<string, string>;
    instruction: string;
    inputContent?: string;
}

// Text structure
export interface TextPromptStructure extends BasePromptStructure {
    format: 'text';
}

// JSON structure
export interface JsonPromptStructure extends BasePromptStructure {
    format: 'json';
}

// YAML structure
export interface YamlPromptStructure extends BasePromptStructure {
    format: 'yaml';
}

export type PromptStructure = TextPromptStructure | JsonPromptStructure | YamlPromptStructure;

