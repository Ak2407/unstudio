"use client";

import { useEffect, useRef } from "react";
import { fabric } from "fabric";
import ShapesContainer from "./shapes-container";
import { useImgStore } from "@/hooks/add-img-canvas";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

const CanvasBoard = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const deleteButtonRef = useRef<HTMLButtonElement | null>(null);
  const selectedImage = useImgStore((state) => state.selectedImage);
  const clearSelectedImage = useImgStore((state) => state.clearSelectedImage);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = new fabric.Canvas(canvasRef.current);
      fabricCanvasRef.current = canvas;

      canvas.backgroundColor = "black";
      fabricCanvasRef.current.renderAll();

      // Handle object selection
      canvas.on("selection:created", (e) => {
        if (e.selected && e.selected.length > 0) {
          const selectedObject = e.selected[0];
          if (selectedObject && deleteButtonRef.current) {
            const { left, top, width, height } =
              selectedObject.getBoundingRect();
            deleteButtonRef.current.style.left = `${left + width / 5}px`;
            deleteButtonRef.current.style.top = `${top - height / 2}px`;
            deleteButtonRef.current.style.display = "block";

            deleteButtonRef.current.onclick = () => {
              canvas.remove(selectedObject);
              if (deleteButtonRef.current)
                deleteButtonRef.current.style.display = "none";
            };
          }
        }
      });

      canvas.on("selection:cleared", () => {
        if (deleteButtonRef.current) {
          deleteButtonRef.current.style.display = "none";
        }
      });

      // Cleanup
      return () => {
        canvas.dispose();
      };
    }
  }, []);
  useEffect(() => {
    if (selectedImage && fabricCanvasRef.current) {
      fabric.Image.fromURL(selectedImage, (img) => {
        img.scaleToWidth(200);
        img.scaleToHeight(200);
        fabricCanvasRef.current?.add(img);
        fabricCanvasRef.current?.renderAll();
        clearSelectedImage();
      });
    }
  }, [selectedImage]);

  const addRect = () => {
    if (fabricCanvasRef.current) {
      const rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "red",
        width: 100,
        height: 100,
      });

      fabricCanvasRef.current.add(rect);
      fabricCanvasRef.current.renderAll();
    }
  };

  const addCircle = () => {
    if (fabricCanvasRef.current) {
      const circle = new fabric.Circle({
        radius: 50,
        fill: "red",
        stroke: "red",
        strokeWidth: 3,
      });

      fabricCanvasRef.current.add(circle);
      fabricCanvasRef.current.renderAll();
    }
  };

  const addLine = () => {
    if (fabricCanvasRef.current) {
      const line = new fabric.Line([50, 10, 200, 150], {
        stroke: "red",
      });
      fabricCanvasRef.current.add(line);
      fabricCanvasRef.current.renderAll();
    }
  };

  const addTriangle = () => {
    if (fabricCanvasRef.current) {
      const triangle = new fabric.Triangle({
        width: 150,
        height: 100,
        fill: "red",
        stroke: "red",
        strokeWidth: 3,
        angle: 45,
      });
      fabricCanvasRef.current.add(triangle);
      fabricCanvasRef.current.renderAll();
    }
  };

  return (
    <div className="relative flex items-center justify-center flex-col gap-6">
      <ShapesContainer
        addTriangle={addTriangle}
        addLine={addLine}
        addCircle={addCircle}
        addRect={addRect}
      />
      <canvas ref={canvasRef} width={1000} height={700} />
      <Button
        ref={deleteButtonRef}
        variant="destructive"
        className="absolute hidden"
        size="sm"
      >
        <XCircle className="h-4 w-4" />
      </Button>
      {/* <button */}
      {/*   ref={deleteButtonRef} */}
      {/*   className="absolute z-10 bg-red-500 text-white px-2 py-1 rounded hidden" */}
      {/*   style={{ display: "none", position: "absolute" }} */}
      {/* > */}
      {/*   Delete */}
      {/* </button> */}
    </div>
  );
};

export default CanvasBoard;
