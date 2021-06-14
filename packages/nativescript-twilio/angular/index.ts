import { Directive, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { registerElement } from '@nativescript/angular';
import { VideoView } from '@nuno-morais/nativescript-twilio';

@Directive({
	selector: 'TwilioVideoView',
})
export class TwilioVideoViewDirective {}

@NgModule({
	declarations: [TwilioVideoViewDirective],
	exports: [TwilioVideoViewDirective],
	schemas: [NO_ERRORS_SCHEMA],
})
export class NativescriptTwilioModule {}

// Uncomment this line if the package provides a custom view component
registerElement('TwilioVideoView', () => VideoView);
