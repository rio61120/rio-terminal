'use client';

import { FitAddon } from '@xterm/addon-fit';
import { Terminal } from '@xterm/xterm';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';
import { ConnectionStatus } from '@/features/terminal/components/connection-status';
import { writeLocalEcho } from '@/features/terminal/lib/terminal-local-echo';
import { safeFit } from '@/features/terminal/lib/safe-fit';
import { FONT_OPTIONS, getXtermTheme } from '@/features/terminal/lib/terminal-themes';
import { useTerminalAppearance } from '@/features/terminal/terminal-appearance-context';
import type { BootPhase } from '@/features/terminal/components/terminal-boot-loader';
import '@xterm/xterm/css/xterm.css';

type EchoMode = 'local' | 'remote';
type SessionBackend = 'pty' | 'pipe' | 'unknown';

type XtermTerminalProps = {
  className?: string;
  onPhaseChange?: (phase: BootPhase) => void;
  onReady?: () => void;
};

function getFontStack(fontFamily: (typeof FONT_OPTIONS)[number]['id']) {
  return FONT_OPTIONS.find((f) => f.id === fontFamily)?.stack ?? 'var(--font-mono), monospace';
}

export function XtermTerminal({ className, onPhaseChange, onReady }: XtermTerminalProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const echoModeRef = useRef<EchoMode>('local');
  const readyRef = useRef(false);
  const { appearance } = useTerminalAppearance();
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [sessionLabel, setSessionLabel] = useState('');

  const notifyPhase = useCallback(
    (phase: BootPhase) => {
      onPhaseChange?.(phase);
    },
    [onPhaseChange],
  );

  const markReady = useCallback(() => {
    if (readyRef.current) return;
    readyRef.current = true;
    notifyPhase('ready');
    onReady?.();
  }, [notifyPhase, onReady]);

  const applyAppearance = useCallback(
    (term: Terminal) => {
      term.options.theme = getXtermTheme(appearance.preset);
      term.options.fontSize = appearance.fontSize;
      term.options.fontFamily = getFontStack(appearance.fontFamily);
      term.options.lineHeight = appearance.lineHeight;
      term.options.cursorStyle = appearance.cursorStyle;
      term.options.cursorBlink = appearance.cursorBlink;
    },
    [appearance],
  );

  const scheduleFit = useCallback((): boolean => {
    const container = containerRef.current;
    const term = termRef.current;
    const fitAddon = fitAddonRef.current;
    if (!safeFit(fitAddon, term, container)) return false;

    const socket = socketRef.current;
    if (socket?.connected && term) {
      socket.emit('resize', { cols: term.cols, rows: term.rows });
    }
    return true;
  }, []);

  const sendInput = useCallback((data: string) => {
    const socket = socketRef.current;
    const term = termRef.current;
    if (!socket?.connected || !term) return;

    socket.emit('input', data);
    if (echoModeRef.current === 'local') {
      writeLocalEcho(term, data);
    }
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    notifyPhase('terminal');

    const term = new Terminal({
      cursorBlink: appearance.cursorBlink,
      fontSize: appearance.fontSize,
      lineHeight: appearance.lineHeight,
      fontFamily: getFontStack(appearance.fontFamily),
      theme: getXtermTheme(appearance.preset),
      disableStdin: false,
      cursorStyle: appearance.cursorStyle,
      scrollback: 5000,
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(container);

    termRef.current = term;
    fitAddonRef.current = fitAddon;

    const focusTerminal = () => {
      term.focus();
      scheduleFit();
    };

    notifyPhase('shell');

    const socket: Socket = io({
      path: '/api/terminal/io',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 20,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setStatus('connected');
      requestAnimationFrame(() => {
        scheduleFit();
        requestAnimationFrame(() => {
          if (scheduleFit()) {
            markReady();
          }
          setTimeout(() => {
            scheduleFit();
            markReady();
            focusTerminal();
          }, 80);
        });
      });
    });

    socket.on('disconnect', () => setStatus('connecting'));

    socket.on('connect_error', () => {
      setStatus('error');
      term.writeln('\r\n\x1b[33m⚠ Terminal server not connected.\x1b[0m');
      term.writeln('Run: \x1b[36mbun run dev\x1b[0m or \x1b[36mnpm run dev\x1b[0m\r\n');
      markReady();
    });

    socket.on('session', (payload: { echo?: EchoMode; backend?: SessionBackend }) => {
      echoModeRef.current = payload.echo === 'remote' ? 'remote' : 'local';
      setSessionLabel(
        payload.backend === 'pty' || payload.echo === 'remote' ? 'real shell' : 'limited',
      );
    });

    socket.on('output', (data: string) => term.write(data));

    const dataDisposable = term.onData((data) => {
      socket.emit('input', data);
      if (echoModeRef.current === 'local') {
        writeLocalEcho(term, data);
      }
    });

    const onMouseDown = (e: MouseEvent) => {
      e.stopPropagation();
      focusTerminal();
    };

    container.addEventListener('mousedown', onMouseDown);

    const resizeObserver = new ResizeObserver(() => {
      if (scheduleFit() && socket.connected) {
        markReady();
      }
    });
    resizeObserver.observe(container);

    const fitTimers = [50, 150, 400, 800].map((ms) =>
      window.setTimeout(() => scheduleFit(), ms),
    );

    return () => {
      readyRef.current = false;
      fitTimers.forEach(clearTimeout);
      dataDisposable.dispose();
      resizeObserver.disconnect();
      container.removeEventListener('mousedown', onMouseDown);
      socket.disconnect();
      term.dispose();
      termRef.current = null;
      fitAddonRef.current = null;
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const term = termRef.current;
    if (!term) return;
    applyAppearance(term);
    requestAnimationFrame(() => scheduleFit());
  }, [appearance, applyAppearance, scheduleFit]);

  const onWrapperKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!socketRef.current?.connected) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;

    const target = e.target as HTMLElement;
    if (target.classList.contains('xterm-helper-textarea')) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      sendInput('\r');
      return;
    }
    if (e.key === 'Backspace') {
      e.preventDefault();
      sendInput('\x7f');
      return;
    }
    if (e.key === 'Tab') {
      e.preventDefault();
      sendInput('\t');
      return;
    }
    if (e.key.length === 1) {
      e.preventDefault();
      sendInput(e.key);
    }
  };

  return (
    <div
      ref={wrapperRef}
      className={className}
      tabIndex={-1}
      aria-label="Terminal"
      onMouseDown={(e) => {
        e.stopPropagation();
        termRef.current?.focus();
      }}
      onKeyDown={onWrapperKeyDown}
      onFocus={() => termRef.current?.focus()}
    >
      <div className="pointer-events-none absolute top-2 right-3 z-30">
        <ConnectionStatus
          status={status}
          label={status === 'connected' ? sessionLabel || 'live' : undefined}
        />
      </div>
      <div ref={containerRef} className="terminal-host h-full min-h-0 w-full flex-1 px-2 pb-2" />
    </div>
  );
}
