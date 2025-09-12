// app/onboarding/page.tsx
'use client';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';
import Layout from '../components/Layout';
import ProgressBar from '../components/onboarding/ProgressBar';

export default function OnboardingPage() {
  return (
    <Layout>
      <ProgressBar progress={0} />
      <OnboardingFlow onComplete={() => {}} />
    </Layout>
  );
}