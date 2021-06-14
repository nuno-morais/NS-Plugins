import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { Http } from '@nativescript/core';
import { VideoActivity, VideoAudioPermissions } from '@nuno-morais/nativescript-twilio';

@Component({
	selector: 'demo-nativescript-twilio',
	templateUrl: 'nativescript-twilio.component.html',
})
export class NativescriptTwilioComponent {
	private videoActivity: VideoActivity;

	@ViewChild('localVideoView', { static: true }) localVideoView: ElementRef;
	@ViewChild('remoteVideoView', { static: true }) remoteVideoView: ElementRef;

	constructor(private _ngZone: NgZone) {}

	ngOnInit() {
		this.videoActivity = new VideoActivity(this.localVideoView.nativeElement, [this.remoteVideoView.nativeElement]);
	}

	async connect() {
		console.log(`connect`);
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

	disconnect() {
		console.log(`disconnect.`);
		this.videoActivity.disconnect();
	}

	switchCamera() {
		console.log(`switchCamera`);
		this.videoActivity.switchCamera();
	}

	mute() {
		console.log(`mute`);
		this.videoActivity.mute();
	}

	unmute() {
		console.log(`unmute`);
		this.videoActivity.unmute();
	}

	disableCamera() {
		console.log(`disableCamera`);
		this.videoActivity.disableCamera();
	}

	enableCamera() {
		console.log(`enableCamera`);
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
