import { Tooltip, UnstyledButton } from "@mantine/core";
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
import { HiOutlineArrowLeftCircle } from "react-icons/hi2";

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

  let device = new DeviceController();

  console.log = function (value) {
    let clean_val = value.replaceAll("<UART>", "");

    if (!clean_val.startsWith("Sending") || !clean_val.startsWith("Sent")) {
      setResponse(`${response}&nbsp;  
            ${clean_val}`);
    }
  };

  const uploadFile = (e:any) => {
    let file = e.target.files[0],
        read = new FileReader();

        read.readAsBinaryString(file);

    read.onloadend = () => {
        setCode(read.result as string);
    }


  }

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

  return (
    <>
      <div className="dash-container">
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
              
          </div>
            <div className="code-editor" style={{paddingTop:10}}>
              <Editor

                className="line-numbers"
                defaultLanguage="javascript"
                defaultValue={code}
                value={code}
                onChange={(code:any) => setCode(code)}
              />
            </div>
          </Pane>
        </SplitPane>
      </div>
    </>
  );
};
