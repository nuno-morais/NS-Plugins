# Nativescript Twilio

This plugin allows to create video calls using Twilio on iOS and Android

## How does it work?

Twilio has to verify a user before they can join a room. You can generate a token and select a room for them to join a room.

### Requirements

1. Make an account on twilio.com
2. Create a Programmable Video application. You'll receive an api key, auth token, and account sid.
3. This will require minimum server knowledge. I used node. You can find further instructions here https://www.twilio.com/docs/api/video/identity also here https://github.com/TwilioDevEd/video-access-token-server-node

## Install

```javascript
ns plugin add @nuno-morais/nativescript-twilio
```

## Usage

1. In AndroidManifest.xml

```xml
<uses-permission android:name="android.permission.CAMERA" />

<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

2. In Info.plist

```xml
<key>NSCameraUsageDescription</key>
<string>Why are you requesting permissions for camera?</string>
<key>NSMicrophoneUsageDescription</key>
<string>Why are you requesting permissions for mic?</string>
```

3. Create a view

   3.1. Vanilla

   ```xml
   <twilio:VideoView row="0" id="local-video" ></twilio:VideoView>
   <twilio:VideoView row="1" id="remote-video" ></twilio:VideoView>
   ```

   3.2. Angular

   ```xml
   <TwilioVideoView #localVideoView row="0" id="local-video"></TwilioVideoView>
   <TwilioVideoView #remoteVideoView row="1" id="remote-video"></TwilioVideoView>
   ```

4. Generate a token
   ```js
   async getToken(): Promise<string> {
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
   ```
5. Request permissions

   ```js
   await VideoAudioPermissions.checkAll();

   const messageAudio = 'Message to request audio';
   const messageVideo = 'Message to request camera';

   await VideoAudioPermissions.requestAll(messageAudio, messageVideo);
   ```

6. Create a VideoActivity
   ```js
       const localVideo = this.page.getViewById('local-video') as VideoView;
   	const remoteView = this.page.getViewById('remote-video') as VideoView;
   	this.videoActivity = new VideoActivity(localVideo, [remoteView]);
       this.videoActivity.connect('testing-room', token, { video: true, audio: true });
   ```

## Functionalities:

- `startPreview(): Promise<void>;`
- `connect(room: string, accessToken: string, options: { video: boolean; audio: boolean }): Promise<void>;`
- `disconnect(): Promise<void>;`
- `mute();`
- `unmute();`
- `disableCamera();`
- `enableCamera();`
- `switchCamera();`
- `subscribeOnRemoteParticipantConnect(fn: (participantName: string) => void);`
- `subscribeOnRemoteParticipantDisconnect(fn: (participantName: string) => void);`
- `subscribeOnLocalParticipantConnect(fn: (participantName: string) => void);`
- `subscribeOnLocalParticipantDisconnect(fn: (participantName: string) => void);`

## License

Apache License Version 2.0
