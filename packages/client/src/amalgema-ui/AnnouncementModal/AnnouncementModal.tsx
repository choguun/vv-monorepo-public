import useLocalStorageState from "use-local-storage-state";

import { Modal } from "../Modal";
import { Button } from "../Theme/SkyStrife/Button";
import { Heading, OverlineSmall } from "../Theme/SkyStrife/Typography";

export function AnnouncementModal() {
  const [seenPatchNotes, setSeenPatchNotes] = useLocalStorageState(
    "viewed-patch-notes-season-2",
    {
      defaultValue: false,
    }
  );

  return (
    <div className="uppercase w-fit px-4 flex items-center">
      <Modal
        // footer={
        //   <Dialog.Close asChild={true} className="w-fit">
        //     <Button className="mx-auto" buttonType="primary">
        //       start playing
        //     </Button>
        //   </Dialog.Close>
        // }
        title="announcements"
        trigger={
          <div onClick={() => setSeenPatchNotes(true)} className="relative">
            <Button buttonType="tertiary">announcements</Button>

            {!seenPatchNotes && (
              <span className="absolute -right-1 -top-1 w-2 h-2 rounded-full animate-ping bg-red-500" />
            )}
          </div>
        }
      >
        <div></div>
        <Heading>Season 1</Heading>
        <OverlineSmall>October 4nd, 2024</OverlineSmall>

        <Heading className="mt-6 mb-4 font-bold text-ss-text-default">
          🌟 Season 1 Begins 🌟
        </Heading>
        <p className="text-ss-text-light">
          Get ready for another exciting season! VoxelWorld Season 1 kicks off
          on October 4rd and runs through October 31st.
        </p>

        <br />
      </Modal>
    </div>
  );
}
