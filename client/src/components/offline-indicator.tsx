import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPendingSyncItems, syncData } from "@/lib/sync-manager";

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const checkPending = async () => {
      const items = await getPendingSyncItems();
      setPendingCount(items.length);
    };

    checkPending();
    const interval = setInterval(checkPending, 5000);

    return () => clearInterval(interval);
  }, []);

  async function handleSync() {
    setSyncing(true);
    try {
      await syncData();
      const items = await getPendingSyncItems();
      setPendingCount(items.length);
    } finally {
      setSyncing(false);
    }
  }

  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      {!isOnline && (
        <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500">
          <WifiOff className="mr-1 h-3 w-3" />
          Offline
        </Badge>
      )}

      {pendingCount > 0 && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {pendingCount} pending
          </Badge>
          {isOnline && (
            <Button
              size="sm"
              variant="ghost"
              onClick={handleSync}
              disabled={syncing}
              className="h-8 px-2"
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
