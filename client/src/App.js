import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [managerName, setManagerName] = useState('');
  const [region, setRegion] = useState('');
  const [reportText, setReportText] = useState('');
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');

  // Завантаження звітів
  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get('https://manager-reports-backend.vercel.app/api/reports');
      setReports(response.data);
    } catch (err) {
      console.error('Error fetching reports:', err);
    }
  };

  // Відправка звіту
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://manager-reports-backend.vercel.app/api/reports', {
        managerName,
        region,
        reportText,
      });
      setMessage(response.data.message);
      setManagerName('');
      setRegion('');
      setReportText('');
      fetchReports(); // Оновити список звітів
    } catch (err) {
      setMessage('Failed to save report');
    }
  };

  return (
    <div className="App">
      <h1>Звіти регіональних менеджерів</h1>
      <div className="form-container">
        <h2>Додати звіт</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Ім'я менеджера:</label>
            <input
              type="text"
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Регіон:</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Текст звіту:</label>
            <textarea
              value={reportText}
              onChange={(e) => setReportText(e.target.value)}
              required
            ></textarea>
          </div>
          <button type="submit">Надіслати звіт</button>
        </form>
        {message && <p>{message}</p>}
      </div>
      <div className="reports-container">
        <h2>Усі звіти</h2>
        {reports.length === 0 ? (
          <p>Звітів поки немає</p>
        ) : (
          <ul>
            {reports.map((report) => (
              <li key={report._id}>
                <strong>{report.managerName}</strong> ({report.region}) -{' '}
                {new Date(report.createdAt).toLocaleDateString()}:<br />
                {report.reportText}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;