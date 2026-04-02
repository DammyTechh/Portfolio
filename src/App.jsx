import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PortfolioSite from './PortfolioSite'
import AdminPage    from './pages/Admin'
import NotFound     from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"       element={<PortfolioSite />} />
        <Route path="/admin"  element={<AdminPage />} />
        <Route path="/admin/" element={<AdminPage />} />
        <Route path="*"       element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
