import React, { useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';

// PUBLIC_INTERFACE
function App() {
  /**
   * Root app component. Initializes theme attribute if missing.
   */
  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    if (!current) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  return (
    <div className="App">
      <main className="App-header" style={{ alignItems: 'stretch' }}>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;
