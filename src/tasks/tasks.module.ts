import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksScheduler } from './tasks.scheduler';
import { AppService } from 'src/app.service';
import { FirebaseService } from 'src/firebase-admin.init';

@Module({
  providers: [TasksService, TasksScheduler, AppService, FirebaseService],
})
export class TasksModule {}
