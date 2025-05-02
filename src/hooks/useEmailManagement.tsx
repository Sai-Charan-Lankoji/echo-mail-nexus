
import { useState, useEffect } from 'react';
import { Email, Folder, sampleEmails } from '@/data/emails';

export interface FilterOptions {
  unreadOnly: boolean;
  hasAttachments: boolean;
  sortBy: 'newest' | 'oldest';
}

export const useEmailManagement = (initialFolder: Folder = 'inbox') => {
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

  // Reset selected email and page when folder changes
  useEffect(() => {
    setSelectedEmail(null);
    setCurrentPage(1);
  }, [activeFolder]);

  // Filter emails based on search query and filter options
  const getFilteredEmails = () => {
    // Check if activeFolder exists in sampleEmails before proceeding
    if (!sampleEmails[activeFolder]) {
      // If the folder doesn't exist, return an empty array
      console.error(`Folder "${activeFolder}" not found in sampleEmails`);
      return [];
    }
    
    let emails = [...sampleEmails[activeFolder]];
    
    // Apply filters
    if (filterOptions.unreadOnly) {
      emails = emails.filter(email => !email.read);
    }
    
    if (filterOptions.hasAttachments) {
      // Check if email.attachments exists and has length > 0
      emails = emails.filter(email => email.attachments && email.attachments.length > 0);
    }
    
    // Apply sorting - Convert timestamp strings to Date objects for comparison
    if (filterOptions.sortBy === 'newest') {
      emails = emails.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateB - dateA;
      });
    } else {
      emails = emails.sort((a, b) => {
        const dateA = new Date(a.timestamp).getTime();
        const dateB = new Date(b.timestamp).getTime();
        return dateA - dateB;
      });
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
    }
  };

  const handleFolderChange = (folder: string) => {
    // Check if the folder starts with "label:" to handle label filtering
    if (folder.startsWith('label:')) {
      // Handle label-based filtering here if needed
      // For now, we'll just use inbox as a fallback
      setActiveFolder('inbox');
    } else if (sampleEmails[folder as Folder]) {
      // Only set the active folder if it exists in sampleEmails
      setActiveFolder(folder as Folder);
    } else {
      // Default to inbox if the folder doesn't exist
      console.warn(`Folder "${folder}" not found, defaulting to inbox`);
      setActiveFolder('inbox');
    }
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
  };
};
