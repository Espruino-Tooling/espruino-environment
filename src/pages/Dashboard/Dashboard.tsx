import { Modal, Tabs, Tooltip, UnstyledButton } from "@mantine/core";
import { RowButton } from "../../components/RowButton";
import { Terminal } from "../../components/Terminal";
import "../../styles/dashboard.scss";
import SplitPane, { Pane, SashContent } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";

import "../../styles/codeeditor.scss";
import { transpile } from "@espruino-tools/transpiler";
import DeviceController from "@espruino-tools/core";
import { AiFillPlayCircle, AiOutlineCloudUpload, AiOutlineDelete, AiOutlineSave } from "react-icons/ai";
import { VscDesktopDownload } from 'react-icons/vsc'
const transpiled_code = (code: string) => {
  try {
    return transpile(code);
  } catch (err) {
    return code;
  }
};

export const Dashboard = () => {
  const [sizes, setSizes] = useState([400, "50%", "auto"]);
  const [code, setCode] = useState(``);
  const [transpiledCode, setTranspiledCode] = useState(``);
  const [response, setResponse] = useState(``);

  let [device] = useState(new DeviceController());

  console.log = function (value) {
    let clean_val = value.replaceAll("<UART>", "");

    clean_val = clean_val
      .replace('Sending',"> ")
      .replace("Received","")
      .replace('Sent','')
      setResponse(`${response}
        ${clean_val}
      `);
  };

  const uploadFile = (e:any) => {
    let file = e.target.files[0],
        read = new FileReader();

        read.readAsBinaryString(file);

    read.onloadend = () => {
        setCode(read.result as string);
    }
  }

  function getFunctionNamesFromString(
    str: string,
  ): { name: string; parameters: string[] }[] {
    let str_arr = str?.split('\n');

    let new_arr = str_arr?.map((x) => {
      if (x.startsWith('function')) {
        return x.split('{')[0].replace('function', '').split(' ').join('');
      } else if (x.startsWith('let') || x.startsWith('const')) {
        if (x.includes('function(') || x.includes('=>')) {
          if (x.includes('=>')) {
            return x
              .split('=>')[0]
              .replace('let', '')
              .replace('const', '')
              .replace('=', '')
              .split(' ')
              .join('');
          } else {
            return x
              .split('{')[0]
              .replace('let', '')
              .replace('const', '')
              .replace('=', '')
              .replace('function', '')
              .split(' ')
              .join('');
          }
        }
      }
    });

    let filtered_arr = new_arr.filter(Boolean);

    return filtered_arr.map((func) => {
      return {
        name: (func as string).split('(')[0],
        parameters:
          (func as string).split('(')[1].replace(')', '').split(',')[0] !== ''
            ? (func as string).split('(')[1].replace(')', '').split(',')
            : [],
      };
    });
  }  

  function mapStringFunctionToCall(funcArr: { name: string; parameters: string[] }[]) {
    return funcArr.map((func) => {
      return {
        [func.name]:JSON.stringify(func.parameters),
      };
    });
  }

  const [deviceCode,setDeviceCode] = useState({data:"no code..."});

  const getDeviceCode = async () => {
    await device.dump().then((dumpStr:any) => {
      setDeviceCode(dumpStr)
    }).catch(()=>{
      setDeviceCode({data:"no code..."})
    })
  }

  const getDeviceFunction = async () => {
    await device.dump().then((dumpStr:any)=>{
      setModalContent(mapStringFunctionToCall(getFunctionNamesFromString(dumpStr.data)))
    });
    setFuncsModalOpen(true)
  }

  useEffect(()=>{
    document.addEventListener("keydown", function(e) {
      if (e.keyCode === 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
        e.preventDefault();
        saveCodeFromEditor()
      }
    }, false);
  },[])
  
  useEffect(() => {
    setTranspiledCode(transpiled_code(code));
  }, [code]);

  const clearCode = () => {
    setResponse("")
  }

  const saveCodeFromEditor = () => {
    const fileData = code;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "espruinotoolside.js";
    link.href = url;
    link.click();
  }

  const runCode = async () => {
    device.UART.write(transpiledCode + "\n",()=>{});
  };

  const default_props={
    size:25,
    color:'white'
}

  const clearButton = {
    name: 'Clear code (from terminal)',
    icon: <AiOutlineDelete {...default_props}/>,
    background:'#B03A2E',
    border:'#78281F'
}

 const loadCodeButton = {
    name:'Load code (from file)',
    icon:<AiOutlineCloudUpload {...default_props}/>,
    background: '#616A6B',
    border:'#424949'
}

const saveCodeButton = {
    name:'Save code (from editor)',
    icon: <AiOutlineSave {...default_props}/>,
    background: '#117A65',
    border:'#0B5345'
}

const runCodeButton = {
  name: 'Run code (from editor)',
  icon: <AiFillPlayCircle {...default_props}/>,
  background:'#1F618D',
  border:'#1B4F72',
}

const deviceFuncButton = {
  name: 'Get Device Functions (from device)',
  icon: <VscDesktopDownload {...default_props}/>,
  background:'#1F618D',
  border:'#1B4F72',
}

const convertToCsv = (x:any) => {
  return JSON.parse(x[0]).join(',')
}

const [funcsModalOpen, setFuncsModalOpen] = useState(false);
const [modalContent, setModalContent] = useState<any>(null)
  return (
    <>
      <div className="dash-container">
      <Modal
        opened={funcsModalOpen}
        onClose={() => setFuncsModalOpen(false)}
        title="Device Functions"
      >
        {modalContent?.map((func:any) => 
          <p>{Object.keys(func)[0]}({convertToCsv(Object.values(func))})</p>
        )}
      </Modal>
        <SplitPane
          split="vertical"
          sizes={sizes}
          onChange={setSizes}
          resizerSize={9}
          sashRender={(index, active) => (
            <SashContent
              className={`sash-wrap-line ${active ? "active" : "inactive"}`}
            >
              {[<span className="line" />] as JSX.Element[]}
            </SashContent>
          )}
        >
          <Pane minSize={50}>
          <div className="dash-btns terminal">
      <Tooltip label={clearButton.name} position="bottom">
            <UnstyledButton>
              <RowButton
                color={{ background: clearButton.background, border: clearButton.border }}
                icon={clearButton.icon}
                name={clearButton.name}
                call={() => clearCode()}
              />
            </UnstyledButton>
          </Tooltip>
          </div>
            <Terminal out={response} />
          </Pane>
          <Pane minSize={300}>
          <div className="dash-btns editor">
          <Tooltip label={runCodeButton.name} position="bottom">
                <UnstyledButton>
                  <RowButton
                    color={{ background: runCodeButton.background, border: runCodeButton.border }}
                    icon={runCodeButton.icon}
                    name={runCodeButton.name}
                    call={() => runCode()}
                  />
                </UnstyledButton>
              </Tooltip>
              <Tooltip label={loadCodeButton.name} position="bottom">
                <label style={{cursor:'pointer'}}>
                    <input onChange={uploadFile} id="FILE_UPLOAD_TO_IDE" type="file"/>

                  <RowButton
                    color={{ background: loadCodeButton.background, border: loadCodeButton.border }}
                    icon={loadCodeButton.icon}
                    name={loadCodeButton.name}
                    call={() => {}}
                  />

                </label>
              </Tooltip>
              <Tooltip label={saveCodeButton.name} position="bottom">
                <UnstyledButton>
                  <RowButton
                    color={{ background: saveCodeButton.background, border: saveCodeButton.border }}
                    icon={saveCodeButton.icon}
                    name={saveCodeButton.name}
                    call={saveCodeFromEditor}
                  />
                </UnstyledButton>
              </Tooltip>
              <Tooltip label={deviceFuncButton.name} position="bottom">
                <UnstyledButton>
                  <RowButton
                    icon={deviceFuncButton.icon}
                    name={deviceFuncButton.name}
                    call={getDeviceFunction}
                  />
                </UnstyledButton>
              </Tooltip>
              
          </div>
          <div className="code-editor" style={{paddingTop:10}}>

          <Tabs defaultValue={'editor'} sx={{height:"100%"}}>
            <Tabs.List>
          <Tabs.Tab value="editor" icon={<></>}>Editor</Tabs.Tab>
          <Tabs.Tab value="transpiled-code" icon={<></>}>Transpiled Code</Tabs.Tab>
          <Tabs.Tab onClick={getDeviceCode} value="device" icon={<></>}>Device Code</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="editor" h={'100%'}  mah={'calc(100vh - 200px)'} pt="xs">
              <Editor

                className="line-numbers"
                defaultLanguage="javascript"
                defaultValue={code}
                value={code}
                onChange={(code:any) => setCode(code)}
              />
          </Tabs.Panel>
          <Tabs.Panel value="transpiled-code" h={'100%'} mah={'calc(100vh - 200px)'} pt="xs">
          <Editor
            className="line-numbers"
            defaultLanguage="javascript"
            value={transpiledCode}
            options={{readOnly:true,domReadOnly:true}}
          />
          </Tabs.Panel>
          <Tabs.Panel value="device" h={'100%'} mah={'calc(100vh - 200px)'} pt="xs">
          <Editor
            className="line-numbers"
            defaultLanguage="javascript"
            value={deviceCode.data}
            options={{readOnly:true,domReadOnly:true}}
          />
          </Tabs.Panel>
          </Tabs>
          </div>

          </Pane>
          
        </SplitPane>
      </div>
    </>
  );
};
