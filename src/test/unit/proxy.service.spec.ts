import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import { ProxyService } from "../../proxy/proxy.service";

describe('ProxyService', () => {
  let service: ProxyService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProxyService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('https://example.com'),
          },
        },
      ],
    }).compile();

    service = module.get<ProxyService>(ProxyService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });


  describe('fetchAndModify', () => {
    it('should fetch and modify HTML content', async () => {
      const url = 'https://example.com';
      const host = 'http://localhost:3000';
      const html = `
        <html>
          <body>
            <div>
              <a href="/test">Link Module</a>
              <p>Example text with sixsix letters.</p>
            </div>
          </body>
        </html>
      `;
      const response: AxiosResponse<string> = {
        data: html,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined
        },
      };

      jest.spyOn(httpService, 'get').mockReturnValue(of(response));

      const result = await service.fetchAndModify(url, host);

      expect(result).toContain(`href="${host}/api?url=${url}/test"`);
      expect(result).toContain('Link Module™');
      expect(result).toContain('Example text with sixsix™ letters.');
    });

    it('should throw an error if the request fails', async () => {
      const url = 'https://example.com';
      const host = 'http://localhost:3000';

      jest.spyOn(httpService, 'get').mockImplementation(() => {
        throw new Error('Network error');
      });

      await expect(service.fetchAndModify(url, host)).rejects.toThrow(
        'Failed to fetch and modify content',
      );
    });
  });
});
