import "../styles/terminal.scss"
import {IoIosArrowForward} from 'react-icons/io'
import ReactMarkdown from "react-markdown"
export const Terminal = ({out}:any) => {
    return (
        <>
        <div className="terminal">
            <div className="out">
                <ReactMarkdown>{out}</ReactMarkdown></div>
        </div>
        </>
    )
}