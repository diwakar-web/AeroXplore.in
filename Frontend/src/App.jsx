import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Analytics } from "@vercel/analytics/react"
import { AuthProvider } from './context/AuthContext'
import Home from './Pages/Home'
import BlogPost from './Pages/BlogPost'
import AllBlogs from './Pages/AllBlogs'
import Login from './Pages/Login'
import CreateArticle from './Pages/CreateArticle'
import MyArticles from './Pages/MyArticles'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<AllBlogs />} />
          <Route path="/blog/:id" element={<BlogPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create" element={<CreateArticle />} />
          <Route path="/my-articles" element={<MyArticles />} />
        </Routes>
        <Analytics />
      </AuthProvider>
    </Router>
  )
}

export default App
