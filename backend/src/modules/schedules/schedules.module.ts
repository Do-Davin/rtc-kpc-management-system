import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SchedulesService } from './schedules.service';
import { SchedulesController } from './schedules.controller';
import { Schedule } from './entities/schedule.entity';
import { Teacher } from '../teachers/entities/teacher.entity';
import { Department } from '../departments/entities/department.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Teacher, Department])],
  controllers: [SchedulesController],
  providers: [SchedulesService],
  exports: [SchedulesService],
})
export class SchedulesModule {}
