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
import { Launch } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../store";
import { NodeStoreType, RecordBaseType } from "../../domain/types";
import { appendWebsite, setNode } from "../../store/visSlice";
import { setCreateAction, setExecutAction } from "../../store/recSlice";
import { OpenApiService } from "../../services/openapi";
import RecordDialog from "../_shared/RecordDialog";

type CrawledNodeDialogType = {
  show: boolean;
  hide: () => void;
  node: NodeStoreType;
};

function CrawledNodeDialog({ show, hide, node }: CrawledNodeDialogType): JSX.Element {

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
    <Dialog open={show}>
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
    </Dialog>
  );
}

export default function NodeDialog(): JSX.Element {

  const dispatch = useAppDispatch();
  const {
    node,
    createAction
  } = useAppSelector((state) => state.vis);

  const [show, setShow] = useState(false);

  useEffect(() => setShow(!!node), [node]);

  const hide = () => {
    setShow(false);
    dispatch(setNode(undefined));
  };

  const callback = async (record: RecordBaseType) => {
    dispatch(setCreateAction(true));
    try {
      const { recId } = await OpenApiService.createRecord(record);
      if (!record.active) {
        await OpenApiService.createExecution(recId);
      }
      dispatch(appendWebsite({ ...record, recId: recId }));
      hide();
    }
    catch (ex: any) { alert(ex?.message); }
    finally {
      dispatch(setCreateAction(false));
    }
  };

  return (
    <>
      {!!node &&  node.crawlable &&
        <CrawledNodeDialog node={node} show={show} hide={hide} />
      }
      {!!node && !node.crawlable &&
        <RecordDialog
          show={show}
          hide={hide}
          action={"create"}
          record={{
            url: node.url,
            regexp: ".*",
            period: 5,
            label: "",
            active: false,
            tags: []
          }}
          callback={callback}
          remoteAction={createAction}
        />
      }
    </>
  );
}
