// app/onboarding/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';
import Layout from '../components/Layout';
import ProgressBar from '../components/onboarding/ProgressBar';

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <Layout>
      <ProgressBar progress={0} /> {/* Opcional: Ajustar progreso */}
      <OnboardingFlow 
        onComplete={() => router.push('/cognitive-exercises')} 
      />
    </Layout>
  );
}