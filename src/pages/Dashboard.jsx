import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.jsx";
import { useToast } from "@/hooks/use-toast.jsx";
import { recordingService } from "@/services/recordingService.jsx";
import {
  Video,
  Download,
  Share2,
  Trash2,
  Play,
  Clock,
  Calendar,
  FolderOpen,
  Loader2,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    loadRecordings();
  }, [user]);

  const loadRecordings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await recordingService.getUserRecordings();
      setRecordings(data);
    } catch (error) {
      console.error("Error loading recordings:", error);
      toast({
        title: "Error",
        description: "Failed to load recordings.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (recordingId, storagePath) => {
    setDeleting(recordingId);
    try {
      await recordingService.deleteRecording(recordingId);
      setRecordings(recordings.filter((r) => r.id !== recordingId));
      toast({
        title: "Deleted",
        description: "Recording deleted successfully.",
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete recording.",
        variant: "destructive",
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleShare = async (recording) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recording.title,
          text: "Check out my screen recording!",
          url: recording.public_url,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          // Fallback to copy
          navigator.clipboard.writeText(recording.public_url);
          toast({
            title: "Link Copied",
            description: "Shareable link copied to clipboard.",
          });
        }
      }
    } else {
      navigator.clipboard.writeText(recording.public_url);
      toast({
        title: "Link Copied",
        description: "Shareable link copied to clipboard.",
      });
    }
  };

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
              label="Total Size"
              value={`${(recordings.reduce((sum, r) => sum + (r.file_size || 0), 0) / (1024 * 1024 * 1024)).toFixed(2)}GB`}
            />
            <StatCard
              icon={<FolderOpen className="h-5 w-5" />}
              label="Cloud Status"
              value="Active"
            />
          </div>

          {/* Recordings List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recordings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              {recordings.map((recording) => (
                <RecordingCard 
                  key={recording.id} 
                  recording={recording} 
                  onDelete={handleDelete}
                  onShare={handleShare}
                  deleting={deleting === recording._id}
                />
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

const StatCard = ({ icon, label, value }) => (
  <div className="bg-card rounded-xl border border-border p-5">
    <div className="flex items-center gap-3 mb-2 text-muted-foreground">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <p className="text-2xl font-bold">{value}</p>
  </div>
);

const RecordingCard = ({ recording, onDelete, onShare, deleting }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatSize = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-colors">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        <Video className="h-12 w-12 text-muted-foreground/50" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-background/50">
          <a href={recording.public_url} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="icon" className="rounded-full">
              <Play className="h-5 w-5" />
            </Button>
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold mb-2 truncate">{recording.title}</h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(recording.created_at)}
          </span>
          <span>{formatSize(recording.file_size)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a href={recording.public_url} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </a>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onShare(recording)}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDelete(recording.id, recording.storage_path)}
            disabled={deleting}
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

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
