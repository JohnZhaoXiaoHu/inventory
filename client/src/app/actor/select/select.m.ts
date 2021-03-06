import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// mat modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';


// componets
import { SelectComponent } from './select.c';
import { DialogSelectComponent } from './dialog-select/dialog-select.c';

// routers
import { selectRouter } from './select.r';

const matModules = [
  MatDialogModule,
  MatButtonModule
];

@NgModule({
  imports: [
    CommonModule,

    matModules,

    selectRouter

  ],
  declarations: [
    SelectComponent,
    DialogSelectComponent
  ],
  entryComponents: [
    DialogSelectComponent
  ]
})
export class SelectModule { }