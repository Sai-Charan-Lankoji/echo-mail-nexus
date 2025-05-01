
import React from 'react';
import { ArrowLeft, Star, Trash2, Reply, Forward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Email } from '../data/emails';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

interface EmailViewProps {
  email: Email | null;
  onBack: () => void;
  onReply: (email: Email) => void;
}

const EmailView: React.FC<EmailViewProps> = ({ email, onBack, onReply }) => {
  if (!email) return null;

  const formattedDate = format(new Date(email.timestamp), 'MMM d, yyyy h:mm a');

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="ml-2 flex-1">
          <h2 className="text-lg font-medium">{email.subject}</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Star className="h-4 w-4" fill={email.starred ? "currentColor" : "none"} />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-auto">
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
              {email.from.name.charAt(0)}
            </div>
            <div>
              <div className="font-medium">
                {email.from.name} <span className="text-muted-foreground font-normal">&lt;{email.from.email}&gt;</span>
              </div>
              <div className="text-sm text-muted-foreground">To: {email.to.name} &lt;{email.to.email}&gt;</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">{formattedDate}</div>
        </div>

        <div 
          className="prose prose-sm max-w-none mt-6"
          dangerouslySetInnerHTML={{ __html: email.body }} 
        />

        {email.attachments && email.attachments.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">Attachments ({email.attachments.length})</h3>
              <div className="flex flex-wrap gap-2">
                {email.attachments.map((attachment, index) => (
                  <div key={index} className="border rounded p-3 flex items-center gap-2 bg-muted/30">
                    <div className="w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center text-xs">
                      {attachment.type === 'pdf' ? 'PDF' : 
                       attachment.type === 'image' ? 'IMG' :
                       attachment.type === 'document' ? 'DOC' : 'FILE'}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{attachment.name}</div>
                      <div className="text-xs text-muted-foreground">{attachment.size}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onReply(email)}>
            <Reply className="h-3.5 w-3.5 mr-1" />
            Reply
          </Button>
          <Button variant="outline" size="sm">
            <Forward className="h-3.5 w-3.5 mr-1" />
            Forward
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailView;
