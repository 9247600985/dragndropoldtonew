import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutRoutes } from './layout.routing';
import { DeviceUtil } from '../utils/DeviceUtil';
@NgModule({
    imports: [
        RouterModule.forChild(LayoutRoutes),
        FormsModule,
        ReactiveFormsModule,
        FontAwesomeModule,
    ],
    declarations: []
})
export class LayoutModule {

}
