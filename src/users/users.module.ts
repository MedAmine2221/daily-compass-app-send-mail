import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersScheduler } from './users.scheduler';
import { FirebaseService } from 'src/firebase-admin.init';

@Module({
  providers: [UsersService, UsersScheduler, FirebaseService],
})
export class UsersModule {}
