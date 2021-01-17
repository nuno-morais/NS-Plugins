import { Observable, EventData, Page } from '@nativescript/core';
import { DemoSharedNativescriptMultipleListPicker } from '@demo/shared';
import {} from '@nuno-morais/nativescript-multiple-list-picker';

export function navigatingTo(args: EventData) {
	const page = <Page>args.object;
	page.bindingContext = new DemoModel();
}

export class DemoModel extends DemoSharedNativescriptMultipleListPicker {}
