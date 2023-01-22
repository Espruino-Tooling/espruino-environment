import { ReactElement } from "react"
import { Footer } from "./Footer"
import { MenuBar } from "./MenuBar"

export const AppShell = ({children}:{children:ReactElement<any, any>}) => {
    
    return (
        <>
            <MenuBar/>
            {children}
            <Footer/>
        </>
    )
}