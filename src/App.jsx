import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './index.css';

function App() {
  const [seamType, setSeamType] = useState('LS');
  const [length, setLength] = useState(3000);
  const [thickness, setThickness] = useState(50);
  const [radioSource, setRadioSource] = useState('I');
  const [rtType, setRtType] = useState('S');
  const [spotLength, setSpotLength] = useState(300);
  const [numberOfSpots, setNumberOfSpots] = useState(10);
  const [result, setResult] = useState(0); // Result in minutes only

  const timeFactors = useMemo(() => ({
    I: { spot: 5.4 * Math.pow(2, thickness / 12.5), tFrame: 10.8 * Math.pow(2, thickness / 12.5), panoramic: 18 * Math.pow(2, thickness / 12.5) * length * length / 1000000 },
    C: { spot: 4.2 * Math.pow(2, thickness / 20), tFrame: 8.4 * Math.pow(2, thickness / 20), panoramic: 9 * Math.pow(2, thickness / 20) * length * length / 1000000 },
  }), [thickness, length]);

  const calculateValue = useCallback((seamType, innerRadius, thickness) => {
    if (typeof innerRadius !== "number" || typeof thickness !== "number") {
      throw new Error("Inner radius and thickness must be numbers.");
    }

    switch (seamType) {
      case "CS":
        return (innerRadius / 2) + thickness; // Outer radius for CS
      case "LS":
        return innerRadius; // For LS, return the length as is
      case "TF":
        return innerRadius; // For TF, return the length as is
      default:
        throw new Error("Invalid seam type. Expected 'CS', 'LS', or 'TF'.");
    }
  }, []);

  useEffect(() => {
    const newSpotLength = radioSource === 'I' ? 300 : 250;
    setSpotLength(newSpotLength);

    // Calculate number of spots based on seam type
    if (seamType === 'CS') {
      const outerRadius = calculateValue(seamType, length, thickness);
      const circumference = 2 * Math.PI * outerRadius; // Circumference for CS
      setNumberOfSpots(Math.ceil(circumference / newSpotLength));
    } else {
      setNumberOfSpots(Math.ceil(length / newSpotLength)); // For LS and TF
    }
  }, [radioSource, length, thickness, seamType, calculateValue]);

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
    setResult(totalMinutes); // Set result in minutes only
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
          <p><strong>{result.toFixed(2)}</strong> minutes</p>
        </div>
      )}

      <div>
        <h2>Calculated Value:</h2>
        <p>{calculateValue(seamType, length, thickness).toFixed(2)}</p>
      </div>
    </div>
  );
}

export default App;
