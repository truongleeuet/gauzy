import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { OrganizationProject } from '../organization-projects/organization-projects.entity';
import { CommandHandlers } from './commands/handlers';
import { UserService } from '../user/user.service';
import { User } from '../user/user.entity';
import { Employee } from '../employee/employee.entity';
import { EmployeeService } from '../employee/employee.service';
import { RoleService } from '../role/role.service';
import { Role } from '../role/role.entity';

@Module({
	imports: [
		TypeOrmModule.forFeature([
			Task,
			OrganizationProject,
			User,
			Employee,
			Role
		])
	],
	controllers: [TaskController],
	providers: [
		TaskService,
		EmployeeService,
		RoleService,
		...CommandHandlers,
		UserService
	],
	exports: [TaskService]
})
export class TaskModule {}
