import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';

import { BiSolidRightArrow } from "react-icons/bi";

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

export default function AccordionSection(
    {
        title,
        expanded,
        handleChange,
        id,
        className,
        isStriped,
        children
    }:{
        title: string|JSX.Element,
        expanded: string|false,
        handleChange: (panel: string) => (event: React.SyntheticEvent<Element, Event>, expanded: boolean) => void,
        id: string,
        className?: string,
        isStriped?: boolean,
        children: JSX.Element
    }
): JSX.Element {

    return (
        <div className={className ?? ""}>
            <Accordion className={isStriped ? "striped" : ""} expanded={expanded === id} onChange={handleChange(id)}>
                <AccordionSummary aria-controls={"panel" + id + "d-content"} id={"panel" + id + "d-header"}>
                    <Typography>{title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                <Typography>
                    {children}
                </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
    );
}