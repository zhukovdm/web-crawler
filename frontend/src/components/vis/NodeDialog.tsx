import { useEffect } from "react";
import { useAppSelector } from "../../store";
import { Dialog } from "@mui/material";

export default function NodeDialog(): JSX.Element {

  const {
    node
  } = useAppSelector((state) => state.vis);

  useEffect(() => {
    console.log(node);
  }, [node]);

  return (
    <Dialog open={false}>
    </Dialog>
  );
}
