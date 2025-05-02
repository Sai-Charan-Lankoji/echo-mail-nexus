
import React, { useState, useEffect } from 'react';
import { X, Paperclip, Send, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Email } from '@/data/emails';
import { useToast } from '@/hooks/use-toast';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { gmailService } from '@/services/gmail.service';
import { Spinner } from '@/components/ui/spinner';

interface ComposerProps {
  isOpen: boolean;
  onClose: () => void;
  replyToEmail?: Email | null;
}

const Composer: React.FC<ComposerProps> = ({ isOpen, onClose, replyToEmail }) => {
  const { toast } = useToast();
  const [to, setTo] = useState(replyToEmail ? replyToEmail.from.email : '');
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [cc, setCc] = useState('');
  const [bcc, setBcc] = useState('');
  const [subject, setSubject] = useState(replyToEmail ? `Re: ${replyToEmail.subject}` : '');
  const [body, setBody] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    if (replyToEmail) {
      setBody(`<br/><br/><div style="border-left: 2px solid #ccc; padding-left: 10px; color: #666;">
        <p><strong>From:</strong> ${replyToEmail.from.name}</p>
        <p><strong>Date:</strong> ${new Date(replyToEmail.timestamp).toLocaleString()}</p>
        <p><strong>Subject:</strong> ${replyToEmail.subject}</p>
        <br/>
        ${replyToEmail.body}
      </div>`);
    }
  }, [replyToEmail]);

  if (!isOpen) return null;

  const modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
  };
  
  const formats = [
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
    'color', 'background',
    'align'
  ];

  const handleSend = async () => {
    if (!to) {
      toast({
        title: "Missing recipient",
        description: "Please specify at least one recipient",
        variant: "destructive",
      });
      return;
    }

    if (!subject) {
      toast({
        title: "Missing subject",
        description: "Are you sure you want to send without a subject?",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSending(true);
      
      const emailData = {
        to,
        subject,
        body,
        cc: cc || undefined,
        bcc: bcc || undefined,
      };

      await gmailService.sendEmail(emailData);
      
      toast({
        title: "Email sent",
        description: "Your email has been sent successfully",
      });
      
      onClose();
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Failed to send email",
        description: "There was an error sending your email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      setIsSending(true);
      
      const emailData = {
        to,
        subject,
        body,
        cc: cc || undefined,
        bcc: bcc || undefined,
      };

      await gmailService.createDraft(emailData);
      
      toast({
        title: "Draft saved",
        description: "Your draft has been saved",
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Failed to save draft",
        description: "There was an error saving your draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border rounded-lg shadow-lg w-full max-w-2xl flex flex-col max-h-[80vh]">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h2 className="font-medium">{replyToEmail ? 'Reply' : 'New Message'}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4 flex-1 overflow-auto">
          <div className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center">
                <label htmlFor="to" className="text-sm font-medium w-16">
                  To:
                </label>
                <Input
                  id="to"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  placeholder="email@example.com"
                  className="flex-1"
                />
                {(!showCc || !showBcc) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2"
                    onClick={() => {
                      if (!showCc) setShowCc(true);
                      else if (!showBcc) setShowBcc(true);
                    }}
                  >
                    {!showCc ? 'Cc' : 'Bcc'}
                  </Button>
                )}
              </div>
            </div>
            
            {showCc && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center">
                  <label htmlFor="cc" className="text-sm font-medium w-16">
                    Cc:
                  </label>
                  <Input
                    id="cc"
                    value={cc}
                    onChange={(e) => setCc(e.target.value)}
                    placeholder="cc@example.com"
                    className="flex-1"
                  />
                </div>
              </div>
            )}
            
            {showBcc && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center">
                  <label htmlFor="bcc" className="text-sm font-medium w-16">
                    Bcc:
                  </label>
                  <Input
                    id="bcc"
                    value={bcc}
                    onChange={(e) => setBcc(e.target.value)}
                    placeholder="bcc@example.com"
                    className="flex-1"
                  />
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center">
                <label htmlFor="subject" className="text-sm font-medium w-16">
                  Subject:
                </label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Subject"
                  className="flex-1"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5 min-h-[300px]">
              <div className="flex-grow">
                <ReactQuill 
                  theme="snow"
                  value={body}
                  onChange={setBody}
                  modules={modules}
                  formats={formats}
                  placeholder="Write your message here..."
                  className="h-[250px] mb-12"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-4 border-t flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Paperclip className="h-3.5 w-3.5 mr-1" />
              Attach
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSaveDraft}
              disabled={isSending}
            >
              {isSending ? <Spinner className="h-3.5 w-3.5 mr-1" /> : null}
              Save Draft
            </Button>
          </div>
          
          <Button 
            onClick={handleSend} 
            className="bg-primary hover:bg-primary/90"
            disabled={isSending}
          >
            {isSending ? <Spinner className="h-4 w-4 mr-1" /> : <Send className="h-4 w-4 mr-1" />}
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Composer;
