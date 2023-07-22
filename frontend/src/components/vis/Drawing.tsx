import { useEffect, useRef } from "react";
import { Paper } from "@mui/material";
import { Edge, Network, Node, Options } from "vis-network";
import { NodeType } from "../../domain/types";

type DrawingType = {
  nods: NodeType[];
};

interface DrawingNode extends Node {
  url: string;
  links: string[];
};

export default function Drawing({ nods }: DrawingType): JSX.Element {

  const vis = useRef<HTMLInputElement>(null);

  useEffect(() => {

    const nodes: DrawingNode[] = nods.map((nod, i) => (
      {
        id: i,
        color: nod.crawlable ? "#eb7134" : undefined,
        links: [...nod.links],
        label: nod.title ?? nod.url,
        url: nod.url,
      }
    ));

    const items = nodes.reduce((acc, node, i) => acc.set(node.url, i), new Map<string, number>())

    const edges: Edge[] = nodes.map((node, i) => node.links.map((link) => (
      { from: i, to: items.get(link)! }
    ))).flat();

    const options: Options = {
      nodes: {
        font: {
          size: 10,
        },
        size: 15,
        shape: "dot",
      },
      edges: {
        arrows: {
          to: {
            enabled: true,
          }
        },
        color: {
          color: "lightgray",
          opacity: 0.5,
        },
        length: 1000,
        smooth: true,
      },
      interaction: {
        hideEdgesOnDrag: true,
      },
      layout: {
        randomSeed: 0,
        improvedLayout: false,
      },
      physics: {
        enabled: false,
        repulsion: {
          nodeDistance: 1000,
        }
      }
    };

    const network = vis.current && new Network(vis.current, { nodes, edges }, options);
    network?.on("doubleClick", (e) => console.log(e));
    network?.stabilize(10);

  }, [nods, vis]);

  return (
    <Paper
        ref={vis}
        sx={{ width: "100%", height: "500px" }}
      />
  );
}
