
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import EmailList from '@/components/EmailList';
import EmailView from '@/components/EmailView';
import Composer from '@/components/Composer';
import SearchBar from '@/components/SearchBar';
import EmailFilter from '@/components/EmailFilter';
import EmailPagination from '@/components/EmailPagination';
import { useEmailManagement } from '@/hooks/useEmailManagement';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

const Index = () => {
  const {
    activeFolder,
    selectedEmail,
    searchQuery,
    setSearchQuery,
    isComposerOpen,
    setIsComposerOpen,
    replyToEmail,
    currentPage,
    filterOptions,
    setFilterOptions,
    currentEmails,
    totalPages,
    folderCounts,
    filteredEmails,
    handleSelectEmail,
    handleCompose,
    handleReply,
    handlePageChange,
    handleFolderChange,
  } = useEmailManagement();

  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        <div className="flex items-center space-x-2">
          {/* Filter Dropdown */}
          <EmailFilter 
            filterOptions={filterOptions}
            onFilterChange={setFilterOptions}
          />
          
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main content area - now on the left */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-auto flex flex-col">
            {filteredEmails.length === 0 && searchQuery ? (
              <div className="flex flex-col items-center justify-center h-64 p-8 text-center">
                <p className="text-muted-foreground">
                  No emails found matching "{searchQuery}"
                </p>
              </div>
            ) : (
              <>
                <EmailList
                  emails={currentEmails}
                  activeFolder={activeFolder}
                  onSelectEmail={handleSelectEmail}
                  selectedEmailId={selectedEmail?.id || null}
                />
                
                <EmailPagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onPageChange={handlePageChange} 
                />
              </>
            )}
          </div>
        </div>

        {/* Sidebar - now on the right, conditionally shown based on mobile state */}
        {(isMobile ? isSidebarOpen : true) && (
          <Sidebar
            activeFolder={activeFolder}
            onFolderChange={handleFolderChange}
            onCompose={handleCompose}
            folderCounts={folderCounts}
          />
        )}
      </div>

      {/* Email view dialog */}
      <Dialog open={!!selectedEmail} onOpenChange={(open) => !open && handleSelectEmail(null)}>
        <DialogContent className="max-w-3xl w-full p-0 h-[80vh] max-h-[80vh] overflow-hidden">
          {selectedEmail && (
            <>
              <DialogTitle className="sr-only">Email View</DialogTitle>
              <EmailView
                email={selectedEmail}
                onBack={() => handleSelectEmail(null)}
                onReply={handleReply}
              />
            </>
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
