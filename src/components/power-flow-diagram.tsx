import "@xyflow/react/dist/style.css";

import {
  MarkerType,
  Position,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type EdgeTypes,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import React from "react";
import { useAtomValue } from "jotai";

import { powerFlowEdgesAtom } from "@/integrations/jotai/store";

import {
  BatteryMediumIcon,
  BoxIcon,
  ServerIcon,
  SolarPanelIcon,
  UtilityPoleIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";

import PowerNode from "./power-flow-diagram/power-node";
import PowerEdge from "./power-flow-diagram/power-edge";

const nodeTypes: NodeTypes = {
  powerNode: PowerNode,
};

const edgeTypes: EdgeTypes = {
  powerEdge: PowerEdge,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "powerNode",
    data: { label: "Grid", icon: <UtilityPoleIcon className="size-4" /> },
    position: { x: -200, y: -100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Right,
  },
  {
    id: "2",
    type: "powerNode",
    data: { label: "PV", icon: <SolarPanelIcon className="size-4" /> },
    position: { x: -200, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Right,
  },
  {
    id: "3",
    type: "powerNode",
    data: { label: "Battery", icon: <BatteryMediumIcon className="size-4" /> },
    position: { x: -200, y: 100 },
    sourcePosition: Position.Right,
    targetPosition: Position.Right,
  },
  {
    id: "4",
    type: "powerNode",
    data: { label: "Inverter", icon: <BoxIcon className="size-4" /> },
    position: { x: 0, y: 0 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
  },
  {
    id: "5",
    type: "powerNode",
    data: { label: "Server 1", icon: <ServerIcon className="size-4" /> },
    position: { x: 200, y: -150 },
    sourcePosition: Position.Left,
    targetPosition: Position.Left,
  },
  {
    id: "6",
    type: "powerNode",
    data: { label: "Server 2", icon: <ServerIcon className="size-4" /> },
    position: { x: 200, y: -75 },
    sourcePosition: Position.Left,
    targetPosition: Position.Left,
  },
  {
    id: "7",
    type: "powerNode",
    data: { label: "Server 3", icon: <ServerIcon className="size-4" /> },
    position: { x: 200, y: 0 },
    sourcePosition: Position.Left,
    targetPosition: Position.Left,
  },
  {
    id: "8",
    type: "powerNode",
    data: { label: "Server 4", icon: <ServerIcon className="size-4" /> },
    position: { x: 200, y: 75 },
    sourcePosition: Position.Left,
    targetPosition: Position.Left,
  },
  {
    id: "9",
    type: "powerNode",
    data: { label: "Server 5", icon: <ServerIcon className="size-4" /> },
    position: { x: 200, y: 150 },
    sourcePosition: Position.Left,
    targetPosition: Position.Left,
  },
];
const initialEdges: Edge[] = [
  {
    id: "e1-4",
    type: "powerEdge",
    source: "1",
    sourceHandle: "a",
    target: "4",
    targetHandle: "a",
    data: { value: 0 },
    animated: true,
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e2-4",
    type: "powerEdge",
    source: "2",
    sourceHandle: "a",
    target: "4",
    targetHandle: "a",
    data: { value: 0 },
    animated: true,
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e3-4",
    type: "powerEdge",
    source: "3",
    sourceHandle: "a",
    target: "4",
    targetHandle: "a",
    data: { value: 0 },
    animated: true,
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e4-3",
    type: "powerEdge",
    source: "4",
    sourceHandle: "b",
    target: "3",
    targetHandle: "b",
    data: { value: 0 },
    animated: true,
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e4-5",
    type: "powerEdge",
    source: "4",
    sourceHandle: "a",
    target: "5",
    targetHandle: "a",
    data: { value: 0 },
    animated: true,
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e4-6",
    type: "powerEdge",
    source: "4",
    sourceHandle: "a",
    target: "6",
    targetHandle: "a",
    data: { value: 0 },
    animated: true,
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e4-7",
    type: "powerEdge",
    source: "4",
    sourceHandle: "a",
    target: "7",
    targetHandle: "a",
    data: { value: 0 },
    animated: true,
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e4-8",
    type: "powerEdge",
    source: "4",
    sourceHandle: "a",
    target: "8",
    targetHandle: "a",
    data: { value: 0 },
    animated: true,
    markerEnd: { type: MarkerType.Arrow },
  },
  {
    id: "e4-9",
    type: "powerEdge",
    source: "4",
    sourceHandle: "a",
    target: "9",
    targetHandle: "a",
    data: { value: 0 },
    animated: true,
    markerEnd: { type: MarkerType.Arrow },
  },
];

export function PowerFlowDiagram() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const flowLogic = useAtomValue(powerFlowEdgesAtom);

  // Sync calculations to the visual edges
  React.useEffect(() => {
    setEdges((prevEdges) =>
      prevEdges.map((edge) => {
        const rule = flowLogic.find((r) => r.id === edge.id);

        if (rule) {
          return {
            ...edge,
            hidden: !rule.show, // Hide line if rule not met
            animated: rule.show, // Only animate if flowing
            data: {
              ...edge.data,
              value: Math.max(0, rule.val), // Update power value
              metric: "W", // Your Python logic uses Watts
            },
          };
        }
        return edge;
      }),
    );
  }, [flowLogic, setEdges]);

  return (
    <Card className="border-border/50 bg-card p-0">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        panOnDrag={false}
        panOnScroll={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        attributionPosition="bottom-right"
        fitView
        className="w-full min-h-96"
      />
    </Card>
  );
}
