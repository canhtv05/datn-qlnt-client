import RoomAssetTable from "./RoomAssetTable";
import { useParams } from "react-router-dom";

const RoomAssetDetail = () => {
  const { roomId } = useParams();
  return (
    <div className="shadow-lg">
      <RoomAssetTable roomId={roomId ?? ""} />
    </div>
  );
};

export default RoomAssetDetail;
