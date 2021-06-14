import { Component } from '@angular/core';

@Component({
	selector: 'demo-home',
	templateUrl: 'home.component.html',
})
export class HomeComponent {
	demos = [
		{
			name: 'nativescript-multiple-list-picker',
		},
		{
			name: 'nativescript-twilio',
		},
		{
			name: 'zip',
		},
	];
}
