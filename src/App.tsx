import { Navigate, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import './App.css';

import Navbar from 'components/Navbar';
import NewsBar from 'components/NewsBar';

import Home from 'pages/home';
import FAQs from 'pages/faqs';
import Stats from 'pages/stats';

function App() {

    const defaultRoute = "../" + process.env.REACT_APP_ROUTEBASE + "home";

    return (
        <>
            <Navbar/>
            <NewsBar/>
            <div id="notifications">
                <Toaster/>
            </div>
            <Routes>
                <Route path='' element={<Navigate to={defaultRoute} replace={true} />} />
                <Route path={process.env.REACT_APP_ROUTEBASE} element={<Navigate to={defaultRoute} replace={true} />} />
                <Route path={process.env.REACT_APP_ROUTEBASE + 'index.html'} element={<Navigate to={defaultRoute} replace={true} />} />
                <Route path={process.env.REACT_APP_ROUTEBASE + 'home'} element={<Home />} />
                <Route path={process.env.REACT_APP_ROUTEBASE + 'faqs'} element={<FAQs />} />
                <Route path={process.env.REACT_APP_ROUTEBASE + 'stats'} element={<Stats />} />                
            </Routes>
        </>
    )  
}

export default App