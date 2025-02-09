
import FileUpload from "@/components/FileUpload";
import PrivacyNotice from "@/components/PrivacyNotice";
import AudioPlayer from "@/components/AudioPlayer";
import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        'Orbitron',
        'url(https://fonts.gstatic.com/s/orbitron/v31/yMJMMIlzdpvBhQQL_SC3X9yhF25-T1nyKS6BoWgz.woff2)'
      );

      try {
        await font.load();
        document.fonts.add(font);
        console.log('Orbitron font loaded successfully');
      } catch (error) {
        console.error('Error loading Orbitron font:', error);
      }
    };

    loadFont();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#dcf8c6] to-[#25D366] py-12 px-4">
      <AudioPlayer />
      <div className="relative overflow-hidden w-full py-8">
        <div className="animate-[marquee_20s_linear_infinite] whitespace-nowrap">
          <span className="inline-block text-[#F4EF53] text-9xl font-bold px-4 text-center w-full tracking-wider" style={{ 
            fontFamily: 'Orbitron, system-ui',
            fontWeight: '900',
            textShadow: `
              -2px -2px 4px rgba(255, 255, 255, 0.8),
              2px 2px 8px rgba(0, 0, 0, 0.15)
            `,
            filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.1))',
            transform: 'perspective(500px) rotateX(5deg)',
          }}>
            wrappedagainwrappedagainwrappedagainwrappedagainwrappedagainwrappedagainwrappedagainwrappedagainwrappedagainwrappedagain
          </span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-block px-4 py-1 bg-[#075E54]/10 backdrop-blur-sm rounded-full text-[#075E54] text-sm font-medium mb-4">
            WhatsApp Wrapped
          </div>
          <h1 className="text-4xl font-bold mb-4 text-[#075E54]">
            Discover Your Chat Story
          </h1>
          <p className="text-[#075E54]/90 max-w-md mx-auto">
            Upload your WhatsApp chat export and get beautiful insights about your conversations, emoji usage, and chat patterns.
          </p>
        </div>

        <FileUpload />
        
        <div className="mt-12 text-center text-sm text-[#075E54]/80 animate-fade-up bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <h3 className="font-medium text-[#075E54] mb-4">How to export your chat</h3>
          <ol className="space-y-2">
            <li>1. Open WhatsApp and go to the chat</li>
            <li>2. Tap on the chat name at the top</li>
            <li>3. Scroll down and tap "Export Chat"</li>
            <li>4. Select "Without Media"</li>
            <li>5. Save the file and upload it here</li>
          </ol>
        </div>

        <div className="mt-12">
          <PrivacyNotice />
        </div>
      </div>
    </div>
  );
};

export default Index;
