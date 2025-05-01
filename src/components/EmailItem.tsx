
import React from 'react';
import { cn } from '@/lib/utils';
import { Email } from '../data/emails';
import { format, isToday, isYesterday } from 'date-fns';

interface EmailItemProps {
  email: Email;
  onClick: () => void;
  isSelected: boolean;
}

const EmailItem: React.FC<EmailItemProps> = ({ email, onClick, isSelected }) => {
  const date = new Date(email.timestamp);
  
  const formattedDate = (() => {
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  })();

  const previewText = email.body
    .replace(/<[^>]*>/g, ' ')  // Remove HTML tags
    .replace(/\s+/g, ' ')      // Replace multiple spaces with a single space
    .trim()
    .slice(0, 80) + (email.body.length > 80 ? '...' : '');

  return (
    <div 
      className={cn(
        "px-4 py-3 cursor-pointer email-item",
        isSelected ? "bg-muted/80" : "",
        email.read ? "email-read" : "email-unread"
      )}
      onClick={onClick}
    >
      <div className="flex justify-between items-baseline mb-1">
        <div className="font-medium truncate pr-2">
          {email.from.name === 'Me' ? email.to.name : email.from.name}
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {formattedDate}
        </div>
      </div>
      
      <div className="text-sm truncate mb-1">{email.subject}</div>
      
      <div className="text-xs text-muted-foreground truncate">
        {previewText}
      </div>
      
      {email.attachments && email.attachments.length > 0 && (
        <div className="flex items-center mt-1">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-3 w-3 text-muted-foreground mr-1" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          <span className="text-xs text-muted-foreground">
            {email.attachments.length} attachment{email.attachments.length > 1 ? 's' : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default EmailItem;
