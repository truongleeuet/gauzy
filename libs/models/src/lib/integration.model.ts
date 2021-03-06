import { SafeResourceUrl } from '@angular/platform-browser';
import { IBasePerTenantAndOrganizationEntityModel } from './base-entity.model';
import { IOrganizationProjectsCreateInput } from '..';

export interface IIntegrationSetting {
	integration: IIntegrationTenant;
	settingsName: string;
	settingsValue: string;
}

export interface IIntegrationEntitySetting {
	// integration: IIntegration;
	entity: string;
	sync: boolean;
	tiedEntities?: any[];
}

export interface IIntegrationMap {
	integration: IIntegrationTenant;
	sourceId: string;
	gauzyId: string;
}

export interface IIntegrationViewModel {
	name: string;
	imgSrc: string | SafeResourceUrl;
	navigation_url: string;
	isComingSoon?: boolean;
}

export interface IIntegrationTenant
	extends IBasePerTenantAndOrganizationEntityModel {
	name: string;
	entitySettings?: IIntegrationEntitySetting[];
}

export interface IIntegration extends IBasePerTenantAndOrganizationEntityModel {
	name: string;
	imgSrc?: string;
	integrationTypes?: IIntegrationType[];
}

export interface IIntegrationType
	extends IBasePerTenantAndOrganizationEntityModel {
	name: string;
	groupName: string;
	order: number;
}

export interface IIntegrationFilter {
	integrationTypeId: string;
	searchQuery: string;
	filter: string;
}

export interface IIntegrationMapSyncProject {
	organizationProjectCreateInput: IOrganizationProjectsCreateInput;
	integrationId: string;
	sourceId: string;
}

export interface IIntegrationMapSyncEntityInput {
	integrationId: string;
	sourceId: string;
	gauzyId: string;
	entity: string;
}

export interface IIntegrationTenantCreateDto {
	name: string;
	entitySettings?: IIntegrationEntitySetting[];
	settings?: any[];
}

export enum IntegrationEnum {
	UPWORK = 'Upwork',
	HUBSTAFF = 'Hubstaff'
}

export enum IntegrationEntity {
	PROJECT = 'Project',
	ORGANIZATION = 'Organization',
	NOTE = 'Note',
	CLIENT = 'Client',
	TASK = 'Task',
	ACTIVITY = 'Activity',
	USER = 'User',
	EMPLOYEE = 'Employee',
	TIME_LOG = 'TimeLog',
	TIME_SLOT = 'TimeSlot',
	SCREENSHOT = 'Screenshot',
	INCOME = 'Income',
	EXPENSE = 'Expense',
	PROPOSAL = 'Proposal'
}

export enum IntegrationTypeGroupEnum {
	FEATURED = 'Featured',
	CATEGORIES = 'Categories'
}

export enum IntegrationTypeNameEnum {
	ALL_INTEGRATIONS = 'All Integrations',
	FOR_SALES_TEAMS = 'For Sales Teams',
	FOR_ACCOUNTANTS = 'For Accountants',
	FOR_SUPPORT_TEAMS = 'For Support Teams',
	CRM = 'CRM',
	SCHEDULING = 'Scheduling',
	TOOLS = 'Tools'
}
