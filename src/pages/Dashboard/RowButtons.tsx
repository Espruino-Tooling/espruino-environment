import {MdOutlineBluetoothConnected} from 'react-icons/md'
import {AiOutlineCloudUpload, AiOutlineDelete, AiOutlineSave} from 'react-icons/ai'
import {HiOutlineArrowLeftCircle} from 'react-icons/hi2'
const default_props={
    size:20,
    color:'white'
}

export const rowButtons = [{
    name: 'Clear code (from terminal)',
    icon: <AiOutlineDelete {...default_props}/>,
    background:'#B03A2E',
    border:'#78281F'
}

,{
    name:'Load code (from file)',
    icon:<AiOutlineCloudUpload {...default_props}/>,
    background: '#616A6B',
    border:'#424949'
},{
    name:'Save code (from editor)',
    icon: <AiOutlineSave {...default_props}/>,
    background: '#117A65',
    border:'#0B5345'
},{
    name: 'Run code (from editor)',
    icon: <HiOutlineArrowLeftCircle {...default_props}/>,
    background:'#1F618D',
    border:'#1B4F72'
}]