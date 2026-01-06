import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import {
  useDropzone,
  Dropzone,
  DropzoneMessage,
  DropzoneTrigger,
  DropzoneRemoveFile,
} from "@/components/ui/dropzone";
import { IconCloudUp, IconTrash } from "@tabler/icons-react";
import { Button } from "./components/ui/button";
import { toast } from "sonner";

export function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const dropzone = useDropzone({
    onDropFile: async (file: File) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return {
        status: "success",
        result: URL.createObjectURL(file),
      };
    },
    validation: {
      accept: { "image/*": [".png", ".jpg", ".jpeg"] },
      maxFiles: 1,
    },
    shiftOnMaxFiles: true,
  });

  const submit = async () => {
    const fileStatus = dropzone.fileStatuses[0];
    const file = fileStatus?.file;

    if (!file) {
      alert("Please select an image first!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Get the processed image with bounding boxes
      const res = await axios.post("http://localhost:8000/predict", formData, {
        responseType: "blob", // important to get image as blob
      });

      const imageUrl = URL.createObjectURL(res.data);

      // Navigate to preview page with the backend-processed image
      navigate("/preview", {
        state: {
          image: imageUrl,
        },
      });
    } catch (err) {
      const axiosError = err as any;
      toast.error("Upload failed", {
        description: axiosError.response?.data?.detail || axiosError.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      <h1 className="text-4xl font-bold text-center p-4">
        Parasitic Eggs Detection
      </h1>

      {/* Dropzone */}
      <div className="flex-1 flex items-center justify-center p-4">
        <Dropzone {...dropzone}>
          <DropzoneMessage />

          <div className="relative w-full h-full max-w-4xl rounded-xl border-2 border-dashed bg-white overflow-hidden">
            {dropzone.fileStatuses.length === 0 && (
              <DropzoneTrigger className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center bg-transparent">
                <IconCloudUp className="size-12" />
                <div>
                  <p className="font-semibold text-lg">Upload Image</p>
                  <p className="text-sm text-muted-foreground">
                    Click or drag and drop
                  </p>
                </div>
              </DropzoneTrigger>
            )}

            {dropzone.fileStatuses.map((file) => (
              <div key={file.id} className="absolute inset-0">
                {file.status === "pending" && (
                  <div className="absolute inset-0 animate-pulse bg-black/20" />
                )}
                {file.status === "success" && (
                  <img
                    src={file.result}
                    alt={file.fileName}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <DropzoneRemoveFile className="absolute right-3 top-3 rounded-md p-1 backdrop-blur">
                  <IconTrash className="size-5" />
                </DropzoneRemoveFile>
              </div>
            ))}
          </div>
        </Dropzone>
      </div>

      {/* Submit button */}
      <div className="w-full p-4 flex justify-center">
        <Button
          onClick={submit}
          disabled={dropzone.fileStatuses.length === 0 || loading}
          className="w-full max-w-md h-16 text-lg"
        >
          {loading ? "Processing..." : "Submit"}
        </Button>
      </div>
    </div>
  );
}
