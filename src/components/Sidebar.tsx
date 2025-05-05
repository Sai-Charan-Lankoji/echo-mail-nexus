
import React, { useState } from 'react';
import { 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Plus,
  Tag,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface SidebarProps {
  activeFolder: string;
  onFolderChange: (folder: string) => void;
  onCompose: () => void;
  folderCounts: Record<string, number>;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeFolder, 
  onFolderChange, 
  onCompose,
  folderCounts 
}) => {
  const isMobile = useIsMobile();
  const [isLabelsOpen, setIsLabelsOpen] = useState(true);
  
  const folders = [
    { id: 'inbox', name: 'Inbox', icon: Inbox },
    { id: 'sent', name: 'Sent', icon: Send },
    { id: 'drafts', name: 'Drafts', icon: FileText },
    { id: 'trash', name: 'Trash', icon: Trash2 }
  ];

  // Sample labels - in a real app, these would come from the backend
  const labels = [
    { id: 'work', name: 'Work', color: '#ef4444' },
    { id: 'personal', name: 'Personal', color: '#3b82f6' },
    { id: 'finance', name: 'Finance', color: '#10b981' },
    { id: 'social', name: 'Social', color: '#8b5cf6' }
  ];

  return (
    <div className={cn(
      "border-l min-h-screen bg-sidebar flex flex-col",
      isMobile ? "fixed inset-y-0 right-0 z-50 w-64 transform transition-transform duration-200 ease-in-out" : "w-64"
    )}>
      <div className="p-4">
        <Button 
          className="w-full flex items-center gap-2 bg-primary hover:bg-primary/90" 
          onClick={onCompose}
        >
          <Plus className="h-4 w-4" />
          <span>Compose</span>
        </Button>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-1 px-2">
          {folders.map(folder => (
            <li key={folder.id}>
              <button
                onClick={() => onFolderChange(folder.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm",
                  activeFolder === folder.id ? "folder-active" : "hover:bg-muted"
                )}
              >
                <folder.icon className="h-4 w-4" />
                <span>{folder.name}</span>
                {folderCounts[folder.id] > 0 && (
                  <span className="ml-auto bg-muted rounded-full px-2 py-1 text-xs">
                    {folderCounts[folder.id]}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
        
        {/* Labels Section */}
        <div className="mt-6">
          <Collapsible 
            open={isLabelsOpen} 
            onOpenChange={setIsLabelsOpen}
            className="w-full"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2" />
                <span>Labels</span>
              </div>
              <ChevronRight 
                className={cn(
                  "h-4 w-4 transition-transform",
                  isLabelsOpen ? "transform rotate-90" : ""
                )} 
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <ul className="space-y-1 px-2 mt-1">
                {labels.map(label => (
                  <li key={label.id}>
                    <button
                      onClick={() => onFolderChange(`label:${label.id}`)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm hover:bg-muted",
                        activeFolder === `label:${label.id}` && "folder-active"
                      )}
                    >
                      <span 
                        className="h-3 w-3 rounded-full" 
                        style={{ backgroundColor: label.color }}
                      />
                      <span>{label.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
            ME
          </div>
          <div className="flex-1 truncate">
            <div className="text-sm font-medium">Me</div>
            <div className="text-xs text-muted-foreground truncate">me@example.com</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
