import React from 'react';
import EstimationCard from './EstimationCard';

const EstimationPage: React.FC = () => {
  const estimationItems = [
    {
      title: 'Energétique',
      content: 'Contenu détaillé pour Energétique...',
    },
    {
      title: 'Agencement',
      content: 'Contenu détaillé pour Agencement...',
    },
    {
      title: 'Ameublement',
      content: 'Contenu détaillé pour Ameublement...',
    },
  ];

  return (
    <div>
      <EstimationCard items={estimationItems} budget={2850} total={18090} />
    </div>
  );
};

export default EstimationPage;