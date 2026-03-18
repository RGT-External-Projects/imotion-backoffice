import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Check overall health' })
  @ApiResponse({ status: 200, description: 'API is healthy' })
  check() {
    return this.health.check([
      () => this.db.pingCheck('database'),
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024), // 512MB
    ]);
  }

  @Get('db')
  @HealthCheck()
  @ApiOperation({ summary: 'Check database health' })
  @ApiResponse({ status: 200, description: 'Database is healthy' })
  checkDatabase() {
    return this.health.check([() => this.db.pingCheck('database')]);
  }

  @Get('memory')
  @HealthCheck()
  @ApiOperation({ summary: 'Check memory usage' })
  @ApiResponse({ status: 200, description: 'Memory is healthy' })
  checkMemory() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 512 * 1024 * 1024),
      () => this.memory.checkRSS('memory_rss', 1024 * 1024 * 1024),
    ]);
  }

  @Get('disk')
  @HealthCheck()
  @ApiOperation({ summary: 'Check disk space' })
  @ApiResponse({ status: 200, description: 'Disk space is healthy' })
  checkDisk() {
    return this.health.check([
      () =>
        this.disk.checkStorage('disk', {
          path: '/',
          thresholdPercent: 0.9, // Alert if > 90% full
        }),
    ]);
  }
}
