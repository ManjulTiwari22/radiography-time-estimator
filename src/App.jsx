import React, { useState } from "react";
import './index.css';



const RadiographyCalculator = () => {
    const [seamType, setSeamType] = useState("LS");
    const [length, setLength] = useState();
    const [thickness, setThickness] = useState();
    const [source, setSource] = useState("Cobalt");
    const [mode, setMode] = useState("Spot");
    const [result, setResult] = useState(null);

    const calculateRadiographyTime = () => {
        let spotLength = source === "Cobalt" ? 250 : 300;
        let seamLength;
        
        if (seamType === "LS" || seamType === "TF") {
            seamLength = length;
        } else if (seamType === "CS") {
            let outerRadius = (length / 2) + thickness;
            seamLength = outerRadius;
        } else {
            setResult("Invalid Seam Type");
            return;
        }

        let numSpots;
        if (seamType === "CS") {
            numSpots = mode === "Panoramic" ? 1 : Math.ceil((Math.PI * (length / 2 + thickness) * 2) / spotLength);
        } else {
            numSpots = Math.ceil(seamLength / spotLength);
        }

        let time = 0;

        if (seamType === "CS") {
            if (mode === "Panoramic") {
                time = source === "Cobalt" 
                    ? 9 * Math.pow(2, thickness / 20) * (seamLength * seamLength) / 1000000
                    : 18 * Math.pow(2, thickness / 12.5) * (seamLength * seamLength) / 1000000;
            } else if (mode === "Spot") {
                time = source === "Cobalt" 
                    ? 4.2 * Math.pow(2, thickness / 20) * numSpots
                    : 5.4 * Math.pow(2, thickness / 12.5) * numSpots;
            }
        } else if (seamType === "LS") {
            if (mode === "Spot") {
                time = source === "Cobalt" 
                    ? 4.2 * Math.pow(2, thickness / 20) * numSpots
                    : 5.4 * Math.pow(2, thickness / 12.5) * numSpots;
            } else {
                setResult("Not Possible (NULL)");
                return;
            }
        } else if (seamType === "TF") {
            if (mode === "Spot") {
                time = source === "Cobalt" 
                    ? 8.4 * Math.pow(2, (1.5 * thickness) / 20) * numSpots
                    : 10.8 * Math.pow(2, (1.5 * thickness) / 12.5) * numSpots;
            } else {
                setResult("Not Possible (NULL)");
                return;
            }
        }

        let totalMinutes = Math.round(time);
        let totalHours = Math.round(totalMinutes / 60);
        let totalDays = Math.round(totalHours / 24);
        
        setResult(`Time Required:
In Mins: ${totalMinutes}
In Hours: ${totalHours}
In Days: ${totalDays}`);
    };

    return (
        <div>
            <h2>Radiography Time Calculator</h2>
            <label>Seam Type: 
                <select value={seamType} onChange={(e) => setSeamType(e.target.value)}>
                    <option value="LS">Long Seam</option>
                    <option value="CS">Circumferential Seam</option>
                    <option value="TF">T Frame</option>
                </select>
            </label>
            <br/>
            <label>Length/Inside Diameter: <input type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} /></label>
            <br/>
            <label>Thickness: <input type="number" value={thickness} onChange={(e) => setThickness(Number(e.target.value))} /></label>
            <br/>
            <label>Source: 
                <select value={source} onChange={(e) => setSource(e.target.value)}>
                    <option value="Cobalt">Cobalt-60</option>
                    <option value="Iridium">Iridium-192</option>
                </select>
            </label>
            <br/>
            <label>Mode: 
                <select value={mode} onChange={(e) => setMode(e.target.value)}>
                    <option value="Spot">Spot</option>
                    <option value="Panoramic">Panoramic</option>
                </select>
            </label>
            <br/>
            <button onClick={calculateRadiographyTime}>Calculate</button>
            <br/>
            {result !== null && <h3>Time Required: {result}</h3>}
        </div>
    );
};

export default RadiographyCalculator;
