
import { EmailMessage, Label } from '@/services/gmail.service';
import { Email, Folder } from '@/data/emails';

export const gmailToEchomail = (gmailEmail: EmailMessage): Email => {
  // Extract name and email from the from field (which might be in format "Name <email@example.com>")
  const fromMatch = gmailEmail.from.match(/^(.*?)\s*<(.*)>$/) || [];
  const fromName = fromMatch[1] || gmailEmail.from.split('@')[0];
  const fromEmail = fromMatch[2] || gmailEmail.from;
  
  // Extract name and email from the to field
  const toMatch = gmailEmail.to.match(/^(.*?)\s*<(.*)>$/) || [];
  const toName = toMatch[1] || gmailEmail.to.split('@')[0];
  const toEmail = toMatch[2] || gmailEmail.to;

  const isUnread = gmailEmail.labelIds?.includes('UNREAD');

  // Create attachments array if they exist
  const attachments = gmailEmail.attachments?.map(attachment => {
    // Determine attachment type based on MIME type or file extension
    let type = 'file';
    if (attachment.mimeType) {
      if (attachment.mimeType.includes('image')) type = 'image';
      else if (attachment.mimeType.includes('pdf')) type = 'pdf';
      else if (attachment.mimeType.includes('document') || 
               attachment.mimeType.includes('word') ||
               attachment.mimeType.includes('text')) type = 'document';
    }
    
    return {
      name: attachment.filename || 'attachment',
      type,
      size: attachment.size ? `${Math.round(attachment.size / 1024)}KB` : 'Unknown'
    };
  }) || [];

  return {
    id: gmailEmail.id,
    subject: gmailEmail.subject || '(no subject)',
    from: {
      name: fromName,
      email: fromEmail
    },
    to: {
      name: toName,
      email: toEmail
    },
    body: gmailEmail.body || '',
    timestamp: gmailEmail.date || gmailEmail.internalDate || new Date().toISOString(),
    read: !isUnread,
    starred: gmailEmail.labelIds?.includes('STARRED') || false,
    attachments: attachments.length > 0 ? attachments : undefined,
    labels: gmailEmail.labelIds || []
  };
};

export const labelToFolder = (label: Label): Folder => {
  // Map Gmail system labels to EchoMail folders
  switch (label.id) {
    case 'INBOX':
      return 'inbox';
    case 'SENT':
      return 'sent';
    case 'DRAFT':
      return 'drafts';
    case 'TRASH':
      return 'trash';
    default:
      // For custom labels, return the label ID
      return label.id.toLowerCase() as Folder;
  }
};

export const folderToLabel = (folder: Folder): string => {
  // Map EchoMail folders to Gmail system labels
  switch (folder) {
    case 'inbox':
      return 'INBOX';
    case 'sent':
      return 'SENT';
    case 'drafts':
      return 'DRAFT';
    case 'trash':
      return 'TRASH';
    default:
      // For custom labels, return the folder name in uppercase
      return folder.toUpperCase();
  }
};
