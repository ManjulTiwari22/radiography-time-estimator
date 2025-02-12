import React, { useState, useEffect } from 'react';
import './index.css';

function App() {
  const [seamType, setSeamType] = useState('LS');
  const [length, setLength] = useState(3000);
  const [thickness, setThickness] = useState(50);
  const [radioSource, setRadioSource] = useState('I');
  const [rtType, setRtType] = useState('S');
  const [spotLength, setSpotLength] = useState(300);
  const [numberOfSpots, setNumberOfSpots] = useState(10);
  const [result, setResult] = useState({ minutes: 0, hours: 0, days: 0 });

  const timeFactors = {
    I: { spot: 86.4, tFrame: 691.2, panoramic: 7200 },
    C: { spot: 23.8, tFrame: 113.0, panoramic: 1272.8 },
  };

  useEffect(() => {
    const newSpotLength = radioSource === 'I' ? 300 : 250;
    setSpotLength(newSpotLength);
    setNumberOfSpots(Math.ceil(length / newSpotLength));
  }, [radioSource, length]);

  useEffect(() => {
    if (seamType !== 'CS') {
      setRtType('S');
    }
  }, [seamType]);

  const calculateTime = () => {
    const factor = timeFactors[radioSource];
    const spotTime = numberOfSpots * factor.spot;
    const tFrameTime = seamType === 'TF' ? factor.tFrame : 0;
    const panoramicTime = rtType === 'P' ? factor.panoramic : 0;
    
    const totalMinutes = spotTime + tFrameTime + panoramicTime;
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    const totalDays = Math.floor(totalHours / 24);
    
    setResult({ minutes: remainingMinutes, hours: totalHours % 24, days: totalDays });
  };

  const getLengthLabel = () => {
    if (seamType === 'CS') return 'Inner Diameter (mm):';
    if (seamType === 'TF') return 'Long Seam (mm):';
    return 'Length of Shell/Nozzle (mm):';
  };

  return (
    <div className="App">
      <h1>Radiography Test Time Estimation</h1>
      <div>
        <label>
          C/SEAM OR L/SEAM OR T-FRAME (LS/CS/TF):
          <select value={seamType} onChange={(e) => setSeamType(e.target.value)}>
            <option value="LS">LS</option>
            <option value="CS">CS</option>
            <option value="TF">TF</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          {getLengthLabel()}
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Lower Thickness including Reinforcement (mm):
          <input
            type="number"
            value={thickness}
            onChange={(e) => setThickness(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <label>
          Radiography by Iridium/Cobalt (I/C):
          <select value={radioSource} onChange={(e) => setRadioSource(e.target.value)}>
            <option value="I">Iridium</option>
            <option value="C">Cobalt</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Spot RT or Panoramic RT (S/P):
          <select value={rtType} onChange={(e) => setRtType(e.target.value)} disabled={seamType !== 'CS'}>
            <option value="S">Spot RT</option>
            {seamType === 'CS' && <option value="P">Panoramic RT</option>}
          </select>
        </label>
      </div>
      <div>
        <label>
          Spot Length (mm):
          <input type="number" value={spotLength} readOnly />
        </label>
      </div>
      <div>
        <label>
          Number of Spots:
          <input type="number" value={numberOfSpots} readOnly />
        </label>
      </div>
      <button onClick={calculateTime}>Calculate Time</button>
      {result !== null && (
        <div className="result-container">
          <h2>Estimated Time Required:</h2>
          <p><strong>{result.days}</strong> day(s)</p>
          <p><strong>{result.hours}</strong> hour(s)</p>
          <p><strong>{result.minutes}</strong> minute(s)</p>
        </div>
      )}
    </div>
  );
}

export default App;