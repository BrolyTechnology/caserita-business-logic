import { Controller } from '@nestjs/common';
import { HealthBridge } from './bridges/health.bridge';
import { MessagePattern } from '@nestjs/microservices';
import { MS_HEALTH_CHECK } from '@shared/catalogs/event.catalog';

@Controller()
export class HealthHandler {
  constructor(private readonly healthBridge: HealthBridge) {}

  @MessagePattern({ cmd: MS_HEALTH_CHECK })
  checked() {
    return this.healthBridge.checked();
  }
}
