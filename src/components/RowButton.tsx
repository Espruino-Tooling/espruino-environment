import "../styles/rowbuttons.scss"

export const RowButton = (props:any) => {
    
    return (
        <div style={props.border && {borderRight:`0.5px solid lightgray`}} className="row-btn" onClick={props.call && (() => props.call())}> 
            {props.icon}
        </div>
    )
}