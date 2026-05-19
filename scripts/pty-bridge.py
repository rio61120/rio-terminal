#!/usr/bin/env python3
"""PTY bridge: stdin/stdout <-> real shell. Used when node-pty fails on macOS."""
import os
import pty
import select
import sys


def main() -> int:
    cwd = sys.argv[1] if len(sys.argv) > 1 else os.getcwd()
    shell = os.environ.get("SHELL", "/bin/zsh")

    pid, master_fd = pty.openpty()

    if pid == 0:
        os.setsid()
        os.chdir(cwd)
        os.environ["TERM"] = "xterm-256color"
        os.environ["COLORTERM"] = "truecolor"
        os.execvp(shell, [shell, "-il"])
        return 1

    try:
        while True:
            r, _, _ = select.select([sys.stdin.buffer, master_fd], [], [])
            if sys.stdin.buffer in r:
                data = os.read(sys.stdin.fileno(), 4096)
                if not data:
                    break
                os.write(master_fd, data)
            if master_fd in r:
                data = os.read(master_fd, 4096)
                if not data:
                    break
                os.write(sys.stdout.fileno(), data)
    except KeyboardInterrupt:
        pass
    finally:
        try:
            os.close(master_fd)
        except OSError:
            pass
        try:
            os.waitpid(pid, 0)
        except ChildProcessError:
            pass

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
