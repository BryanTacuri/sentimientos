import { NzTagModule } from 'ng-zorro-antd/tag';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';

import { NzAffixModule } from 'ng-zorro-antd/affix';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';

import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzResultModule } from 'ng-zorro-antd/result';

import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
const myModules = [
  NzCardModule,
  NzButtonModule,
  NzMenuModule,
  NzStepsModule,
  NzTagModule,
  NzLayoutModule,
  NzFormModule,
  NzResultModule,
  NzIconModule,
  NzSwitchModule,
  NzInputModule,
  NzModalModule,
  NzTableModule,
  NzDividerModule,
  NzPopconfirmModule,
  NzAlertModule,
  NzSelectModule,
  NzSkeletonModule,
  NzMessageModule,
  NzDatePickerModule,
  NzPaginationModule,
  NzBreadCrumbModule,
  NzPageHeaderModule,
  NzSpaceModule,
  NzDescriptionsModule,
  NzListModule,
  NzToolTipModule,
  NzCollapseModule,
  NzAffixModule,
  NzResultModule,
  NzSpinModule,
  NzUploadModule,
  NzMessageModule,

  NzDropDownModule,
  NzAvatarModule,
];

@NgModule({
  imports: [...myModules],
  exports: [...myModules],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgZorroModule {}
