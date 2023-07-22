import {
  ChangeEvent,
  useEffect,
  useState
} from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField
} from "@mui/material";
import {
  NodeApiType,
  NodeType,
  WebsiteReducedType
} from "../../domain/types";
import {
  useAppSelector
} from "../../store";
import {
  GraphQlService
} from "../../services/graphql";
import Drawing from "./Drawing";

type ModeType = "static" | "live";

type ViewType = "domain" | "website";

function timeComparator(ln: NodeApiType, rn: NodeApiType): number {
  if (ln.crawlTime === null) { return +1; }
  if (rn.crawlTime === null) { return -1; }

  const ld = new Date(ln.crawlTime);
  const rd = new Date(rn.crawlTime);

  if (ld > rd) { return -1; }
  if (rd > ld) { return +1; }
  return 0;
}

function getView(nodeUrl: string, view: ViewType): string {
  return view === "website"
    ? nodeUrl
    : new URL(nodeUrl).hostname;
}

function getTitle(nodeTitle: string | null, view: ViewType): string | null {
  return view === "website" ? nodeTitle : null;
}

export default function Visualisation(): JSX.Element {

  const {
    websites,
    selection
  } = useAppSelector((state) => state.vis);

  const [tick, setTick] = useState(3);
  const [nods, setNods] = useState<NodeType[]>([]);
  const [mode, setMode] = useState<ModeType>("static");
  const [view, setView] = useState<ViewType>("website");

  useEffect(() => {
    const f = async () => {

      const ws = (selection.map((s, i) => [s, i]) as [boolean, number][])
        .filter(([s, _]) => s)
        .map(([_, i]) => websites[i]!.recId);

      const ns = (await GraphQlService.getNodes(ws))
        .sort(timeComparator)
        .reduce((acc, n) => {

          const url = getView(n.url, view);
          const title = getTitle(n.title, view);
          const {
            crawlTime,
            owner
          } = n;
          const crawlable = new RegExp(n.owner.regexp).test(n.url);
          const links = n.links.map((link) => getView(link.url, view));

          const baseNode: NodeType = acc.get(url) ?? {
            url: url,
            title: title,
            crawlTime: crawlTime,
            crawlable: crawlable,
            links: new Set(links),
            owners: new Map<number, WebsiteReducedType>(
              [[owner.recId, owner]])
          };

          baseNode.title = baseNode.title ?? title;
          baseNode.crawlTime = baseNode.crawlTime ?? crawlTime;
          baseNode.crawlable = baseNode.crawlable || crawlable;
          links.forEach((link) => baseNode.links.add(link));
          baseNode.owners.set(owner.recId, owner);

          // remove loops
          baseNode.links.delete(baseNode.url);

          return acc.set(baseNode.url, baseNode);

        }, new Map<string, NodeType>());

      setNods([...ns.values()]);
    };

    f();
  }, [websites, selection, view]);

  return (
    <Stack direction={"column"} gap={2}>
      <Stack
        gap={8}
        direction={"row"}
        justifyContent={"center"}
      >
        <FormControl>
          <FormLabel>View</FormLabel>
          <RadioGroup
            row
            value={view}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setView(e.target.value as ViewType);
            }}
          >
            <FormControlLabel
              value={"website"}
              label={"Website"}
              control={<Radio />}
            />
            <FormControlLabel
              value={"domain"}
              label={"Domain"}
              control={<Radio />}
            />
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Mode</FormLabel>
          <RadioGroup
            row
            value={mode}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setMode(e.target.value as ModeType);
            }}
          >
            <FormControlLabel
              value={"static"}
              label={"Static"}
              control={<Radio />}
            />
            <FormControlLabel
              value={"live"}
              label={"Live"}
              control={<Radio />}
            />
          </RadioGroup>
        </FormControl>
        <Box display={"flex"} alignItems={"center"}>
          <TextField
            size={"small"}
            type={"number"}
            value={tick.toString()}
            label={"Interval"}
            sx={{ width: "8rem" }}
            onChange={(e) => setTick(Math.max(3, parseInt(e.target.value)))}
          />
        </Box>
      </Stack>
      <Drawing nods={nods} />
    </Stack>
  );
}
