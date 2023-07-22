import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Link,
  Stack,
  Typography
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Launch, Send } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store";
import { setNode } from "../../store/visSlice";
import { NodeStoreType } from "../../domain/types";
import { setExecutAction } from "../../store/recSlice";
import { OpenApiService } from "../../services/openapi";

type CrawledNodeDialogType = {
  node: NodeStoreType;
  hide: () => void;
};

function CrawledNodeDialog({ node, hide }: CrawledNodeDialogType): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    executAction
  } = useAppSelector((state) => state.vis);

  const execute = async (recId: number) => {
    dispatch(setExecutAction(true));

    try {
      await OpenApiService.createExecution(recId);
    }
    catch (ex: any) { alert(ex.message); }
    finally {
      dispatch(setExecutAction(false));
    }
  };

  return (
    <>
      <DialogContent>
        <Stack direction={"column"} gap={2}>
          <Stack direction={"row"} gap={2}>
            <Typography>URL</Typography>
            <Link
              href={node.url}
              target={"_blank"}
              rel={"noopener noreferrer"}
            >
              <Launch />
            </Link>
          </Stack>
          <Stack direction={"row"} gap={2}>
            <Typography>Crawl time</Typography>
            <Typography>{node.crawlTime ?? "N/A"}</Typography>
          </Stack>
          {node.owners.map((owner, i) => (
            <Stack key={i} direction={"row"} gap={2} alignItems={"center"}>
              <Typography>{owner.label}</Typography>
              <Button
                size={"small"}
                variant={"outlined"}
                disabled={executAction}
                onClick={() => execute(owner.recId)}
              >
                <span>Exec</span>
              </Button>
            </Stack>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color={"error"}
          onClick={hide}
          disabled={executAction}
        >
          <span>Close</span>
        </Button>
      </DialogActions>
    </>
  );
}

type UnknownNodeDialogType = CrawledNodeDialogType;

function UnknownNodeDialog({ node, hide }: UnknownNodeDialogType): JSX.Element {

  return (
    <>
      <DialogContent>
        {node.url}
      </DialogContent>
      <DialogActions>
        <Button
          color={"error"}
          onClick={hide}
        >
          <span>Close</span>
        </Button>
        <LoadingButton startIcon={<Send />}>
          <span>Send</span>
        </LoadingButton>
      </DialogActions>
    </>
  )
}

export default function NodeDialog(): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    node
  } = useAppSelector((state) => state.vis);

  const [show, setShow] = useState(false);

  useEffect(() => setShow(!!node), [node]);

  const hide = () => {
    setShow(false);
    dispatch(setNode(undefined));
  };

  return (
    <Dialog open={show}>
      <>{!!node &&  node.crawlable && <CrawledNodeDialog node={node} hide={hide} />}</>
      <>{!!node && !node.crawlable && <UnknownNodeDialog node={node} hide={hide} />}</>
    </Dialog>
  );
}
