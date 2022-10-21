import kurentoClient, { ClientInstance, MediaPipeline, WebRtcEndpoint } from "kurento-client";
import { vars } from "../../config/vars";

class Kurento {
  connection: ClientInstance | null = null;
  pipeline: MediaPipeline | null = null;

  getOrCreateKurentoConnection = async (): Promise<ClientInstance> => {
    if (this.connection) {
      return this.connection;
    }

    this.connection = await kurentoClient(vars.kurentoUrl, { failAfter: 10 });
    return this.connection;
  };

  getOrCreatePipeline = async (): Promise<MediaPipeline> => {
    if (this.pipeline) {
      return this.pipeline;
    }

    const connection = await this.getOrCreateKurentoConnection();
    this.pipeline = await connection.create("MediaPipeline");
    return this.pipeline;
  };

  createWebRTCEndpoint = async (): Promise<WebRtcEndpoint> => {
    const pipeline = await this.getOrCreatePipeline();
    return pipeline.create("WebRtcEndpoint");
  };
}

export default new Kurento();
