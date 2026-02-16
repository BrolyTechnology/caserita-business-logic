import { Injectable } from '@nestjs/common';
import { HealthService } from 'src/features/health/core/services/health.service';

@Injectable()
export class HealthBridge {
  constructor(private readonly healthService: HealthService) {}

  checked() {
    return this.healthService.checked();
  }

  async dummyProxy() {
    return this.healthService.dummyProxy();
  }
}
