import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type Edge,
  type EdgeProps,
} from "@xyflow/react";

import { formatPower } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";

type PowerEdgeData = {
  value: number;
  metric: string;
};

const PowerEdge = ({
  id,
  data,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  ...props
}: EdgeProps<Edge<PowerEdgeData>>) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <BaseEdge id={id} path={edgePath} {...props} />

      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: "all",
          }}
        >
          <Badge variant="secondary" className="mb-1 text-xs font-medium">
            {data ? formatPower(data.value) : ""}
          </Badge>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default PowerEdge;
