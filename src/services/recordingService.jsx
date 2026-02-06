import { supabase } from "@/integrations/supabase/client";

export const recordingService = {
  // Upload recording to Supabase storage
  async uploadRecording(blob, fileName, userId) {
    try {
      const filePath = `${userId}/${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from("recordings")
        .upload(filePath, blob, {
          contentType: "video/webm",
          upsert: false,
        });

      if (uploadError) {
        if (uploadError.message.includes("Bucket not found")) {
          throw new Error(
            'Storage bucket "recordings" not found. Please create it in Supabase Storage and ensure it is set to Public.'
          );
        }
        throw uploadError;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("recordings")
        .getPublicUrl(filePath);

      return {
        path: filePath,
        url: publicUrlData.publicUrl,
        fileName: fileName,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },

  // Save recording metadata to database
  async saveRecordingMetadata(userId, recording) {
    try {
      const { data, error } = await supabase
        .from("recordings")
        .insert([
          {
            user_id: userId,
            title: recording.title || "Untitled Recording",
            storage_path: recording.path,
            file_size: recording.fileSize,
            duration: recording.duration,
            public_url: recording.url,
          },
        ])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error("Metadata save error:", error);
      throw error;
    }
  },

  // Get user's recordings
  async getUserRecordings(userId) {
    try {
      const { data, error } = await supabase
        .from("recordings")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  },

  // Delete recording
  async deleteRecording(recordingId, storagePath) {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("recordings")
        .remove([storagePath]);

      if (storageError) throw storageError;

      // Delete database record
      const { error: dbError } = await supabase
        .from("recordings")
        .delete()
        .eq("id", recordingId);

      if (dbError) throw dbError;
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  },

  // Generate downloadable link (already public, but here for convenience)
  getDownloadUrl(publicUrl) {
    return publicUrl;
  },
};
