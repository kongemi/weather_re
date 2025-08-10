import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { WeatherDetail } from './pages/WeatherDetail';
import { SearchPage } from './pages/SearchPage';
import { ErrorToast } from './components/ErrorToast';
import { useTheme } from './hooks/useTheme';

function App() {
  // 初始化主题，确保主题在应用启动时正确应用
  useTheme();
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/weather/:city" element={<WeatherDetail />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
        <ErrorToast />
      </div>
    </Router>
  );
}

export default App;
