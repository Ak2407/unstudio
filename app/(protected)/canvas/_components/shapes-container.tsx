import { Button } from "@/components/ui/button";
import {
  Circle,
  Minus,
  RectangleHorizontal,
  Triangle,
  Upload,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


type ShapesContainerProps = {
  addCircle: () => void;
  addRect: () => void;
  addLine: () => void;
  addTriangle: () => void;

};


const ShapesContainer = ({
  addTriangle,
  addLine,
  addRect,
  addCircle
}: ShapesContainerProps) => {
  return (
    <div className="  border-border  p-4 w-full flex items-center justify-center ">
      <div className="m-auto border-border border-[1px] flex items-center justify-evenly gap-8 rounded-full  px-6 py-4 ">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Circle className="h-6 w-6" onClick={addCircle} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Circle</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <RectangleHorizontal className="h-6 w-6" onClick={addRect}/>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Rectangle</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Minus className="h-6 w-6" onClick={addLine}/>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Line</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger>
              <Triangle className="h-6 w-6" onClick={addTriangle} />
            </TooltipTrigger>
            <TooltipContent>
              <p>Add Triangle</p>
            </TooltipContent>
          </Tooltip>

        </TooltipProvider>
      </div>
    </div>
  );
};

export default ShapesContainer;
