import { Utils } from '@nativescript/core';
import { VideoView } from '.';
import { CameraSourceDelegate, RemoteParticipantDelegate, RoomDelegate } from './delegates.ios';
import { VideoActivityCommon } from './video-activity.common';

declare var TVIConnectOptions, TVICameraSource, TVILocalVideoTrack, TVILocalAudioTrack, TwilioVideoSDK;

export class VideoActivity extends VideoActivityCommon {
	private lastCamera: AVCaptureDevicePosition = AVCaptureDevicePosition.Front;

	private camera: any;
	private readonly cameraSourceDelegate: CameraSourceDelegate;
	private readonly roomDelegate: RoomDelegate;
	private readonly remoteParticipantDelegate: RemoteParticipantDelegate;

	private localVideoTrack: any;
	private localAudioTrack: any;

	private remoteParticipants = [];

	constructor(private readonly localVideoView: VideoView, private readonly remoteVideoViews: VideoView[]) {
		super();

		this.cameraSourceDelegate = CameraSourceDelegate.initWithOwner(new WeakRef(this), this.event);
		this.roomDelegate = RoomDelegate.initWithOwner(new WeakRef(this), this.event, this);
		this.remoteParticipantDelegate = RemoteParticipantDelegate.initWithOwner(new WeakRef(this), this, this.event);
	}

	async startPreview(): Promise<void> {
		if (!Utils.isRealDevice()) {
			return;
		}

		const cameraDevice = TVICameraSource.captureDeviceForPosition(this.lastCamera);
		this.camera = TVICameraSource.alloc().initWithDelegate(this.cameraSourceDelegate);
		this.localVideoTrack = TVILocalVideoTrack.trackWithSource(this.camera);

		if (!this.localVideoView) {
			this.notifyError('localVideoView is not set');

			return;
		}

		if (!this.localVideoTrack) {
			this.notifyError('Failed to add video track');
		} else {
			this.localVideoTrack.addRenderer(this.localVideoView.videoView);
		}

		this.camera.startCaptureWithDevice(cameraDevice);
	}

	protected async setupLocalAudioTrack(): Promise<void> {
		this.localAudioTrack = TVILocalAudioTrack.track();
	}

	protected async setupLocalVideoTrack(): Promise<void> {
		await this.startPreview();
	}

	protected async connectToRoom(room: string, accessToken: string): Promise<void> {
		var connectOptions = TVIConnectOptions.optionsWithTokenBlock(accessToken, (builder) => {
			if (this.localAudioTrack) {
				builder.audioTracks = [this.localAudioTrack];
			}

			if (this.localVideoTrack) {
				builder.videoTracks = [this.localVideoTrack];
			}

			builder.roomName = room;
		});

		this.room = TwilioVideoSDK.connectWithOptionsDelegate(connectOptions, this.roomDelegate);
	}

	protected onLocalParticipantConnectedToRoom(room: any, participant: any): void {
		const length = room.remoteParticipants.count;
		for (let i = 0; i < length; i++) {
			this.remoteParticipants[i] = room.remoteParticipants[i];
			this.remoteParticipants[i].delegate = this.remoteParticipantDelegate;
		}

		this.notifyOut(`onLocalParticipantConnect`, () => ({
			participantName: participant.identity,
		}));
	}

	protected onRemoteParticipantVideoTrackSubscribed(videoTrack: any, participant: any) {
		const remoteParticipantIndex = this.remoteParticipants.indexOf(participant);

		if (remoteParticipantIndex >= 0) {
			videoTrack.addRenderer(this.remoteVideoViews[remoteParticipantIndex].videoView);
		}
	}

	protected onLocalParticipantDisconnectedToRoomWithError(room: any, error: any): void {
		while (this.remoteParticipants.length > 0) {
			this.deleteRemoteParticipant(this.remoteParticipants[0]);
		}
		if (room.localParticipant != null) {
			this.notifyOut(`onLocalParticipantDisconnect`, () => ({
				participantName: room.localParticipant.identity,
			}));
		}
	}

	private deleteRemoteParticipant(participant: any) {
		const remoteParticipantIndex = this.remoteParticipants.indexOf(participant);
		if (remoteParticipantIndex >= 0) {
			const view = this.remoteVideoViews[remoteParticipantIndex];

			this.remoteVideoViews.splice(remoteParticipantIndex, 1);
			this.remoteParticipants.splice(remoteParticipantIndex, 1);
			this.remoteVideoViews.push(view);

			if (participant.videoTracks.count > 0) {
				var videoTrack = participant.remoteVideoTracks[0].remoteTrack;
				if (videoTrack != null) {
					videoTrack.removeRenderer(view.videoView);
				}
			}

			this.notifyOut(`onRemoteParticipantDisconnect`, () => ({
				participantName: participant.identity,
			}));
		}
	}

	protected onRoomParticipantConnectedToRoom(room: any, participant: any): void {
		const remoteParticipantIndex = this.remoteParticipants.indexOf(participant);

		if (remoteParticipantIndex == -1) {
			participant.delegate = this.remoteParticipantDelegate;
			this.remoteParticipants.push(participant);
		}

		this.notifyOut(`onRemoteParticipantConnect`, () => ({
			participantName: participant.identity,
		}));
	}
	protected onRoomParticipantDisconnectedToRoom(room: any, participant: any): void {
		this.deleteRemoteParticipant(participant);
	}
	protected onRemoteParticipantVideoTrackUnsubscribed(videoTrack: any, participant: any) {
		const remoteParticipantIndex = this.remoteParticipants.indexOf(participant);
		if (remoteParticipantIndex > 0) {
			videoTrack.removeRenderer(this.remoteParticipants[remoteParticipantIndex].videoView);
		}
	}

	public mute() {
		if (this.localAudioTrack) {
			this.localAudioTrack.enabled = false;
		}
	}

	public unmute() {
		if (this.localAudioTrack) {
			this.localAudioTrack.enabled = true;
		}
	}

	public async disableCamera(): Promise<boolean> {
		if (this.localVideoTrack) {
			this.localVideoTrack.enabled = false;
		}
		return true;
	}

	public async enableCamera(): Promise<boolean> {
		if (this.localVideoTrack) {
			this.localVideoTrack.enabled = true;
		} else {
			this.setupLocalVideoTrack();
		}
		return true;
	}

	public switchCamera() {
		console.log(`switchCamera`);
		if (this.camera) {
			console.log(`Switching camera`);
			if (this.lastCamera == AVCaptureDevicePosition.Front) {
				this.lastCamera = AVCaptureDevicePosition.Back;
			} else {
				this.lastCamera = AVCaptureDevicePosition.Front;
			}
			const cameraDevice = TVICameraSource.captureDeviceForPosition(this.lastCamera);
			this.camera.selectCaptureDevice(cameraDevice);
		}
	}
}
