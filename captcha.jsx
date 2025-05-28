import React, { useState, useRef, useEffect } from 'react';

const Captcha = () => {
  const [captcha, setCaptcha] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [message, setMessage] = useState('');
  const canvasRef = useRef(null);

  useEffect(() => {
    const newCaptcha = generateCaptcha(6);
    setCaptcha(newCaptcha);
  }, []);

  useEffect(() => {
    if (captcha) {
      drawCaptcha(captcha);
    }
  }, [captcha]);

  const generateCaptcha = (length) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => possible.charAt(Math.floor(Math.random() * possible.length))).join('');
  };

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  };

  const handleRefresh = () => {
    const newCaptcha = generateCaptcha(6);
    setCaptcha(newCaptcha);
    setInputValue('');
    setMessage('');
  };

  const handleAudio = () => {
    const utterance = new SpeechSynthesisUtterance(captcha.split('').join(' '));
    utterance.rate = 0.6;
    window.speechSynthesis.speak(utterance);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    if (value === captcha) {
      setMessage('');
    } else {
      setMessage('Captcha is incorrect!');
    }
  };

  return (
    <div id="captchaWrapper" className="rnc">
      <div className="rnc-row" style={{ display: 'flex', alignItems: 'center' }}>
        <canvas
          ref={canvasRef}
          width={200}
          height={50}
          data-testid="captcha-canvas"
          className="rnc-canvas"
        />
        <div className="rnc-column" style={{ display: 'flex', flexDirection: 'column', marginLeft: '10px' }}>
          <button
            type="button"
            onClick={handleRefresh}
            className="rnc-button"
            data-testid="captcha-refresh"
            aria-label="get new captcha"
          >
            <img width="24" height="24" src="./refresh.png" alt="Refresh" />
          </button>
          <button
            type="button"
            onClick={handleAudio}
            className="rnc-button"
            data-testid="captcha-audio"
            aria-label="play audio"
          >
            <img width="24" height="24" src="./voice.png" alt="Voice" />
          </button>
        </div>
      </div>
      <input
        type="text"
        placeholder="Insert captcha"
        value={inputValue}
        onChange={handleInputChange}
        className={`rnc-input ${inputValue === captcha ? 'success' : inputValue ? 'error' : ''}`}
        data-testid="captcha-input"
      />
      <div id="message" className="message" style={{ color: inputValue && inputValue !== captcha ? 'red' : 'green' }}>
        {inputValue === captcha ? 'Captcha is correct!' : message}
      </div>
    </div>
  );
};

export default Captcha;
