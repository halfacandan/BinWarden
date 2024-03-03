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
        5
    );

    const [blackBinToggle, setBlackBinToggle] = useState<boolean>(false);
    const [greenBinToggle, setGreenBinToggle] = useState<boolean>(false);
    const [email, setEmail] = useState<string|null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const blackBinReported = dayjs().utc().to(dayjs.utc(latestReport?.LastBlackBin), true);
    const greenBinReported = dayjs().utc().to(dayjs.utc(latestReport?.LastGreenBin), true);

    const emailIsValid = function(emailAddress: string|null): boolean {

        if((emailAddress ?? '').trim() == '') return false;

        const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

        return (emailAddress?.match(isValidEmail) ?? []).length > 0;
    }

    const formCanSubmit = function(suppressNotification: boolean = false): boolean {

        const emailCheck = emailIsValid(email);
        const blackBinCheck = !blackBinToggle || emailCheck || (blackBinToggle && (latestReport?.CanReportBlackBinsAnonymously() ?? true));
        const greenBinCheck = !greenBinToggle || emailCheck || (greenBinToggle && (latestReport?.CanReportGreenBinsAnonymously() ?? true));

        if(!blackBinCheck || !greenBinCheck){
            
            if(!suppressNotification){
                toast("The selected bins have already been anonymously reported in the last 2 working days.\n\nEnter your email address to report the problem again.", {
                    duration: 5000,
                    position: 'top-right',
                    className: "error",
                    icon: <FaCircleXmark className="icon" />
                });
            }

            return false;
        }
        
        return true;
    }

    const submitForm = function(){

        if(blackBinToggle || greenBinToggle){

            if(!formCanSubmit()) return;

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

                const isError = json.errorMessage != null;

                setSubmitting(false);

                if(!isError){

                    // Clear all cached API calls so that new settings can take effect
                    ls.clear();

                    setLatestReport(new LatestReport({
                        "blackBin": {
                            "latest": blackBinToggle ? dayjs.utc().format() : latestReport?.LastBlackBin,
                            "nextAnon": blackBinToggle ? dayjs.utc().add(2, "day").format() : latestReport?.NextBlackBin
                        },
                        "greenBin": {
                            "latest": greenBinToggle ? dayjs.utc().format() : latestReport?.LastGreenBin,
                            "nextAnon": greenBinToggle ? dayjs.utc().add(2, "day").format() : latestReport?.NextGreenBin
                        }
                    }));

                    setBlackBinToggle(false);
                    setGreenBinToggle(false);
                    setEmail('');
                }

                // Display a message
                const responseMessage = isError ? json.errorMessage : json.successMessage;
                toast(responseMessage, {
                    duration: 3000,
                    position: 'top-right',
                    className: isError ? "error" : "success",
                    icon: isError ? <FaCircleXmark className="icon" /> : <FaCircleCheck className="icon" />
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
                        label={(formCanSubmit(true) && email == null ? "(Optional) " : "") +  "Email Address"}
                        variant="outlined"
                        onChange={ (event) => setEmail(event.target.value) }
                        placeholder="Enter your email address to receive progress updates"
                        value={email}
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