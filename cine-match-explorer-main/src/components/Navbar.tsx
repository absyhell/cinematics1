
import React from 'react';
import { Film, Search, User, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Navbar = () => {
  const location = useLocation();
  
  return (
    <header className="border-b border-cinema-light sticky top-0 z-50 bg-cinema/90 backdrop-blur-sm">
      <div className="container mx-auto px-4 flex items-center justify-between h-16">
        <Link to="/" className="flex items-center space-x-2">
          <Film className="w-6 h-6 text-cinema-accent" />
          <span className="font-heading text-xl font-bold">CineMatch</span>
        </Link>
        
        <div className="hidden md:flex items-center bg-cinema-light rounded-full px-3 py-1 flex-1 max-w-md mx-4">
          <Search className="w-4 h-4 text-muted-foreground mr-2" />
          <Input 
            type="search" 
            placeholder="Search movies..." 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        <nav className="flex items-center space-x-4">
          <Link 
            to="/discover" 
            className={`text-sm font-medium hover:text-cinema-accent transition-colors hidden md:block ${
              location.pathname === '/discover' ? 'text-cinema-accent' : ''
            }`}
          >
            Discover
          </Link>
          <Link 
            to="/favorites" 
            className={`text-sm font-medium hover:text-cinema-accent transition-colors hidden md:block ${
              location.pathname === '/favorites' ? 'text-cinema-accent' : ''
            }`}
          >
            <Heart className="w-4 h-4 inline mr-1" />
            Favorites
          </Link>
          <Button variant="outline" size="sm" className="hidden md:flex border-cinema-accent text-cinema-accent hover:bg-cinema-accent hover:text-cinema">
            Log in
          </Button>
          <Button size="sm" className="bg-cinema-accent text-cinema hover:bg-cinema-accent-hover">
            <User className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Sign up</span>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
