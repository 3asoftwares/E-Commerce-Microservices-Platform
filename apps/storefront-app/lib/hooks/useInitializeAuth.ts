'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';

export function useInitializeAuth() {
  const { loadUserFromStorage, userProfile } = useCartStore();

  useEffect(() => {
    if (!userProfile) {
      loadUserFromStorage();
    }
  }, [loadUserFromStorage, userProfile]);
}
