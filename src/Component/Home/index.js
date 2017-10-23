import React, { Component } from 'react';

const FACE_API = '46349259edb8401f9c3fdd698e50791c';
const VISION_API = 'ddf922dd530644228b96466ef14c1e5e';

// Index component
class Home extends Component {
  constructor() {
    super();
    this.state = {
      blob: {},
      result: {},
    }
    this.didMountVideo = this.didMountVideo.bind(this);
    this.processImage = this.processImage.bind(this);
    this.imageIdentify = this.imageIdentify.bind(this);
  }

  componentDidMount() {
    this.didMountVideo();
  }

  didMountVideo() {
    const that = this;
    var video = document.getElementById('video');
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
          video.src = window.URL.createObjectURL(stream);
          video.play();

          /*
          * Video to thumb
          */
          // setTimeout(function(){
          setInterval(function(){
            const track = stream.getVideoTracks()[0];
            const imageCapture = new ImageCapture(track);
            imageCapture.takePhoto()
            .then(function(blob) {
              const imgSrc = URL.createObjectURL(blob);
              document.getElementById('video-img').src = imgSrc;
              that.setState({blob})
            })
            .catch(function(error) {
              console.log('takePhoto() error: ', error);
            });
          }, 300);

        });
    } else {
        document.getElementById('error').style.display = 'block';
    }
  }

  imageIdentify() {
    this.processImage({data: this.state.blob});
  }

  async processImage(setting) {

    const uriBase = typeof (setting.uriBase) === 'undefined' ? "https://eastasia.api.cognitive.microsoft.com/vision/v1.0/analyze" : setting.uriBase;
    const subscriptionKey = typeof (setting.subscriptionKey) === 'undefined' ? VISION_API : setting.subscriptionKey;
    const type = typeof (setting.type) === 'undefined' ? 'blob' : setting.type;
    const visualFeatures = typeof (setting.visualFeatures) === 'undefined' ? 'Categories,Description,Color,Faces,ImageType,Color,Adult' : setting.visualFeatures;
    const details = typeof (setting.details) === 'undefined' ? 'Celebrities,Landmarks' : setting.details;
    const language = typeof (setting.language) === 'undefined' ? 'en' : setting.language;
    const data = setting.data;

    const response = await fetch(
      `${uriBase}?visualFeatures=${visualFeatures}&details=${details}&language=${language}`,
      {
        method: 'POST',
        headers: new Headers({
          'content-type': 'application/octet-stream',
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        }),
        body: data,
      }
    );

    let newResult = await response.json();
    this.setState({result: newResult});
  }

  render() {
    return (
        <div>
          <div id="v_div" style={{ width: '100px', display: 'inline-block', position: 'relative' }}>
            <h2>Live video</h2>
            <video style={{ width: '100%' }} id="video" width="100%" height="auto" autoPlay></video>
          </div>
          <h2>Video capture</h2>
          <img id="video-img" style={{ width: '100px', display: 'inline-block' }}></img>
          <h2>Upload image for identify</h2>
          <button onClick={this.imageIdentify}>Identify</button>
          <h2>Result</h2>
          <textarea style={{ height: 400, width: 200 }} value={JSON.stringify(this.state.result)} />
        </div>
    );
  }
}

export default Home
