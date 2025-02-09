
import { formatPercentage } from '@/lib/utils';
import { ChatAnalysisResult } from '@/types/chat';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface AnalysisResultsProps {
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  analysisResults: ChatAnalysisResult | null;
}

export const AnalysisResults = ({ showResults, setShowResults, analysisResults }: AnalysisResultsProps) => {
  if (!analysisResults) return null;

  return (
    <Dialog open={showResults} onOpenChange={setShowResults}>
      <DialogContent className="max-w-2xl bg-gradient-to-br from-white via-primary/20 to-primary">
        <DialogHeader>
          <DialogTitle>Chat Analysis Results</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Message Stats</h3>
            <p>Total Messages: {analysisResults.total_messages}</p>
            <p>Messages Sent: {analysisResults.messages_sent}</p>
            <p>Messages Received: {analysisResults.messages_received}</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold">Communication Styles</h3>
            {Object.entries(analysisResults.communication_styles || {}).map(([participant, style]) => (
              <div key={participant} className="bg-gray-50 p-3 rounded-lg">
                <p className="font-medium">{participant}</p>
                <p className="text-gray-600">{style}</p>
              </div>
            ))}
          </div>

          {analysisResults.top_emojis.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Top Emojis</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResults.top_emojis.slice(0, 5).map(({ emoji, count }, index) => (
                  <span 
                    key={index} 
                    className="px-3 py-2 bg-gray-100 rounded-md text-lg flex items-center gap-2"
                  >
                    <span className="text-2xl">{emoji}</span>
                    <span className="text-gray-600">({count})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

