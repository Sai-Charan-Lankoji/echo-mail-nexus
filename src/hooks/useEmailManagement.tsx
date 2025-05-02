
import { useState, useEffect, useCallback } from 'react';
import { Email, Folder } from '@/data/emails';
import { gmailService, EmailMessage, Label } from '@/services/gmail.service';
import { gmailToEchomail, folderToLabel } from '@/utils/emailAdapter';
import { useToast } from '@/hooks/use-toast';

export interface FilterOptions {
  unreadOnly: boolean;
  hasAttachments: boolean;
  sortBy: 'newest' | 'oldest';
}

export const useEmailManagement = (initialFolder: Folder = 'inbox') => {
  const { toast } = useToast();
  const [activeFolder, setActiveFolder] = useState<Folder>(initialFolder);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [replyToEmail, setReplyToEmail] = useState<Email | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [emailsPerPage] = useState(10);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    unreadOnly: false,
    hasAttachments: false,
    sortBy: 'newest',
  });
  
  // Email data states
  const [emails, setEmails] = useState<Email[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [labels, setLabels] = useState<Label[]>([]);
  const [folderCounts, setFolderCounts] = useState<Record<string, number>>({
    inbox: 0,
    sent: 0,
    drafts: 0,
    trash: 0,
  });

  // Check Gmail access on mount
  useEffect(() => {
    const checkGmailAccess = async () => {
      try {
        const accessResponse = await gmailService.checkAccess();
        setHasAccess(accessResponse.hasAccess);
        
        if (accessResponse.hasAccess) {
          // If we have access, load initial data
          await fetchLabels();
          await fetchEmails();
          await fetchFolderCounts();
        }
      } catch (error) {
        console.error("Error checking Gmail access:", error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to Gmail. Please try again.",
          variant: "destructive",
        });
      }
    };
    
    checkGmailAccess();
  }, []);

  // Reset selected email and page when folder changes
  useEffect(() => {
    setSelectedEmail(null);
    setCurrentPage(1);
    fetchEmails();
  }, [activeFolder]);

  // Fetch emails for the current folder with search and filters
  const fetchEmails = useCallback(async () => {
    if (!hasAccess) return;
    
    setIsLoading(true);
    try {
      // Convert folder to label and prepare query
      const labelId = folderToLabel(activeFolder);
      const query: any = {
        maxResults: emailsPerPage,
        pageToken: (currentPage > 1) ? `page${currentPage}` : undefined, // You'll need to implement actual pagination with your API
      };
      
      // Add label query if not searching
      if (!searchQuery) {
        if (labelId.startsWith('label:')) {
          query.labelIds = labelId.replace('label:', '');
        } else {
          query.labelIds = labelId;
        }
      }
      
      // Add search query if present
      if (searchQuery) {
        query.q = searchQuery;
      }
      
      // Add filter options
      if (filterOptions.unreadOnly) {
        query.q = (query.q ? query.q + ' ' : '') + 'is:unread';
      }
      
      if (filterOptions.hasAttachments) {
        query.q = (query.q ? query.q + ' ' : '') + 'has:attachment';
      }
      
      // Get emails from Gmail API
      const response = await gmailService.getEmails(query);
      
      // Convert Gmail emails to EchoMail format
      const convertedEmails = response.messages.map(gmailToEchomail);
      
      // Sort emails
      if (filterOptions.sortBy === 'newest') {
        convertedEmails.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } else {
        convertedEmails.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      }
      
      setEmails(convertedEmails);
    } catch (error) {
      console.error("Error fetching emails:", error);
      toast({
        title: "Failed to Load Emails",
        description: "Could not retrieve your emails. Please try again.",
        variant: "destructive",
      });
      setEmails([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeFolder, currentPage, searchQuery, filterOptions, hasAccess, emailsPerPage]);

  // Fetch folder counts (unread counts)
  const fetchFolderCounts = useCallback(async () => {
    if (!hasAccess) return;
    
    try {
      // Get counts for main folders
      const inboxCount = await gmailService.getEmailCount({ labelIds: 'INBOX', q: 'is:unread' });
      const draftsCount = await gmailService.getEmailCount({ labelIds: 'DRAFT' });
      const sentCount = await gmailService.getEmailCount({ labelIds: 'SENT' });
      const trashCount = await gmailService.getEmailCount({ labelIds: 'TRASH' });
      
      setFolderCounts({
        inbox: inboxCount.count,
        drafts: draftsCount.count,
        sent: sentCount.count,
        trash: trashCount.count
      });
    } catch (error) {
      console.error("Error fetching folder counts:", error);
    }
  }, [hasAccess]);

  // Fetch available labels
  const fetchLabels = useCallback(async () => {
    if (!hasAccess) return;
    
    try {
      const labelList = await gmailService.getLabels();
      setLabels(labelList);
    } catch (error) {
      console.error("Error fetching labels:", error);
    }
  }, [hasAccess]);

  // Request Gmail access if not already granted
  const handleRequestAccess = async () => {
    try {
      await gmailService.requestAccess();
    } catch (error) {
      console.error("Error requesting Gmail access:", error);
      toast({
        title: "Authentication Failed",
        description: "Could not authenticate with Gmail. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Filtered emails based on all criteria
  const filteredEmails = emails;
  
  // Calculate pagination
  const indexOfLastEmail = currentPage * emailsPerPage;
  const indexOfFirstEmail = indexOfLastEmail - emailsPerPage;
  const currentEmails = filteredEmails.slice(0, emailsPerPage); // Already paginated from API
  const totalPages = Math.ceil(filteredEmails.length / emailsPerPage);

  // Email actions
  const handleSelectEmail = async (email: Email | null) => {
    setSelectedEmail(email);
    
    // Mark as read when selected (if it's not already read)
    if (email && !email.read) {
      try {
        await gmailService.markAsRead(email.id);
        // Update email in state to mark it as read
        setEmails(prev => 
          prev.map(e => e.id === email.id ? { ...e, read: true } : e)
        );
        // Refresh folder counts
        await fetchFolderCounts();
      } catch (error) {
        console.error("Error marking email as read:", error);
      }
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
    }
  };

  const handleFolderChange = (folder: string) => {
    const newFolder = folder as Folder;
    setActiveFolder(newFolder);
  };

  return {
    activeFolder,
    selectedEmail,
    searchQuery,
    setSearchQuery,
    isComposerOpen,
    setIsComposerOpen,
    replyToEmail,
    currentPage,
    emailsPerPage,
    filterOptions,
    setFilterOptions,
    filteredEmails,
    currentEmails,
    totalPages,
    folderCounts,
    handleSelectEmail,
    handleCompose,
    handleReply,
    handlePageChange,
    handleFolderChange,
    isLoading,
    hasAccess,
    handleRequestAccess,
    labels,
  };
};
