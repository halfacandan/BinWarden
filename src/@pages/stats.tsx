import { useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { Button } from '@mui/material';
import { FaFileCsv } from "react-icons/fa6";

import DownloadCSV from 'addons/DownloadCSV';
import GetJwtApiData from 'addons/GetJwtApiData';

import Report from 'classes/Report';

const Stats = () => {

    const [reports, setReports] = useState<Report[]>([]);
    const sourceUrl = (process.env.REACT_APP_BASEURL ?? "") + "/stats/graph";
    const csvDownloadUrl = sourceUrl + "?export=1";
    
    GetJwtApiData<Report>(
        sourceUrl, 
        "reports", 
        setReports,
        [],
        Report,
        () => { },
        3600
    );
    
    if(reports.length < 1) return <></>;

    const dataset = reports.map(report => report.toObject());

    return (
        <>
            <div className="sectionContainer centred">
                <Button
                    className="csvExport"
                    variant="contained"
                    startIcon={<FaFileCsv />}
                    onClick={() => DownloadCSV(csvDownloadUrl, "bin_warden_reports.csv")}
                >Export Data as CSV</Button>
                <BarChart
                    sx={{marginTop: "50px"}}
                    dataset={dataset}
                    series={[
                        { dataKey: 'greenBin', stack: 'A', label: 'Recycling Bins', color: '#438150' },
                        { dataKey: 'blackBin', stack: 'A', label: 'Waste Bins', color: '#000000cb' },
                    ]}
                    xAxis={[
                        { label: 'Bin Warden Reports' }
                    ]}
                    yAxis={[{ scaleType: 'band', dataKey: 'yearMonth' }]}
                    layout="horizontal"
                    height={600}
                    width={350}
                />
            </div>
        </>
    );
};
 
export default Stats;