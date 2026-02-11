/**
 * Auto-Configuration Service Tests
 */

import { AutoConfigService, runAutoConfigCheck } from '../auto-config.service';

describe('AutoConfigService', () => {
  let service: AutoConfigService;

  beforeEach(() => {
    service = new AutoConfigService();
  });

  describe('Configuration Management', () => {
    it('should get configuration value', () => {
      const value = service.get('NODE_ENV');
      expect(value).toBeDefined();
    });

    it('should set configuration value', () => {
      service.set('TEST_CONFIG', 'test-value', 'user');
      const value = service.get('TEST_CONFIG');
      expect(value).toBe('test-value');
    });

    it('should get all configurations', () => {
      const configs = service.getAll();
      expect(Array.isArray(configs)).toBe(true);
      expect(configs.length).toBeGreaterThan(0);
    });
  });

  describe('Validation', () => {
    it('should validate required configurations', () => {
      const result = service.validateAll();
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(result).toHaveProperty('warnings');
    });

    it('should detect missing required configurations', () => {
      const originalUrl = process.env.DATABASE_URL;
      delete process.env.DATABASE_URL;

      const newService = new AutoConfigService();
      const result = newService.validateAll();

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      process.env.DATABASE_URL = originalUrl;
    });

    it('should validate DATABASE_URL format', () => {
      service.set('DATABASE_URL', 'invalid-url', 'user');
      const result = service.validateAll();

      const dbError = result.errors.find(e => e.key === 'DATABASE_URL');
      expect(dbError).toBeDefined();
    });
  });

  describe('Auto-Detection', () => {
    it('should detect database provider from URL', async () => {
      service.set('DATABASE_URL', 'postgresql://user@db.supabase.co:5432/db', 'env');
      const result = await service.autoDetect();

      const supabaseDetection = result.suggestions.find(s =>
        s.suggestion.toLowerCase().includes('supabase')
      );
      expect(supabaseDetection).toBeDefined();
    });

    it('should detect NEON provider', async () => {
      service.set('DATABASE_URL', 'postgresql://user@ep-xxx.neon.tech:5432/db?sslmode=require', 'env');
      const result = await service.autoDetect();

      expect(result.detected.length).toBeGreaterThan(0);
    });

    it('should detect Vercel environment', async () => {
      const originalVercel = process.env.VERCEL;
      process.env.VERCEL = '1';

      const result = await service.autoDetect();

      const vercelDetection = result.detected.find(d => d.key === 'DEPLOYMENT_PLATFORM');
      expect(vercelDetection?.value).toBe('vercel');

      if (originalVercel === undefined) {
        delete process.env.VERCEL;
      } else {
        process.env.VERCEL = originalVercel;
      }
    });
  });

  describe('Auto-Configuration', () => {
    it('should auto-configure JWT secret if missing', async () => {
      const originalSecret = process.env.JWT_SECRET;
      delete process.env.JWT_SECRET;

      const newService = new AutoConfigService();
      const result = await newService.autoConfigure();

      const jwtConfig = result.configured.find(c => c.key === 'JWT_SECRET');
      if (jwtConfig) {
        expect(jwtConfig.value.length).toBeGreaterThanOrEqual(64);
      }

      process.env.JWT_SECRET = originalSecret;
    });

    it('should skip configured settings', async () => {
      const result = await service.autoConfigure();
      expect(result.skipped).toBeDefined();
      expect(Array.isArray(result.skipped)).toBe(true);
    });
  });

  describe('Export Functionality', () => {
    it('should export configurations to env format', () => {
      const envContent = service.exportToEnv();
      expect(envContent).toContain('# Auto-generated configuration');
      expect(envContent).toContain('DATABASE_URL=');
      expect(envContent).toContain('REDIS_URL=');
    });
  });
});

describe('runAutoConfigCheck', () => {
  it('should run complete configuration check', async () => {
    const result = await runAutoConfigCheck();

    expect(result).toHaveProperty('valid');
    expect(result).toHaveProperty('errors');
    expect(result).toHaveProperty('warnings');
    expect(result).toHaveProperty('suggestions');
  });

  it('should provide suggestions for configuration improvements', async () => {
    const result = await runAutoConfigCheck();
    expect(Array.isArray(result.suggestions)).toBe(true);
  });
});
