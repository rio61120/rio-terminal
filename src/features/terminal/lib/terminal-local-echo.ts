import type { Terminal } from '@xterm/xterm';

/** Show keystrokes in xterm when the shell has no PTY (pipe mode). */
export function writeLocalEcho(term: Terminal, data: string) {
  for (const char of data) {
    if (char === '\r') {
      term.write('\r\n');
    } else if (char === '\n') {
      term.write('\n');
    } else if (char === '\x7f' || char === '\b') {
      term.write('\b \b');
    } else if (char === '\u0003') {
      term.write('^C');
    } else if (char >= ' ' && char !== '\x7f') {
      term.write(char);
    }
  }
}
