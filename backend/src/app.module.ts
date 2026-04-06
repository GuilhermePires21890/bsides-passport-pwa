import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
    PrismaModule,
    AuthModule,
    AttendeesModule,
    SponsorsModule,
    StampsModule,
    EventsModule,
    AdminModule,
  ],
})
export class AppModule {}
