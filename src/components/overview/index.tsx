import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import ReservationContext from "../../state/ReservationContext";

import RoomsDom from "./RoomsDom";
import { useRoomsMeetingsFetch } from "../../hooks/useRoomsMeetingsFetch";
import TimeBlocksDom from "./TimeBlocksDom";
import { Room, RoomData } from "../../types/types";
/* import useAuth from "../../hooks/useAuth"; */

import LoadingSpinner from "../ui/LoadingSpinner/LoadingSpinner";

const Overview = () => {
  const { pickedDate, setPickedRoom, roomsData, setRoomsData } =
    useContext(ReservationContext);

  /* const { user, company } = useAuth(); */
  const navigate = useNavigate();

  const { roomsAndMeetingsFetch, isLoading } = useRoomsMeetingsFetch();

  //1. Firebase query - stáhne všechny rooms za danou firmu včetně meetingů a zpracované meetingy vč. upravených objektů o meetingy ve vybraném dnu uloží do state. Viz. funkce..
  useEffect(() => {
    let isCurrent = true;
    if (!isCurrent) return;
    roomsAndMeetingsFetch(
      "secondCompany", //upravit na company
      pickedDate
    );
    return () => {
      isCurrent = false;
    };
  }, []);

  const clickBlockHandler = (room: number, block: number): void => {
    //Uloží do Contextu room a block, na které user clicknul, aby se dalo pak použít v detailní rezervaci jako přednastaveno

    const clickedRoom = roomsData.find((roomData: Room) => {
      return roomData.id == room;
    });
    //přidána property selected: false ke každému bloku. U reserve se tam bude přidělovat kliknutí a podle toho se barvit.
    const adjustedRoomData = clickedRoom!.roomData.map((data: RoomData) => {
      return { ...data, selected: false };
    });
    const adjustedClickedRoom = { ...clickedRoom, roomData: adjustedRoomData };
    //Pošle se vyfiltrovaná room do react contextu. Odtud se pak bere v Reserve componentu
    setPickedRoom(adjustedClickedRoom as Room);
    navigate("/reserve");
  };

  //Vypočítá šířku celého obsahu podle počtu místnosti - = 5rem) na místnost + 5rem za time blocks.
  const roomsNumber = roomsData.length;
  const displayWidth = roomsNumber * 5 + 5;

  //Počet sloupců pro GRID
  const displayCols = roomsNumber + 1;

  //Loading spinner width

  return (
    <div className="flex justify-center bg-gradient-to-r from-violet-300 to-violet-400 overflow-x-scroll">
      <section
        className={` ${isLoading ? "flex" : "grid"} gap-5 mt-2`}
        //Custom in-line style, protože Tailwind neumožňuje dynamic styling - takto udělá grid podle počtu místností (const displayCols) a přidá dynamicky width contentu.
        style={{
          gridTemplateColumns: `repeat(${displayCols}, minmax(0, 1fr))`,
          width: `${displayWidth}rem`,
        }}
      >
        <div className=" -ml-4">
          <div className="text-xs w-24 h-10 flex justify-center items-center  border border-stone-700 rounded-md bg-emerald-900 text-white font-bold mb-1 cursor-pointer">
            Time
          </div>
          <TimeBlocksDom />
        </div>
        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <RoomsDom
            roomsData={roomsData}
            clickBlockHandler={clickBlockHandler}
          />
        )}
      </section>
    </div>
  );
};

export default Overview;
