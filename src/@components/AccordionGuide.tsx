import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import { BiSolidRightArrow } from "react-icons/bi";

import GuideData from 'classes/GuideData';
import GuideSection from 'classes/GuideSection';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<BiSolidRightArrow sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

export default function AccordionGuide({guideData}:{guideData?:GuideData}): JSX.Element {

    if(guideData == null){
        return <></>;
    }
        
    const [expanded, setExpanded] = React.useState<string | false>(guideData.ExpandedIndex == null ? false : "panel" + guideData.ExpandedIndex);

    const handleChange =
        (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
            setExpanded(newExpanded ? panel : false);
        };

    return (
        <div className={guideData.ClassName ?? ""}>
            {guideData.Sections.map((guideSection: GuideSection, index: number) =>
                <>
                    <div id={guideSection.AnchorName} className={guideData.ClassName == null ? "" : guideData.ClassName + "Item"}>
                        <Accordion className={index%2 == 1 ? "striped" : ""} expanded={expanded === 'panel' + index} onChange={handleChange('panel' + index)}>
                            <AccordionSummary aria-controls={"panel" + index + "d-content"} id={"panel" + index + "d-header"}>
                            <Typography>{guideSection.Title}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                {guideSection.Body}
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                    </div>
                </>
            )}
        </div>
    );
}