import { apiClient } from "@/api/client";

export const recordingService = {
  // Upload recording to Express backend
  async uploadRecording(blob, fileName, userId) {
    try {
      if (!blob || blob.size <= 0) {
        throw new Error('Recording is empty. Please record for at least a few seconds before uploading.');
      }

      const normalizedType = blob.type?.startsWith('video/') ? blob.type : 'video/webm';
      const uploadFile = new File([blob], fileName, { type: normalizedType });

      const formData = new FormData();
      formData.append('recording', uploadFile);
      formData.append('title', fileName.replace(/\.[^/.]+$/, "")); // Remove extension for title
      formData.append('duration', '0'); // Will be updated by client if needed

      const response = await apiClient.uploadRecording(formData);

      return {
        path: response.recording.filePath,
        url: response.url || response.public_url,
        public_url: response.public_url || response.url,
        fileName: response.recording.fileName,
        recordingId: response.recording._id,
      };
    } catch (error) {
      console.error("Upload error:", error);
      throw error;
    }
  },

  // Save recording metadata to database (now handled in upload)
  async saveRecordingMetadata(userId, recording) {
    try {
      // In MERN stack, this is handled during upload
      // If we need to update metadata after upload, we can use updateRecording
      if (recording.recordingId) {
        const updates = {};
        if (recording.title) updates.title = recording.title;
        if (recording.description) updates.description = recording.description;
        
        if (Object.keys(updates).length > 0) {
          const response = await apiClient.updateRecording(recording.recordingId, updates);
          return response.recording;
        }
      }
      
      return recording;
    } catch (error) {
      console.error("Save metadata error:", error);
      throw error;
    }
  },

  // Get user recordings
  async getUserRecordings(userId, page = 1, limit = 10) {
    try {
      const response = await apiClient.getUserRecordings(page, limit);
      return response.recordings;
    } catch (error) {
      console.error("Get recordings error:", error);
      throw error;
    }
  },

  // Delete recording
  async deleteRecording(recordingId) {
    try {
      await apiClient.deleteRecording(recordingId);
      return { success: true };
    } catch (error) {
      console.error("Delete recording error:", error);
      throw error;
    }
  },

  // Get single recording
  async getRecording(recordingId) {
    try {
      const response = await apiClient.getRecording(recordingId);
      return response.recording;
    } catch (error) {
      console.error("Get recording error:", error);
      throw error;
    }
  },

  // Update recording
  async updateRecording(recordingId, updates) {
    try {
      const response = await apiClient.updateRecording(recordingId, updates);
      return response.recording;
    } catch (error) {
      console.error("Update recording error:", error);
      throw error;
    }
  },

  // Get public recordings
  async getPublicRecordings(page = 1, limit = 10) {
    try {
      const response = await apiClient.getPublicRecordings(page, limit);
      return response.recordings;
    } catch (error) {
      console.error("Get public recordings error:", error);
      throw error;
    }
  }
};
