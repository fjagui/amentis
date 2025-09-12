'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/onboarding'); // ✅ Navegación segura
  }, [router]);

  return null; // O un loader/spinner
}