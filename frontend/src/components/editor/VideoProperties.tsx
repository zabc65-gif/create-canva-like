import { useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import type { VideoElement } from '@create/shared';

interface VideoPropertiesProps {
  element: VideoElement;
  onChange: (key: string, value: unknown) => void;
}

// Formater le temps en mm:ss
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export default function VideoProperties({ element, onChange }: VideoPropertiesProps) {
  const [currentTime, setCurrentTime] = useState(element.startTime);
  const [isPlaying, setIsPlaying] = useState(false);

  // Récupérer la vidéo du DOM
  const getVideoElement = (): HTMLVideoElement | null => {
    return document.getElementById(`video-${element.id}`) as HTMLVideoElement;
  };

  // Synchroniser l'état avec la vidéo
  useEffect(() => {
    const video = getVideoElement();
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [element.id]);

  // Reset current time si l'élément change
  useEffect(() => {
    setCurrentTime(element.startTime);
    setIsPlaying(false);
  }, [element.id]);

  const handlePlayPause = () => {
    const video = getVideoElement();
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleVolumeChange = (value: number) => {
    onChange('volume', value / 100);
    if (value > 0 && element.muted) {
      onChange('muted', false);
    }
  };

  const handleMuteToggle = () => {
    onChange('muted', !element.muted);
  };

  const handleLoopToggle = () => {
    onChange('loop', !element.loop);
  };

  const handleStartTimeChange = (value: number) => {
    const newStartTime = Math.max(0, Math.min(value, element.endTime - 1));
    onChange('startTime', newStartTime);
  };

  const handleEndTimeChange = (value: number) => {
    const newEndTime = Math.max(element.startTime + 1, Math.min(value, element.duration));
    onChange('endTime', newEndTime);
  };

  const trimDuration = element.endTime - element.startTime;

  return (
    <>
      {/* Informations vidéo */}
      <div className="space-y-3">
        <h4 className="sidebar-title">Informations</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-dark-500">Durée totale:</span>
            <p className="text-dark-800 font-medium">{formatTime(element.duration)}</p>
          </div>
          <div>
            <span className="text-dark-500">Durée trim:</span>
            <p className="text-dark-800 font-medium">{formatTime(trimDuration)}</p>
          </div>
        </div>
      </div>

      {/* Contrôles de lecture */}
      <div className="space-y-3">
        <h4 className="sidebar-title">Lecture</h4>

        {/* Bouton Play/Pause et temps */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayPause}
            className="btn-primary flex items-center justify-center w-10 h-10 rounded-full"
            title={isPlaying ? 'Pause' : 'Lecture'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>
          <div className="flex-1 text-sm text-dark-700">
            <span className="font-medium">{formatTime(currentTime)}</span>
            <span className="text-dark-400"> / </span>
            <span>{formatTime(element.duration)}</span>
          </div>
        </div>

        {/* Timeline visuelle */}
        <div className="relative h-12 bg-dark-100 rounded-lg p-2">
          {/* Barre totale */}
          <div className="h-full bg-dark-200 rounded relative overflow-hidden">
            {/* Zone de trim (en surbrillance) */}
            <div
              className="absolute top-0 bottom-0 bg-primary-200"
              style={{
                left: `${(element.startTime / element.duration) * 100}%`,
                width: `${(trimDuration / element.duration) * 100}%`,
              }}
            />

            {/* Marqueurs de temps */}
            <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-between px-2">
              <span className="text-[10px] font-medium text-dark-600">
                {formatTime(element.startTime)}
              </span>
              <span className="text-[10px] font-medium text-primary-700">
                {formatTime(trimDuration)}
              </span>
              <span className="text-[10px] font-medium text-dark-600">
                {formatTime(element.endTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Contrôles de trim */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-dark-500">Début (s)</label>
            <input
              type="number"
              min="0"
              max={element.duration}
              step="0.1"
              value={element.startTime.toFixed(1)}
              onChange={(e) => handleStartTimeChange(parseFloat(e.target.value))}
              className="input text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-dark-500">Fin (s)</label>
            <input
              type="number"
              min="0"
              max={element.duration}
              step="0.1"
              value={element.endTime.toFixed(1)}
              onChange={(e) => handleEndTimeChange(parseFloat(e.target.value))}
              className="input text-sm"
            />
          </div>
        </div>

        {/* Checkbox Loop */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={element.loop}
            onChange={handleLoopToggle}
            className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-sm text-dark-700">Boucle automatique</span>
        </label>
      </div>

      {/* Contrôles de volume */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="sidebar-title">Volume</h4>
          <button
            onClick={handleMuteToggle}
            className="tool-button"
            title={element.muted ? 'Activer le son' : 'Couper le son'}
          >
            {element.muted ? (
              <VolumeX className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="100"
            value={element.muted ? 0 : Math.round(element.volume * 100)}
            onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
            className="w-full"
            disabled={element.muted}
          />
          <span className="text-xs text-dark-500">
            {element.muted ? 'Muet' : `${Math.round(element.volume * 100)}%`}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-700">
          💡 <strong>Astuce :</strong> Utilisez le trim pour n'afficher qu'une portion de la vidéo. La vidéo démarrera au temps de début et bouclera si activé.
        </p>
      </div>

      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
        <p className="text-xs text-purple-700">
          🎬 <strong>Contrôles :</strong> Sélectionnez la vidéo sur le canvas pour afficher les contrôles natifs de lecture.
        </p>
      </div>
    </>
  );
}
