import { Directive, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { NativescriptMultipleListPicker } from '@nuno-morais/nativescript-multiple-list-picker';

@Directive({
	selector: 'NativescriptMultipleListPicker',
})
export class NativescriptMultipleListPickerDirective {}

@NgModule({
	declarations: [NativescriptMultipleListPickerDirective],
	exports: [NativescriptMultipleListPickerDirective],
	schemas: [NO_ERRORS_SCHEMA],
})
export class NativescriptMultipleListPickerModule {}

// Uncomment this line if the package provides a custom view component
registerElement('NativescriptMultipleListPicker', () => NativescriptMultipleListPicker);
