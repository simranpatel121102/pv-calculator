import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "chart.js/auto";
import "./PVCalculator.css";

const formatINR = (num) => {
  return Number(num).toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

const PVCalculator = () => {
  const [futureValue, setFutureValue] = useState(1000000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);
  const [darkMode, setDarkMode] = useState(false);

  const presentValue = futureValue / Math.pow(1 + annualRate / 100, years);

  const generateChartData = () => {
    const months = years * 12;
    const labels = Array.from({ length: months }, (_, i) => `Month ${i + 1}`);
    const pv = presentValue;
    const monthlyRate = annualRate / 100 / 12;
    const data = labels.map((_, i) =>
      pv * Math.pow(1 + monthlyRate, i + 1)
    );
    const invested = Array.from({ length: months }, () => pv);

    return {
      labels,
      datasets: [
        {
          label: "Future Value",
          data,
          borderColor: "#a855f7",
          backgroundColor: "#a855f7",
          fill: false,
        },
        {
          label: "Invested Amount",
          data: invested,
          borderColor: "#64748b",
          backgroundColor: "#64748b",
          fill: false,
        },
      ],
    };
  };

  const downloadPDF = () => {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("PV Calculator Report", 14, 16);
  doc.setFontSize(12);

  autoTable(doc, {
    head: [["Parameter", "Value"]],
    body: [
      ["Future Value", `₹${formatINR(futureValue)}`],
      ["Expected Return Rate (p.a)", `${annualRate}%`],
      ["Time Period (Years)", `${years}`],
      ["Required Present Value", `₹${formatINR(presentValue)}`],
    ],
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: [147, 51, 234],
      textColor: 255,
    },
    theme: "striped",
  });

  doc.save("pv-calculator.pdf");
};


  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <div className={`container calculator ${darkMode ? "dark" : ""}`}>
        <div className="header">
          <h1>PV Calculator</h1>
          <p>Calculate Present Value from Future Value</p>
          <button className="mode-toggle" onClick={() => setDarkMode((prev) => !prev)}>
            {darkMode ? "🌞" : "🌙"}
          </button>
        </div>

        <div className="main-layout">
          <div className="controls">
            <h2 className="section-title">Investment Inputs</h2>

            <label>Future Value</label>
            <div className="currency-input">
              <input
                type="number"
                className="input-box"
                value={futureValue}
                onChange={(e) => setFutureValue(Number(e.target.value))}
              />
              <input
                type="range"
                min="10000"
                max="100000000"
                step="10000"
                value={futureValue}
                onChange={(e) => setFutureValue(Number(e.target.value))}
              />
            </div>

            <label>Expected Return Rate (p.a)</label>
            <div className="currency-input">
              <input
                type="number"
                className="input-box"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
              />
              <input
                type="range"
                min="1"
                max="30"
                step="0.1"
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
              />
            </div>

            <label>Time Period (Years)</label>
            <div className="currency-input">
              <input
                type="number"
                className="input-box"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
              />
            </div>

            <button className="download-btn" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>

          <div className="results">
            <div className="cards">
              <div className="card">
                <p>Future Value</p>
                <h3>₹{formatINR(futureValue)}</h3>
              </div>
              <div className="card">
                <p>Required Present Value</p>
                <h3>₹{formatINR(presentValue)}</h3>
              </div>
            </div>
            <div className="chart-container">
              <Line data={generateChartData()} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PVCalculator;
