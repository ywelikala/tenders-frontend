import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import { useTenderStats } from '../hooks/useTenders';

interface SearchFiltersProps {
  onSearch?: (searchTerm: string, category?: string) => void;
  initialSearchTerm?: string;
  initialCategory?: string;
}

const SearchFilters = ({ 
  onSearch, 
  initialSearchTerm = '', 
  initialCategory = '' 
}: SearchFiltersProps) => {
  const { data: stats, isLoading: statsLoading } = useTenderStats();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const handleSearch = () => {
    if (onSearch) {
      const categoryToSend = selectedCategory === 'all' ? undefined : selectedCategory;
      onSearch(searchTerm, categoryToSend);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  return (
    <div className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">
            {statsLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                LOADING TENDERS...
              </span>
            ) : (
              `PUBLISHED TENDERS: ${stats?.totalTenders || 0}`
            )}
          </h2>
        </div>
        
        <div className="flex gap-2 max-w-4xl mx-auto">
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-48 bg-white text-foreground">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="construction">Construction</SelectItem>
              <SelectItem value="it">Computer & IT</SelectItem>
              <SelectItem value="registration">Registration of Suppliers</SelectItem>
              <SelectItem value="upkeep">Upkeep/Repair</SelectItem>
              <SelectItem value="consultancy">Consultancy Services</SelectItem>
              <SelectItem value="supply">Supply</SelectItem>
              <SelectItem value="services">Services</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder="Search tender title or description..."
            className="flex-1 bg-white text-foreground"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          
          <Button 
            size="lg" 
            className="px-8 bg-white text-tender-blue hover:bg-gray-50 border-2 border-white font-semibold transition-colors"
            onClick={handleSearch}
          >
            <Search className="mr-2 h-4 w-4" />
            SEARCH
          </Button>
        </div>
        
        <div className="text-right mt-4">
          <Button variant="link" className="text-muted-foreground text-sm">
            ADVANCE SEARCH ▼
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;