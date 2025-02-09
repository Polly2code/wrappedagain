
import { FileUpload } from "@/components/FileUpload";
import { PrivacyNotice } from "@/components/PrivacyNotice";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-muted py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-block px-4 py-1 bg-primary/10 rounded-full text-primary text-sm font-medium mb-4">
            WhatsApp Wrapped
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Discover Your Chat Story
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Upload your WhatsApp chat export and get beautiful insights about your conversations, emoji usage, and chat patterns.
          </p>
        </div>

        <FileUpload />
        <PrivacyNotice />
        
        <div className="mt-12 text-center text-sm text-gray-500 animate-fade-up">
          <h3 className="font-medium text-gray-700 mb-2">How to export your chat</h3>
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
