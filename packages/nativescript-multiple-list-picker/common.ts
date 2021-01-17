import { CoercibleProperty, Property, View } from '@nativescript/core';

export abstract class NativescriptMultipleListPickerCommon extends View {
	public static valueChangeEvent: string = 'valueChange';

	public value: Array<String> = [];
	public items: Array<Array<string>> = [];
	public textField: string;

	public constructor() {
		super();
	}

	public getItemAsString(column: number, index: number): string {
		let items = this.items || [];
		if (!items[column] || !items[column][index]) {
			return '';
		}
		let item = items[column][index];
		return item === undefined || item === null ? index + '' : this.parseItem(item);
	}

	private parseItem(item) {
		return this.textField ? item[this.textField] + '' : item + '';
	}

	public updateSelectedValue(values) {
		if (this.value !== values) {
			this.set('selectedValue', values);
		}
	}
}

export const valueProperty = new CoercibleProperty<NativescriptMultipleListPickerCommon, Array<String>>({
	name: 'value',
	defaultValue: [],
	valueConverter: (v) => v.split(''),
	coerceValue: (target, value) => {
		target.updateSelectedValue(value);
		return value;
	},
});
valueProperty.register(NativescriptMultipleListPickerCommon);

export const itemsProperty = new Property<NativescriptMultipleListPickerCommon, Array<Array<string>>>({
	name: 'items',
});
itemsProperty.register(NativescriptMultipleListPickerCommon);
