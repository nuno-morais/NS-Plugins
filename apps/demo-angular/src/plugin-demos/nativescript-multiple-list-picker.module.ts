import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { NativescriptMultipleListPickerModule as NativescriptMultipleListPickerModuleAngular } from '@nuno-morais/nativescript-multiple-list-picker/angular';
import { NativescriptMultipleListPickerComponent } from './nativescript-multiple-list-picker.component';

@NgModule({
	imports: [NativeScriptCommonModule, NativescriptMultipleListPickerModuleAngular, NativeScriptRouterModule.forChild([{ path: '', component: NativescriptMultipleListPickerComponent }])],
	declarations: [NativescriptMultipleListPickerComponent],
	schemas: [NO_ERRORS_SCHEMA],
})
export class NativescriptMultipleListPickerModule {}
