import { useEffect } from 'react'

import AccordionGuide from 'components/AccordionGuide';

import GuideData from 'classes/GuideData';

const FAQs = () => {

    const anchor:string|null = window.location.href.indexOf("#") < 0 ? null : window.location.href.slice(window.location.href.indexOf("#"));

    const aboutBinWarden:GuideData = new GuideData({
        "className": "guideSections",
        "sections": [
            {
                "title": "Why did you create this site?",
                "body": <>
                            <p className="readability">Edinburgh Council has failed to provide a regular bin collection service since August 2022. This site will let us all report issues to the Council when we see them.</p>
                            <p className="readability">My goal is to make it as easy as possible to notify the Council of a failed collection.</p>
                        </>
            },
            {
                "title": "How did you create this site?",
                "body": <><p className="readability">The site's front-end uses <a target="_blank" href="https://react.dev/">React</a>, the API is written in <a target="_blank" href="https://www.php.net/">PHP</a>. You can <a target="_blank" href="https://github.com/halfacandan/BinWarden">view the site's source code on GitHub</a>.</p></>
            },
            {
                "title": "How do I contact the Owner of Bin Warden?",
                "body": <><p className="readability">You can either shine a bin-shaped light into the sky or email me at <a href="mailto:binwardenuk@gmail.com">binwardenuk@gmail.com</a>.</p></>
            }
        ]
    }, anchor);
    
    const wasteCollection:GuideData = new GuideData({
        "className": "guideSections",
        "sections": [
            {
                "title": "Who collects our bins?",
                "body": <><p className="readability">Edinburgh Council is responsible for the collection of our bins. The factor has no involvement in the process.</p></>
            },
            {
                "title": "When should our bins get collected?",
                "body": <><p className="readability">The collection of general waste (black bins) and recycling waste (green bins) alternates so that each is collected one week after the other to give a fortnightly collection of each bin type. Edinburgh Council provides <a target="_blank" href="https://www.edinburgh.gov.uk/directory-record/1573467/james-gall-wynd">a collection calendar on their website</a>.</p></>
            },
            {
                "title": "How long do I have to wait after reporting a problem?",
                "body": <><p className="readability">The email that Bin Warden sends has to be logged by a member of Edinburgh Council's staff. They then aim to collect the waste within two working days (Mon-Fri) of our report being logged. Typically this means that a report made on Tuesday will lead to a bin collection on Thursday whereas a report on Friday will be collected the following Tuesday (since Saturday and Sunday are not working days).</p></>
            }
        ]
    }, anchor);

    const yourData:GuideData = new GuideData({
        "className": "guideSections",
        "sections": [
            {
                "title": "How does the site use my data?",
                "body": <>
                    <h4>Does the site use Cookies?</h4>
                    <p className="readability">No. The site does not use cookies.</p>

                    <h4>What information is collected?</h4>
                    <p className="readability">Bin Warden only collects:
                        <ul className="readability">
                            <li>The date and time that you report a full bin</li>
                            <li>The location of the bin store</li>
                        </ul>
                    </p>

                    <p className="readability">Bin Warden does <u>NOT</u> collect:
                        <ul className="readability">
                            <li>Your email address</li>
                            <li>Your IP Address</li>
                            <li>Any identifiable information</li>
                        </ul>
                    </p>

                    <h4>Why is the information collected?</h4>
                    <p className="readability">Date and time information are collected in order to produce a report on how frequently problems are reported to Edinburgh Council and to display when they were last notified of an issue.</p>
                    
                    <h4>Who is the information shared with or sold to?</h4>
                    <p className="readability">The information is publicly visible on the Bin Warden site and will not be shared with any other entity, nor will it be sold.</p>
                    
                    <h4>What rights do I have over my data?</h4>
                    <p className="readability">No personal or user-identifiable data are stored.</p>
                </>
            }
        ]
    }, anchor);

    useEffect(() => {
        document.getElementById(anchor?.slice(1) ?? "")?.scrollIntoView();
    }, []); // Passing an empty array = Run Once

    return (
        <>
            <div className="sectionContainer">
                <div className="text">
                
                    <h3>Waste Collection</h3>
                    <AccordionGuide guideData={wasteCollection} />

                    <h3>About Bin Warden</h3>
                    <AccordionGuide guideData={aboutBinWarden} />

                    <h3>Privacy Policy</h3>
                    <AccordionGuide guideData={yourData} />
                </div>
            </div>
        </>
    );
};
 
export default FAQs;