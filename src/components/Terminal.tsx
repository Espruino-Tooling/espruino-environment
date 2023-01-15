import "../styles/terminal.scss"
import {IoIosArrowForward} from 'react-icons/io'
export const Terminal = () => {
    return (
        <div className="terminal">
            <div className="out"></div>
            <div className="in">
                <div className="icon">
                    <IoIosArrowForward size={20}/>
                </div>

                <pre className="entry caret-block" contentEditable="true">
                </pre>
            </div>
        </div>
    )
}