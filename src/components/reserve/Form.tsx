import React, { useState, useContext } from "react";
/* import Input from "../layout/Input"; */
import { Button } from "@chakra-ui/react";
import MeetingType from "./MeetingType";

import AppContext from "../../state/AppContext";
import AuthContext from "../../state/AuthContext";
import { meetingTypes } from "../../constants/data";
import { Input } from "@chakra-ui/react";
import GuestsModal from "./GuestsModal";

import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "../../config/firebase";
import ReservationContext from "../../state/ReservationContext";
import { useNavigate } from "react-router-dom";

const Form: React.FC = () => {
  const navigate = useNavigate();
  const [fetchData, setFetchData] = useState();
  //FormData

  //1.meeting name
  const [name, setName] = useState<string>();

  //2.guests
  const [guests, setGuests] = useState<string[]>([]);
  const [guestsOpenModal, setGuestsOpenModal] = useState(false);
  const onAddGuests = (guests: any) => {
    setGuests((prevGuests: any[]) => [...prevGuests, guests]);
  };

  //3.meeting type --> Přes reservation context. V Select componentu.
  const authContext = useContext(AuthContext);
  const appContext = useContext(AppContext);
  const reservationContext = useContext(ReservationContext);

  const [meetingType, setMeetingType] = useState<string>("call");

  //nepouzito zatim
  const { setOpenModal } = appContext;
  const { company, user } = authContext;
  const { pickedDate, pickedRoom } = reservationContext;
  /*   const { pickedRoom } = reservationContext; */

  const onChangeInputHandler = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setName(e.target.value);

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();

    //Čísla vybraných bloků k rezervaci
    let blocks: number[] = [];
    pickedRoom.roomData.forEach((data: any) => {
      if (data.selected) blocks.push(data.block);
    });

    const newMeeting = {
      date: pickedDate,
      name,
      type: meetingType,
      room: "1", //pak přidat ROOM !!!!
      blocks,
      creator: user.email,
      guests,
    };
    console.log(newMeeting);

    const dbRef = doc(db, `companies/secondCompany/rooms`, "1"); //UPRAVIT DYNAMICKY
    await updateDoc(dbRef, { meetings: arrayUnion(newMeeting) });
    setName("");
    navigate("/overview");
  };

  return (
    <section className="flex justify-center mt-4 ">
      <div className=" flex flex-col justify-center  bg-green-50 h-1/3 rounded-lg items-center">
        <h1 className="text-lg font-bold flex justify-center">
          Create a meeting
        </h1>
        <form
          className="flex flex-col w-72 p-6 [&>input]:mb-4 "
          onSubmit={onSubmitHandler}
        >
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter the meeting name"
            onChange={onChangeInputHandler}
            value={name}
            style={{ backgroundColor: "white" }}
          />

          <Button
            colorScheme={"purple"}
            //VYUZIT
            onClick={() => {
              setGuestsOpenModal(true);
            }}
          >
            Add guests
          </Button>
          {guestsOpenModal && (
            <GuestsModal
              isOpen={guestsOpenModal}
              setIsOpen={setGuestsOpenModal}
              onAddGuests={onAddGuests}
            />
          )}
          <MeetingType
            name="rooms"
            id="rooms"
            options={meetingTypes}
            setMeetingType={setMeetingType}
          />
          <div className="flex flex-col justify-center [&>button]:mt-1 ">
            <Button colorScheme="teal" type="submit">
              Reserve
            </Button>
            <Button
              colorScheme="teal"
              variant="outline"
              onClick={() => {
                navigate("/overview");
              }}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Form;
