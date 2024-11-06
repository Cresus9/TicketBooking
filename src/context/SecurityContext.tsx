import React, { createContext, useContext, useState } from 'react';

interface SecurityLog {
  id: string;
  timestamp: string;
  action: string;
  ip: string;
  userId?: string;
  details: string;
  severity: 'low' | 'medium' | 'high';
}

interface BlockedIP {
  ip: string;
  reason: string;
  timestamp: string;
  expiresAt: string;
}

interface SecurityContextType {
  logs: SecurityLog[];
  blockedIPs: BlockedIP[];
  addSecurityLog: (log: Omit<SecurityLog, 'id' | 'timestamp'>) => void;
  blockIP: (ip: string, reason: string, duration: number) => void;
  isIPBlocked: (ip: string) => boolean;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([]);

  const addSecurityLog = (log: Omit<SecurityLog, 'id' | 'timestamp'>) => {
    const newLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString()
    };
    setLogs(prevLogs => [newLog, ...prevLogs]);
  };

  const blockIP = (ip: string, reason: string, duration: number) => {
    const expiresAt = new Date(Date.now() + duration * 60 * 1000).toISOString();
    setBlockedIPs(prevBlocked => [
      ...prevBlocked,
      {
        ip,
        reason,
        timestamp: new Date().toISOString(),
        expiresAt
      }
    ]);
  };

  const isIPBlocked = (ip: string) => {
    const now = new Date();
    return blockedIPs.some(blocked => 
      blocked.ip === ip && new Date(blocked.expiresAt) > now
    );
  };

  return (
    <SecurityContext.Provider value={{
      logs,
      blockedIPs,
      addSecurityLog,
      blockIP,
      isIPBlocked
    }}>
      {children}
    </SecurityContext.Provider>
  );
}

export function useSecurity() {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}