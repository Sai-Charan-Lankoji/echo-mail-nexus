
import React from 'react';
import { Email } from '../data/emails';
import EmailItem from './EmailItem';
import { Folder } from '@/data/emails';

interface EmailListProps {
  emails: Email[];
  activeFolder: Folder;
  onSelectEmail: (email: Email) => void;
  selectedEmailId: string | null;
}

const EmailList: React.FC<EmailListProps> = ({ 
  emails, 
  activeFolder,
  onSelectEmail, 
  selectedEmailId 
}) => {
  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="mb-4 p-4 rounded-full bg-muted">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-8 w-8 text-muted-foreground" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect width="18" height="14" x="3" y="5" rx="2" />
            <polyline points="3 7 12 13 21 7" />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-1">No emails in {activeFolder}</h3>
        <p className="text-sm text-muted-foreground">
          {activeFolder === 'inbox' ? 'Your inbox is empty' : 
           activeFolder === 'drafts' ? 'You have no saved drafts' :
           activeFolder === 'sent' ? 'You haven\'t sent any emails yet' :
           'Your trash is empty'}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {emails.map(email => (
        <EmailItem 
          key={email.id} 
          email={email} 
          onClick={() => onSelectEmail(email)}
          isSelected={selectedEmailId === email.id}
        />
      ))}
    </div>
  );
};

export default EmailList;
