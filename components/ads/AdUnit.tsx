'use client';

import { AdBanner } from './AdBanner';

interface AdUnitProps {
  type: 'banner' | 'rectangle' | 'sidebar' | 'mobile';
  className?: string;
}

export function AdUnit({ type, className = '' }: AdUnitProps) {
  const adConfigs = {
    banner: {
      adSlot: '1234567890', // Replace with your actual ad slot ID
      adFormat: 'auto' as const,
      style: { display: 'block', width: '100%', height: '90px' }
    },
    rectangle: {
      adSlot: '1234567891', // Replace with your actual ad slot ID
      adFormat: 'rectangle' as const,
      style: { display: 'block', width: '300px', height: '250px' }
    },
    sidebar: {
      adSlot: '1234567892', // Replace with your actual ad slot ID
      adFormat: 'vertical' as const,
      style: { display: 'block', width: '160px', height: '600px' }
    },
    mobile: {
      adSlot: '1234567893', // Replace with your actual ad slot ID
      adFormat: 'auto' as const,
      style: { display: 'block', width: '100%', height: '50px' }
    }
  };

  const config = adConfigs[type];

  return (
    <div className={`ad-unit ad-unit-${type} ${className}`}>
      <div className="text-xs text-gray-500 mb-1 text-center">Advertisement</div>
      <AdBanner
        adSlot={config.adSlot}
        adFormat={config.adFormat}
        style={config.style}
        className="mx-auto"
      />
    </div>
  );
}