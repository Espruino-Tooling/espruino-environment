import "../styles/terminal.scss"
import {IoIosArrowForward} from 'react-icons/io'
import ReactMarkdown from "react-markdown"
export const Terminal = ({out}:any) => {
    return (
        <div className="terminal">
            <div className="out">
                <ReactMarkdown>{out}</ReactMarkdown></div>
            {/* <div className="in">
                <div className="icon">
                    <IoIosArrowForward size={20} />
                </div>

                 <pre className="entry caret-block" contentEditable="true">
                </pre> 
            </div> */}
        </div>
    )
}