import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../shadcn/Dialog";
import { Button } from "@/components/ui/button";

export default function ErrorModal({
  isOpen,
  setViewModal,
}: {
  isOpen: boolean;
  setViewModal: any;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setViewModal}>
      <DialogContent className="sm:max-w-[350px] w-[90%] sm:w-full">
        <DialogHeader>
          <DialogTitle>Sorry, we didn't catch that</DialogTitle>
        </DialogHeader>
        <DialogDescription>Please try again.</DialogDescription>
        <DialogFooter>
          <div>
            <Button
              type="button"
              className="w-full sm:w-auto"
              onClick={() => setViewModal(false)}
            >
              OK
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

