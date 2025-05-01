
export interface Email {
  id: string;
  from: {
    name: string;
    email: string;
  };
  to: {
    name: string;
    email: string;
  };
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
  starred: boolean;
  labels?: string[];
  attachments?: {
    name: string;
    size: string;
    type: string;
  }[];
}

export type Folder = 'inbox' | 'sent' | 'drafts' | 'trash';

export const sampleEmails: Record<Folder, Email[]> = {
  inbox: [
    {
      id: '1',
      from: { name: 'John Smith', email: 'john.smith@example.com' },
      to: { name: 'Me', email: 'me@example.com' },
      subject: 'Project Update - Q2 Goals',
      body: `
        <p>Hi there,</p>
        <p>I wanted to share an update on our Q2 goals and progress. We're making good headway on the primary objectives, but there are a few areas we need to focus on:</p>
        <ul>
          <li>Customer acquisition targets are currently at 80% of forecast</li>
          <li>Product development is on schedule for the July release</li>
          <li>Team expansion interviews are progressing well</li>
        </ul>
        <p>Can we schedule a meeting this week to discuss strategies for improving our customer acquisition numbers?</p>
        <p>Best regards,<br>John</p>
      `,
      timestamp: '2025-04-30T09:30:00Z',
      read: false,
      starred: true,
    },
    {
      id: '2',
      from: { name: 'Marketing Team', email: 'marketing@company.com' },
      to: { name: 'Me', email: 'me@example.com' },
      subject: 'New Campaign Materials Ready for Review',
      body: `
        <p>Hello,</p>
        <p>The new marketing campaign materials are ready for your review. Please check the attached files and let us know if you have any feedback or changes before we proceed with the launch next week.</p>
        <p>Thanks!<br>Marketing Team</p>
      `,
      timestamp: '2025-04-29T16:45:00Z',
      read: true,
      starred: false,
      attachments: [
        { name: 'Campaign_Brief.pdf', size: '2.3 MB', type: 'pdf' },
        { name: 'Assets_Preview.jpg', size: '1.7 MB', type: 'image' }
      ]
    },
    {
      id: '3',
      from: { name: 'Sarah Johnson', email: 'sarah.j@partner.org' },
      to: { name: 'Me', email: 'me@example.com' },
      subject: 'Partnership Opportunity',
      body: `
        <p>Dear Team,</p>
        <p>I'm reaching out from Partner Organization to explore potential collaboration opportunities between our companies. We believe there's significant synergy in our approaches to market challenges.</p>
        <p>Would you be available for an introductory call next week to discuss this further?</p>
        <p>Looking forward to your response.</p>
        <p>Best regards,<br>Sarah Johnson<br>Business Development, Partner Org</p>
      `,
      timestamp: '2025-04-28T11:20:00Z',
      read: false,
      starred: false,
    },
    {
      id: '4',
      from: { name: 'Tech Support', email: 'support@workspace.com' },
      to: { name: 'Me', email: 'me@example.com' },
      subject: 'Your Support Ticket #45678 Has Been Resolved',
      body: `
        <p>Hello,</p>
        <p>We're pleased to inform you that your recent support ticket regarding workspace access issues has been resolved. The problem was related to a temporary authentication service disruption, which has now been fixed.</p>
        <p>If you experience any further issues, please don't hesitate to contact us.</p>
        <p>Thank you for your patience.</p>
        <p>Regards,<br>Tech Support Team</p>
      `,
      timestamp: '2025-04-27T14:15:00Z',
      read: true,
      starred: false,
    },
    {
      id: '5',
      from: { name: 'Team Collaboration', email: 'noreply@teamcollab.com' },
      to: { name: 'Me', email: 'me@example.com' },
      subject: 'New Comment on Your Document',
      body: `
        <p>A team member has added a comment to your document "Strategic Plan 2025".</p>
        <p><strong>Michael wrote:</strong> "I think we should expand section 3.2 to include more details about our international expansion plans. Happy to discuss this more in our next meeting."</p>
        <p><a href="#">View Comment</a></p>
      `,
      timestamp: '2025-04-26T17:30:00Z',
      read: true,
      starred: true,
    },
  ],
  sent: [
    {
      id: '101',
      from: { name: 'Me', email: 'me@example.com' },
      to: { name: 'Development Team', email: 'dev@company.com' },
      subject: 'Requirements for New Feature',
      body: `
        <p>Hi Dev Team,</p>
        <p>I've attached the requirements document for the new feature we discussed in yesterday's meeting. Please review and let me know if you have any questions or need clarification.</p>
        <p>I'd like to start implementation by next Monday, so it would be great to get your feedback by Thursday.</p>
        <p>Thanks!<br>Me</p>
      `,
      timestamp: '2025-04-30T10:15:00Z',
      read: true,
      starred: false,
      attachments: [
        { name: 'Feature_Requirements.docx', size: '1.2 MB', type: 'document' }
      ]
    },
    {
      id: '102',
      from: { name: 'Me', email: 'me@example.com' },
      to: { name: 'Client X', email: 'contact@clientx.com' },
      subject: 'Proposal for Project Implementation',
      body: `
        <p>Dear Client X,</p>
        <p>Thank you for our productive meeting last week. As discussed, I've prepared a comprehensive proposal for the implementation of your project.</p>
        <p>The proposal includes timeline estimates, resource allocation, and budget considerations. I believe this approach will effectively address your requirements while staying within the specified constraints.</p>
        <p>Please review the attached document and let me know if you'd like to schedule a follow-up discussion.</p>
        <p>Best regards,<br>Me</p>
      `,
      timestamp: '2025-04-29T14:20:00Z',
      read: true,
      starred: false,
      attachments: [
        { name: 'Project_Proposal.pdf', size: '3.4 MB', type: 'pdf' }
      ]
    },
  ],
  drafts: [
    {
      id: '201',
      from: { name: 'Me', email: 'me@example.com' },
      to: { name: 'Human Resources', email: 'hr@company.com' },
      subject: 'Request for Additional Team Resources',
      body: `
        <p>Hi HR Team,</p>
        <p>I'd like to discuss the possibility of adding additional resources to our team for the upcoming project phase. Based on our current projections, we will need:</p>
        <p>[DRAFT - Need to add specific details about required roles and justification]</p>
        <p>Thanks,<br>Me</p>
      `,
      timestamp: '2025-04-30T11:45:00Z',
      read: true,
      starred: false,
    },
  ],
  trash: [
    {
      id: '301',
      from: { name: 'Newsletter', email: 'newsletter@industry.com' },
      to: { name: 'Me', email: 'me@example.com' },
      subject: 'Industry Updates - April Edition',
      body: `
        <p>Your monthly roundup of industry news and updates.</p>
        <p>Featured articles include:</p>
        <ul>
          <li>10 Trends Shaping Our Industry in 2025</li>
          <li>Interview with Innovation Leader Jane Smith</li>
          <li>Regulatory Changes on the Horizon</li>
        </ul>
        <p>Click here to read more.</p>
      `,
      timestamp: '2025-04-25T08:00:00Z',
      read: true,
      starred: false,
    },
  ],
};
