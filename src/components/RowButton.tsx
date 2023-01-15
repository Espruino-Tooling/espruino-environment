import "../styles/rowbuttons.scss"

export const RowButton = (props:any) => {
    
    return (
        <div style={{background:props?.color?.background, border:`0.5px solid ${props?.color?.border}`}} className="row-btn" onClick={props.call && (() => props.call())}> 
            {props.icon}
        </div>
    )
}