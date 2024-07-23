"use client";

import { Separator } from "@/components/ui/separator";
import { UploadButton } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/actions/uploadImage";
import { useImgStore } from "@/hooks/add-img-canvas";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

const Sidebar = () => {
  const [images, setImages] = useState<
    { id: string; url: string; userId: string; createdAt: Date }[]
  >([]);
  const setSelectedImage = useImgStore((state) => state.setSelectedImage);
  const [uploading, setUploading] = useState<boolean>(false);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const getImg = async () => {
      const imgs = await uploadImage();
      if (Array.isArray(imgs)) {
        setImages(imgs);
      } else {
        console.error(imgs.error);
      }
    };
    getImg();
  }, []);

  const router = useRouter();

  const handleFileChange = (e: any) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/s3-upload-img", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data.status);
      setUploading(false);
      location.reload();
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  return (
    <div className=" flex flex-col items-center  border-r border-gray-200 h-screen overflow-y-auto ">
      <div className="  flex items-center justify-center w-full flex-col gap-4 bg-white p-2 ">
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <form
          className=" flex flex-col items-center justify-center gap-4"
          onSubmit={handleSubmit}
        >
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hover:cursor-pointer"
          />
          <Button
            type="submit"
            disabled={!file || uploading}
            variant="outline"
            size="sm"
          >
            {uploading ? (
              "Uploading..."
            ) : (
              <div className="flex items-center justify-center gap-4">
                <h1>Upload</h1>
                <UploadIcon className="h-4 w-4" />
              </div>
            )}
          </Button>
        </form>
        {/* <UploadButton  endpoint="imageUploader" onClientUploadComplete={()=> {
          router.refresh()
        }}/> */}
      </div>
      <Separator className="mt-4" />
      {/* {isMounted? <ImageBoard/> : <></>} */}
      <div className="p-4  gap-4  grid grid-cols-2 ">
        {images.map((img, index) => (
          <Image
            onClick={() => setSelectedImage(img.url)}
            key={index}
            src={img.url}
            height={100}
            width={150}
            className="aspect-video cursor-pointer hover:opacity-80"
            alt="img-1"
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
