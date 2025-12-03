import { QueryClient } from '@tanstack/react-query';

// Configurare QueryClient cu opțiuni globale
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Timpul în care datele sunt considerate "fresh" (în milisecunde)
      staleTime: 1000 * 60 * 5, // 5 minute
      
      // Cache time - cât timp să păstreze datele în cache după ce nu mai sunt folosite
      gcTime: 1000 * 60 * 10, // 10 minute (fostul cacheTime)
      
      // Retry failed requests de 3 ori
      retry: 3,
      
      // Timpul de așteptare între retry-uri
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch când window-ul devine focused
      refetchOnWindowFocus: false,
      
      // Refetch când reconectezi la internet
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry failed mutations o singură dată
      retry: 1,
    },
  },
});