import { hasPermission, requestPermissions } from 'nativescript-permissions';

export class VideoAudioPermissions {
	public static async checkAll(): Promise<boolean> {
		return (await VideoAudioPermissions.checkAudio()) && (await VideoAudioPermissions.checkVideo());
	}

	public static async checkAudio(): Promise<boolean> {
		return hasPermission('android.permission.RECORD_AUDIO');
	}

	public static async checkVideo(): Promise<boolean> {
		return hasPermission('android.permission.CAMERA');
	}

	public static async requestAll(messageAudio: string, messageVideo: string): Promise<boolean> {
		return (await VideoAudioPermissions.requestAudio(messageAudio)) && (await VideoAudioPermissions.requestVideo(messageVideo));
	}

	public static async requestAudio(message: string): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			await requestPermissions(['android.permission.RECORD_AUDIO'], message || 'Audio is needed to make and receive video calls');
			resolve(await VideoAudioPermissions.checkAudio());
		});
	}

	public static async requestVideo(message: string): Promise<boolean> {
		return new Promise<boolean>(async (resolve, reject) => {
			await requestPermissions(['android.permission.CAMERA'], message || 'Camera is needed to make and receive video calls');
			resolve(await VideoAudioPermissions.checkVideo());
		});
	}
}
