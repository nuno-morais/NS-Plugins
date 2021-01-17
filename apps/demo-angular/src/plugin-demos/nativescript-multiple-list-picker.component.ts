import { Component, NgZone } from '@angular/core';
import { DemoSharedNativescriptMultipleListPicker } from '@demo/shared';
import {} from '@nuno-morais/nativescript-multiple-list-picker';

@Component({
	selector: 'demo-nativescript-multiple-list-picker',
	templateUrl: 'nativescript-multiple-list-picker.component.html',
})
export class NativescriptMultipleListPickerComponent {
	demoShared: DemoSharedNativescriptMultipleListPicker;

	constructor(private _ngZone: NgZone) {}

	ngOnInit() {
		this.demoShared = new DemoSharedNativescriptMultipleListPicker();
	}
}
