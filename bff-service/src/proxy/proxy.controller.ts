import {
  All,
  Controller,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from './proxy.service';

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All()
  proxy(@Req() request: Request) {
    const [serviceName, ...apiPath] = request.url.split('/').filter(Boolean);
    const apiEndpoint = process.env[serviceName];

    if (!apiEndpoint) {
      throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
    }

    return this.proxyService.request(
      `${apiEndpoint}/${apiPath.join('/')}`,
      request,
    );
  }
}
