import { View } from '@nativescript/core';

declare var TVIVideoView;

export class VideoView extends View {
	videoView: any;
	nativeView: any;

	constructor() {
		super();

		this.videoView = TVIVideoView.alloc().init();
		this.videoView.mirror = true;
		this.videoView.contentMode = UIViewContentMode.ScaleAspectFit;
	}

	public createNativeView(): any {
		return this.videoView;
	}

	public disposeNativeView(): void {
		this.nativeView = null;
	}
}
