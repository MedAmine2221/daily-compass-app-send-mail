import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks.service';
import { TasksScheduler } from './tasks.scheduler';
import { AppService } from 'src/app.service';
import { FirebaseService } from 'src/firebase-admin.init';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TasksService, TasksScheduler, AppService, FirebaseService],
})
export class TasksModule {}
