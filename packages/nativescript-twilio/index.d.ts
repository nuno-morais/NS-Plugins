import { View } from '@nativescript/core';

export declare class VideoView extends View {
	videoView: any;
	nativeView: any;

	setMirror(enabled: boolean);
	createNativeView(): any;
	disposeNativeView(): void;
}

export declare class VideoAudioPermissions {
	static checkAll(): Promise<boolean>;
	static checkAudio(): Promise<boolean>;
	static checkVideo(): Promise<boolean>;
	static requestAll(messageAudio: ?string, messageVideo: ?string): Promise<boolean>;
	static requestAudio(message: ?string): Promise<boolean>;
	static requestVideo(message: ?string): Promise<boolean>;
}

export declare class VideoActivity {
	constructor(localVideoViews: VideoView, remoteVideoViews: VideoView[]);
	startPreview(): Promise<void>;
	connect(room: string, accessToken: string, options: { video: boolean; audio: boolean }): Promise<void>;
	disconnect(): Promise<void>;

	mute();
	unmute();
	disableCamera();
	enableCamera();
	switchCamera();

	subscribeOnRemoteParticipantConnect(fn: (participantName: string) => void);
	subscribeOnRemoteParticipantDisconnect(fn: (participantName: string) => void);
	subscribeOnLocalParticipantConnect(fn: (participantName: string) => void);
	subscribeOnLocalParticipantDisconnect(fn: (participantName: string) => void);
}
