import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import RecyclingMap from './pages/RecyclingMap';
import Education from './pages/Education';
import Profile from './pages/Profile';
import Subscription from './pages/Subscription';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/map" element={<RecyclingMap />} />
            <Route path="/education" element={<Education />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/subscription" element={<Subscription />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;