"use client";
import React from 'react';
import { useMockup } from '../context/MockupContext';
import MockupAdmin from './MockupAdmin';
import MockupUser from './MockupUser';
import { Button } from '../../components/ui/button';

const MockupApp = () => {
  const { isAdmin, toggleAdminMode } = useMockup();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Mockup Generator</h1>
          <Button onClick={toggleAdminMode}>
            Switch to {isAdmin ? 'User' : 'Admin'} Mode
          </Button>
        </div>
      </header>

      <main>
        {isAdmin ? <MockupAdmin /> : <MockupUser />}
      </main>

      <footer className="mt-12 border-t">
        <div className="container mx-auto py-4 text-center text-muted-foreground">
          &copy; {new Date().getFullYear()} Mockup Generator App
        </div>
      </footer>
    </div>
  );
};

export default MockupApp;
