import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { UsersService } from './users.service';

@Injectable()
export class UsersScheduler {
  constructor(private usersService: UsersService) {}

  @Cron('0 0 * * *') // every day at midnight
  async handleFreePeriodCron() {
    await this.usersService.updateFreePeriod();
  }
}
