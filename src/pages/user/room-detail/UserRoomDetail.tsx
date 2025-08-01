import {
  Building2,
  MapPin,
  UserCog,
  Phone,
  Key,
  Ruler,
  Users2,
  Tag,
  DoorOpen,
  FileText,
  FileSignature,
  UserCircle2,
  Users,
  PhoneCall,
  CalendarDays,
  IdCard,
  CreditCard,
  DollarSign,
  BadgeDollarSign,
  CalendarCheck,
  CalendarX,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApiResponse, RoomDetailsResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const NA = "N/A";

const UserRoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, error } = useQuery<ApiResponse<RoomDetailsResponse>>({
    queryKey: ["room-detail"],
    queryFn: async () => {
      const res = (await httpRequest.get(`/rooms/details/${id}`)).data;
      return res;
    },
    retry: 1,
    enabled: !!id,
  });

  useEffect(() => {
    if (error instanceof AxiosError) {
      toast.error(error?.response?.data?.message);
    }

    if (!id) {
      navigate("/room", { replace: true });
    }
  }, [id, error, navigate]);

  const room = data?.data;

  return (
    <div className="bg-background rounded-sm">
      <div className="pb-6">
        <div className="relative h-48 overflow-hidden">
          <img
            src={
              "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
            }
            alt="Building Exterior"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
            <h1 className="text-3xl font-bold text-white">{room?.buildingAddress || NA}</h1>
            <p className="text-gray-200 flex items-center mt-2">
              <MapPin className="mr-2" />
              {room?.buildingName || NA}
            </p>
          </div>
        </div>
        <div className="p-5 flex gap-5 lg:flex-row flex-col w-full bg-background">
          <div className="p-5 flex gap-5 lg:flex-row flex-col w-full bg-background">
            <Card className="rounded-sm shadow-none w-full gap-2">
              <CardHeader>
                <CardTitle>Thông tin tòa nhà</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col text-sm gap-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Tên tòa nhà:</span>
                    <span className="font-bold">{room?.buildingName || NA}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Địa chỉ:</span>
                    <span className="font-bold">{room?.buildingAddress || NA}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserCog className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Chủ nhà:</span>
                    <span className="font-bold">{room?.ownerName || NA}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">SĐT:</span>
                    <span className="font-bold">{room?.ownerPhone || NA}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Thông tin phòng */}
            <Card className="rounded-sm shadow-none w-full gap-2">
              <CardHeader>
                <CardTitle>Thông tin phòng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col text-sm gap-3">
                  <div className="flex items-center gap-2">
                    <Key className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Mã phòng:</span>
                    <span className="font-bold">{room?.roomCode || NA}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Ruler className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Diện tích:</span>
                    <span className="font-bold">{room?.acreage || NA} m²</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users2 className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Sức chứa:</span>
                    <span className="font-bold">{room?.maximumPeople || NA} người</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Loại phòng:</span>
                    <span className="font-bold">{room?.roomType || NA}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DoorOpen className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Trạng thái:</span>
                    <span className="font-bold">{room?.status || NA}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <FileText className="size-4 mt-1 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground mt-[2px]">Mô tả:</span>
                    <p className="font-normal">{room?.description || NA}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-sm shadow-none w-full gap-2">
              <CardHeader>
                <CardTitle>Thông tin hợp đồng</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col text-sm gap-3">
                  <div className="flex items-center gap-2">
                    <FileSignature className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Mã hợp đồng:</span>
                    <span className="font-bold">{room?.contractCode || NA}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Số người thuê:</span>
                    <span className="font-bold">{room?.numberOfPeople || NA} người</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <UserCircle2 className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Người đại diện:</span>
                    <span className="font-bold">{room?.representativeName || NA}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <PhoneCall className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">SĐT đại diện:</span>
                    <span className="font-bold">{room?.representativePhone || NA}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Ngày sinh:</span>
                    <span className="font-bold">
                      {(room?.dob && new Date(room.dob).toLocaleDateString("vi-VN")) || NA}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <IdCard className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">CMND/CCCD:</span>
                    <span className="font-bold">{room?.identityCardNumber || NA}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CreditCard className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Tiền cọc:</span>
                    <span className="font-bold">
                      {(room?.deposit && Number(room?.deposit).toLocaleString("vi-VN")) || NA} đ
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <DollarSign className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Giá phòng:</span>
                    <span className="font-bold">
                      {(room?.roomPrice && Number(room?.roomPrice).toLocaleString("vi-VN")) || NA} đ
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <BadgeDollarSign className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Trạng thái HĐ:</span>
                    <span className="font-bold">{room?.contractStatus || NA}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarCheck className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Bắt đầu:</span>
                    <span className="font-bold">
                      {(room?.startDate && new Date(room.startDate).toLocaleDateString("vi-VN")) || NA}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarX className="size-4 text-muted-foreground" />
                    <span className="font-medium text-muted-foreground">Kết thúc:</span>
                    <span className="font-bold">
                      {(room?.endDate && new Date(room.endDate).toLocaleDateString("vi-VN")) || NA}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoomDetail;
