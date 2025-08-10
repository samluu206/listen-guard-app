import { useState } from 'react';
import { Mic, Square, Play, Pause, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AudioWaveform } from './AudioWaveform';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { cn } from '@/lib/utils';

interface AnalysisResult {
  status: 'analyzing' | 'safe' | 'warning' | 'scam';
  confidence: number;
  threats: string[];
  riskFactors: string[];
}

export const VoiceScamDetector = () => {
  const { isRecording, isPaused, recordingTime, audioLevel, startRecording, stopRecording, pauseRecording, resumeRecording } = useAudioRecorder();
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleStartRecording = async () => {
    setAnalysisResult(null);
    await startRecording();
  };

  const handleStopRecording = async () => {
    const audioBlob = await stopRecording();
    if (audioBlob) {
      setIsAnalyzing(true);
      
      // Simulate analysis - in real app, this would send audio to AI service
      setTimeout(() => {
        const mockResult: AnalysisResult = {
          status: Math.random() > 0.7 ? 'scam' : Math.random() > 0.5 ? 'warning' : 'safe',
          confidence: Math.floor(Math.random() * 30) + 70,
          threats: ['Impersonation detected', 'Urgency tactics', 'Request for personal info'],
          riskFactors: ['Unknown caller', 'Suspicious keywords', 'Voice synthesis markers']
        };
        setAnalysisResult(mockResult);
        setIsAnalyzing(false);
      }, 3000);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'safe': return 'bg-gradient-success';
      case 'warning': return 'bg-gradient-to-r from-warning/20 to-warning/10';
      case 'scam': return 'bg-gradient-danger';
      default: return 'bg-gradient-primary';
    }
  };

  const getStatusIcon = (status: AnalysisResult['status']) => {
    switch (status) {
      case 'safe': return <CheckCircle className="w-6 h-6 text-success" />;
      case 'warning': return <AlertTriangle className="w-6 h-6 text-warning" />;
      case 'scam': return <AlertTriangle className="w-6 h-6 text-destructive" />;
      default: return <Shield className="w-6 h-6 text-primary" />;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Voice Scam Detector
          </h1>
        </div>
        <p className="text-muted-foreground text-lg">
          Record audio to analyze potential scam patterns and voice manipulation
        </p>
      </div>

      {/* Main Recording Interface */}
      <Card className="p-8 bg-card shadow-card border-border">
        <div className="space-y-6">
          {/* Waveform Visualization */}
          <div className="flex flex-col items-center space-y-4">
            <AudioWaveform 
              isActive={isRecording && !isPaused} 
              audioLevel={audioLevel}
              className="w-full"
            />
            
            {/* Recording Time */}
            <div className={cn(
              "text-2xl font-mono font-bold transition-colors",
              isRecording ? "text-primary animate-pulse-custom" : "text-muted-foreground"
            )}>
              {formatTime(recordingTime)}
            </div>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center gap-4">
            {!isRecording ? (
              <Button 
                onClick={handleStartRecording}
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                <Mic className="w-5 h-5 mr-2" />
                Start Recording
              </Button>
            ) : (
              <div className="flex gap-3">
                <Button
                  onClick={isPaused ? resumeRecording : pauseRecording}
                  variant="secondary"
                  size="lg"
                >
                  {isPaused ? (
                    <><Play className="w-5 h-5 mr-2" /> Resume</>
                  ) : (
                    <><Pause className="w-5 h-5 mr-2" /> Pause</>
                  )}
                </Button>
                
                <Button
                  onClick={handleStopRecording}
                  variant="destructive"
                  size="lg"
                  className="animate-recording"
                >
                  <Square className="w-5 h-5 mr-2" />
                  Stop & Analyze
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Analysis Results */}
      {(isAnalyzing || analysisResult) && (
        <Card className="p-6 bg-card shadow-card border-border">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-semibold">Analysis Results</h3>
            </div>

            {isAnalyzing ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-muted-foreground">Analyzing voice patterns...</span>
                </div>
                <Progress value={66} className="h-2" />
              </div>
            ) : analysisResult && (
              <div className="space-y-4">
                {/* Status Badge */}
                <div className={cn(
                  "p-4 rounded-lg border",
                  getStatusColor(analysisResult.status)
                )}>
                  <div className="flex items-center gap-3">
                    {getStatusIcon(analysisResult.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold capitalize">
                          {analysisResult.status === 'safe' ? 'Voice Appears Safe' : 
                           analysisResult.status === 'warning' ? 'Potential Risks Detected' : 
                           'High Scam Risk Detected'}
                        </span>
                        <Badge variant="secondary">
                          {analysisResult.confidence}% Confidence
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Risk Factors */}
                {analysisResult.status !== 'safe' && analysisResult.riskFactors.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-foreground">Risk Factors Detected:</h4>
                    <div className="grid gap-2">
                      {analysisResult.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-warning" />
                          <span className="text-muted-foreground">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Threats */}
                {analysisResult.status === 'scam' && analysisResult.threats.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-destructive">Threats Identified:</h4>
                    <div className="grid gap-2">
                      {analysisResult.threats.map((threat, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="w-4 h-4 text-destructive" />
                          <span className="text-muted-foreground">{threat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card className="p-4 bg-secondary/50 border-border">
        <div className="text-sm space-y-2">
          <h4 className="font-medium text-foreground">How it works:</h4>
          <ul className="text-muted-foreground space-y-1 ml-4">
            <li>• Record suspicious phone calls or voice messages</li>
            <li>• Our AI analyzes speech patterns, tone, and keywords</li>
            <li>• Get instant feedback on potential scam indicators</li>
            <li>• Stay protected from voice-based fraud attempts</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};