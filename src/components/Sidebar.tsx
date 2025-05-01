
import React from 'react';
import { 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Edit, 
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  const folders = [
    { id: 'inbox', name: 'Inbox', icon: Inbox },
    { id: 'sent', name: 'Sent', icon: Send },
    { id: 'drafts', name: 'Drafts', icon: FileText },
    { id: 'trash', name: 'Trash', icon: Trash2 }
  ];

  return (
    <div className={cn(
      "border-r min-h-screen bg-sidebar flex flex-col",
      isMobile ? "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out" : "w-64"
    )}>
      <div className="p-4">
        <Button 
          className="w-full flex items-center gap-2" 
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
