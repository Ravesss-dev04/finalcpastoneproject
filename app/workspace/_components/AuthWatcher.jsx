// UPDATED AuthWatcher.jsx - WITH ROLE DETECTION
'use client';

import { useUser } from '@clerk/nextjs';
import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

export default function AuthWatcher() {
  const { user, isLoaded } = useUser();
  const hasShownToast = useRef(false);

  useEffect(() => {
    if (isLoaded && user && !hasShownToast.current) {
      // Get user role from localStorage or user metadata
      let userRole = 'Student'; // Default
      try {
        const storedRole = localStorage.getItem('pendingRole');
        if (storedRole === 'teacher') {
          userRole = 'Teacher';
        }
      } catch (e) {
        // If no role in localStorage, check user metadata or use default
        userRole = 'Student';
      }

      let userName = user.firstName || user.fullName || user.username;
      
      if (!userName && user.primaryEmailAddress?.emailAddress) {
        const email = user.primaryEmailAddress.emailAddress;
        userName = extractFirstNameFromEmail(email);
      }
      
      // Welcome message with role
      const welcomeMessage = userName 
        ? `Welcome back, ${userRole} ${userName}!`
        : `Welcome back, ${userRole}!`;
      
      toast.success(welcomeMessage, {
        icon: userRole === 'Teacher' ? '👨‍🏫' : '🎓',
      });
      hasShownToast.current = true;

      // Clean up localStorage after use
      try {
        localStorage.removeItem('pendingRole');
      } catch (e) {}
    }
  }, [isLoaded, user]);

  return null;
}

function extractFirstNameFromEmail(email) {
  const emailUsername = email.split('@')[0];
  let firstName = emailUsername
    .replace(/[0-9._-]/g, ' ')
    .split(' ')[0]
    .trim();
  
  if (firstName) {
    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  }
  
  return firstName;
}