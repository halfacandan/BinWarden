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
                            <p className="readability">Edinburgh Council has failed to provide a regular bin collection service for over 18 months. This site will let us all report issues to the Council when we see them.</p>
                            <p className="readability">My goal is to make it as easy as possible to notify the Council of a failed collection.</p>
                        </>
            },
            {
                "title": "How did you create this site?",
                "body": <><p className="readability">The site's front-end uses <a target="_blank" href="https://react.dev/">React</a>, the API is written in <a target="_blank" href="https://www.php.net/">PHP</a>. You can <a target="_blank" href="https://github.com/halfacandan/BinWarden">view the site's source code on GitHub</a>.</p></>
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
                            <li>The date and time that you reported a full bin</li>
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
                    <p className="readability">Date and time information is collected in order to produce a report on how frequently a problem is reported and to display when Edinburgh Council was last notified of an issue.</p>
                    
                    <h4>Who is the information shared with or sold to?</h4>
                    <p className="readability">The information is publicly visible on the Bin Warden site and will not be shared with any other entity, nor will it be sold.</p>
                    
                    <h4>What rights do I have over my data?</h4>
                    <p className="readability">No personal or user-identifiable data are stored.</p>
                    
                    <h4>How do I contact the Owner of Bin Warden?</h4>
                    <p className="readability">You can pop a note through my door or ring the bell and say "hi": I'm at number 21.</p>
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