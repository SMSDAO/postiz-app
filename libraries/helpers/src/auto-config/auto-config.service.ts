/**
 * Auto-Configuration Service
 * Automatically detects and configures application settings
 */

import * as crypto from 'crypto';

export interface ConfigurationItem {
  key: string;
  value: string;
  source: 'env' | 'default' | 'detected' | 'user';
  required: boolean;
  description: string;
  validated: boolean;
}

export class AutoConfigService {
  private configurations: Map<string, ConfigurationItem> = new Map();
  private validationRules: Map<string, (value: string) => boolean> = new Map();

  constructor() {
    this.initializeDefaultConfigurations();
  }

  /**
   * Initialize default configurations
   */
  private initializeDefaultConfigurations(): void {
    const defaults: Array<Omit<ConfigurationItem, 'validated'>> = [
      {
        key: 'DATABASE_URL',
        value: process.env.DATABASE_URL || '',
        source: process.env.DATABASE_URL ? 'env' : 'default',
        required: true,
        description: 'PostgreSQL database connection string',
      },
      {
        key: 'REDIS_URL',
        value: process.env.REDIS_URL || 'redis://localhost:6379',
        source: process.env.REDIS_URL ? 'env' : 'default',
        required: true,
        description: 'Redis connection string',
      },
      {
        key: 'JWT_SECRET',
        value: process.env.JWT_SECRET || '',
        source: process.env.JWT_SECRET ? 'env' : 'default',
        required: true,
        description: 'JWT secret for authentication',
      },
      {
        key: 'SESSION_SECRET',
        value: process.env.SESSION_SECRET || '',
        source: process.env.SESSION_SECRET ? 'env' : 'default',
        required: false,
        description: 'Session secret for cookie encryption',
      },
      {
        key: 'FRONTEND_URL',
        value: process.env.FRONTEND_URL || 'http://localhost:4200',
        source: process.env.FRONTEND_URL ? 'env' : 'default',
        required: true,
        description: 'Frontend application URL',
      },
      {
        key: 'NEXT_PUBLIC_BACKEND_URL',
        value: process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000',
        source: process.env.NEXT_PUBLIC_BACKEND_URL ? 'env' : 'default',
        required: true,
        description: 'Backend API URL',
      },
      {
        key: 'OPENAI_API_KEY',
        value: process.env.OPENAI_API_KEY || '',
        source: process.env.OPENAI_API_KEY ? 'env' : 'default',
        required: false,
        description: 'OpenAI API key for AI features',
      },
      {
        key: 'NODE_ENV',
        value: process.env.NODE_ENV || 'development',
        source: process.env.NODE_ENV ? 'env' : 'default',
        required: true,
        description: 'Node environment (development, production, test)',
      },
    ];

    defaults.forEach(config => {
      this.configurations.set(config.key, {
        ...config,
        validated: false,
      });
    });

    // Initialize validation rules
    this.initializeValidationRules();
  }

  /**
   * Initialize validation rules for configurations
   */
  private initializeValidationRules(): void {
    this.validationRules.set('DATABASE_URL', (value) => {
      return value.startsWith('postgres://') || value.startsWith('postgresql://');
    });

    this.validationRules.set('REDIS_URL', (value) => {
      return value.startsWith('redis://') || value.startsWith('rediss://');
    });

    this.validationRules.set('JWT_SECRET', (value) => {
      return value.length >= 32;
    });

    this.validationRules.set('FRONTEND_URL', (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    });

    this.validationRules.set('NEXT_PUBLIC_BACKEND_URL', (value) => {
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    });

    this.validationRules.set('NODE_ENV', (value) => {
      return ['development', 'production', 'test'].includes(value);
    });
  }

  /**
   * Validate all configurations
   */
  validateAll(): {
    valid: boolean;
    errors: Array<{ key: string; message: string }>;
    warnings: Array<{ key: string; message: string }>;
  } {
    const errors: Array<{ key: string; message: string }> = [];
    const warnings: Array<{ key: string; message: string }> = [];

    for (const [key, config] of this.configurations.entries()) {
      const validator = this.validationRules.get(key);

      // Check if required field is missing
      if (config.required && !config.value) {
        errors.push({
          key,
          message: `Required configuration ${key} is missing`,
        });
        continue;
      }

      // Skip validation if no value and not required
      if (!config.value && !config.required) {
        continue;
      }

      // Run validation rule if exists
      if (validator && !validator(config.value)) {
        errors.push({
          key,
          message: `Invalid value for ${key}`,
        });
        config.validated = false;
      } else {
        config.validated = true;
      }

      // Add warnings for default values in production
      if (process.env.NODE_ENV === 'production' && config.source === 'default') {
        warnings.push({
          key,
          message: `${key} is using default value in production`,
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Auto-detect missing configurations
   */
  async autoDetect(): Promise<{
    detected: ConfigurationItem[];
    suggestions: Array<{ key: string; suggestion: string }>;
  }> {
    const detected: ConfigurationItem[] = [];
    const suggestions: Array<{ key: string; suggestion: string }> = [];

    // Detect database provider
    const dbUrl = this.configurations.get('DATABASE_URL')?.value;
    if (dbUrl) {
      let provider = 'unknown';
      if (dbUrl.includes('supabase.co')) {
        provider = 'supabase';
        suggestions.push({
          key: 'DATABASE_PROVIDER',
          suggestion: 'Detected Supabase as database provider',
        });
      } else if (dbUrl.includes('neon.tech')) {
        provider = 'neon';
        suggestions.push({
          key: 'DATABASE_PROVIDER',
          suggestion: 'Detected NEON as database provider',
        });
      }

      if (provider !== 'unknown') {
        detected.push({
          key: 'DATABASE_PROVIDER',
          value: provider,
          source: 'detected',
          required: false,
          description: 'Detected database provider',
          validated: true,
        });
      }
    }

    // Detect environment from NODE_ENV
    const nodeEnv = this.configurations.get('NODE_ENV')?.value;
    if (nodeEnv) {
      suggestions.push({
        key: 'ENVIRONMENT',
        suggestion: `Running in ${nodeEnv} mode`,
      });
    }

    // Detect if running in Vercel
    if (process.env.VERCEL) {
      detected.push({
        key: 'DEPLOYMENT_PLATFORM',
        value: 'vercel',
        source: 'detected',
        required: false,
        description: 'Detected Vercel deployment',
        validated: true,
      });
      suggestions.push({
        key: 'DEPLOYMENT_PLATFORM',
        suggestion: 'Running on Vercel platform',
      });
    }

    return { detected, suggestions };
  }

  /**
   * Auto-configure missing settings with sensible defaults
   */
  async autoConfigure(): Promise<{
    configured: ConfigurationItem[];
    skipped: string[];
  }> {
    const configured: ConfigurationItem[] = [];
    const skipped: string[] = [];

    for (const [key, config] of this.configurations.entries()) {
      if (config.value || !config.required) {
        skipped.push(key);
        continue;
      }

      // Try to auto-configure based on key
      let autoValue: string | null = null;

      switch (key) {
        case 'JWT_SECRET':
          // Generate a random JWT secret
          autoValue = this.generateRandomSecret(64);
          break;
        case 'SESSION_SECRET':
          autoValue = this.generateRandomSecret(64);
          break;
        default:
          skipped.push(key);
          continue;
      }

      if (autoValue) {
        this.configurations.set(key, {
          ...config,
          value: autoValue,
          source: 'detected',
          validated: true,
        });
        configured.push(this.configurations.get(key)!);
      }
    }

    return { configured, skipped };
  }

  /**
   * Generate a cryptographically secure random secret
   */
  private generateRandomSecret(length: number): string {
    // Use Node.js crypto for cryptographically secure random generation
    return crypto.randomBytes(length).toString('base64').slice(0, length);
  }

  /**
   * Get configuration value
   */
  get(key: string): string | undefined {
    return this.configurations.get(key)?.value;
  }

  /**
   * Set configuration value
   */
  set(key: string, value: string, source: 'user' | 'env' | 'detected' = 'user'): void {
    const existing = this.configurations.get(key);
    if (existing) {
      this.configurations.set(key, {
        ...existing,
        value,
        source,
        validated: false,
      });
    } else {
      this.configurations.set(key, {
        key,
        value,
        source,
        required: false,
        description: '',
        validated: false,
      });
    }
  }

  /**
   * Get all configurations
   */
  getAll(): ConfigurationItem[] {
    return Array.from(this.configurations.values());
  }

  /**
   * Export configurations to environment format
   */
  exportToEnv(): string {
    let envContent = '# Auto-generated configuration\n';
    envContent += `# Generated at: ${new Date().toISOString()}\n\n`;

    for (const config of this.configurations.values()) {
      if (config.description) {
        envContent += `# ${config.description}\n`;
      }
      envContent += `${config.key}="${config.value}"\n\n`;
    }

    return envContent;
  }
}

/**
 * Initialize auto-configuration service
 */
export function initializeAutoConfig(): AutoConfigService {
  return new AutoConfigService();
}

/**
 * Run auto-configuration check
 */
export async function runAutoConfigCheck(): Promise<{
  valid: boolean;
  errors: Array<{ key: string; message: string }>;
  warnings: Array<{ key: string; message: string }>;
  suggestions: Array<{ key: string; suggestion: string }>;
}> {
  const service = initializeAutoConfig();
  const validation = service.validateAll();
  const detection = await service.autoDetect();

  return {
    ...validation,
    suggestions: detection.suggestions,
  };
}
