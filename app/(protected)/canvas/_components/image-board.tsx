import { uploadImage } from "@/actions/uploadImage"
import Image from "next/image"
import { useEffect, useState } from "react"

const ImageBoard = () => {

  const [images, setImages] = useState([])

  useEffect(() => {

  const getImg = async () => {
      const imgs = await uploadImage()
      if(imgs){
        console.log(imgs)
      } 
  }
    
  }, [])
  

  return (
    <div className="p-4  gap-4  grid grid-cols-2 ">

      <Image
        src="https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
        height={100}
        width={150}
        className="aspect-video"
        alt="flower"
      />
    </div>
  )
}

export default ImageBoard
