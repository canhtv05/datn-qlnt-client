import { useQuery } from "@tanstack/react-query";
import { httpRequest } from "@/utils/httpRequest";

const UserRoom = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["my-room"],
    queryFn: async () => {
      const res = await httpRequest.get("/rooms/me");
      console.log(res.data);
      return res.data;
    },
  });

  if (isLoading) return <div>Đang tải phòng của bạn...</div>;
  if (error) return <div>Không thể tải thông tin phòng.</div>;
  if (!data) return <div>Không có dữ liệu phòng.</div>;

  const { roomCode, roomType, maximumPeople, price, status, acreage, createdAt, updatedAt, floor } = data;

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-2xl p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-blue-600">Thông tin phòng của bạn</h2>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Mã phòng:</span> {roomCode}
        </div>
        <div>
          <span className="font-medium">Loại phòng:</span> {roomType}
        </div>
        <div>
          <span className="font-medium">Số người tối đa:</span> {maximumPeople}
        </div>
        <div>
          <span className="font-medium">Giá thuê:</span> {price} đ
        </div>
        <div>
          <span className="font-medium">Tình trạng:</span>{" "}
          <span className={`font-semibold ${status === "TRONG" ? "text-green-600" : "text-red-600"}`}>{status}</span>
        </div>
        <div>
          <span className="font-medium">Diện tích:</span> {acreage} m²
        </div>
        <div>
          <span className="font-medium">Ngày tạo:</span> {new Date(createdAt).toDateString()}
        </div>
        <div>
          <span className="font-medium">Ngày cập nhật:</span> {new Date(updatedAt).toDateString()}
        </div>
      </div>

      {floor && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-md font-semibold mb-2 text-gray-700">Thông tin tầng</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Tầng:</span> {floor.nameFloor}
            </div>
            <div>
              <span className="font-medium">Tòa nhà:</span> {floor.buildingName}
            </div>
            <div>
              <span className="font-medium">Số phòng tối đa:</span> {floor.maximumRoom}
            </div>
            <div>
              <span className="font-medium">Loại tầng:</span> {floor.floorType}
            </div>
            <div>
              <span className="font-medium">Trạng thái:</span>{" "}
              <span className={floor.status === "HOAT_DONG" ? "text-green-700" : "text-red-700"}>{floor.status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoom;
