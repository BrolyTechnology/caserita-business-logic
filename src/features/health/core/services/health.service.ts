import { Injectable } from '@nestjs/common';
import * as pk from '../../../../../package.json';
import { DattebayoProxy } from '@shared/proxies/dattebayo.proxy';

@Injectable()
export class HealthService {
  constructor(private readonly dattebayoProxy: DattebayoProxy) {}

  checked() {
    return {
      name: pk.name.toUpperCase(),
      version: pk.version,
      message: `Welcome to my service`,
    };
  }

  async dummyProxy() {
    return this.dattebayoProxy.characters();
  }
}
