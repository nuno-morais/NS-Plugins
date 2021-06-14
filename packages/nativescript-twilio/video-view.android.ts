import { Utils, View } from '@nativescript/core';

declare var com: any;
const TwilioVideoView = com.twilio.video.VideoView;
const VideoScaleType = com.twilio.video.VideoScaleType;

export class VideoView extends View {
	videoView: any;

	constructor() {
		super();
		this.videoView = new TwilioVideoView(Utils.ad.getApplicationContext());
		this.videoView.setVideoScaleType(VideoScaleType.ASPECT_FIT);
		this.videoView.setMirror(true);
	}

	public createNativeView() {
		return this.videoView;
	}

	public disposeNativeView() {
		this.nativeView = null;
	}
}
