import { Tooltip, UnstyledButton } from '@mantine/core'
import { AiOutlineSetting } from 'react-icons/ai'
import { MdOutlineBluetoothConnected } from 'react-icons/md'
import '../styles/menubar.scss'
import { RowButton } from './RowButton'

const default_props={
    size:20,
    color:'white'
}

const btn = {
    name:'Connect to device',
    icon:<MdOutlineBluetoothConnected {...default_props}/>,
    background:'#239B56',
    border:'#186A3B'
}

const settings = {
    name: 'Settings',
    icon:<AiOutlineSetting {...default_props}/>, 
    background:'#909497',
    border:'#626567'
}

export const MenuBar = () => {
    return(
        <div className="menubar">
            <div className="flex">
            <div className="logo"/>
            <h2>Espruino Tools IDE</h2>
            </div>
            <div className='flex'>
            <Tooltip label={btn.name} position="bottom"><UnstyledButton><RowButton color={{background:btn.background,border:btn.border }} icon={btn.icon} name={btn.name} call={undefined}/></UnstyledButton></Tooltip>        
            <Tooltip label={settings.name} position="bottom"><UnstyledButton><RowButton color={{background:settings.background,border:settings.border }} icon={settings.icon} name={settings.name} call={undefined}/></UnstyledButton></Tooltip>        
            </div>
            </div>
    )
}