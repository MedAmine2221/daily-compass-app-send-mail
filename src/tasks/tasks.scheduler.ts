import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TasksService } from './tasks.service';

@Injectable()
export class TasksScheduler {
  constructor(private tasksService: TasksService) {}

  @Cron('*/1 * * * *') // chaque 5 minutes
  async handleCron() {
    await this.tasksService.checkTasksAndSendEmails();
  }
}
