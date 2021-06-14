import { DemoSharedNativescriptTwilio } from '@demo/shared';
import { EventData, Http, Page } from '@nativescript/core';
import { VideoActivity, VideoAudioPermissions, VideoView } from '@nuno-morais/nativescript-twilio';

export function navigatingTo(args: EventData) {
	const page = <Page>args.object;
	page.bindingContext = new DemoModel(page);
}

export class DemoModel extends DemoSharedNativescriptTwilio {
	constructor(private page: Page) {
		super();

		const localVideo = this.page.getViewById('local-video') as VideoView;
		const remoteView = this.page.getViewById('remote-video') as VideoView;
		this.videoActivity = new VideoActivity(localVideo, [remoteView]);
	}
	public videoActivity: VideoActivity;

	public async testIt() {
		console.log('hello World...');
		await VideoAudioPermissions.checkAll().then((result) => {
			console.log(result);
		});

		await VideoAudioPermissions.requestAll(null, null).then((result) => {
			console.log(result);
		});

		this.videoActivity.startPreview();

		this.getToken().then((token) => {
			this.videoActivity.connect('testing-room', token, { video: true, audio: true });
		});
	}

	public disconnect() {
		this.videoActivity.disconnect();
	}

	public switchCamera() {
		this.videoActivity.switchCamera();
	}

	public mute() {
		this.videoActivity.mute();
	}

	public unmute() {
		this.videoActivity.unmute();
	}

	public disableCamera() {
		this.videoActivity.disableCamera();
	}

	public enableCamera() {
		this.videoActivity.enableCamera();
	}

	private async getToken(): Promise<string> {
		const userName = 'awesomename22';
		return await Http.getString({
			url: `https://251c4d52a840.ngrok.io/token?identity=${userName}`,
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
		}).catch((e) => {
			console.error(e);
			return null;
		});
	}
}
