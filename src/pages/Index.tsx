
import { FileUpload } from "@/components/FileUpload";
import { PrivacyNotice } from "@/components/PrivacyNotice";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#9b87f5] via-[#D946EF] to-[#F97316] py-12 px-4">
      <div className="relative overflow-hidden w-full">
        <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          <span className="inline-block text-[#FEF7CD] text-xl font-bold px-4">
            wrappedagain • wrappedagain • wrappedagain • wrappedagain • wrappedagain • 
            wrappedagain • wrappedagain • wrappedagain • wrappedagain • wrappedagain
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-block px-4 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
            WhatsApp Wrapped
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">
            Discover Your Chat Story
          </h1>
          <p className="text-white/90 max-w-md mx-auto">
            Upload your WhatsApp chat export and get beautiful insights about your conversations, emoji usage, and chat patterns.
          </p>
        </div>

        <FileUpload />
        <PrivacyNotice />
        
        <div className="mt-12 text-center text-sm text-white/80 animate-fade-up bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="font-medium text-white mb-4">How to export your chat</h3>
          <ol className="space-y-2">
            <li>1. Open WhatsApp and go to the chat</li>
            <li>2. Tap on the chat name at the top</li>
            <li>3. Scroll down and tap "Export Chat"</li>
            <li>4. Select "Without Media"</li>
            <li>5. Save the file and upload it here</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Index;
