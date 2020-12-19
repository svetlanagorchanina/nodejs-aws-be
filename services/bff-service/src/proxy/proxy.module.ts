import { CacheModule, HttpModule, Module } from '@nestjs/common';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { ConfigModule } from '@nestjs/config';

const CACHE_EXPIRATION_TIME = 2 * 60;

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    CacheModule.register({ ttl: CACHE_EXPIRATION_TIME }),
  ],
  controllers: [ProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
