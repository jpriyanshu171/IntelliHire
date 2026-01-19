import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import { ProtectedRoute } from './routes/ProtectedRoute.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import JobsPage from './pages/JobsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MyApplicationsPage from './pages/MyApplicationsPage.jsx';
import RecruiterJobsPage from './pages/RecruiterJobsPage.jsx';
import ResumeBuilderPage from './pages/ResumeBuilderPage.jsx';
import CreateJobPage from './pages/CreateJobPage.jsx';


function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white/95 backdrop-blur-lg shadow-md border-b border-slate-200/60 sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white p-2.5 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <div className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                IntelliHire
              </div>
              <div className="text-xs font-medium text-slate-500 -mt-0.5">AI-Powered Career Platform</div>
            </div>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-semibold transition-all duration-200 relative group ${
                isActive('/') ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              Jobs
              {isActive('/') && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
              )}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full group-hover:w-full transition-all duration-300"></span>
            </Link>
            
            {user && (
              <>
                {user.role === 'STUDENT' && (
                  <>
                    <Link
                      to="/applications"
                      className={`text-sm font-semibold transition-all duration-200 relative group ${
                        isActive('/applications') ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'
                      }`}
                    >
                      Applications
                      {isActive('/applications') && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                      )}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                    </Link>
                    <Link
                      to="/resume/builder"
                      className={`text-sm font-semibold transition-all duration-200 relative group ${
                        isActive('/resume/builder') ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'
                      }`}
                    >
                      Resume
                      {isActive('/resume/builder') && (
                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                      )}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </>
                )}
                {user.role === 'RECRUITER' && (
                  <Link
                    to="/recruiter/jobs"
                    className={`text-sm font-semibold transition-all duration-200 relative group ${
                      isActive('/recruiter/jobs') ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'
                    }`}
                  >
                    Dashboard
                    {isActive('/recruiter/jobs') && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                    )}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                  </Link>
                )}
                <Link
                  to="/profile"
                  className={`text-sm font-semibold transition-all duration-200 relative group ${
                    isActive('/profile') ? 'text-blue-600' : 'text-slate-700 hover:text-blue-600'
                  }`}
                >
                  Profile
                  {isActive('/profile') && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></span>
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-slate-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.fullName?.charAt(0) || 'U'}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500 font-medium">Welcome</div>
                    <div className="text-sm font-bold text-slate-800">{user.fullName}</div>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-semibold rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden md:block px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-bold">IntelliHire</div>
                <div className="text-xs text-slate-400">Smart Career Solutions</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              AI-powered job portal connecting talented students with top recruiters. 
              Streamline your hiring process and discover your dream career.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">For Students</a></li>
              <li><a href="#" className="hover:text-white transition-colors">For Recruiters</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-sm text-slate-400">
          <p>&copy; 2024 IntelliHire. All rights reserved. Built with ❤️ for students and recruiters.</p>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-white border-t-transparent mb-6"></div>
          <div className="text-xl font-semibold text-white">Loading IntelliHire...</div>
          <div className="text-sm text-blue-200 mt-2">Preparing your career journey</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
      <Navbar />
      <main className="min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/" element={<JobsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/applications"
            element={
              <ProtectedRoute roles={['STUDENT']}>
                <MyApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/jobs"
            element={
              <ProtectedRoute roles={['RECRUITER']}>
                <RecruiterJobsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/resume/builder"
            element={
              <ProtectedRoute roles={['STUDENT']}>
                <ResumeBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
              path="/recruiter/jobs/new"
              element={
                <ProtectedRoute roles={['RECRUITER']}>
                  <CreateJobPage />
                </ProtectedRoute>
              }
          />

        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
