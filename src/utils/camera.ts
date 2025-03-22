export const useCameraH5 = () => {
  let mediaStreamTrack: MediaStreamTrack[];
  const video: HTMLVideoElement = document.createElement("video");
  const canvas: HTMLCanvasElement = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const openMedia = () => {
    let constraints = {
      video: true,
      audio: false,
    };
    //获得video摄像头
    let promise = navigator.mediaDevices.getUserMedia(constraints);
    promise.then((mediaStream) => {
      // mediaStreamTrack = typeof mediaStream.stop === 'function' ? mediaStream : mediaStream.getTracks()[1];
      mediaStreamTrack = mediaStream.getVideoTracks();
      video.srcObject = mediaStream;
      video.play();
    });
  };

  // 拍照
  const takePhoto = () => {
    ctx.drawImage(video, 0, 0, 500, 500);
    let img = canvas.toDataURL();
    console.log(img);
  };
  // 关闭摄像头
  const closeMedia = () => {
    let tracks = mediaStreamTrack;

    tracks?.forEach?.(function (track) {
      track.stop();
    });

    video.srcObject = null;
  };

  return { openMedia, takePhoto, closeMedia, video, canvas, ctx };
};
