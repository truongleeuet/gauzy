import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslationBaseComponent } from '../../@shared/language-base/translation-base.component';
import {
	IEquipment,
	ComponentLayoutStyleEnum,
	IOrganization
} from '@gauzy/models';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { EquipmentService } from '../../@core/services/equipment.service';
import { EquipmentMutationComponent } from '../../@shared/equipment/equipment-mutation.component';
import { first, takeUntil } from 'rxjs/operators';
import { DeleteConfirmationComponent } from '../../@shared/user/forms/delete-confirmation/delete-confirmation.component';
import { AutoApproveComponent } from './auto-approve/auto-approve.component';
import { Router, RouterEvent, NavigationEnd } from '@angular/router';
import { PictureNameTagsComponent } from '../../@shared/table-components/picture-name-tags/picture-name-tags.component';
import { ComponentEnum } from '../../@core/constants/layout.constants';
import { Store } from '../../@core/services/store.service';
import { Subject } from 'rxjs';

@Component({
	templateUrl: './equipment.component.html',
	styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent extends TranslationBaseComponent
	implements OnInit, OnDestroy {
	settingsSmartTable: object;
	loading = true;
	selectedEquipment: IEquipment;
	smartTableSource = new LocalDataSource();
	form: FormGroup;
	tags: any;
	selectedTags: any;
	equipmentsData: IEquipment[];
	disableButton = true;
	viewComponentName: ComponentEnum;
	dataLayoutStyle = ComponentLayoutStyleEnum.TABLE;

	@ViewChild('equipmentTable') equipmentTable;
	selectedOrganization: IOrganization;
	private _ngDestroy$ = new Subject<void>();

	constructor(
		readonly translateService: TranslateService,
		private dialogService: NbDialogService,
		private equipmentService: EquipmentService,
		private toastrService: NbToastrService,
		private router: Router,
		private store: Store
	) {
		super(translateService);
		this.setView();
	}

	ngOnInit(): void {
		this.loadSmartTable();
		this._applyTranslationOnSmartTable();

		this.router.events
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((event: RouterEvent) => {
				if (event instanceof NavigationEnd) {
					this.setView();
				}
			});

		this.store.selectedOrganization$
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((organization) => {
				if (organization) {
					this.selectedOrganization = organization;
					this.loadSettings();
				}
			});
	}

	ngOnDestroy(): void {
		this._ngDestroy$.next();
		this._ngDestroy$.complete();
	}

	setView() {
		this.viewComponentName = ComponentEnum.EQUIPMENT;
		this.store
			.componentLayout$(this.viewComponentName)
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe((componentLayout) => {
				this.dataLayoutStyle = componentLayout;
			});
	}

	async loadSmartTable() {
		this.settingsSmartTable = {
			actions: false,
			columns: {
				name: {
					title: this.getTranslation('EQUIPMENT_PAGE.EQUIPMENT_NAME'),
					type: 'custom',
					renderComponent: PictureNameTagsComponent
				},
				type: {
					title: this.getTranslation('EQUIPMENT_PAGE.EQUIPMENT_TYPE'),
					type: 'string'
				},
				serialNumber: {
					title: this.getTranslation('EQUIPMENT_PAGE.EQUIPMENT_SN'),
					type: 'string'
				},
				manufacturedYear: {
					title: this.getTranslation(
						'EQUIPMENT_PAGE.EQUIPMENT_MANUFACTURED_YEAR'
					),
					type: 'number',
					filter: false
				},
				initialCost: {
					title: this.getTranslation(
						'EQUIPMENT_PAGE.EQUIPMENT_INITIAL_COST'
					),
					type: 'number',
					filter: false
				},
				currency: {
					title: this.getTranslation(
						'EQUIPMENT_PAGE.EQUIPMENT_CURRENCY'
					),
					type: 'string',
					filter: false
				},
				maxSharePeriod: {
					title: this.getTranslation(
						'EQUIPMENT_PAGE.EQUIPMENT_MAX_SHARE_PERIOD'
					),
					type: 'number',
					filter: false
				},
				autoApproveShare: {
					title: this.getTranslation(
						'EQUIPMENT_PAGE.EQUIPMENT_AUTO_APPROVE'
					),
					type: 'custom',
					filter: false,
					renderComponent: AutoApproveComponent
				}
			}
		};
	}

	manageEquipmentSharing() {
		this.router.navigate(['/pages/organization/equipment-sharing']);
	}

	async save(selectedItem?: IEquipment) {
		if (selectedItem) {
			this.selectEquipment({
				isSelected: true,
				data: selectedItem
			});
		}
		if (this.selectedEquipment) {
			this.selectedTags = this.selectedEquipment.tags;
		} else {
			this.selectedTags = [];
		}
		const dialog = this.dialogService.open(EquipmentMutationComponent, {
			context: {
				equipment: this.selectedEquipment,
				tags: this.selectedTags,
				selectedOrganization: this.selectedOrganization
			}
		});
		const equipment = await dialog.onClose.pipe(first()).toPromise();
		this.selectedEquipment = null;
		this.disableButton = true;

		if (equipment) {
			this.toastrService.primary(
				this.getTranslation('EQUIPMENT_PAGE.EQUIPMENT_SAVED'),
				this.getTranslation('TOASTR.TITLE.SUCCESS')
			);
		}

		this.loadSettings();
	}

	async delete(selectedItem?: IEquipment) {
		if (selectedItem) {
			this.selectEquipment({
				isSelected: true,
				data: selectedItem
			});
		}
		const result = await this.dialogService
			.open(DeleteConfirmationComponent)
			.onClose.pipe(first())
			.toPromise();

		if (result) {
			await this.equipmentService.delete(this.selectedEquipment.id);
			this.loadSettings();
			this.toastrService.primary(
				this.getTranslation('EQUIPMENT_PAGE.EQUIPMENT_DELETED'),
				this.getTranslation('TOASTR.TITLE.SUCCESS')
			);
		}
		this.disableButton = true;
	}

	async loadSettings() {
		this.selectedEquipment = null;
		const { items } = await this.equipmentService.getAll(
			['equipmentSharings', 'tags'],
			{
				organizationId: this.selectedOrganization.id,
				tenantId: this.selectedOrganization.tenantId
			}
		);

		this.loading = false;
		this.equipmentsData = items;
		this.smartTableSource.load(items);
	}

	async selectEquipment({ isSelected, data }) {
		const selectedEquipment = isSelected ? data : null;
		if (this.equipmentTable) {
			this.equipmentTable.grid.dataSet.willSelect = false;
		}
		this.disableButton = !isSelected;
		this.selectedEquipment = selectedEquipment;
	}

	_applyTranslationOnSmartTable() {
		this.translateService.onLangChange
			.pipe(takeUntil(this._ngDestroy$))
			.subscribe(() => {
				this.loadSmartTable();
			});
	}
}
