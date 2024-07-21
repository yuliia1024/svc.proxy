import { Test, TestingModule } from '@nestjs/testing';
import {HttpStatus, INestApplication} from '@nestjs/common';
import * as request from 'supertest';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse } from 'axios';
import {ProxyService} from "../../proxy/proxy.service";
import {ProxyController} from "../../proxy/proxy.controller";

describe('ProxyController (Integration)', () => {
  let app: INestApplication;
  let proxyService: ProxyService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ProxyController],
      providers: [
        ProxyService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn().mockImplementation(() => {
              const mockResponse: AxiosResponse<string> = {
                data: `
                  <html>
                    <body>
                      <div>
                        <a href="/test">Link Module</a>
                        <p>Example тексту with sixsix letters.</p>
                      </div>
                    </body>
                  </html>
                `,
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {
                  headers: undefined
                }
              };
              return of(mockResponse);
            }),
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

    app = moduleFixture.createNestApplication();
    proxyService = moduleFixture.get<ProxyService>(ProxyService);
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/')
      .query({ url: 'https://example.com' })
      .expect(HttpStatus.OK);

    expect(response.text).toContain('Link Module™');
    expect(response.text).toContain('Example тексту™ with sixsix™ letters.');
  });

  afterAll(async () => {
    await app.close();
  });
});
