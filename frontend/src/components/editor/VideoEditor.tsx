import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Plus,
  Type,
  Music,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';

interface VideoClip {
  id: string;
  src: string;
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  position: number; // Position sur la timeline
}

interface TextOverlay {
  id: string;
  content: string;
  startTime: number;
  endTime: number;
  style: {
    fontSize: number;
    color: string;
    fontFamily: string;
    position: { x: number; y: number };
  };
}

interface AudioTrack {
  id: string;
  src: string;
  name: string;
  startTime: number;
  endTime: number;
  volume: number;
}

interface VideoEditorProps {
  onExport: (data: { clips: VideoClip[]; textOverlays: TextOverlay[]; audioTracks: AudioTrack[] }) => void;
  onClose: () => void;
}

export default function VideoEditor({ onExport, onClose }: VideoEditorProps) {
  const [clips, setClips] = useState<VideoClip[]>([]);
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Calcul de la durée totale
  useEffect(() => {
    if (clips.length === 0) {
      setTotalDuration(0);
      return;
    }
    const maxEnd = Math.max(...clips.map((c) => c.position + (c.endTime - c.startTime)));
    setTotalDuration(maxEnd);
  }, [clips]);

  // Contrôles de lecture
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (time: number) => {
    setCurrentTime(Math.max(0, Math.min(time, totalDuration)));
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Import de fichiers
  const handleFileImport = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      Array.from(files).forEach((file) => {
        const url = URL.createObjectURL(file);

        if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.src = url;
          video.onloadedmetadata = () => {
            const newClip: VideoClip = {
              id: `clip-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              src: url,
              name: file.name,
              startTime: 0,
              endTime: video.duration,
              duration: video.duration,
              position: totalDuration,
            };
            setClips((prev) => [...prev, newClip]);
          };
        } else if (file.type.startsWith('audio/')) {
          const audio = document.createElement('audio');
          audio.src = url;
          audio.onloadedmetadata = () => {
            const newTrack: AudioTrack = {
              id: `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              src: url,
              name: file.name,
              startTime: 0,
              endTime: audio.duration,
              volume: 1,
            };
            setAudioTracks((prev) => [...prev, newTrack]);
          };
        }
      });
    },
    [totalDuration]
  );

  // Ajouter un texte
  const handleAddText = () => {
    const newText: TextOverlay = {
      id: `text-${Date.now()}`,
      content: 'Nouveau texte',
      startTime: currentTime,
      endTime: currentTime + 5,
      style: {
        fontSize: 32,
        color: '#ffffff',
        fontFamily: 'Inter',
        position: { x: 50, y: 50 },
      },
    };
    setTextOverlays((prev) => [...prev, newText]);
  };

  // Supprimer un clip
  const handleDeleteClip = (clipId: string) => {
    setClips((prev) => prev.filter((c) => c.id !== clipId));
    if (selectedClipId === clipId) {
      setSelectedClipId(null);
    }
  };

  // Timeline en secondes
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const PIXELS_PER_SECOND = 50;

  return (
    <div className="fixed inset-0 bg-dark-900 flex flex-col z-50">
      {/* Header */}
      <header className="h-14 bg-dark-800 border-b border-dark-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="text-dark-400 hover:text-white">
            ← Retour
          </button>
          <h1 className="text-white font-semibold">Éditeur Vidéo</h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-secondary">Prévisualiser</button>
          <button
            onClick={() => onExport({ clips, textOverlays, audioTracks })}
            className="btn btn-primary"
          >
            Exporter
          </button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Sidebar - Médias */}
        <aside className="w-64 bg-dark-800 border-r border-dark-700 flex flex-col">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-dark-400 uppercase mb-3">
              Médias
            </h2>
            <label className="block w-full p-4 border-2 border-dashed border-dark-600 rounded-lg text-center cursor-pointer hover:border-primary-500 hover:bg-dark-700 transition-colors">
              <Plus className="w-6 h-6 mx-auto mb-2 text-dark-400" />
              <span className="text-sm text-dark-400">Importer</span>
              <input
                type="file"
                className="hidden"
                multiple
                accept="video/*,audio/*"
                onChange={handleFileImport}
              />
            </label>
          </div>

          {/* Liste des clips */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {clips.map((clip) => (
              <div
                key={clip.id}
                onClick={() => setSelectedClipId(clip.id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedClipId === clip.id
                    ? 'bg-primary-600'
                    : 'bg-dark-700 hover:bg-dark-600'
                }`}
              >
                <p className="text-sm text-white truncate">{clip.name}</p>
                <p className="text-xs text-dark-400">{formatTime(clip.duration)}</p>
              </div>
            ))}
          </div>

          {/* Outils */}
          <div className="p-4 border-t border-dark-700">
            <h2 className="text-sm font-semibold text-dark-400 uppercase mb-3">
              Ajouter
            </h2>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleAddText}
                className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-center"
              >
                <Type className="w-5 h-5 mx-auto mb-1 text-dark-300" />
                <span className="text-xs text-dark-400">Texte</span>
              </button>
              <button className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-center">
                <Music className="w-5 h-5 mx-auto mb-1 text-dark-300" />
                <span className="text-xs text-dark-400">Musique</span>
              </button>
              <button className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-center">
                <ImageIcon className="w-5 h-5 mx-auto mb-1 text-dark-300" />
                <span className="text-xs text-dark-400">Image</span>
              </button>
              <button className="p-3 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors text-center">
                <Sparkles className="w-5 h-5 mx-auto mb-1 text-dark-300" />
                <span className="text-xs text-dark-400">Effets</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          {/* Preview */}
          <div className="flex-1 flex items-center justify-center bg-black p-8">
            {clips.length > 0 ? (
              <video
                ref={videoRef}
                src={clips[0]?.src}
                className="max-w-full max-h-full rounded-lg"
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
              />
            ) : (
              <div className="text-center text-dark-500">
                <p className="text-lg mb-2">Aucune vidéo</p>
                <p className="text-sm">Importez des fichiers pour commencer</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="h-16 bg-dark-800 border-t border-dark-700 flex items-center justify-center gap-4 px-4">
            <button onClick={() => handleSeek(0)} className="text-dark-400 hover:text-white">
              <SkipBack className="w-5 h-5" />
            </button>
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center hover:bg-primary-400 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white ml-1" />
              )}
            </button>
            <button
              onClick={() => handleSeek(totalDuration)}
              className="text-dark-400 hover:text-white"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm text-dark-400 w-16">
                {formatTime(currentTime)}
              </span>
              <span className="text-dark-600">/</span>
              <span className="text-sm text-dark-400 w-16">
                {formatTime(totalDuration)}
              </span>
            </div>

            <div className="flex items-center gap-2 ml-auto">
              <button onClick={toggleMute} className="text-dark-400 hover:text-white">
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-24"
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="h-48 bg-dark-900 border-t border-dark-700 overflow-x-auto">
            <div
              ref={timelineRef}
              className="relative h-full"
              style={{ minWidth: `${Math.max(800, totalDuration * PIXELS_PER_SECOND)}px` }}
            >
              {/* Time markers */}
              <div className="h-6 bg-dark-800 flex items-center border-b border-dark-700">
                {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-xs text-dark-500"
                    style={{ left: `${i * PIXELS_PER_SECOND}px` }}
                  >
                    {formatTime(i)}
                  </div>
                ))}
              </div>

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                style={{ left: `${currentTime * PIXELS_PER_SECOND}px` }}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full -ml-1.5 -mt-1" />
              </div>

              {/* Video track */}
              <div className="h-16 bg-dark-800/50 mt-2 mx-2 rounded relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-2 text-xs text-dark-500 w-20">
                  Vidéo
                </div>
                <div className="ml-20 h-full relative">
                  {clips.map((clip) => (
                    <div
                      key={clip.id}
                      onClick={() => setSelectedClipId(clip.id)}
                      className={`absolute top-1 bottom-1 rounded-lg cursor-pointer transition-all ${
                        selectedClipId === clip.id
                          ? 'bg-primary-500 ring-2 ring-primary-300'
                          : 'bg-blue-600 hover:bg-blue-500'
                      }`}
                      style={{
                        left: `${clip.position * PIXELS_PER_SECOND}px`,
                        width: `${(clip.endTime - clip.startTime) * PIXELS_PER_SECOND}px`,
                      }}
                    >
                      <div className="p-2 text-xs text-white truncate">
                        {clip.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio track */}
              <div className="h-12 bg-dark-800/50 mt-2 mx-2 rounded relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-2 text-xs text-dark-500 w-20">
                  Audio
                </div>
                <div className="ml-20 h-full relative">
                  {audioTracks.map((track) => (
                    <div
                      key={track.id}
                      className="absolute top-1 bottom-1 bg-green-600 rounded-lg"
                      style={{
                        left: `${track.startTime * PIXELS_PER_SECOND}px`,
                        width: `${(track.endTime - track.startTime) * PIXELS_PER_SECOND}px`,
                      }}
                    >
                      <div className="p-2 text-xs text-white truncate">
                        {track.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Text track */}
              <div className="h-10 bg-dark-800/50 mt-2 mx-2 rounded relative">
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-2 text-xs text-dark-500 w-20">
                  Texte
                </div>
                <div className="ml-20 h-full relative">
                  {textOverlays.map((text) => (
                    <div
                      key={text.id}
                      className="absolute top-1 bottom-1 bg-yellow-600 rounded-lg"
                      style={{
                        left: `${text.startTime * PIXELS_PER_SECOND}px`,
                        width: `${(text.endTime - text.startTime) * PIXELS_PER_SECOND}px`,
                      }}
                    >
                      <div className="p-1 text-xs text-white truncate">
                        {text.content}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
