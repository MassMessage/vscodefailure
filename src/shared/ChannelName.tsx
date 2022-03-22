export default { }

export enum ChannelName
{
    MainProcessResponseStdout   =  'mainprocess-response-stdout',
    MainProcessResponseStderr   =  'mainprocess-response-stderr',
    MainProcessResponseStdin    =  'mainprocess-response-stdin',
    MainprocessRunShellCommand  =  'mainprocess-run-shell-command',
    MainprocessShellCommandFinished = 'mainprocess-shell-command-finished',
}