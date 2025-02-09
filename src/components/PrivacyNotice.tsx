
import { ShieldCheck, Flag } from 'lucide-react';

export const PrivacyNotice = () => {
  return (
    <div className="w-full max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-sm animate-fade-up">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-full bg-primary/10">
          <ShieldCheck className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-base">GDPR Conform</h3>
          <p className="text-sm text-gray-600 mt-1">
            Hosted in Europe, fully compliant with EU data protection regulations
          </p>
        </div>
      </div>
      
      <div className="flex items-start gap-4 mt-4">
        <div className="p-2 rounded-full bg-primary/10">
          <Flag className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-medium text-base">Made in Germany</h3>
          <p className="text-sm text-gray-600 mt-1">
            Based in Berlin, developed with German engineering standards
          </p>
        </div>
      </div>
    </div>
  );
};
