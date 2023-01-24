import "../styles/terminal.scss"
import ReactMarkdown from "react-markdown"
export const Terminal = ({out}:any) => {
    return (
        <>
        <div className="terminal">
            <div className="out">
                <ReactMarkdown>{out}</ReactMarkdown>
            </div>
        </div>
        </>
    )
}