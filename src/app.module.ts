import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ProxyModule } from "./proxy/proxy.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../.env'],
    }),
    ProxyModule
  ],
  controllers: [AppController]
})
export class AppModule {}
