const {
    contextBridge,
    ipcRenderer
} = require("electron");

import { ChannelName } from '../src/shared/ChannelName';
import { EOL } from 'os';
import { basename, extname } from 'path';

//console.log('hello from preload!!')

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object.
//
/// !!NOTE!! VERY IMPORTANT!! if you modify this object, update accordinly
// in the global.d.ts file. Those function implementations must match the 
// signature in the global.d.ts file give by interface IAPI.


contextBridge.exposeInMainWorld(
    "api", {
        newline: EOL,
        basename: basename,
        extname: extname,
        send: (channel, data) => {
            // whitelist channels
            let validChannels = ['toMain', 
                                 ChannelName.MainProcessResponseStdout,
                                 ChannelName.MainProcessResponseStderr,
                                 ChannelName.MainprocessRunShellCommand,
                                 ChannelName.MainprocessShellCommandFinished,
                                ];
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data);
            }
        },
        receive: (channel, func) => {
            let validChannels = ['fromMain',
                                    ChannelName.MainProcessResponseStdout,
                                    ChannelName.MainProcessResponseStderr,
                                    ChannelName.MainprocessShellCommandFinished
                                ];
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender` 
                ipcRenderer.on(channel, (event, ...args) => func(...args));
            }
        }
    }
);