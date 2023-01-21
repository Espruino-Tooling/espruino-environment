import DeviceController from "@espruino-tools/core";
import { Tooltip, UnstyledButton } from "@mantine/core";
import { useState } from "react";
import { AiOutlineSetting } from "react-icons/ai";
import { MdOutlineBluetoothConnected } from "react-icons/md";
import "../styles/menubar.scss";
import { RowButton } from "./RowButton";
const default_props = {
  size: 20,
  color: "white",
};

const btn = {
  name: "Connect to device",
  icon: <MdOutlineBluetoothConnected {...default_props} />,
  background: "#239B56",
  border: "#186A3B",
};

const disconnect = {
  name: "Disconnect from device",
  icon: <MdOutlineBluetoothConnected {...default_props} />,
  background: "rgb(176, 58, 46)",
  border: "rgb(120, 40, 31)",
};

const settings = {
  name: "Settings",
  icon: <AiOutlineSetting {...default_props} />,
  background: "#909497",
  border: "#626567",
};

export const MenuBar = () => {
    let device = new DeviceController();

  let [deviceConnected, setDeviceConnected] = useState(false);

  let connectToDevice = () => {
    let p = new Promise((res) => {
      res(device.connect());
    });
    p.then(() => {
      setDeviceConnected(true);
    });
  };

  let disconnectDevice = () => {
      device.disconnect();
      setDeviceConnected(false);
  };

  return (
    <div className="menubar">
      <div className="flex">
        <div className="logo" />
        <h2>Espruino Tools IDE</h2>
      </div>
      <div className="flex">
        {!deviceConnected ? (
          <Tooltip label={btn.name} position="bottom">
            <UnstyledButton>
              <RowButton
                color={{ background: btn.background, border: btn.border }}
                icon={btn.icon}
                name={btn.name}
                call={connectToDevice}
              />
            </UnstyledButton>
          </Tooltip>
        ) : (
          <Tooltip label={disconnect.name} position="bottom">
            <UnstyledButton>
              <RowButton
                color={{
                  background: disconnect.background,
                  border: disconnect.border,
                }}
                icon={disconnect.icon}
                name={disconnect.name}
                call={disconnectDevice}
              />
            </UnstyledButton>
          </Tooltip>
        )}
        <Tooltip label={settings.name} position="bottom">
          <UnstyledButton>
            <RowButton
              color={{
                background: settings.background,
                border: settings.border,
              }}
              icon={settings.icon}
              name={settings.name}
              call={undefined}
            />
          </UnstyledButton>
        </Tooltip>
      </div>
    </div>
  );
};
