import React, {
  useState,
  useContext,
  Dispatch,
  SetStateAction,
  FC,
} from "react";
import { Button, IconButton } from "@chakra-ui/react";
import useAuth from "../../hooks/useAuth";
import { meetingTypes } from "../../data/constants";
import { Input } from "@chakra-ui/react";
import GuestsModal from "./GuestsModal";
import ReservationContext from "../../state/ReservationContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RoomData } from "../../types/types";
import { useAddMeeting } from "../../hooks/useAddMeeting";
import { CALL } from "../../data/constants";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { BsArrowUp } from "react-icons/bs";
import GuestsPopover from "../../components/reserve/GuestsPopover";
import { paramsToDate } from "../../utils/dateParamsFormat";
import MeetingType from "../../components/reserve/FormSelect";

type ReservationFormProps = {
  blocksPickError: { error: boolean; message: string };
  isMaxMdScreen: boolean;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
};

const ReservationForm: FC<ReservationFormProps> = ({
  blocksPickError,
  isMaxMdScreen,
  setIsFormOpen,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { pickedRoom } = useContext(ReservationContext);
  const { addMeeting } = useAddMeeting();

  const [searchParams, setSearchParams] = useSearchParams();
  const pickedRoomId = searchParams.get("room");
  const pickedDate = searchParams.get("date");

  const formatedDate = paramsToDate(pickedDate!);

  const [disabledBtn, setDisabledBtn] = useState(false);

  const [formData, setFormData] = useState({ name: "", type: CALL });

  const [guests, setGuests] = useState<string[] | []>([]);
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false);
  const onAddGuests = (guests: string[]) => {
    setGuests(guests);
  };

  const [missingFormDataError, setMissingFormDataError] = useState(false);

  const inputChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMissingFormDataError(false);
    setDisabledBtn(false);
  };

  const submitHandler = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();
    setDisabledBtn(true);
    setMissingFormDataError(false);

    let blocks: number[] = [];
    pickedRoom.roomData.forEach((data: RoomData) => {
      if (data.selected) blocks.push(data.block);
    });
    const { name } = formData;

    if (!pickedRoomId) return;
    const newMeeting = {
      ...formData,
      id: Date.now(),
      date: formatedDate,
      room: pickedRoomId,
      blocks,
      creator: user!.email,
      guests,
    };

    if (blocks.length > 0 && name && name.length >= 1) {
      addMeeting(
        newMeeting,
        pickedRoomId as string,
        { pathname: `/overview`, search: `?date=${pickedDate}` },
        setFormData
      );
      setMissingFormDataError(false);
    } else {
      setMissingFormDataError(true);
    }
  };

  return (
    <section className="flex justify-center md:ml-6  ">
      <div className=" flex flex-col justify-center bg-green-50 pt-7 md:pt-4 h-3/5  md:h-2/5 rounded-lg  ">
        <h1 className="text-lg font-bold self-center">Create a meeting</h1>
        <h3 className="text-sm self-center">
          Pick blocks and add meeting details
        </h3>
        <form
          className="flex flex-col w-72 p-4 pb-10 [&>input]:mb-4"
          onSubmit={submitHandler}
        >
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter the meeting name"
            onChange={inputChangeHandler}
            value={formData.name}
            style={{ backgroundColor: "white" }}
            focusBorderColor="teal.400"
          />

          {guests.length > 0 ? (
            <GuestsPopover
              guests={guests}
              setGuestsOpenModal={setIsGuestModalOpen}
            />
          ) : (
            <Button
              colorScheme={"purple"}
              leftIcon={<AiOutlinePlusCircle size={20} />}
              onClick={() => {
                setIsGuestModalOpen(true);
              }}
            >
              Add guests
            </Button>
          )}

          {isGuestModalOpen && (
            <GuestsModal
              isOpen={isGuestModalOpen}
              setIsOpen={setIsGuestModalOpen}
              onAddGuests={onAddGuests}
              addedGuests={guests}
            />
          )}
          <MeetingType
            name="type"
            id="type"
            options={meetingTypes}
            onChange={inputChangeHandler}
            label="Select meeting type:"
            additionalStyle="mt-2 mb-2 text-sm"
          />
          <div className="flex flex-col justify-center [&>button]:mt-1 ">
            <Button
              colorScheme="teal"
              type="submit"
              disabled={disabledBtn && !missingFormDataError}
            >
              Reserve
            </Button>
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={() => {
                navigate({
                  pathname: `/overview`,
                  search: `?date=${pickedDate}`,
                });
              }}
            >
              {isMaxMdScreen ? "Back to overview" : "Back"}
            </Button>
            {isMaxMdScreen && (
              <div className="mt-4 flex justify-center">
                <IconButton
                  colorScheme="yellow"
                  aria-label="arrow-up"
                  icon={<BsArrowUp />}
                  className="w-1/4"
                  onClick={() => setIsFormOpen(false)}
                />
              </div>
            )}
          </div>

          <p className="h-1 text-xs text-red-600">
            {blocksPickError.error && blocksPickError.message}
          </p>

          <p className="mt-3 h-1 text-xs text-red-600">
            {missingFormDataError &&
              "Please fill in meeting name and pick meeting blocks."}
          </p>
        </form>
      </div>
    </section>
  );
};

export default ReservationForm;
