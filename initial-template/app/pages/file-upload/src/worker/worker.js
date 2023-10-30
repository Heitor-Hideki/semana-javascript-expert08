import CanvasRenderer from "./canvasRenderer.js"
import MP4Demuxer from "./mp4Demuxer.js"
import VideoProcessor from "./videoProcessor.js"
import WebMWriter from './../deps/webm-writer2.js'
import Service from "./service.js"

const qvgaConstraints = {
  width: 320,
  height: 240,
}

const vgaConstraints = {
  width: 640,
  height: 480,
}

const hdConstraints = {
  width: 1280,
  height: 720,
}

const encoderConfig = {
  ...qvgaConstraints,
  bitrate: 10e6,
  // WebM
  codec: 'vp09.00.10.08',
  pt: 4,
  hardwareAcceleration: 'prefer-software',

  // Mp4
  // codec: 'avc1.42002A',
  // pt: 1,
  // hardwareAcceleration: 'prefer-hardware',
  // avc: {
  //   fortmat: 'annexb'
  // }
}

const webMWriterConfig = {
  ...qvgaConstraints,
  codec: 'VP9',
  width: encoderConfig.width,
  height: encoderConfig.height,
  bitrate: encoderConfig.bitrate
}

//instancia todas as classes auxiliares
const mp4Demuxer = new MP4Demuxer()
const service = new Service({
  url: 'http://localhost:3000'
})
const videoProcessor = new VideoProcessor({
  mp4Demuxer,
  webMWriter: new WebMWriter(webMWriterConfig),
  service
});

onmessage = async ({ data }) => {
  const renderFrame = CanvasRenderer.getRenderer(data.canvas);

  //inicializa o processamento do vídeo e fornece o arquivo, o método para renderização no canvas,  as configurações do encoder e o método para postar mensagens no worker
  await videoProcessor.start({
    file: data.file,
    renderFrame,
    encoderConfig,
    sendMessage: (message) => {
      self.postMessage(message)
    }
  })
  
  // self.postMessage({
  //   status: 'done'
  // })
}