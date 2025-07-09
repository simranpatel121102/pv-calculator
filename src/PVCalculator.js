import './FVCalculator.css';

import React, { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./FVCalculator.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const formatINR = (num) => {
  return Number(Math.round(num)).toLocaleString("en-IN");
};

const FVCalculator = () => {
  const [presentValue, setPresentValue] = useState(100000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);
  const [darkMode, setDarkMode] = useState(false);

  const months = years * 12;
  const monthlyRate = annualRate / 12 / 100;

  const investedAmount = presentValue;
  const futureValue = presentValue * Math.pow(1 + monthlyRate, months);

  const data = [];
  for (let i = 6; i <= months; i += 6) {
    const fv = presentValue * Math.pow(1 + monthlyRate, i);
    data.push({
      label: `Month ${i}`,
      "Future Value": fv,
      "Invested Amount": presentValue,
    });
  }

  const chartColors = darkMode
    ? { fv: "#c084fc", inv: "#94a3b8" }
    : { fv: "#9333ea", inv: "#64748b" };

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: "Future Value",
        data: data.map((d) => d["Future Value"]),
        borderColor: chartColors.fv,
        backgroundColor: "rgba(147, 51, 234, 0.2)",
        tension: 0.3,
      },
      {
        label: "Invested Amount",
        data: data.map((d) => d["Invested Amount"]),
        borderColor: chartColors.inv,
        backgroundColor: "rgba(100, 116, 139, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => "₹" + formatINR(value),
        },
      },
    },
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Future Value Calculator Report", 14, 16);
    doc.setFontSize(12);

    autoTable(doc, {
      head: [["Label", "Future Value (₹)", "Invested Amount (₹)"]],
      body: data.map((d) => [
        d.label,
        formatINR(d["Future Value"]),
        formatINR(d["Invested Amount"]),
      ]),
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: [108, 43, 217],
        textColor: 255,
      },
      theme: "striped",
    });

    doc.text(`Total Future Value: ₹${formatINR(futureValue)}`, 14, doc.lastAutoTable.finalY + 10);
    doc.text(`Total Invested: ₹${formatINR(investedAmount)}`, 14, doc.lastAutoTable.finalY + 18);

    doc.save("fv-report.pdf");
  };

  return (
    <div className={`app-container ${darkMode ? "dark" : ""}`}>
      <div className="container calculator">
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

            <label>Present Value (One-time)</label>
            <input
              type="number"
              className="currency-input"
              value={presentValue}
              onChange={(e) => setPresentValue(Number(e.target.value))}
            />
            <input
              type="range"
              className="slider"
              min="10000"
              max="1000000"
              step="1000"
              value={presentValue}
              onChange={(e) => setPresentValue(Number(e.target.value))}
            />

            <label>Expected Return Rate (p.a)</label>
            <input
              type="number"
              className="currency-input"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
            />
            <input
              type="range"
              className="slider"
              min="1"
              max="30"
              step="0.5"
              value={annualRate}
              onChange={(e) => setAnnualRate(Number(e.target.value))}
            />

            <label>Time Period (Years)</label>
            <input
              type="number"
              className="currency-input"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />
            <input
              type="range"
              className="slider"
              min="1"
              max="40"
              value={years}
              onChange={(e) => setYears(Number(e.target.value))}
            />

            <button className="pdf-button" onClick={downloadPDF}>
              Download PDF
            </button>
          </div>

          <div className="results">
            <div className="cards">
              <div className="card">
                <p>Invested Amount</p>
                <h3>₹{formatINR(investedAmount)}</h3>
              </div>
              <div className="card">
                <p>Future Value</p>
                <h3>₹{formatINR(futureValue)}</h3>
              </div>
            </div>
            <div className="canvas-container">
              <Line options={chartOptions} data={chartData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FVCalculator;
