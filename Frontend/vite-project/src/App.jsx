import { useState } from 'react'
import './App.css'
import {Routes , Route} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login"
import Register from "./pages/Register"
import Upload from "./pages/Upload"
import Dashboard from "./pages/Dashboard"
import FileView    from "./pages/FileView"
import ProtectedRoute from "./components/ProtectedRoute"
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Pricing from "./pages/Pricing";
import Chat from "./pages/Chat";
import Contact from './pages/contact';

import Footer from './components/Footer';
import BundleView from './pages/BundleView';
import ChangePassword from './pages/ChangePassword';
import DeleteAccount from './pages/DeleteAccount';



export default function App(){
  return (
    <div className='min-h-screen bg-gray-50 text-gray-900 flex flex-col'>
      <Navbar/>
      <div className='flex-1'>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/bundle/:bundleId" element={<BundleView />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/delete-account" element={<DeleteAccount/>} />

        

        <Route
          path="/pricing"
          element={
            <ProtectedRoute>
              <Pricing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route path="/file/:id" element={<FileView />} />

        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />

      </Routes>
      </div>

      <Footer/>

    </div>
  )
}

