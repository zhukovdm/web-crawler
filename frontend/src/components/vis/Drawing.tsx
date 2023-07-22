import { useEffect, useRef } from "react";
import { Paper } from "@mui/material";
import { Edge, Network, Node, Options } from "vis-network";
import { NodeType } from "../../domain/types";
import { useAppDispatch } from "../../store";
import { setNode } from "../../store/visSlice";

type DrawingType = {
  nods: NodeType[];
};

interface DrawingNode extends Node {
  url: string;
  links: string[];
};

export default function Drawing({ nods }: DrawingType): JSX.Element {

  const dispatch = useAppDispatch();
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

    const items = nodes.reduce((acc, nod, i) => acc.set(nod.url, i), new Map<string, number>())

    const edges: Edge[] = nodes.map((nod, i) => nod.links.map((link) => (
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
            scaleFactor: 0.5,
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
    network?.stabilize(10);
    network?.on("doubleClick", (e) => {
      const i = e.nodes[0];
      if (i !== undefined) {

        const nod = nods[i]!;
        dispatch(setNode({
          ...nod,
          links: [...nod.links],
          owners: [...nod.owners.values()]
        }));
      }
    });
  }, [dispatch, vis, nods]);

  return (
    <Paper
      ref={vis}
      sx={{ width: "100%", height: "500px" }}
    />
  );
}
