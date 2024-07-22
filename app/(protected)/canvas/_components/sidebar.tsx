"use client"

import { Separator } from "@/components/ui/separator";
import { UploadButton } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { uploadImage } from "@/actions/uploadImage";
import {useImgStore} from "@/hooks/add-img-canvas"


const Sidebar = () => {

  const [images, setImages] = useState<{ id: string; url: string; userId: string; createdAt: Date }[]>([]);
  const setSelectedImage = useImgStore((state) => state.setSelectedImage) 

  useEffect(() => {

  const getImg = async () => {
      const imgs = await uploadImage();
      if (Array.isArray(imgs)) {
        setImages(imgs);
      } else {
        console.error(imgs.error);
      }
  }
    getImg()
    
  }, [])

  const router = useRouter()
  return (
    <div className=" flex flex-col items-center  border-r border-gray-200 h-screen overflow-y-auto ">
      <div className="  flex items-center justify-center w-full flex-col gap-4 bg-white ">
        <h1 className="text-2xl font-semibold">Gallery</h1>
        <UploadButton  endpoint="imageUploader" onClientUploadComplete={()=> {
          router.refresh()
        }}/>
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
          className="aspect-video cursor-pointer"
          alt="img-1"
        />
        ))}

      </div>
    </div>
  );
};

export default Sidebar;