import { useState } from 'react';
import { useSearchParams, Navigate, Routes, Route } from 'react-router-dom';

import Navbar from 'components/Navbar';
import NewsBar from 'components/NewsBar';
import MessageBar from 'components/MessageBar';

import Home from 'pages/home';

import './App.css';

function App() {

    const defaultRoute = "../" + process.env.REACT_APP_ROUTEBASE + "home";

    // MessageBar
    const [searchParams] = useSearchParams();
    var searchParamsObj = Object.fromEntries(searchParams.entries())
    const [messageBarText, setMessageBarText] = useState(searchParamsObj["successMessage"] ?? searchParamsObj["errorMessage"]);
    const [messageBarError, setMessageBarError] = useState(searchParamsObj["errorMessage"] != null);
    const [messageBarShow, setMessageBarShow] = useState((searchParamsObj["successMessage"] ?? searchParamsObj["errorMessage"]) != null);

    return (
        <>
            <Navbar/>
            <NewsBar/>
            <MessageBar text={messageBarText} setShow={setMessageBarShow} show={messageBarShow} error={messageBarError} />
            <Routes>
                <Route path='' element={<Navigate to={defaultRoute} replace={true} />} />
                <Route path={process.env.REACT_APP_ROUTEBASE} element={<Navigate to={defaultRoute} replace={true} />} />
                <Route path={process.env.REACT_APP_ROUTEBASE + 'index.html'} element={<Navigate to={defaultRoute} replace={true} />} />
                <Route path={process.env.REACT_APP_ROUTEBASE + 'home'} element={<Home setMessageBarText={setMessageBarText} setMessageBarError={setMessageBarError} setMessageBarShow={setMessageBarShow} />} />
            </Routes>
        </>
    )  
}

export default App