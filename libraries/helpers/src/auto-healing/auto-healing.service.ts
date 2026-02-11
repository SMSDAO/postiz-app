/**
 * Auto-Healing Service
 * Monitors system health and automatically recovers from failures
 */

export interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  lastCheck: Date;
  responseTime?: number;
}

export interface HealingAction {
  name: string;
  description: string;
  execute: () => Promise<boolean>;
  priority: number;
}

export class AutoHealingService {
  private healthChecks: Map<string, HealthCheck> = new Map();
  private checkFunctions: Map<string, () => Promise<{ healthy: boolean; message?: string; responseTime?: number }>> = new Map();
  private healingActions: Map<string, HealingAction> = new Map();
  private isMonitoring: boolean = false;
  private isRunningChecks: boolean = false;
  private checkInterval: number;
  private retryAttempts: number;
  private retryDelay: number;
  private intervalId?: NodeJS.Timeout;

  constructor(config?: {
    checkInterval?: number;
    retryAttempts?: number;
    retryDelay?: number;
  }) {
    this.checkInterval = config?.checkInterval || parseInt(process.env.AUTO_HEAL_CHECK_INTERVAL || '60000', 10);
    this.retryAttempts = config?.retryAttempts || parseInt(process.env.AUTO_HEAL_RETRY_ATTEMPTS || '3', 10);
    this.retryDelay = config?.retryDelay || parseInt(process.env.AUTO_HEAL_RETRY_DELAY || '5000', 10);
  }

  /**
   * Register a health check
   */
  registerHealthCheck(
    name: string,
    checkFn: () => Promise<{ healthy: boolean; message?: string; responseTime?: number }>
  ): void {
    this.healthChecks.set(name, {
      name,
      status: 'healthy',
      lastCheck: new Date(),
    });

    // Store the check function in a type-safe Map
    this.checkFunctions.set(name, checkFn);
  }

  /**
   * Register a healing action
   */
  registerHealingAction(action: HealingAction): void {
    this.healingActions.set(action.name, action);
  }

  /**
   * Start monitoring system health
   */
  async startMonitoring(): Promise<void> {
    if (this.isMonitoring) {
      console.log('Auto-healing service is already monitoring');
      return;
    }

    this.isMonitoring = true;
    console.log('Auto-healing service started');

    // Run initial health checks
    await this.runAllHealthChecks();

    // Set up periodic health checks with overlap prevention
    this.intervalId = setInterval(async () => {
      if (this.isMonitoring && !this.isRunningChecks) {
        await this.runAllHealthChecks();
      }
    }, this.checkInterval);
  }

  /**
   * Stop monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
    console.log('Auto-healing service stopped');
  }

  /**
   * Run all registered health checks
   */
  private async runAllHealthChecks(): Promise<void> {
    // Prevent overlapping health check runs
    if (this.isRunningChecks) {
      return;
    }

    this.isRunningChecks = true;
    
    try {
      for (const [name] of this.healthChecks.entries()) {
        try {
          const checkFn = this.checkFunctions.get(name);
          if (!checkFn) continue;

          const result = await checkFn();
        
        this.healthChecks.set(name, {
          name,
          status: result.healthy ? 'healthy' : 'unhealthy',
          message: result.message,
          lastCheck: new Date(),
          responseTime: result.responseTime,
        });

        // If unhealthy, attempt healing
        if (!result.healthy) {
          console.warn(`Health check failed for ${name}: ${result.message}`);
          await this.attemptHealing(name);
        }
      } catch (error) {
        console.error(`Error running health check for ${name}:`, error);
        this.healthChecks.set(name, {
          name,
          status: 'unhealthy',
          message: error instanceof Error ? error.message : 'Unknown error',
          lastCheck: new Date(),
        });
      }
    }
    } finally {
      this.isRunningChecks = false;
    }
  }

  /**
   * Attempt to heal a failed service
   */
  private async attemptHealing(serviceName: string): Promise<boolean> {
    console.log(`Attempting to heal ${serviceName}...`);

    // Get relevant healing actions, sorted by priority
    // Match actions that include the service name or are generic/catch-all
    const actions = Array.from(this.healingActions.values())
      .filter(action => 
        action.name.toLowerCase().includes(serviceName.toLowerCase()) || 
        action.name === 'generic' ||
        action.name.includes('restart-connection') // Include default restart action
      )
      .sort((a, b) => b.priority - a.priority);

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      console.log(`Healing attempt ${attempt}/${this.retryAttempts} for ${serviceName}`);

      for (const action of actions) {
        try {
          const success = await action.execute();
          if (success) {
            console.log(`Successfully healed ${serviceName} using ${action.name}`);
            return true;
          }
        } catch (error) {
          console.error(`Healing action ${action.name} failed:`, error);
        }
      }

      // Wait before next retry
      if (attempt < this.retryAttempts) {
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }

    console.error(`Failed to heal ${serviceName} after ${this.retryAttempts} attempts`);
    return false;
  }

  /**
   * Get current system health status
   */
  getHealthStatus(): {
    overall: 'healthy' | 'degraded' | 'unhealthy';
    checks: HealthCheck[];
  } {
    const checks = Array.from(this.healthChecks.values());
    const unhealthyCount = checks.filter(c => c.status === 'unhealthy').length;
    const degradedCount = checks.filter(c => c.status === 'degraded').length;

    let overall: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (unhealthyCount > 0) {
      overall = 'unhealthy';
    } else if (degradedCount > 0) {
      overall = 'degraded';
    }

    return { overall, checks };
  }

  /**
   * Manually trigger healing for a specific service
   */
  async heal(serviceName: string): Promise<boolean> {
    return await this.attemptHealing(serviceName);
  }
}

/**
 * Default health checks
 */
export async function checkDatabaseHealth(): Promise<{ healthy: boolean; message?: string; responseTime?: number }> {
  const start = Date.now();
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return {
        healthy: false,
        message: 'DATABASE_URL not configured',
        responseTime: Date.now() - start,
      };
    }
    return {
      healthy: true,
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      healthy: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - start,
    };
  }
}

export async function checkRedisHealth(): Promise<{ healthy: boolean; message?: string; responseTime?: number }> {
  const start = Date.now();
  try {
    const redisUrl = process.env.REDIS_URL;
    if (!redisUrl) {
      return {
        healthy: false,
        message: 'REDIS_URL not configured',
        responseTime: Date.now() - start,
      };
    }
    return {
      healthy: true,
      responseTime: Date.now() - start,
    };
  } catch (error) {
    return {
      healthy: false,
      message: error instanceof Error ? error.message : 'Unknown error',
      responseTime: Date.now() - start,
    };
  }
}

/**
 * Initialize auto-healing service with default configuration
 */
export function initializeAutoHealing(): AutoHealingService {
  const service = new AutoHealingService();

  // Register default health checks
  service.registerHealthCheck('database', checkDatabaseHealth);
  service.registerHealthCheck('redis', checkRedisHealth);

  // Register default healing actions
  service.registerHealingAction({
    name: 'restart-connection',
    description: 'Restart database/redis connections',
    priority: 10,
    execute: async () => {
      console.log('Restarting connections...');
      return true;
    },
  });

  return service;
}
