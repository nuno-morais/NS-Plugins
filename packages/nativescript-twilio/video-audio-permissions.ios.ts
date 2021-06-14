export class VideoAudioPermissions {
	public static async checkAll(): Promise<boolean> {
		return (await VideoAudioPermissions.checkAudio()) && (await VideoAudioPermissions.checkVideo());
	}

	public static async checkAudio(): Promise<boolean> {
		return await VideoAudioPermissions.checkPermission(AVMediaTypeAudio);
	}

	public static async checkVideo(): Promise<boolean> {
		return await VideoAudioPermissions.checkPermission(AVMediaTypeVideo);
	}

	public static async requestAll(messageAudio: string, messageVideo: string): Promise<boolean> {
		return (await VideoAudioPermissions.requestAudio(messageAudio)) && (await VideoAudioPermissions.requestVideo(messageVideo));
	}

	public static async requestAudio(message: string): Promise<boolean> {
		return await VideoAudioPermissions.requestPermission(AVMediaTypeAudio);
	}

	public static async requestVideo(message: string): Promise<boolean> {
		return await VideoAudioPermissions.requestPermission(AVMediaTypeVideo);
	}

	private static async checkPermission(type: string): Promise<boolean> {
		return await new Promise(function (resolve, reject) {
			let status = AVCaptureDevice.authorizationStatusForMediaType(type);
			switch (status) {
				case AVAuthorizationStatus.Authorized: {
					resolve(true);
					break;
				}
				default: {
					resolve(false);
				}
			}
		});
	}

	private static async requestPermission(type: string): Promise<boolean> {
		return await new Promise(function (resolve, reject) {
			let status = AVCaptureDevice.authorizationStatusForMediaType(type);
			switch (status) {
				case AVAuthorizationStatus.Authorized: {
					resolve(true);
					break;
				}
				case AVAuthorizationStatus.NotDetermined: {
					AVCaptureDevice.requestAccessForMediaTypeCompletionHandler(type, (granted) => {
						resolve(granted);
					});
					break;
				}
				case AVAuthorizationStatus.Restricted:
				case AVAuthorizationStatus.Denied: {
					resolve(false);
				}
			}
		});
	}
}
