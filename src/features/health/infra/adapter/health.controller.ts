import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HealthBridge } from './bridges/health.bridge';

@Controller('health')
export class HealthController {
  constructor(private readonly healthBridge: HealthBridge) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  checked() {
    return this.healthBridge.checked();
  }

  @Get('/dummy-proxy')
  @HttpCode(HttpStatus.OK)
  async dummyProxy() {
    return this.healthBridge.dummyProxy();
  }
}
