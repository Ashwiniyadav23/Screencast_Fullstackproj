import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth.jsx";
import { useToast } from "@/hooks/use-toast";
import { recordingService } from "@/services/recordingService";
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
  Search,
  Filter,
  Grid3X3,
  List,
  Edit,
  Star,
  Eye,
  BarChart3,
  Folder,
  Plus,
  Settings,
  Scissors,
  Palette,
  FileVideo,
  Upload,
  Tag,
  Archive,
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [recordings, setRecordings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const [showStats, setShowStats] = useState(true);
  const [folderFilter, setFolderFilter] = useState("all");

  useEffect(() => {
    loadRecordings();
  }, [user]);

  const loadRecordings = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await recordingService.getUserRecordings();
      setRecordings(data || []);
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

  const handleBulkDelete = async () => {
    if (selectedRecordings.length === 0) return;
    
    try {
      await Promise.all(
        selectedRecordings.map(id => recordingService.deleteRecording(id))
      );
      setRecordings(recordings.filter(r => !selectedRecordings.includes(r.id)));
      setSelectedRecordings([]);
      toast({
        title: "Success",
        description: `${selectedRecordings.length} recordings deleted.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some recordings.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async (recording) => {
    const shareUrl = recording.public_url || recording.url;
    if (!shareUrl) {
      toast({
        title: "Unable to share",
        description: "Recording URL is missing.",
        variant: "destructive",
      });
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: recording.title,
          text: "Check out my screen recording!",
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          navigator.clipboard.writeText(shareUrl);
          toast({
            title: "Link Copied",
            description: "Shareable link copied to clipboard.",
          });
        }
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link Copied",
        description: "Shareable link copied to clipboard.",
      });
    }
  };

  const filteredRecordings = recordings.filter(recording =>
    recording.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recording.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedRecordings = [...filteredRecordings].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return (a.title || "").localeCompare(b.title || "");
      case "size":
        return (b.file_size || 0) - (a.file_size || 0);
      case "duration":
        return (b.duration || 0) - (a.duration || 0);
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  const totalSize = recordings.reduce((sum, r) => sum + (r.file_size || 0), 0);
  const totalDuration = recordings.reduce((sum, r) => sum + (r.duration || 0), 0);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Dashboard"
        description="Manage, preview, and share your recordings from the ScreenCast Pro dashboard."
        path="/dashboard"
        noindex
      />
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Enhanced Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 animate-fade-in">
            <div>
              <h1 className="text-4xl font-bold mb-2 gradient-text">My Recordings</h1>
              <p className="text-muted-foreground text-lg">
                Manage, edit, and share your screen recordings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button asChild className="glow-primary">
                <Link to="/record">
                  <Video className="h-4 w-4 mr-2" />
                  New Recording
                </Link>
              </Button>
            </div>
          </div>

          {/* Advanced Controls & Stats */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Enhanced Stats */}
              {showStats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-scale-in">
                  <StatsCard
                    icon={<Video className="h-6 w-6 text-primary" />}
                    label="Total Recordings"
                    value={recordings.length.toString()}
                    trend="+12%"
                    trendUp={true}
                  />
                  <StatsCard
                    icon={<FileVideo className="h-6 w-6 text-accent" />}
                    label="Total Size"
                    value={`${(totalSize / (1024 * 1024 * 1024)).toFixed(2)}GB`}
                    trend="2.1GB this month"
                  />
                  <StatsCard
                    icon={<Clock className="h-6 w-6 text-success" />}
                    label="Total Duration"
                    value={`${Math.floor(totalDuration / 60)}m`}
                    trend="Active"
                  />
                  <StatsCard
                    icon={<Eye className="h-6 w-6 text-orange-500" />}
                    label="Views"
                    value="1,234"
                    trend="+8% today"
                    trendUp={true}
                  />
                </div>
              )}

              {/* Search, Filter & View Controls */}
              <div className="bg-card rounded-2xl border border-border p-6 mb-8 glass-strong animate-slide-up">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                  <div className="flex-1 flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                    <div className="relative flex-1 min-w-[300px]">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search recordings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="created_at">Recent</SelectItem>
                        <SelectItem value="title">Name</SelectItem>
                        <SelectItem value="size">Size</SelectItem>
                        <SelectItem value="duration">Duration</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {selectedRecordings.length > 0 && (
                      <div className="flex items-center gap-2 mr-4">
                        <Badge variant="secondary">
                          {selectedRecordings.length} selected
                        </Badge>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={handleBulkDelete}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    )}
                    <div className="flex items-center border rounded-lg p-1">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid3X3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="bg-card rounded-2xl border border-border p-8 animate-scale-in">
                <h3 className="text-2xl font-bold mb-6">Analytics Dashboard</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-muted/20 rounded-xl">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      Usage Trends
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Recording activity over the last 30 days
                    </p>
                    <div className="mt-4 h-32 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg flex items-end justify-center">
                      <span className="text-xs text-muted-foreground">Chart placeholder</span>
                    </div>
                  </div>
                  <div className="p-4 bg-muted/20 rounded-xl">
                    <h4 className="font-semibold mb-2">Popular Content</h4>
                    <p className="text-sm text-muted-foreground">
                      Most viewed recordings this week
                    </p>
                    <div className="mt-4 space-y-2">
                      {recordings.slice(0, 3).map((rec, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="truncate">{rec.title}</span>
                          <span className="text-muted-foreground">{Math.floor(Math.random() * 100)} views</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="bg-card rounded-2xl border border-border p-8 animate-scale-in">
                <h3 className="text-2xl font-bold mb-6">Dashboard Settings</h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">Show Statistics</h4>
                      <p className="text-sm text-muted-foreground">Display stats cards at the top</p>
                    </div>
                    <Button
                      variant={showStats ? "default" : "outline"}
                      onClick={() => setShowStats(!showStats)}
                    >
                      {showStats ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Recordings Display */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Loading your recordings...</p>
              </div>
            </div>
          ) : sortedRecordings.length > 0 ? (
            <div className={`animate-fade-in ${
              viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
            }`}>
              {sortedRecordings.map((recording, index) => (
                <RecordingCard
                  key={recording.id || recording._id}
                  recording={recording} 
                  onDelete={handleDelete}
                  onShare={handleShare}
                  deleting={deleting === (recording.id || recording._id)}
                  viewMode={viewMode}
                  selected={selectedRecordings.includes(recording.id || recording._id)}
                  onSelect={(selected) => {
                    const id = recording.id || recording._id;
                    if (selected) {
                      setSelectedRecordings([...selectedRecordings, id]);
                    } else {
                      setSelectedRecordings(selectedRecordings.filter(s => s !== id));
                    }
                  }}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <EnhancedEmptyState searchTerm={searchTerm} />
          )}
        </div>
      </main>
    </div>
  );
};

const StatsCard = ({ icon, label, value, trend, trendUp }) => (
  <div className="bg-card rounded-2xl border border-border p-6 hover-lift hover:border-primary/30 transition-all duration-300 group">
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-xl bg-muted/50 group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
    <p className="text-3xl font-bold mb-2">{value}</p>
    {trend && (
      <div className={`flex items-center gap-1 text-xs ${
        trendUp ? "text-green-600" : "text-muted-foreground"
      }`}>
        {trendUp && <span>↗</span>}
        {trend}
      </div>
    )}
  </div>
);

const RecordingCard = ({ recording, onDelete, onShare, deleting, viewMode = "grid", selected, onSelect, index }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(recording.title || "");
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatSize = (bytes) => {
    if (!bytes) return "0 MB";
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const recordingId = recording.id || recording._id;
  const recordingUrl = recording.public_url || recording.url;

  const saveTitle = async () => {
    try {
      await recordingService.updateRecording(recordingId, { title: editedTitle });
      setIsEditing(false);
      toast({
        title: "Updated",
        description: "Recording title updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update title.",
        variant: "destructive",
      });
    }
  };

  if (viewMode === "list") {
    return (
      <div className={`bg-card rounded-xl border border-border p-4 hover:border-primary/30 transition-all duration-300 animate-fade-in ${
        selected ? "ring-2 ring-primary" : ""
      }`} style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="rounded border-border"
          />
          
          <div className="w-24 h-16 bg-muted rounded-lg flex items-center justify-center video-thumbnail">
            <Video className="h-6 w-6 text-muted-foreground/50" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="h-8"
                    onBlur={saveTitle}
                    onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                    autoFocus
                  />
                </div>
              ) : (
                <h3
                  className="font-semibold truncate cursor-pointer hover:text-primary"
                  onClick={() => setIsEditing(true)}
                >
                  {recording.title || "Untitled Recording"}
                </h3>
              )}
              <Badge variant="secondary" className="text-xs">
                {formatSize(recording.file_size)}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(recording.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(recording.duration)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{recording.title}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video bg-muted rounded-lg">
                  <video
                    src={recordingUrl}
                    controls
                    className="w-full h-full rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>

            <a href={recordingUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
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
              onClick={() => onDelete(recordingId, recording.storage_path)}
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
  }

  return (
    <div className={`group bg-card rounded-2xl border border-border overflow-hidden hover-lift hover:border-primary/50 transition-all duration-500 animate-bounce-in ${
      selected ? "ring-2 ring-primary" : ""
    }`} style={{ animationDelay: `${index * 0.1}s` }}>
      {/* Enhanced Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
        <Video className="h-12 w-12 text-muted-foreground/50 z-10" />
        
        {/* Overlay Controls */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-background/50 backdrop-blur-sm z-20">
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                  <Play className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{recording.title}</DialogTitle>
                </DialogHeader>
                <div className="aspect-video bg-muted rounded-lg">
                  <video
                    src={recordingUrl}
                    controls
                    className="w-full h-full rounded-lg"
                  />
                </div>
              </DialogContent>
            </Dialog>
            
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full"
              onClick={() => onShare(recording)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Selection Checkbox */}
        <div className="absolute top-3 left-3 z-30">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelect(e.target.checked)}
            className="w-4 h-4 rounded border-border bg-background/80"
          />
        </div>

        {/* Recording Duration Badge */}
        {recording.duration && (
          <div className="absolute bottom-3 right-3 z-30">
            <Badge className="bg-background/80 text-foreground">
              {formatDuration(recording.duration)}
            </Badge>
          </div>
        )}
      </div>

      {/* Enhanced Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          {isEditing ? (
            <Input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="text-lg font-semibold"
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === "Enter" && saveTitle()}
              autoFocus
            />
          ) : (
            <h3
              className="text-lg font-semibold mb-1 truncate cursor-pointer hover:text-primary transition-colors group"
              onClick={() => setIsEditing(true)}
            >
              {recording.title || "Untitled Recording"}
              <Edit className="h-4 w-4 opacity-0 group-hover:opacity-100 inline ml-2 transition-opacity" />
            </h3>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(recording.created_at)}
          </span>
          <Badge variant="outline" className="text-xs">
            {formatSize(recording.file_size)}
          </Badge>
        </div>

        {/* Enhanced Actions */}
        <div className="flex items-center gap-2">
          <a
            href={recordingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1"
          >
            <Button variant="outline" size="sm" className="w-full group/btn">
              <Download className="h-3 w-3 mr-1 group-hover/btn:animate-bounce" />
              Download
            </Button>
          </a>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(recordingId, recording.storage_path)}
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

const EnhancedEmptyState = ({ searchTerm }) => (
  <div className="text-center py-20 animate-fade-in">
    <div className="relative mb-8">
      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto animate-float">
        <Video className="h-16 w-16 text-primary" />
      </div>
      <div className="absolute inset-0 w-32 h-32 mx-auto rounded-full border-2 border-dashed border-primary/30 animate-pulse-ring"></div>
    </div>
    
    <h3 className="text-2xl font-bold mb-3">
      {searchTerm ? "No matching recordings" : "No recordings yet"}
    </h3>
    <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
      {searchTerm 
        ? `No recordings match "${searchTerm}". Try a different search term.`
        : "Start recording your screen to create amazing presentations, tutorials, and demos."
      }
    </p>
    
    {!searchTerm && (
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button asChild size="lg" className="glow-primary">
          <Link to="/record">
            <Video className="h-5 w-5 mr-2" />
            Create Your First Recording
          </Link>
        </Button>
        <Button variant="outline" size="lg">
          <Upload className="h-5 w-5 mr-2" />
          Import Recording
        </Button>
      </div>
    )}
  </div>
);

export default Dashboard;
