
import React from 'react';
import { ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterOptions {
  unreadOnly: boolean;
  hasAttachments: boolean;
  sortBy: 'newest' | 'oldest';
}

interface EmailFilterProps {
  filterOptions: FilterOptions;
  onFilterChange: (options: FilterOptions) => void;
}

const EmailFilter: React.FC<EmailFilterProps> = ({
  filterOptions,
  onFilterChange
}) => {
  return (
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
            onFilterChange({ ...filterOptions, unreadOnly: checked as boolean })}
        >
          Unread only
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filterOptions.hasAttachments}
          onCheckedChange={(checked) => 
            onFilterChange({ ...filterOptions, hasAttachments: checked as boolean })}
        >
          Has attachments
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
        <DropdownMenuCheckboxItem
          checked={filterOptions.sortBy === 'newest'}
          onCheckedChange={() => 
            onFilterChange({ ...filterOptions, sortBy: 'newest' })}
        >
          Newest first
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={filterOptions.sortBy === 'oldest'}
          onCheckedChange={() => 
            onFilterChange({ ...filterOptions, sortBy: 'oldest' })}
        >
          Oldest first
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EmailFilter;
