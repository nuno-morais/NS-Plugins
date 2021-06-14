import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from '@nativescript/angular';

import { HomeComponent } from './home.component';

const routes: Routes = [
	{ path: '', redirectTo: '/home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
	{ path: 'nativescript-multiple-list-picker', loadChildren: () => import('./plugin-demos/nativescript-multiple-list-picker.module').then((m) => m.NativescriptMultipleListPickerModule) },
	{ path: 'nativescript-twilio', loadChildren: () => import('./plugin-demos/nativescript-twilio.module').then((m) => m.NativescriptTwilioModule) },
	{ path: 'zip', loadChildren: () => import('./plugin-demos/zip.module').then((m) => m.ZipModule) },
];

@NgModule({
	imports: [NativeScriptRouterModule.forRoot(routes)],
	exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
