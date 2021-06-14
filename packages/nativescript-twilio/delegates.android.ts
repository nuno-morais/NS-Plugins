import { fromObject, Observable } from '@nativescript/core';

declare var com: any;
const Participant = com.twilio.video.RemoteParticipant;
const Room = com.twilio.video.Room;

export function remoteParticipantListener(event: Observable) {
	return new Participant.Listener({
		onAudioTrackPublished(participant, publication) {
			event.notify({
				eventName: 'participantPublishedAudioTrack',
				object: fromObject({
					participant: participant,
					publication: publication,
				}),
			});
		},
		onAudioTrackUnpublished(participant, publication) {
			event.notify({
				eventName: 'participantUnpublishedAudioTrack',
				object: fromObject({
					participant: participant,
					publication: publication,
				}),
			});
		},
		onVideoTrackPublished(participant, publication) {
			event.notify({
				eventName: 'participantPublishedVideoTrack',
				object: fromObject({
					participant: participant,
					publication: publication,
				}),
			});
		},
		onVideoTrackUnpublished(participant, publication) {
			event.notify({
				eventName: 'participantUnpublishedVideoTrack',
				object: fromObject({
					participant: participant,
					publication: publication,
				}),
			});
		},
		onAudioTrackSubscribed(remoteParticipant, remoteAudioTrackPublication, remoteAudioTrack) {
			event.notify({
				eventName: 'onAudioTrackSubscribed',
				object: fromObject({
					participant: remoteParticipant,
					publication: remoteAudioTrackPublication,
					audioTrack: remoteAudioTrack,
				}),
			});
		},
		onAudioTrackUnsubscribed(remoteParticipant, remoteAudioTrackPublication, remoteAudioTrack) {
			event.notify({
				eventName: 'onAudioTrackUnsubscribed',
				object: fromObject({
					participant: remoteParticipant,
					publication: remoteAudioTrackPublication,
					audioTrack: remoteAudioTrack,
				}),
			});
		},
		onVideoTrackSubscribed(remoteParticipant, remoteVideoTrackPublication, remoteVideoTrack) {
			event.notify({
				eventName: 'onVideoTrackSubscribed',
				object: fromObject({
					participant: remoteParticipant,
					publication: remoteVideoTrackPublication,
					videoTrack: remoteVideoTrack,
				}),
			});
		},
		onVideoTrackUnsubscribed(remoteParticipant, remoteVideoTrackPublication, remoteVideoTrack) {
			event.notify({
				eventName: 'onVideoTrackUnsubscribed',
				object: fromObject({
					participant: remoteParticipant,
					publication: remoteVideoTrackPublication,
					videoTrack: remoteVideoTrack,
				}),
			});
		},

		onVideoTrackDisabled(participant, publication) {
			event.notify({
				eventName: 'participantDisabledVideoTrack',
				object: fromObject({
					participant: participant,
					publication: publication,
				}),
			});
		},

		onVideoTrackEnabled(participant, publication) {
			event.notify({
				eventName: 'participantEnabledVideoTrack',
				object: fromObject({
					participant: participant,
					publication: publication,
				}),
			});
		},

		onAudioTrackDisabled(participant, publication) {
			event.notify({
				eventName: 'participantDisabledAudioTrack',
				object: fromObject({
					participant: participant,
					publication: publication,
				}),
			});
		},

		onAudioTrackEnabled(participant, publication) {
			event.notify({
				eventName: 'participantEnabledAudioTrack',
				object: fromObject({
					participant: participant,
					publication: publication,
				}),
			});
		},
	});
}

export function roomListener(event: Observable) {
	return new Room.Listener({
		onConnected(room) {
			event.notify({
				eventName: 'didConnectToRoom',
				object: fromObject({
					room: room,
					count: room.getLocalParticipant(),
				}),
			});
		},

		onConnectFailure(room, error) {
			event.notify({
				eventName: 'disconnectedWithError',
				object: fromObject({
					room: room,
					error: error,
				}),
			});
		},

		onDisconnected(room, error) {
			event.notify({
				eventName: 'roomParticipantDidDisconnect',
				object: fromObject({
					room: room,
					participant: room.getLocalParticipant(),
				}),
			});
		},

		onParticipantConnected(room, participant) {
			event.notify({
				eventName: 'roomParticipantDidConnect',
				object: fromObject({
					room: room,
					participant: participant,
				}),
			});
		},

		onParticipantDisconnected(room, participant) {
			event.notify({
				eventName: 'roomParticipantDidDisconnect',
				object: fromObject({
					room: room,
					participant: participant,
				}),
			});
		},

		onRecordingStarted(room) {},

		onRecordingStopped(room) {},
	});
}
