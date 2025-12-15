import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Video,
  Download,
  Share2,
  Trash2,
  Play,
  Clock,
  Calendar,
  FolderOpen,
} from "lucide-react";

// Mock data for demo purposes
interface Recording {
  id: string;
  title: string;
  duration: string;
  date: string;
  size: string;
  thumbnail?: string;
}

const mockRecordings: Recording[] = [
  {
    id: "1",
    title: "Product Demo - Q4 Update",
    duration: "5:32",
    date: "2024-01-15",
    size: "45.2 MB",
  },
  {
    id: "2",
    title: "Team Standup Recording",
    duration: "12:45",
    date: "2024-01-14",
    size: "98.7 MB",
  },
  {
    id: "3",
    title: "Tutorial - Getting Started",
    duration: "8:21",
    date: "2024-01-12",
    size: "67.3 MB",
  },
];

const Dashboard = () => {
  const [recordings] = useState<Recording[]>(mockRecordings);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Recordings</h1>
              <p className="text-muted-foreground">
                Manage and share your screen recordings
              </p>
            </div>
            <Button asChild>
              <Link to="/record">
                <Video className="h-4 w-4 mr-2" />
                New Recording
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <StatCard
              icon={<Video className="h-5 w-5" />}
              label="Total Recordings"
              value={recordings.length.toString()}
            />
            <StatCard
              icon={<Clock className="h-5 w-5" />}
              label="Total Duration"
              value="26:38"
            />
            <StatCard
              icon={<FolderOpen className="h-5 w-5" />}
              label="Storage Used"
              value="211.2 MB"
            />
          </div>

          {/* Recordings Grid */}
          {recordings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {recordings.map((recording) => (
                <RecordingCard key={recording.id} recording={recording} />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const StatCard = ({ icon, label, value }: StatCardProps) => (
  <div className="bg-card rounded-xl border border-border p-5">
    <div className="flex items-center gap-3 mb-2 text-muted-foreground">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

interface RecordingCardProps {
  recording: Recording;
}

const RecordingCard = ({ recording }: RecordingCardProps) => (
  <div className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors">
    {/* Thumbnail */}
    <div className="relative aspect-video bg-muted flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
      <Video className="h-12 w-12 text-muted-foreground/50" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/50">
        <Button variant="secondary" size="icon" className="rounded-full">
          <Play className="h-5 w-5" />
        </Button>
      </div>
      <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-background/80 text-xs font-medium">
        {recording.duration}
      </div>
    </div>

    {/* Info */}
    <div className="p-4">
      <h3 className="font-semibold mb-2 truncate">{recording.title}</h3>
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {recording.date}
        </span>
        <span>{recording.size}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <Download className="h-3 w-3 mr-1" />
          Download
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
      <Video className="h-10 w-10 text-muted-foreground" />
    </div>
    <h3 className="text-xl font-semibold mb-2">No recordings yet</h3>
    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
      Start recording your screen to create professional presentations and demos.
    </p>
    <Button asChild>
      <Link to="/record">
        <Video className="h-4 w-4 mr-2" />
        Create Your First Recording
      </Link>
    </Button>
  </div>
);

export default Dashboard;
