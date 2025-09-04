import React from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { UniversityVideo } from '../data/universityData';

interface VideoCardProps {
  video: UniversityVideo;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  // Convert video ID to YouTube embed URL or TikTok embed
  const getVideoEmbedUrl = (videoId: string) => {
    // For placeholder IDs, we'll use a default video
    if (videoId.startsWith('placeholder-')) {
      return 'https://www.youtube.com/embed/dQw4w9WgXcQ'; // Default placeholder
    }
    
    // Check if it's a TikTok video (longer ID format)
    if (videoId.length > 15) {
      return `https://www.tiktok.com/embed/${videoId}`;
    }
    
    // Default to YouTube
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const isTikTokVideo = (videoId: string) => {
    return !videoId.startsWith('placeholder-') && videoId.length > 15;
  };

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'Campus Tour':
        return 'default';
      case 'Student Vlog':
        return 'secondary';
      case 'Faculty Focus':
        return 'outline';
      default:
        return 'default';
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground line-clamp-2">
            {video.title}
          </h3>
          <Badge variant={getBadgeVariant(video.type)} className="ml-2 flex-shrink-0">
            {video.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="aspect-video w-full">
          <iframe
            src={getVideoEmbedUrl(video.id)}
            title={video.title}
            className="w-full h-full rounded-b-lg"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
