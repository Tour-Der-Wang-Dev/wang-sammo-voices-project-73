
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Play, Pause, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, audioUrl: string) => void;
  onRecordingRemove: () => void;
  existingRecording?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onRecordingComplete,
  onRecordingRemove,
  existingRecording
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(existingRecording || null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob, url);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: t('message.error'),
        description: 'Unable to access microphone. Please check permissions.',
        variant: 'destructive'
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const removeRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordingTime(0);
    onRecordingRemove();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="border-2 border-dashed border-orange-200 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Mic className="text-orange-500" size={20} />
          <span className="font-medium text-gray-700">
            {t('form.addVoice')}
          </span>
        </div>
        
        {recordingTime > 0 && (
          <span className="text-sm text-gray-500">
            {formatTime(recordingTime)}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {!isRecording && !audioUrl && (
          <Button
            type="button"
            variant="outline"
            onClick={startRecording}
            className="flex items-center space-x-2"
          >
            <Mic size={16} />
            <span>เริ่มบันทึก</span>
          </Button>
        )}

        {isRecording && (
          <Button
            type="button"
            variant="destructive"
            onClick={stopRecording}
            className="flex items-center space-x-2 animate-pulse"
          >
            <MicOff size={16} />
            <span>หยุดบันทึก</span>
          </Button>
        )}

        {audioUrl && !isRecording && (
          <div className="flex items-center space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={isPlaying ? pauseRecording : playRecording}
              className="flex items-center space-x-2"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>{isPlaying ? 'หยุด' : 'เล่น'}</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={removeRecording}
              className="flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>ลบ</span>
            </Button>
          </div>
        )}
      </div>

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />
      )}

      {audioUrl && (
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 p-2 rounded">
          <Upload size={16} />
          <span>เสียงพร้อมส่งแล้ว</span>
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
