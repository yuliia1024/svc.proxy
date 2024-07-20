import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService
  ) {}

  protected targetUrl = this.configService.get<string>('TARGET_URL');

  async fetchAndModify(url: string = this.targetUrl, host: string): Promise<string> {
    try {
      const response: AxiosResponse<string> = await firstValueFrom(
        this.httpService.get(url).pipe(
          catchError((error) => {
            this.logger.error(`Error fetching URL: ${error.message}`);
            throw error;
          }),
        ),
      );

      return this.modifyHtml(response.data, host);
    } catch (error) {
      this.logger.error(`Error in fetchAndModify: ${error.message}`);
      throw new Error('Failed to fetch and modify content');
    }
  }

  private modifyHtml(html: string, host: string): string {
    const $ = cheerio.load(html);

    $('link').each((index, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('/')) {
        const newHref = `${this.targetUrl}${href}`;
        $(element).attr('href', newHref);
      }
      if (href && href.startsWith('//')) {
        const newHref = `https:${href}`;
        $(element).attr('href', newHref);
      }
    });

    $('script').each((index, element) => {
      const href = $(element).attr('src');
      if (href && href.startsWith('/')) {
        const newHref = `${this.targetUrl}${href}`;
        $(element).attr('src', newHref);
      }
      if (href && href.startsWith('//')) {
        const newHref = `https:${href}`;
        $(element).attr('src', newHref);
      }
    });

    $('body a').each((index, element) => {
      const href = $(element).attr('href');
      if (href && href.startsWith('/')) {
        const newHref = `${host}/api?url=${this.targetUrl}${href}`;
        $(element).attr('href', newHref);
      }
    })

    let bodyHtml = $('body').html();
    const tempDiv = $('<div>').html(bodyHtml);

    tempDiv.contents().each(function () {
      if (this.type === 'text') {
        const modifiedText = this.data.replace(/\b(\S{6})\b/g, '$1™');
        this.data = modifiedText;
      } else if (this.type === 'tag') {
        $(this).find('*').contents().each(function () {
          if (this.type === 'text') {
            const modifiedText = this.data.replace(/\b(\S{6})\b/g, '$1™');
            this.data = modifiedText;
          }
        });
      }
    });

    bodyHtml = tempDiv.html();
    $('body').html(bodyHtml);
    return $.html();
  }
}
