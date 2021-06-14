import { Application, Utils } from '@nativescript/core';
import { VideoView } from '.';
import { remoteParticipantListener, roomListener } from './delegates.android';
import { VideoActivityCommon } from './video-activity.common';

declare var com, dev, android, java: any;

const CameraCapturerCompat = dev.morais.twiliovideo.CameraCapturerCompat;
const AudioManager = android.media.AudioManager;
const AudioAttributes = android.media.AudioAttributes;
const AudioFocusRequest = android.media.AudioFocusRequest;
const Video = com.twilio.video.Video;
const ConnectOptions = com.twilio.video.ConnectOptions;
const LocalAudioTrack = com.twilio.video.LocalAudioTrack;
const LocalVideoTrack = com.twilio.video.LocalVideoTrack;

export class VideoActivity extends VideoActivityCommon {
	private localVideoTrack: any;
	private lastCamera = CameraCapturerCompat.Source.FRONT_CAMERA;
	private camera: any;

	private audioManager: any;
	public previousMicrophoneMute: boolean;
	private previousAudioMode: any;

	private remoteParticipants = [];

	private localParticipant: any;
	private localAudioTrack: any;

	constructor(private readonly localVideoView: VideoView, private readonly remoteVideoViews: VideoView[]) {
		super();
	}

	async startPreview(): Promise<void> {
		if (this.localVideoTrack && this.localVideoTrack !== null) {
			return;
		}

		this.camera = new CameraCapturerCompat(Utils.ad.getApplicationContext(), this.lastCamera);
		this.localVideoTrack = LocalVideoTrack.create(Utils.ad.getApplicationContext(), true, this.camera, 'camera');
		if (this.localParticipant != null) {
			this.localParticipant.publishTrack(this.localVideoTrack);
		}

		this.localVideoTrack.addSink(this.localVideoView.videoView);
	}

	protected async setupLocalAudioTrack(): Promise<void> {
		Application.android.foregroundActivity.setVolumeControlStream(AudioManager.STREAM_VOICE_CALL);
		this.audioManager = Application.android.context.getSystemService(android.content.Context.AUDIO_SERVICE);

		this.audioManager.setSpeakerphoneOn(true);
		this.configureAudio(true);
		this.localAudioTrack = LocalAudioTrack.create(Utils.ad.getApplicationContext(), true, 'mic');
	}

	public mute() {
		if (this.audioManager) {
			this.configureAudio(false);
		}
	}

	public unmute() {
		if (this.audioManager) {
			this.configureAudio(true);
		}
	}

	public async disableCamera(): Promise<boolean> {
		if (this.localVideoTrack != null) {
			this.localVideoTrack.enable(false);

			if (this.localParticipant != null) {
				return this.localParticipant.unpublishTrack(this.localVideoTrack);
			}
			return true;
		}

		return false;
	}

	public async enableCamera(): Promise<boolean> {
		if (this.localVideoTrack != null) {
			this.localVideoTrack.enable(true);

			if (this.localParticipant != null) {
				return this.localParticipant.publishTrack(this.localVideoTrack);
			}
			return true;
		} else {
			this.setupLocalVideoTrack();
		}
		return false;
	}

	public switchCamera() {
		if (this.camera != null) {
			this.camera.switchCamera();
		}
	}

	private configureAudio(enable: boolean) {
		if (enable) {
			this.previousAudioMode = this.audioManager.getMode();
			this.requestAudioFocus();
			this.audioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
			this.previousMicrophoneMute = this.audioManager.isMicrophoneMute();
			this.audioManager.setMicrophoneMute(false);
		} else {
			this.audioManager.setMode(this.previousAudioMode);
			this.audioManager.abandonAudioFocus(null);
			this.audioManager.setMicrophoneMute(this.previousMicrophoneMute);
		}
	}

	private requestAudioFocus() {
		if (android.os.Build.VERSION.SDK_INT >= 25) {
			var playbackAttributes = new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_VOICE_COMMUNICATION).setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build();
			var focusRequest = new AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN_TRANSIENT)
				.setAudioAttributes(playbackAttributes)
				.setAcceptsDelayedFocusGain(true)
				.setOnAudioFocusChangeListener(
					new AudioManager.OnAudioFocusChangeListener({
						onAudioFocusChange(i) {
							console.log(i);
						},
					})
				)
				.build();
			this.audioManager.requestAudioFocus(focusRequest);
		} else {
			this.audioManager.requestAudioFocus(null, AudioManager.STREAM_VOICE_CALL, AudioManager.AUDIOFOCUS_GAIN_TRANSIENT);
		}
	}

	protected async setupLocalVideoTrack(): Promise<void> {
		await this.startPreview();
	}

	protected async connectToRoom(room: string, accessToken: string): Promise<void> {
		let connectOptionsBuilder = new ConnectOptions.Builder(accessToken).roomName(room);

		if (this.localAudioTrack) {
			connectOptionsBuilder.audioTracks(java.util.Collections.singletonList(this.localAudioTrack));
		}

		if (this.localVideoTrack) {
			connectOptionsBuilder.videoTracks(java.util.Collections.singletonList(this.localVideoTrack));
		}

		this.room = Video.connect(Utils.ad.getApplicationContext(), connectOptionsBuilder.build(), roomListener(this.event));
	}

	protected onLocalParticipantConnectedToRoom(room: any, participant: any): void {
		this.localParticipant = room.getLocalParticipant();

		var remoteParticipants = room.getRemoteParticipants();

		for (var i = 0, l = remoteParticipants.size(); i < l; i++) {
			var remoteParticipant = remoteParticipants.get(i);

			if (remoteParticipant.getVideoTracks().size() > 0) {
				this.addRemoteParticipant(remoteParticipant);
			}
		}

		this.notifyOut(`onLocalParticipantConnect`, () => ({
			participantName: this.localParticipant.getIdentity(),
		}));
	}

	private addRemoteParticipant(participant) {
		if (this.remoteParticipants.indexOf(participant) == -1) {
			this.remoteParticipants.push(participant);
			if (participant.getRemoteVideoTracks().size() > 0) {
				let remoteVideoTrackPublication = participant.getRemoteVideoTracks().get(0);
				if (remoteVideoTrackPublication.isTrackSubscribed()) {
					this.addRemoteParticipantVideo(participant, remoteVideoTrackPublication.getRemoteVideoTrack());
				}
			}
			participant.setListener(remoteParticipantListener(this.event));

			this.notifyOut(`onRemoteParticipantConnect`, () => ({
				participantName: participant.getIdentity(),
			}));
		}
	}

	private addRemoteParticipantVideo(participant, videoTrack) {
		const remoteParticipantIndex = this.remoteParticipants.indexOf(participant);
		if (remoteParticipantIndex > -1) {
			const view = this.remoteVideoViews[remoteParticipantIndex].videoView;
			videoTrack.addSink(view);
		}
	}

	protected onLocalParticipantDisconnectedToRoomWithError(room: any, error: any): void {
		this.mute();
		this.removeRemoteParticipant(this.localParticipant);

		this.notifyOut(`onLocalParticipantDisconnect`, () => ({
			participantName: this.localParticipant.getIdentity(),
		}));
	}

	protected onRoomParticipantConnectedToRoom(room: any, participant: any): void {
		if (room.getLocalParticipant() != participant) {
			this.addRemoteParticipant(participant);
		}
	}
	protected onRoomParticipantDisconnectedToRoom(room: any, participant: any): void {
		this.removeRemoteParticipant(participant);
	}

	private removeRemoteParticipant(participant): void {
		const remoteParticipantIndex = this.remoteParticipants.indexOf(participant);
		if (remoteParticipantIndex > -1) {
			if (participant.getRemoteVideoTracks().size() > 0) {
				let remoteVideoTrackPublication = participant.getRemoteVideoTracks().get(0);
				this.removeRemoteParticipantVideo(participant, remoteVideoTrackPublication.getRemoteVideoTrack());
			}

			const view = this.remoteVideoViews[remoteParticipantIndex];
			this.remoteVideoViews.splice(remoteParticipantIndex, 1);
			this.remoteParticipants.splice(remoteParticipantIndex, 1);
			this.remoteVideoViews.push(view);

			this.notifyOut(`onRemoteParticipantDisconnect`, () => ({
				participantName: participant.getIdentity(),
			}));
		} else if (participant == this.localParticipant) {
			for (const remoteParticipant of this.remoteParticipants) {
				this.removeRemoteParticipant(remoteParticipant);
			}
			this.notifyOut(`onLocalParticipantDisconnect`, () => ({
				participantName: participant.getIdentity(),
			}));
		}
	}

	protected onRemoteParticipantVideoTrackSubscribed(videoTrack: any, participant: any) {
		if (this.localParticipant != participant) {
			this.addRemoteParticipantVideo(participant, videoTrack);
		}
	}

	protected onRemoteParticipantVideoTrackUnsubscribed(videoTrack: any, participant: any) {
		this.removeRemoteParticipantVideo(videoTrack, participant);
	}

	private removeRemoteParticipantVideo(participant, videoTrack) {
		const remoteParticipantIndex = this.remoteParticipants.indexOf(participant);
		if (remoteParticipantIndex > -1 && videoTrack != null) {
			const view = this.remoteVideoViews[remoteParticipantIndex].videoView;
			videoTrack.removeRenderer(view);
		}
	}
}
