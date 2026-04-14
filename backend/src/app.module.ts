import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { AttendeesModule } from './modules/attendees/attendees.module';
import { SponsorsModule } from './modules/sponsors/sponsors.module';
import { StampsModule } from './modules/stamps/stamps.module';
import { EventsModule } from './modules/events/events.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60000,   // janela de 60 segundos
        limit: 60,    // máximo 60 requests por IP por minuto (geral)
      },
    ]),
    PrismaModule,
    AuthModule,
    AttendeesModule,
    SponsorsModule,
    StampsModule,
    EventsModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,  // rate limit aplicado globalmente
    },
  ],
})
export class AppModule {}