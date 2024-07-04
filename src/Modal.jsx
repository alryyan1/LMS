import { Add, AddTask } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

function Modal({ showModal, setShowModal, children, addHandler }) {
  return (
    <div className={showModal ? "test-options" : "hide"}>
      <Stack direction={"row"} justifyContent={"space-around"}>
        <Button
          size="small"
          variant="contained"
          color="warning"
          onClick={() => setShowModal(false)}
        >
          close
        </Button>
        <Button size="small" variant="contained" onClick={addHandler}>
          add
        </Button>
      </Stack>
      <div className="body">{children}</div>
    </div>
  );
}

export default Modal;
