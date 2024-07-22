import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";

const CustomModal = ({
  title,
  children,
  buttonContent,
  opened,
  close,
  open,
}) => {
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title={title}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        centered
      >
        {children}
      </Modal>
      <Button fullWidth onClick={open}>
        {buttonContent}
      </Button>
    </>
  );
};

export default CustomModal;
