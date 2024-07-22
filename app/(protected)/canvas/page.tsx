"use client";

import { useEffect, useState } from "react";
import CanvasBoard from "./_components/canvas-board";


const CanvasPage = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

  }, [setMounted])

  return (
    <div className="flex items-center justify-center p-6">
      <CanvasBoard />
    </div>
  );
};

export default CanvasPage;
