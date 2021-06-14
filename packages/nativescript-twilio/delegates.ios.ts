import { fromObject, Observable } from '@nativescript/core';

declare var TVIVideoViewDelegate, TVICameraSourceDelegate, TVIRemoteParticipantDelegate, NSObject, TVIRoomDelegate;

@NativeClass()
class RoomDelegate extends NSObject {
	static ObjCProtocols = [TVIRoomDelegate];

	public constructor(private readonly _owner: WeakRef<any>, private readonly event: Observable, public readonly context: any) {
		super();
	}

	public static initWithOwner(owner: WeakRef<any>, event: Observable, ctx): RoomDelegate {
		return new RoomDelegate(owner, event, ctx);
	}

	private notify(eventName: string, fn: any): void {
		try {
			console.log(`Notifying ${eventName}`);
			this.event.notify({
				eventName: eventName,
				object: fromObject(fn()),
			});
		} catch (e) {
			console.error(`An error occurred when sending ${eventName}`);
			console.error(e);
		}
	}

	public didConnectToRoom(room): void {
		this.notify(`didConnectToRoom`, () => ({
			room: room,
			participant: room.localParticipant,
		}));
	}

	public roomDidDisconnectWithError(room, error): void {
		this.notify(`disconnectedWithError`, () => ({
			room: room,
			error: error,
		}));
	}

	public roomDidFailToConnectWithError(room, error): void {
		this.notify(`didFailToConnectWithError`, () => ({
			room: room,
			error: error,
		}));
	}

	public roomIsReconnectingWithError(room, error): void {
		this.notify(`roomIsReconnectingWithError`, () => ({
			room: room,
			error: error,
		}));
	}

	public didReconnectToRoom(room): void {
		this.notify(`didReconnectToRoom`, () => ({
			room: room,
		}));
	}

	public roomParticipantDidConnect(room, participant): void {
		this.notify(`roomParticipantDidConnect`, () => ({
			room: room,
			participant: participant,
		}));
	}

	public roomParticipantDidDisconnect(room, participant): void {
		this.notify(`roomParticipantDidDisconnect`, () => ({
			room: room,
			participant: participant,
		}));
	}
}

@NativeClass()
class RemoteParticipantDelegate extends NSObject {
	static ObjCProtocols = [TVIRemoteParticipantDelegate];

	public constructor(private readonly _owner: WeakRef<any>, private readonly event: Observable, public readonly context: any) {
		super();
	}

	public static initWithOwner(owner: WeakRef<any>, ctx: any, event: Observable): RemoteParticipantDelegate {
		return new RemoteParticipantDelegate(owner, event, ctx);
	}

	private notify(eventName: string, fn: any): void {
		try {
			console.log(`Notifying ${eventName}`);
			this.event.notify({
				eventName: eventName,
				object: fromObject(fn()),
			});
		} catch (e) {
			console.error(`An error occurred when sending ${eventName}`);
			console.error(e);
		}
	}

	public remoteParticipantDidPublishVideoTrack(participant, publication): void {
		// Remote Participant has offered to share the video Track.
		this.notify(`participantPublishedVideoTrack`, () => ({
			participant: participant,
			publication: publication,
		}));
	}

	public remoteParticipantDidUnpublishVideoTrack(participant, publication): void {
		// Remote Participant has stopped sharing the video Track.
		this.notify(`participantUnpublishedVideoTrack`, () => ({
			participant: participant,
			publication: publication,
		}));
	}

	public remoteParticipantDidPublishAudioTrack(participant, publication): void {
		// Remote Participant has offered to share the audio Track.
		this.notify(`participantPublishedAudioTrack`, () => ({
			participant: participant,
			publication: publication,
		}));
	}

	public remoteParticipantDidUnpublishAudioTrack(participant, publication): void {
		// Remote Participant has stopped sharing the audio Track.
		this.notify(`participantUnpublishedAudioTrack`, () => ({
			participant: participant,
			publication: publication,
		}));
	}

	public didSubscribeToVideoTrackPublicationForParticipant(videoTrack, publication, participant): void {
		this.notify(`onVideoTrackSubscribed`, () => ({
			videoTrack: videoTrack,
			publication: publication,
			participant: participant,
		}));
	}

	public didUnsubscribeToVideoTrackPublicationForParticipant(videoTrack, publication, participant): void {
		this.notify(`onVideoTrackUnsubscribed`, () => ({
			videoTrack: videoTrack,
			publication: publication,
			participant: participant,
		}));
	}

	public didSubscribeToAudioTrackPublicationForParticipant(audioTrack, publication, participant): void {
		this.notify(`onAudioTrackSubscribed`, () => ({
			audioTrack: audioTrack,
			publication: publication,
			participant: participant,
		}));
	}

	public didUnsubscribeToAudioTrackPublicationForParticipant(audioTrack, publication, participant): void {
		this.notify(`onAudioTrackUnsubscribed`, () => ({
			audioTrack: audioTrack,
			publication: publication,
			participant: participant,
		}));
	}

	public remoteParticipantDidEnableVideoTrack(participant, publication): void {
		this.notify(`participantEnabledVideoTrack`, () => ({
			publication: publication,
			participant: participant,
		}));
	}

	public remoteParticipantDidDisableVideoTrack(participant, publication): void {
		this.notify(`participantDisabledVideoTrack`, () => ({
			publication: publication,
			participant: participant,
		}));
	}

	public remoteParticipantDidEnableAudioTrack(participant, publication): void {
		this.notify(`participantEnabledAudioTrack`, () => ({
			publication: publication,
			participant: participant,
		}));
	}

	public remoteParticipantDidDisableAudioTrack(participant, publication): void {
		this.notify(`participantDisabledAudioTrack`, () => ({
			publication: publication,
			participant: participant,
		}));
	}
}

@NativeClass()
class VideoViewDelegate extends NSObject {
	public static ObjCProtocols = [TVIVideoViewDelegate];

	public constructor(private readonly _owner: WeakRef<any>, private readonly event: Observable) {
		super();
	}

	public static initWithOwner(owner: WeakRef<any>, event: Observable): VideoViewDelegate {
		return new VideoViewDelegate(owner, event);
	}

	private notify(eventName: string, fn: any): void {
		try {
			console.log(`Notifying ${eventName}`);
			this.event.notify({
				eventName: eventName,
				object: fromObject(fn()),
			});
		} catch (e) {
			console.error(`An error occurred when sending ${eventName}`);
			console.error(e);
		}
	}

	public videoViewDidReceiveData(view: any) {
		this.notify(`videoViewDidReceiveData`, () => ({
			view: view,
		}));
	}
}

@NativeClass()
class CameraSourceDelegate extends NSObject {
	public static ObjCProtocols = [TVICameraSourceDelegate]; // define our native protocalls

	public constructor(private readonly _owner: WeakRef<any>, private readonly event: Observable) {
		super();
	}

	private notify(eventName: string, fn: any): void {
		try {
			console.log(`Notifying ${eventName}`);
			this.event.notify({
				eventName: eventName,
				object: fromObject(fn()),
			});
		} catch (e) {
			console.error(`An error occurred when sending ${eventName}`);
			console.error(e);
		}
	}

	static initWithOwner(owner: WeakRef<any>, event: Observable): CameraSourceDelegate {
		return new CameraSourceDelegate(owner, event);
	}

	public cameraSourceDidStartWithSource(capturer: any, source: any) {
		this.notify(`cameraSource`, () => ({
			capturer: capturer,
			source: source,
		}));
	}

	public cameraSourceWasInterrupted(capturer: any, reason: any) {
		this.notify(`cameraSourceWasInterrupted`, () => ({ capturer, reason }));
	}

	public cameraSourceDidFailWithError(capturer: any, error: any) {
		this.notify(`cameraSourceDidFailWithError`, () => ({ capturer, error }));
	}
}

export { CameraSourceDelegate };
export { RemoteParticipantDelegate };
export { VideoViewDelegate };
export { RoomDelegate };
