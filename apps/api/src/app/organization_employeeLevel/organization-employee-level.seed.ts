import { Connection } from 'typeorm';
import { IEmployeeLevelInput } from '@gauzy/models';
import { EmployeeLevel } from './organization-employee-level.entity';
import { Organization } from '../organization/organization.entity';

export const createEmployeeLevels = async (
	connection: Connection,
	organizations: Organization[]
): Promise<IEmployeeLevelInput[]> => {
	let employeeLevels: IEmployeeLevelInput[] = [];

	for (let i = 0; i < organizations.length; i++) {
		const orgArray = [
			{
				level: 'Level A',
				organizationId: organizations[i]['id']
			},
			{
				level: 'Level B',
				organizationId: organizations[i]['id']
			},
			{
				level: 'Level C',
				organizationId: organizations[i]['id']
			},
			{
				level: 'Level D',
				organizationId: organizations[i]['id']
			}
		];
		employeeLevels = employeeLevels.concat(orgArray);
	}

	for (let i = 0; i < employeeLevels.length; i++) {
		await insertLevel(connection, employeeLevels[i]);
	}

	return employeeLevels;
};

const insertLevel = async (
	connection: Connection,
	employeeLevel: IEmployeeLevelInput
): Promise<void> => {
	await connection
		.createQueryBuilder()
		.insert()
		.into(EmployeeLevel)
		.values(employeeLevel)
		.execute();
};
