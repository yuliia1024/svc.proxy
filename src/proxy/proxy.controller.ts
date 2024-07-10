import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { Response } from 'express';
import { Req } from "@nestjs/common/decorators/http/route-params.decorator";
import { get } from "lodash";

@Controller()
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get()
  async proxy(@Req() req: Request, @Query('url') url: string, @Res() res: Response): Promise<void> {
    try {
      const content = await this.proxyService.fetchAndModify(url, `${get(req, 'protocol')}://${get(req, 'headers.host')}`);
      res.send(content);
    } catch (error) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Failed to fetch content');
    }
  }
}