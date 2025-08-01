import RoomAssetTable from "./RoomAssetTable";
import { useParams } from "react-router-dom";

const RoomAssetDetail = () => {
  const { roomId } = useParams();
  return (
    <div>
      <RoomAssetTable roomId={roomId ?? ""} />
    </div>
  );
};

export default RoomAssetDetail;
