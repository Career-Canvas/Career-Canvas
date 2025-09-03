import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Plus, Trash2, RefreshCw } from "lucide-react";
import apiKeyManager, { APIKey } from "@/services/apiKeyManager";

interface APIKeyManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const APIKeyManagerComponent = ({ isOpen, onClose }: APIKeyManagerProps) => {
  const [newKey, setNewKey] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const keys = apiKeyManager.getKeysStatus();
  const availableCount = apiKeyManager.getAvailableKeysCount();

  const handleAddKey = () => {
    if (newKey.trim() && newKeyName.trim()) {
      apiKeyManager.addKey(newKey.trim(), newKeyName.trim());
      setNewKey("");
      setNewKeyName("");
      setShowAddForm(false);
    }
  };

  const handleRemoveKey = (keyToRemove: string) => {
    apiKeyManager.removeKey(keyToRemove);
  };

  const handleRefreshKeys = () => {
    // Force refresh of key status
    apiKeyManager.getKeysStatus();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-96 max-w-[90vw] max-h-[80vh] overflow-hidden">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-primary">
              🔑 API Key Manager
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Status Summary */}
          <div className="p-4 bg-blue-50 dark:bg-blue-900/50 border-b border-blue-200 dark:border-blue-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Key Status
              </span>
              <Badge variant={availableCount > 0 ? "default" : "destructive"}>
                {availableCount}/{keys.length} Available
              </Badge>
            </div>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              {availableCount > 0 
                ? `${availableCount} key${availableCount > 1 ? 's' : ''} ready to use`
                : "All keys are rate limited"
              }
            </p>
          </div>

          {/* Keys List */}
          <div className="max-h-64 overflow-y-auto p-4 space-y-3">
            {keys.map((key, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">{key.name}</span>
                    <Badge 
                      variant={key.rateLimitHit ? "destructive" : "default"}
                      className="text-xs"
                    >
                      {key.rateLimitHit ? "Rate Limited" : "Active"}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {key.rateLimitHit && key.rateLimitResetTime
                      ? `Resets: ${key.rateLimitResetTime.toLocaleTimeString()}`
                      : `Last used: ${key.lastUsed.toLocaleTimeString()}`
                    }
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveKey(key.key)}
                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                  title="Remove key"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Add New Key */}
          {showAddForm ? (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <Input
                placeholder="API Key"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                className="text-sm"
              />
              <Input
                placeholder="Key Name (e.g., 'Friend 1', 'Backup Key')"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="text-sm"
              />
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={handleAddKey}
                  disabled={!newKey.trim() || !newKeyName.trim()}
                  className="flex-1"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Key
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddForm(true)}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New API Key
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshKeys}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Status
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="flex-1"
              >
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIKeyManagerComponent;
