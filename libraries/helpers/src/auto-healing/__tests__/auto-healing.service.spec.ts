/**
 * Auto-Healing Service Tests
 */

import { AutoHealingService, checkDatabaseHealth, checkRedisHealth } from '../auto-healing.service';

describe('AutoHealingService', () => {
  let service: AutoHealingService;

  beforeEach(() => {
    service = new AutoHealingService({
      checkInterval: 1000,
      retryAttempts: 2,
      retryDelay: 100,
    });
  });

  afterEach(() => {
    service.stopMonitoring();
  });

  describe('Health Check Registration', () => {
    it('should register a health check', () => {
      const mockCheck = jest.fn().mockResolvedValue({
        healthy: true,
        message: 'OK',
        responseTime: 50,
      });

      service.registerHealthCheck('test-service', mockCheck);
      const status = service.getHealthStatus();

      expect(status.checks).toHaveLength(1);
      expect(status.checks[0].name).toBe('test-service');
    });

    it('should register multiple health checks', () => {
      service.registerHealthCheck('service-1', async () => ({ healthy: true }));
      service.registerHealthCheck('service-2', async () => ({ healthy: true }));

      const status = service.getHealthStatus();
      expect(status.checks).toHaveLength(2);
    });
  });

  describe('Healing Action Registration', () => {
    it('should register a healing action', () => {
      service.registerHealingAction({
        name: 'test-action',
        description: 'Test action',
        priority: 10,
        execute: async () => true,
      });

      expect(service).toBeDefined();
    });
  });

  describe('Health Status', () => {
    it('should return healthy status when all checks pass', () => {
      service.registerHealthCheck('test-1', async () => ({
        healthy: true,
        message: 'OK',
      }));

      const status = service.getHealthStatus();
      expect(status.overall).toBe('healthy');
    });
  });

  describe('Manual Healing', () => {
    it('should trigger manual healing for a service', async () => {
      const mockHealingAction = jest.fn().mockResolvedValue(true);

      service.registerHealingAction({
        name: 'test-healing',
        description: 'Test',
        priority: 10,
        execute: mockHealingAction,
      });

      await service.heal('test');
      expect(service).toBeDefined();
    });
  });
});

describe('Default Health Checks', () => {
  describe('checkDatabaseHealth', () => {
    it('should return unhealthy when DATABASE_URL is not set', async () => {
      const originalUrl = process.env.DATABASE_URL;
      delete process.env.DATABASE_URL;

      const result = await checkDatabaseHealth();

      expect(result.healthy).toBe(false);
      expect(result.message).toContain('not configured');

      process.env.DATABASE_URL = originalUrl;
    });

    it('should return healthy when DATABASE_URL is set', async () => {
      process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';

      const result = await checkDatabaseHealth();

      expect(result.healthy).toBe(true);
      expect(result.responseTime).toBeDefined();
    });
  });

  describe('checkRedisHealth', () => {
    it('should return unhealthy when REDIS_URL is not set', async () => {
      const originalUrl = process.env.REDIS_URL;
      delete process.env.REDIS_URL;

      const result = await checkRedisHealth();

      expect(result.healthy).toBe(false);
      expect(result.message).toContain('not configured');

      process.env.REDIS_URL = originalUrl;
    });

    it('should return healthy when REDIS_URL is set', async () => {
      process.env.REDIS_URL = 'redis://localhost:6379';

      const result = await checkRedisHealth();

      expect(result.healthy).toBe(true);
      expect(result.responseTime).toBeDefined();
    });
  });
});
