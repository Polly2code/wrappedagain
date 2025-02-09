
import { Shield, Server } from 'lucide-react';

export const PrivacyNotice = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-sm animate-fade-up">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-primary/10">
          <Shield className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-base">Privacy First</h3>
          <p className="text-sm text-gray-600 mt-1">
            Your chats are analyzed securely and privately. No personal data is stored or shared.
          </p>
        </div>
      </div>
      
      <div className="flex items-start gap-4 mt-4">
        <div className="p-2 rounded-full bg-primary/10">
          <Server className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-base">EU Data Processing</h3>
          <p className="text-sm text-gray-600 mt-1">
            All analysis is performed on secure servers located in Europe, complying with GDPR.
          </p>
        </div>
      </div>
    </div>
  );
};
