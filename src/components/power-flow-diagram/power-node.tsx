import { Handle, type Node, type NodeProps, Position } from "@xyflow/react";

import { cn } from "@/lib/utils";

type PowerNodeData = {
  className?: string;
  label: string;
  icon?: React.ReactNode;
};

const PowerNode = ({
  data,
  targetPosition = Position.Left,
  sourcePosition = Position.Right,
}: NodeProps<Node<PowerNodeData>>) => {
  return (
    <>
      <Handle id={"b"} type="target" position={sourcePosition} />
      <Handle id={"a"} type="target" position={targetPosition} />
      <div
        className={cn(
          "backdrop-blur-md border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
          "size-16 flex justify-center items-center border rounded-full",
          data.className,
        )}
      >
        <div className="flex flex-col items-center">
          {data.icon}
          <span className="text-xs font-medium">{data.label}</span>
        </div>
      </div>
      <Handle id={"a"} type="source" position={sourcePosition} />
      <Handle id={"b"} type="source" position={targetPosition} />
    </>
  );
};

export default PowerNode;
