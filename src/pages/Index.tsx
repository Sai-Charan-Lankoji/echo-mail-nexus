
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import EmailList from '@/components/EmailList';
import EmailView from '@/components/EmailView';
import Composer from '@/components/Composer';
import SearchBar from '@/components/SearchBar';
import { sampleEmails, Email, Folder } from '@/data/emails';
import { Menu, ChevronLeft, ChevronRight, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Index = () => {
  const [activeFolder, setActiveFolder] = useState<Folder>('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<Email | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [emailsPerPage] = useState(10);
  const [filterOptions, setFilterOptions] = useState({
    unreadOnly: false,
    hasAttachments: false,
    sortBy: 'newest' as 'newest' | 'oldest',
  });

  const isMobile = useIsMobile();

  // Reset selected email and page when folder changes
  useEffect(() => {
    setSelectedEmail(null);
    setCurrentPage(1);
  }, [activeFolder]);

  // Filter emails based on search query and filter options
  const getFilteredEmails = () => {
    let emails = [...sampleEmails[activeFolder]];
    
    // Apply filters
    if (filterOptions.unreadOnly) {
      emails = emails.filter(email => !email.read);
    }
    
    if (filterOptions.hasAttachments) {
      emails = emails.filter(email => email.hasAttachments);
    }
    
    // Apply sorting
    if (filterOptions.sortBy === 'newest') {
      emails = emails.sort((a, b) => b.timestamp - a.timestamp);
    } else {
      emails = emails.sort((a, b) => a.timestamp - b.timestamp);
    }
    
    // Apply search
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      emails = emails.filter(email => (
        email.subject.toLowerCase().includes(lowerCaseQuery) ||
        email.from.name.toLowerCase().includes(lowerCaseQuery) ||
        email.body.toLowerCase().includes(lowerCaseQuery)
      ));
    }
    
    return emails;
  };

  const filteredEmails = getFilteredEmails();
  
  // Calculate pagination
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = filteredEmails.slice(indexOfFirstEmail, indexOfLastEmail);
  const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);

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

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="my-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(currentPage - 1)} 
              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNumber = i + 1;
            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink 
                  onClick={() => handlePageChange(pageNumber)}
                  isActive={currentPage === pageNumber}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          
          {totalPages > 5 && (
            <>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink 
                  onClick={() => handlePageChange(totalPages)}
                  isActive={currentPage === totalPages}
                >
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            </>
          )}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(currentPage + 1)} 
              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
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
        <div className="flex items-center space-x-2">
          {/* Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="mr-2">
                <ListFilter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter Emails</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filterOptions.unreadOnly}
                onCheckedChange={(checked) => 
                  setFilterOptions(prev => ({ ...prev, unreadOnly: checked as boolean }))}
              >
                Unread only
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterOptions.hasAttachments}
                onCheckedChange={(checked) => 
                  setFilterOptions(prev => ({ ...prev, hasAttachments: checked as boolean }))}
              >
                Has attachments
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={filterOptions.sortBy === 'newest'}
                onCheckedChange={() => 
                  setFilterOptions(prev => ({ ...prev, sortBy: 'newest' }))}
              >
                Newest first
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filterOptions.sortBy === 'oldest'}
                onCheckedChange={() => 
                  setFilterOptions(prev => ({ ...prev, sortBy: 'oldest' }))}
              >
                Oldest first
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
                
                {renderPagination()}
              </>
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
