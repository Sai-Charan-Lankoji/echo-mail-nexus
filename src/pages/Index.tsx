
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import EmailList from '@/components/EmailList';
import EmailView from '@/components/EmailView';
import Composer from '@/components/Composer';
import SearchBar from '@/components/SearchBar';
import { sampleEmails, Email, Folder } from '@/data/emails';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const Index = () => {
  const [activeFolder, setActiveFolder] = useState<Folder>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<Email | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isMobile = useIsMobile();

  // Reset selected email when folder changes
  useEffect(() => {
    setSelectedEmail(null);
  }, [activeFolder]);

  // Filter emails based on search query
  const filteredEmails = sampleEmails[activeFolder].filter(email => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    return (
      email.subject.toLowerCase().includes(lowerCaseQuery) ||
      email.from.name.toLowerCase().includes(lowerCaseQuery) ||
      email.body.toLowerCase().includes(lowerCaseQuery)
    );
  });

  // Count unread emails in each folder
  const folderCounts = {
    inbox: sampleEmails.inbox.filter(email => !email.read).length,
    sent: sampleEmails.sent.length,
    drafts: sampleEmails.drafts.length,
    trash: sampleEmails.trash.length,
  };

  const handleSelectEmail = (email: Email) => {
    setSelectedEmail(email);
    // Mark as read when selected (in a real app, this would update the server)
    if (!email.read) {
      email.read = true;
    }
  };

  const handleCompose = () => {
    setReplyToEmail(null);
    setIsComposerOpen(true);
  };

  const handleReply = (email: Email) => {
    setReplyToEmail(email);
    setIsComposerOpen(true);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex items-center border-b p-2">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1 px-2">
          <h1 className="text-xl font-bold text-primary">EchoMail</h1>
        </div>
        <div>
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content area - now on the left */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto">
            {filteredEmails.length === 0 && searchQuery ? (
              <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
                <p className="text-muted-foreground">
                  No emails found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              <EmailList
                emails={filteredEmails}
                activeFolder={activeFolder}
                onSelectEmail={handleSelectEmail}
                selectedEmailId={selectedEmail?.id || null}
              />
            )}
          </div>
        </div>

        {/* Sidebar - now on the right, conditionally shown based on mobile state */}
        {(isMobile ? isSidebarOpen : true) && (
          <Sidebar
            activeFolder={activeFolder}
            onFolderChange={(folder) => {
              setActiveFolder(folder as Folder);
              if (isMobile) {
                setIsSidebarOpen(false);
              }
            }}
            onCompose={handleCompose}
            folderCounts={folderCounts}
          />
        )}
      </div>

      {/* Email view dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
        <DialogContent className="max-w-3xl w-full p-0 h-[80vh] max-h-[80vh] overflow-hidden">
          {selectedEmail && (
            <EmailView
              email={selectedEmail}
              onBack={() => setSelectedEmail(null)}
              onReply={handleReply}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Email composer with rich text editor */}
      {isComposerOpen && (
        <Composer 
          isOpen={isComposerOpen} 
          onClose={() => setIsComposerOpen(false)} 
          replyToEmail={replyToEmail}
        />
      )}
    </div>
  );
};

export default Index;
