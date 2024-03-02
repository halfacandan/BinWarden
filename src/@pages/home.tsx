import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button, TextField } from '@mui/material';
import { FaArrowsRotate, FaCircleCheck, FaCircleXmark, FaSquareCheck } from "react-icons/fa6";
import ls from 'localstorage-slim';

import GetJwtApiData from 'addons/GetJwtApiData';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

import LatestReport from 'classes/LatestReport';

const Home = () => {

    const [latestReport, setLatestReport] = useState<LatestReport|null>(null);
    const sourceUrl = (process.env.REACT_APP_BASEURL ?? "") + "/stats/latest";
    
    GetJwtApiData<LatestReport>(
        sourceUrl, 
        null, 
        setLatestReport,
        [],
        LatestReport,
        () => { },
        3600
    );

    const [blackBinToggle, setBlackBinToggle] = useState<boolean>(false);
    const [greenBinToggle, setGreenBinToggle] = useState<boolean>(false);
    const [email, setEmail] = useState<string|null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const blackBinReported = dayjs().utc().to(dayjs.utc(latestReport?.BlackBin), true);
    const greenBinReported = dayjs().utc().to(dayjs.utc(latestReport?.GreenBin), true);

    const submitForm = function(){

        if(blackBinToggle || greenBinToggle){

            setSubmitting(true);

            const data = JSON.stringify({
                "blackBin": blackBinToggle,
                "greenBin": greenBinToggle,
                "email": email
            });

            const emailUrl = (process.env.REACT_APP_BASEURL ?? "") + "/email/send";
            fetch(emailUrl, {
                method: 'POST',
                body: data,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'jwt-auth': process.env.REACT_APP_JWT ?? ""
                }
            })
            .then((response) => response.json())
            .then(json => {

                // Clear all cached API calls so that new settings can take effect
                ls.clear();

                setSubmitting(false);
                setLatestReport(new LatestReport({
                    "blackBin": blackBinToggle ? dayjs.utc().format() : latestReport?.BlackBin,
                    "greenBin": greenBinToggle ? dayjs.utc().format() : latestReport?.GreenBin
                }));

                // Display a message
                const responseMessage = json.successMessage ?? json.errorMessage;                    
                toast(responseMessage, {
                    duration: 3000,
                    position: 'top-right',
                    className: json.errorMessage != null ? "error" : "success",
                    icon: <FaCircleCheck className="icon" />
                });
            });

        } else {

            toast('Select either WASTE or RECYCLING', {
                duration: 3000,
                position: 'top-right',
                className: "error",
                icon: <FaCircleXmark className="icon" />
            });
        }
    }

    return (
        <>
            <div className="sectionContainer">
                <p>You can use this form to report a full bin to Edinburgh Council:</p>
                <ol>
                    <li>Select at least one of the <strong>WASTE</strong> or <strong>RECYCLING</strong> options</li>
                    <li>(Optional) Add your email address to receive updates</li>
                    <li>Click the <strong>REPORT IT</strong> button to email Edinburgh Council</li>
                </ol>
                <div className="binButtonWrapper">
                    <Button
                        className="black"
                        variant="contained"
                        startIcon={(blackBinToggle ? <FaSquareCheck /> : <></>)}
                        onClick={ () => setBlackBinToggle(!blackBinToggle)}
                    >Waste<br/>(Black)</Button>
                    <p>Last Reported: {blackBinReported} ago</p>
                </div>

                <div className="binButtonWrapper">
                    <Button
                        className="green"
                        variant="contained"
                        startIcon={(greenBinToggle ? <FaSquareCheck /> : <></>)}
                        onClick={ () => setGreenBinToggle(!greenBinToggle)}
                    >Recycling<br/>(Green)</Button>
                    <p>Last Reported: {greenBinReported} ago</p>
                </div>

                <div className="textFieldWrapper">
                    <TextField
                        id="email"
                        label="(Optional) Email Address"
                        variant="outlined"
                        onChange={ (event) => setEmail(event.target.value) }
                        placeholder="Enter your email address to receive progress updates"
                    />
                </div>

                <Button
                    className="submit"
                    variant="contained"
                    disabled={submitting}
                    startIcon={(submitting ? <FaArrowsRotate /> : <></>)}
                    onClick={ () => submitForm() }
                >{submitting ? "Reporting..." : "Report it"}</Button>

            </div>
        </>
    );
};
 
export default Home;