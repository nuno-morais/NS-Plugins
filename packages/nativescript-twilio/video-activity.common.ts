import { fromObject, Observable } from '@nativescript/core';

export abstract class VideoActivityCommon {
	protected event = new Observable();
	protected outEvent = new Observable();
	protected room: any;

	constructor() {
		this.setupEvents();
	}

	abstract startPreview(): Promise<void>;

	public async disconnect(): Promise<void> {
		if (this.room) {
			this.room.disconnect();
			this.room = null;
		}
	}

	protected notifyError(reason: string) {
		this.event.notify({
			eventName: 'error',
			object: fromObject({
				reason: reason,
			}),
		});
	}

	async connect(room: string, accessToken: string, options: { video: boolean; audio: boolean }): Promise<void> {
		this.validateField('AccessToken', accessToken);
		this.validateField('Room', room);

		if (options && options.audio) {
			await this.setupLocalAudioTrack();
		}

		if (options && options.video) {
			await this.setupLocalVideoTrack();
		}

		await this.connectToRoom(room, accessToken);
		console.log(`Connecting to ${room}.`);
	}

	private validateField(name: string, value: any) {
		if (value == null || value == '') {
			this.notifyError(`Invalid${name}`);
			throw `Invalid${name}`;
		}
	}

	protected abstract setupLocalAudioTrack(): Promise<void>;
	protected abstract setupLocalVideoTrack(): Promise<void>;
	protected abstract connectToRoom(room: string, accessToken: string): Promise<void>;

	private setupEvents(): void {
		this.event.on('didConnectToRoom', (r: any) => {
			console.log('didConnectToRoom');
			this.onLocalParticipantConnectedToRoom(r.object.room, r.object.participant);
		});

		this.event.on('disconnectedWithError', (r: any) => {
			console.log('disconnectedWithError');
			this.onLocalParticipantDisconnectedToRoomWithError(r.object.room, r.object.error);
		});

		this.event.on('roomParticipantDidConnect', (r: any) => {
			console.log('roomParticipantDidConnect');
			this.onRoomParticipantConnectedToRoom(r.object.room, r.object.participant);
		});

		this.event.on('roomParticipantDidDisconnect', (r: any) => {
			console.log('roomParticipantDidDisconnect');
			this.onRoomParticipantDisconnectedToRoom(r.object.room, r.object.participant);
		});

		this.event.on('onVideoTrackSubscribed', (r: any) => {
			console.log('onVideoTrackSubscribed');
			this.onRemoteParticipantVideoTrackSubscribed(r.object.videoTrack, r.object.participant);
		});

		this.event.on('onVideoTrackUnsubscribed', (r: any) => {
			console.log('onVideoTrackUnsubscribed');
			this.onRemoteParticipantVideoTrackUnsubscribed(r.object.videoTrack, r.object.participant);
		});
	}

	protected abstract onLocalParticipantConnectedToRoom(room: any, participant: any): void;
	protected abstract onLocalParticipantDisconnectedToRoomWithError(room: any, error: any): void;
	protected abstract onRoomParticipantConnectedToRoom(room: any, participant: any): void;
	protected abstract onRoomParticipantDisconnectedToRoom(room: any, participant: any): void;
	protected abstract onRemoteParticipantVideoTrackSubscribed(videoTrack: any, participant: any);
	protected abstract onRemoteParticipantVideoTrackUnsubscribed(videoTrack: any, participant: any);

	public abstract mute();
	public abstract unmute();
	public abstract disableCamera(): Promise<boolean>;
	public abstract enableCamera(): Promise<boolean>;
	public abstract switchCamera();

	public subscribeOnRemoteParticipantConnect(fn: (participantName: string) => void) {
		this.outEvent.on('onRemoteParticipantConnect', (r: any) => {
			fn(r.object.participantName);
		});
	}
	public subscribeOnRemoteParticipantDisconnect(fn: (participantName: string) => void) {
		this.outEvent.on('onRemoteParticipantDisconnect', (r: any) => {
			fn(r.object.participantName);
		});
	}
	public subscribeOnLocalParticipantConnect(fn: (participantName: string) => void) {
		this.outEvent.on('onLocalParticipantConnect', (r: any) => {
			fn(r.object.participantName);
		});
	}
	public subscribeOnLocalParticipantDisconnect(fn: (participantName: string) => void) {
		this.outEvent.on('onLocalParticipantDisconnect', (r: any) => {
			fn(r.object.participantName);
		});
	}

	protected notifyOut(eventName: string, fn: any): void {
		try {
			console.log(`Notifying ${eventName}`);
			this.outEvent.notify({
				eventName: eventName,
				object: fromObject(fn()),
			});
		} catch (e) {
			console.error(`An error occurred when sending ${eventName}`);
			console.error(e);
		}
	}
}
