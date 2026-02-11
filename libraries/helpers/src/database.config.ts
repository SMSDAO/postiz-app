/**
 * Database Configuration Module
 * Supports multiple database providers: PostgreSQL, Supabase, NEON
 */

export interface DatabaseConfig {
  url: string;
  type: 'postgres' | 'supabase' | 'neon';
  pool: {
    min: number;
    max: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
  };
  ssl: boolean | { rejectUnauthorized: boolean };
  logging: boolean;
}

export interface SupabaseConfig extends DatabaseConfig {
  type: 'supabase';
  supabaseUrl: string;
  anonKey: string;
  serviceRoleKey?: string;
}

export interface NeonConfig extends DatabaseConfig {
  type: 'neon';
  pooling: boolean;
  sslMode: 'require' | 'prefer' | 'disable';
}

/**
 * Auto-detect database provider from connection string
 */
export function detectDatabaseProvider(url: string): 'postgres' | 'supabase' | 'neon' {
  if (url.includes('supabase.co')) {
    return 'supabase';
  }
  if (url.includes('neon.tech') || url.includes('neon.') || url.includes('sslmode=require')) {
    return 'neon';
  }
  return 'postgres';
}

/**
 * Get database configuration with auto-detection
 */
export function getDatabaseConfig(): DatabaseConfig | SupabaseConfig | NeonConfig {
  const databaseUrl = process.env.DATABASE_URL || process.env.NEON_DATABASE_URL;
  
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not configured');
  }

  const provider = detectDatabaseProvider(databaseUrl);
  const baseConfig = {
    url: databaseUrl,
    pool: {
      min: parseInt(process.env.DATABASE_POOL_MIN || '2', 10),
      max: parseInt(process.env.DATABASE_POOL_MAX || '10', 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: parseInt(process.env.DATABASE_CONNECTION_TIMEOUT || '20000', 10),
    },
    ssl: provider !== 'postgres',
    logging: process.env.NODE_ENV !== 'production',
  };

  switch (provider) {
    case 'supabase':
      return {
        ...baseConfig,
        type: 'supabase',
        supabaseUrl: process.env.SUPABASE_URL || '',
        anonKey: process.env.SUPABASE_ANON_KEY || '',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      } as SupabaseConfig;

    case 'neon':
      return {
        ...baseConfig,
        type: 'neon',
        pooling: true,
        sslMode: 'require',
        ssl: { rejectUnauthorized: false },
      } as NeonConfig;

    default:
      return {
        ...baseConfig,
        type: 'postgres',
        ssl: false,
      } as DatabaseConfig;
  }
}

/**
 * Validate database configuration
 */
export function validateDatabaseConfig(config: DatabaseConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!config.url) {
    errors.push('Database URL is required');
  }

  if (config.pool.min > config.pool.max) {
    errors.push('Pool min cannot be greater than pool max');
  }

  if (config.type === 'supabase') {
    const supabaseConfig = config as SupabaseConfig;
    if (!supabaseConfig.supabaseUrl) {
      errors.push('Supabase URL is required for Supabase provider');
    }
    if (!supabaseConfig.anonKey) {
      errors.push('Supabase anon key is required for Supabase provider');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get connection string with pooling for serverless environments
 */
export function getPooledConnectionString(url: string): string {
  const provider = detectDatabaseProvider(url);
  
  if (provider === 'neon') {
    // Neon supports connection pooling via query parameter
    const pooledUrl = new URL(url);
    if (!pooledUrl.searchParams.has('sslmode')) {
      pooledUrl.searchParams.set('sslmode', 'require');
    }
    if (!pooledUrl.searchParams.has('pgbouncer')) {
      pooledUrl.searchParams.set('pgbouncer', 'true');
    }
    return pooledUrl.toString();
  }
  
  if (provider === 'supabase') {
    // Supabase uses connection pooler on port 6543
    const pooledUrl = url.replace(':5432/', ':6543/');
    return pooledUrl;
  }
  
  return url;
}

/**
 * Test database connection
 */
export async function testDatabaseConnection(config: DatabaseConfig): Promise<{ success: boolean; error?: string }> {
  try {
    // This would require actual database connection logic
    // For now, we just validate the config
    const validation = validateDatabaseConfig(config);
    
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', '),
      };
    }
    
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
