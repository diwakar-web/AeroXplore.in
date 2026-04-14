import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import Home from './Pages/Home'
import BlogPost from './Pages/BlogPost'
import AllBlogs from './Pages/AllBlogs'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blogs" element={<AllBlogs />} />
        <Route path="/blog/:id" element={<BlogPost />} />
      </Routes>
      <Analytics />
    </Router>
  )
}

export default App
