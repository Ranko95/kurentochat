const defaultConstraints: MediaStreamConstraints = {
  audio: true,
  video: true,
};

export const getUserMedia = async (constraints: MediaStreamConstraints = defaultConstraints): Promise<MediaStream> => {
  try {
    return navigator.mediaDevices.getUserMedia(constraints);
  } catch (e) {
    throw e;
  }
};
