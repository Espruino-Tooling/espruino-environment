import { Tooltip, UnstyledButton } from "@mantine/core"
import { RowButton } from "../../components/RowButton"
import { Terminal } from "../../components/Terminal"
import "../../styles/dashboard.scss"
import { rowButtons } from "./RowButtons"
import SplitPane, { Pane, SashContent } from 'split-pane-react';
import 'split-pane-react/esm/themes/default.css';
import { useState } from "react"
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another

import '../../styles/codeeditor.scss'

export const Dashboard = () => {
    const [sizes, setSizes] = useState([400, '50%', 'auto']);
    const [code, setCode] = useState(
        ``
      );
    return (
        <>
        <div className="dash-btns">
            {rowButtons.map((btn)=><Tooltip label={btn.name} position="bottom"><UnstyledButton><RowButton color={{background:btn.background,border:btn.border }} icon={btn.icon} name={btn.name} call={undefined}/></UnstyledButton></Tooltip>)}
        </div>
        <div className="dash-container">
            <SplitPane
                    split='vertical'
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
                <Pane minSize={200}>
                    <Terminal/>
                </Pane>
                <Pane minSize={200}>
                    <div className="code-editor">
                <Editor
                className="line-numbers"
                placeholder="Enter your code here..."
                    value={code}
                    onValueChange={code => setCode(code)}
                    highlight={code => {
                        return highlight(code, languages.js)
                    }}
                    padding={10}
                    lang={"typescript"}
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 12,
                        height:"100%"
                    }}
                    />
                </div>
                </Pane>
            
            </SplitPane>
        </div>
        </>
    )
}