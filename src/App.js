import React, { useState } from 'react';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import './App.css';

function App() {
  const [videoSrc, setVideoSrc] = useState('');
  const [inputFile, setInputFile] = useState(null);
  const [message, setMessage] = useState('Click Start to transcode');
  const ffmpeg = createFFmpeg({
    log: true,
  });
  const handleChange = (event) => {
    const input = event.target;
    if (input.type === 'file' && input.files && !!input.files.length) {
      setInputFile(input.files[0]);
    }
  };
  const doTranscode = async () => {
    if (!inputFile) return;
    setMessage('Loading ffmpeg-core.js');
    await ffmpeg.load();
    setMessage('Start transcoding');
    ffmpeg.FS('writeFile', 'input_file', await fetchFile(inputFile));
    await ffmpeg.run('-i', 'input_file', 'output.mp4');
    setMessage('Complete transcoding');
    const data = ffmpeg.FS('readFile', 'output.mp4');
    setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' })));
  };
  return (
    <div className="App">
      <input type="file" onChange={handleChange} />
      {videoSrc && (
        <>
          <video src={videoSrc} controls></video>
          <div>
            <a href={videoSrc} download="output.mp4">Download video</a>
          </div>
        </>
      )}
      <button onClick={doTranscode}>Start</button>
      <p>{message}</p>
    </div>
  );
}

export default App;
