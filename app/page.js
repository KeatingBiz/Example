'use client';

import { useState } from 'react';

export default function Home() {
  const [instructions, setInstructions] = useState('');
  const [count, setCount] = useState(1);
  const [ads, setAds] = useState([]);

  const handleSpeak = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInstructions((prev) => `${prev} ${transcript}`.trim());
    };
    recognition.start();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();
    const images = form.elements.images.files;
    const logos = form.elements.logos.files;
    for (const file of images) formData.append('images', file);
    for (const file of logos) formData.append('logos', file);
    formData.append('instructions', instructions);
    formData.append('count', count);

    const res = await fetch('/api/generate', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setAds(data.ads || []);
  };

  return (
    <main>
      <h1>Ad Campaign Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Photos: <input type="file" name="images" multiple /></label>
        </div>
        <div>
          <label>Logos: <input type="file" name="logos" multiple /></label>
        </div>
        <div>
          <textarea
            name="instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Describe your desired ads"
          />
        </div>
        <div>
          <button type="button" onClick={handleSpeak}>Speak Instructions</button>
        </div>
        <div>
          <label>
            Number of ads:
            <input
              type="number"
              min="1"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </label>
        </div>
        <button type="submit">Generate</button>
      </form>
      {ads.length > 0 && (
        <ul>
          {ads.map((ad, idx) => (
            <li key={idx}>{ad}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
