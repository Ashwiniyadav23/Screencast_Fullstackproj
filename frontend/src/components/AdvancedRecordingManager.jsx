import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Folder, 
  Plus, 
  Search, 
  Filter, 
  Tag, 
  Calendar, 
  Clock, 
  FileVideo,
  Edit3,
  Archive,
  Star,
  Share2,
  Download,
  Trash2,
  Eye,
  Settings,
  TrendingUp,
  BarChart3
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdvancedRecordingManager = ({ recordings, onUpdateRecording, onDeleteRecording }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("created_at");
  const [selectedRecordings, setSelectedRecordings] = useState([]);
  const { toast } = useToast();

  // Mock folders data
  const [folders, setFolders] = useState([
    { id: "all", name: "All Recordings", count: recordings?.length || 0, color: "blue" },
    { id: "tutorials", name: "Tutorials", count: 5, color: "green" },
    { id: "presentations", name: "Presentations", count: 3, color: "purple" },
    { id: "demos", name: "Product Demos", count: 2, color: "orange" },
  ]);

  // Mock tags
  const availableTags = [
    "tutorial", "presentation", "demo", "meeting", "webinar", 
    "product", "feature", "bug-report", "training", "overview"
  ];

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder = {
      id: newFolderName.toLowerCase().replace(/\s+/g, '-'),
      name: newFolderName,
      count: 0,
      color: "blue"
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName("");
    setShowCreateFolder(false);
    
    toast({
      title: "Folder Created",
      description: `"${newFolderName}" folder has been created.`
    });
  };

  const handleBulkAction = async (action) => {
    if (selectedRecordings.length === 0) return;

    switch (action) {
      case "delete":
        try {
          await Promise.all(selectedRecordings.map(id => onDeleteRecording(id)));
          setSelectedRecordings([]);
          toast({
            title: "Recordings Deleted",
            description: `${selectedRecordings.length} recordings have been deleted.`
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "Failed to delete some recordings.",
            variant: "destructive"
          });
        }
        break;
      case "archive":
        toast({
          title: "Recordings Archived",
          description: `${selectedRecordings.length} recordings have been archived.`
        });
        break;
      case "move":
        toast({
          title: "Move to Folder",
          description: "Select a folder to move recordings to."
        });
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Advanced Search & Filter Bar */}
      <div className="bg-card rounded-2xl border border-border p-6 glass-strong">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search recordings, folders, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Filter by Tags */}
          <div className="flex items-center gap-2">
            <Label className="text-sm font-medium">Tags:</Label>
            <div className="flex flex-wrap gap-2">
              {availableTags.slice(0, 4).map(tag => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => {
                    if (selectedTags.includes(tag)) {
                      setSelectedTags(selectedTags.filter(t => t !== tag));
                    } else {
                      setSelectedTags([...selectedTags, tag]);
                    }
                  }}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              <Dialog>
                <DialogTrigger asChild>
                  <Badge variant="outline" className="cursor-pointer">
                    <Plus className="h-3 w-3 mr-1" />
                    More
                  </Badge>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filter by Tags</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-3 gap-2">
                    {availableTags.map(tag => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer justify-center"
                        onClick={() => {
                          if (selectedTags.includes(tag)) {
                            setSelectedTags(selectedTags.filter(t => t !== tag));
                          } else {
                            setSelectedTags([...selectedTags, tag]);
                          }
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedRecordings.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2">
              <Badge className="bg-primary/20 text-primary">
                {selectedRecordings.length} selected
              </Badge>
              <span className="text-sm text-muted-foreground">recordings</span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("move")}
              >
                Move to Folder
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkAction("archive")}
              >
                <Archive className="h-4 w-4 mr-1" />
                Archive
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleBulkAction("delete")}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Folders & Organization */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Folder Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Folders</h3>
              <Dialog open={showCreateFolder} onOpenChange={setShowCreateFolder}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="ghost">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Folder</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="folder-name">Folder Name</Label>
                      <Input
                        id="folder-name"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        placeholder="Enter folder name..."
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleCreateFolder}>Create</Button>
                      <Button variant="outline" onClick={() => setShowCreateFolder(false)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="space-y-2">
              {folders.map(folder => (
                <div
                  key={folder.id}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    selectedFolder === folder.id 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedFolder(folder.id)}
                >
                  <div className="flex items-center gap-2">
                    <Folder className="h-4 w-4" />
                    <span className="text-sm font-medium">{folder.name}</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {folder.count}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-border">
              <h4 className="text-sm font-medium mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Star className="h-4 w-4 mr-2" />
                  Starred
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <Archive className="h-4 w-4 mr-2" />
                  Archived
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="recordings" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="recordings">Recordings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recordings" className="mt-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">
                    {selectedFolder === "all" ? "All Recordings" : folders.find(f => f.id === selectedFolder)?.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      Date Range
                    </Button>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                {recordings && recordings.length > 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileVideo className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Recordings will be displayed here with advanced filtering and organization.</p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <Folder className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h4 className="text-lg font-semibold mb-2">No recordings in this folder</h4>
                    <p className="text-muted-foreground mb-4">
                      Start recording or move existing recordings to this folder.
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Recording
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-6">Recording Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center p-4 bg-muted/20 rounded-xl">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold">+15%</div>
                    <div className="text-sm text-muted-foreground">This month</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-xl">
                    <Eye className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold">1,234</div>
                    <div className="text-sm text-muted-foreground">Total views</div>
                  </div>
                  <div className="text-center p-4 bg-muted/20 rounded-xl">
                    <Clock className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <div className="text-2xl font-bold">45m</div>
                    <div className="text-sm text-muted-foreground">Avg. length</div>
                  </div>
                </div>
                
                <div className="h-64 bg-muted/20 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">Analytics Dashboard Coming Soon</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="mt-6">
              <div className="bg-card rounded-2xl border border-border p-6">
                <h3 className="text-lg font-semibold mb-6">Recording Settings</h3>
                
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Default Recording Quality</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Choose the default quality for new recordings
                    </p>
                    <div className="flex gap-2">
                      <Badge variant="outline">720p</Badge>
                      <Badge>1080p (Recommended)</Badge>
                      <Badge variant="outline">4K</Badge>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Auto-Upload</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Automatically upload recordings to cloud storage
                    </p>
                    <Button variant="outline">Enable Auto-Upload</Button>
                  </div>
                  
                  <div>
                    <Label className="text-base font-medium">Storage Management</Label>
                    <p className="text-sm text-muted-foreground mb-3">
                      Manage your storage usage and cleanup old files
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline">View Storage Usage</Button>
                      <Button variant="outline">Cleanup Old Files</Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdvancedRecordingManager;