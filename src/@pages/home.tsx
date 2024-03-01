import { useState } from 'react';

import { Button, TextField } from '@mui/material';
import { FaSquareCheck } from "react-icons/fa6";

//import GetJwtApiData from 'addons/GetJwtApiData';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const Home = (props:{
    setMessageBarText: React.Dispatch<React.SetStateAction<string>>
    setMessageBarError: React.Dispatch<React.SetStateAction<boolean>>
    setMessageBarShow: React.Dispatch<React.SetStateAction<boolean>>
}) => {

    const [blackBinToggle, setBlackBinToggle] = useState<boolean>(false);
    const [greenBinToggle, setGreenBinToggle] = useState<boolean>(false);
    const [email, setEmail] = useState<string|null>(null);

    const blackBinReported = dayjs().utc().to(dayjs.utc('2024-02-29 12:34:56'), true);
    const greenBinReported = dayjs().utc().to(dayjs.utc('2024-02-28 12:34:56'), true);

    return (
        <>
            <div className="sectionContainer">
                <p>You can use this form to report a full bin to Edinburgh Council.</p>
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
                    onClick={ () => {
                            console.log(blackBinToggle + " - " + greenBinToggle + " - " + email);
                            props.setMessageBarText("Submitted");
                            props.setMessageBarError(false);
                            props.setMessageBarShow(true);
                        }
                    }
                >Report it</Button>
            </div>
        </>
    );
};
 
export default Home;