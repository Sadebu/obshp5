import React from 'react';

interface SceneImageProps {
  type: string;
  className?: string;
}

export const SceneImage: React.FC<SceneImageProps> = ({ type, className = '' }) => {
  const images: Record<string, string> = {
    city: 'https://image.qwenlm.ai/generated-images/a2f978f3-1b21-4537-b44c-b6d01340380e/_result.png',
    school: 'https://image.qwenlm.ai/generated-images/9935b138-c9f4-4d5e-8edb-0990ca02d723/_result.png',
    family: 'https://image.qwenlm.ai/generated-images/f1a43bd9-3017-435a-9010-eb92ddf44c11/_result.png',
    pyramid: 'https://image.qwenlm.ai/generated-images/fc421801-d841-4545-b4dd-910f5ed92a3e/_result.png',
    conflict: 'https://image.qwenlm.ai/generated-images/77b115d5-e1b6-444c-90a2-269832a5ef53/_result.png',
    network: 'https://image.qwenlm.ai/generated-images/eecf8c8a-1d7b-4099-b976-797d6351e403/_result.png',
    elevator: 'https://image.qwenlm.ai/generated-images/0a4d789d-6464-4cca-8383-0b2356ba50d1/_result.png',
    migration: 'https://image.qwenlm.ai/generated-images/9033fa8a-627e-4cf7-b949-a12bacf448e1/_result.png',
    work: 'https://image.qwenlm.ai/generated-images/cbd5b2ea-5559-4272-afd7-22fa914109df/_result.png',
    negotiations: 'https://image.qwenlm.ai/generated-images/5470dd25-c414-450b-ad3d-9324a332113c/_result.png',
    statuses: 'https://image.qwenlm.ai/generated-images/eecf8c8a-1d7b-4099-b976-797d6351e403/_result.png',
    passport: 'https://image.qwenlm.ai/generated-images/fc421801-d841-4545-b4dd-910f5ed92a3e/_result.png',
  };

  const imageUrl = images[type] || images.city;

  return (
    <div className={`scene-image-container ${className}`}>
      <img 
        src={imageUrl} 
        alt={type}
        className="scene-image"
        loading="lazy"
      />
    </div>
  );
};
