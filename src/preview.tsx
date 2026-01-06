import { useLocation, useNavigate } from "react-router";
import { Button } from "./components/ui/button";
import { useEffect } from "react";

export function Preview() {
  const location = useLocation();
  const navigate = useNavigate();

  const { image } = location.state as {
    image: string;
  };

  // Redirect to home if no image
  useEffect(() => {
    if (!image) navigate("/");
  }, [image, navigate]);

  if (!image) return null;

  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-100">
      <div className="shrink-0 p-4">
        <Button onClick={() => navigate("/")} className="h-12">
          Back
        </Button>
      </div>

      <div className="flex-1 flex justify-center items-center p-2 overflow-auto">
        <div className="relative w-full max-w-screen-xl aspect-video">
          <img
            src={image}
            alt="Uploaded"
            className="absolute inset-0 w-full h-full object-contain rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
