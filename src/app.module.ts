import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';
import { FirebaseService } from './firebase-admin.init';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TasksModule,
    UsersModule,
    ScheduleModule.forRoot(),
  ],
  providers: [AppService, TasksService, FirebaseService, UsersService],
})
export class AppModule {}
