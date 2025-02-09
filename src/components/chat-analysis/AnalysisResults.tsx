
import { formatPercentage } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface AnalysisResultsProps {
  showResults: boolean;
  setShowResults: (show: boolean) => void;
  analysisResults: {
    total_messages: number;
    messages_sent: number;
    messages_received: number;
    time_distribution: Record<string, number>;
    day_distribution: Record<string, number>;
    top_emojis: Array<{ emoji: string; count: number }>;
    sentiment_analysis: {
      positive: number;
      negative: number;
    };
    communicator_type: string;
  } | null;
}

export const AnalysisResults = ({ showResults, setShowResults, analysisResults }: AnalysisResultsProps) => {
  if (!analysisResults) return null;

  return (
    <Dialog open={showResults} onOpenChange={setShowResults}>
      <DialogContent className="max-w-2xl">
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
            <h3 className="font-semibold">Communication Style</h3>
            <p>{analysisResults.communicator_type}</p>
          </div>

          {analysisResults.top_emojis.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Top Emojis</h3>
              <div className="flex flex-wrap gap-2">
                {analysisResults.top_emojis.slice(0, 5).map(({ emoji, count }, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 rounded-md text-sm">
                    {emoji} ({count})
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
