import React, { useState } from 'react';

function App() {
  const [result, setResult] = useState(null);

  const handleConvert = async () => {
    const response = await fetch('http://localhost:5000/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 100,
        fromCurrency: 'USD',
        toCurrency: 'EUR',
      }),
    });
    const data = await response.json();
    setResult(data.convertedAmount);
  };

  return (
    <div>
      <h1>Konwerter walut</h1>
      <button onClick={handleConvert}>Konwertuj</button>
      {result && <p>Wynik: {result}</p>}
    </div>
  );
}

export default App;
