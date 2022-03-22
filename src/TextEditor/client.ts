import { MessageConnection } from 'vscode-jsonrpc';
import { listen } from '@codingame/monaco-jsonrpc';
import * as monaco from 'monaco-editor'
import {
    MonacoLanguageClient, CloseAction, ErrorAction,
    MonacoServices, createConnection
} from '@codingame/monaco-languageclient'
import normalizeUrl from 'normalize-url'
import ReconnectingWebSocket from 'reconnecting-websocket';

// TODO: put MonacoEnvironment in a interface?
(window as any).MonacoEnvironment = {
    getWorkerUrl: () => './editor.worker.bundle.js'
}

export function DoTheMagic()
{
    // register Monaco languages
    monaco.languages.register({
        id: 'typescript',
        extensions: ['.ts'],
        aliases: ['TypeScript','ts','TS','Typescript','typescript']
    })

    monaco.languages.register({
        id: 'd',
        extensions: ['.d'],
        aliases: ['D','d','dlang','Dlag']
    })

    // create Monaco editor
    const value = `
    import std.stdio;
    void main() {
        writeln("Hello, world!");
    }
    `;

    monaco.languages.setMonarchTokensProvider('d', {
        tokenizer: {
            root: [
                ["int", "int-type-token"],
                ["string-type", "string-type-token"],
                ["return|function", "keyword-token"],
                ["import", "import-token"],
                [/[a-zA-Z_]+/, "identifier-token"],
                [/\d+/, "digits-token"],
                [/"[^"]+\"/, "string-literal-token"],
                //[/[a-zA-Z_]+\s*\(/, "func-call-token"]
            ]
        }
    })

    monaco.editor.defineTheme('myCoolTheme', {
        base: 'vs-dark',
        inherit: false,
        rules: [
            { token: 'int-type-token', foreground: '#ff6347' },
            { token: 'string-type-token', foreground: 'ffa500' },
            { token: 'keyword-token', foreground: '6a5acd' },
            { token: 'identifier-token', foreground: '#eb0450'},
            { token: 'digits-token', foreground: '#ee82ee' },
            { token: 'string-literal-token', foreground: '#d1ed73' },
            { token: 'import-token', foreground: '#dac5f7'},
            { token: 'func-call-token', foreground: '#5bd60d'}
        ],
        colors: {
            "editor.background": "#2B2B2B",
            'editor.foreground': '#FFFFFF',
        }
    })

    monaco.editor.create(document.getElementById("container")!, {
        model: monaco.editor.createModel(value, 'd', monaco.Uri.parse('file:///C:\\Users\\jckj33\\Desktop\\project\\demo\\dlang\\file.d')),
        glyphMargin: true,
        //theme: "vs-dark",
        theme: 'myCoolTheme',
        smoothScrolling: true,
        mouseWheelZoom: true,
        fontFamily: "Consolas",
        lightbulb: {
            enabled: true
        }
    })

    // install Monaco language client services
    MonacoServices.install(monaco, {rootUri: "file:///C:\\Users\\jckj33\\Desktop\\project\\demo\\dlang\\"})

    // create the web socket
    const url = createUrl('ws://localhost:3000/dlang')
    const webSocket = createWebSocket(url)

    // listen when the web socket is opened
    listen({
        webSocket,
        onConnection: connection => {
            // create and start the language client
            const languageClient = createLanguageClient(connection);
            const disposable = languageClient.start();
            connection.onClose(() => disposable.dispose());
        }
    });
}

function createLanguageClient(connection: MessageConnection): MonacoLanguageClient {
    return new MonacoLanguageClient({
        name: "Sample Language Client",
        clientOptions: {
            // use a language id as a document selector
            documentSelector: ['d'],
            // disable the default error handler
            errorHandler: {
                error: () => ErrorAction.Continue,
                closed: () => CloseAction.DoNotRestart
            }
        },
        // create a language client connection from the JSON RPC connection on demand
        connectionProvider: {
            get: (errorHandler, closeHandler) => {
                return Promise.resolve(createConnection(connection, errorHandler, closeHandler))
            }
        }
    });
}

function createUrl(path: string): string {
    return normalizeUrl(path);
}

function createWebSocket(url: string): WebSocket {
    const socketOptions = {
        maxReconnectionDelay: 10000,
        minReconnectionDelay: 1000,
        reconnectionDelayGrowFactor: 1.3,
        connectionTimeout: 10000,
        maxRetries: Infinity,
        debug: false
    };
    return new (ReconnectingWebSocket as any)(url, [], socketOptions) as WebSocket;
}