import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProjectProvider } from './contexts/ProjectContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import ChatInterface from './components/Chat/ChatInterface';
import Projects from './components/Projects/Projects';
import AccountSettings from './components/Account/AccountSettings';
import CodePreview from './components/Code/CodePreview';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ProjectProvider>
          <div className="min-h-screen bg-cyber-black text-white font-sans">
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 ml-64 p-6">
                <Routes>
                  <Route path="/" element={
                    <ProtectedRoute>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
                        <ChatInterface />
                        <CodePreview />
                      </div>
                    </ProtectedRoute>
                  } />
                  <Route path="/projects" element={
                    <ProtectedRoute>
                      <Projects />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <AccountSettings />
                    </ProtectedRoute>
                  } />
                </Routes>
              </main>
            </div>
          </div>
        </ProjectProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
