// src/app.module.ts
import { Module } from '@nestjs/common';
import { TasksModule } from './task/tasks.module';

@Module({
  imports: [TasksModule],
})
export class AppModule {}
