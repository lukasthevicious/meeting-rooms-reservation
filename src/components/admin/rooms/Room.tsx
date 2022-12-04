import { Tr, Th } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { useRoomsAdminFncs } from "../../../hooks/useRoomsAdminFncs";

const Room = ({ room, setRooms }: any) => {
  const { deleteRoom } = useRoomsAdminFncs();

  const deleteRoomHandler = (roomId: any) => {
    deleteRoom(roomId, setRooms);
  };

  return (
    <Tr>
      <Th>{room.name}</Th>
      <Th isNumeric>
        <IconButton
          aria-label="minus"
          colorScheme="red"
          icon={<AiOutlineMinusCircle size={15} style={{ color: "#f0fdf4" }} />}
          onClick={() => {
            deleteRoomHandler(room.id);
          }}
          className=" w-5 mr-2"
          size="xs"
        />
      </Th>
    </Tr>
  );
};

export default Room;
