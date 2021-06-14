import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule, NativeScriptRouterModule } from '@nativescript/angular';
import { NativescriptTwilioModule as NativescriptTwilioVideoModule } from '@nuno-morais/nativescript-twilio/angular';
import { NativescriptTwilioComponent } from './nativescript-twilio.component';

@NgModule({
	imports: [NativeScriptCommonModule, NativeScriptRouterModule.forChild([{ path: '', component: NativescriptTwilioComponent }]), NativescriptTwilioVideoModule],
	declarations: [NativescriptTwilioComponent],
	schemas: [NO_ERRORS_SCHEMA],
})
export class NativescriptTwilioModule {}
