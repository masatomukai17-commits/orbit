import { useState } from 'react';
import { STUDENT_TABS } from '../data/constants.js';
import Header from '../components/Header.jsx';
import HomeTab from '../components/student/HomeTab.jsx';
import LadderTab from '../components/student/LadderTab.jsx';
import CombatTab from '../components/student/CombatTab.jsx';
import LaparoTab from '../components/student/LaparoTab.jsx';
import EvalTab from '../components/student/EvalTab.jsx';
import SurveyTab from '../components/student/SurveyTab.jsx';

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('home');

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'ladder': return <LadderTab />;
      case 'combat': return <CombatTab />;
      case 'laparo': return <LaparoTab />;
      case 'eval': return <EvalTab />;
      case 'survey': return <SurveyTab />;
      default: return <HomeTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header tabs={STUDENT_TABS} activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="max-w-6xl mx-auto p-4">
        {renderTab()}
      </main>
    </div>
  );
}
