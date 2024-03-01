import { FaCircleCheck, FaCircleXmark, FaXmark } from "react-icons/fa6";

const MessageBar = (props:{
    text: string,
    setShow: React.Dispatch<React.SetStateAction<boolean>>,
    show: boolean,
    error?: boolean   
}): JSX.Element => {

    var MessageBar = <></>;
    if(props.text != null){
        MessageBar = 
            <div className={"messageBar" + (props.error ? " error" : " success") + (props.show ? "" : " hide")} onClick={() => { props.setShow(false); }}>
                <span className="icon">{(props.error ? <FaCircleXmark /> : <FaCircleCheck />)}</span>
                <p>{props.text}</p>
                <span className="messageClose"><FaXmark /></span>
            </div>;
    }

    return MessageBar;
};

export default MessageBar;