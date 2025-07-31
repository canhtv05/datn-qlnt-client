// components/RoomAssetDetailsDrawer.tsx
import React from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useRoomAssetDrawerStore } from "@/zustand/openModalStore"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import RoomAssetTable from "./RoomAssetTable"

const RoomAssetDetailsDrawer = () => {
    const { open, closeDrawer, room } = useRoomAssetDrawerStore()
    const roomId = room?.id || ""
    console.log("Room Asset Details Drawer - Room ID:", room)
    return (
        <Drawer open={open} onOpenChange={closeDrawer} direction="right">
            <DrawerContent className="!w-[1000px] !max-w-none">
                <DrawerHeader>
                    <DrawerTitle>Thông tin phòng</DrawerTitle>
                </DrawerHeader>
                <Card className="w-fit border border-black rounded-[20px] mx-4">
                    <CardHeader>
                        <h3 className="text-lg font-bold">{room?.roomCode ?? "Room Details"}</h3>
                    </CardHeader>
                    <CardContent className="px-4 py-0 text-sm space-y-1">
                        {room ? (
                            <>
                                <p><strong>Mã phòng:</strong> {room.roomCode}</p>
                                <p><strong>Loại phòng:</strong> {room.roomType}</p>
                                <p><strong>Trạng thái:</strong> {room.status}</p>
                                <p><strong>Số người tối đa:</strong> {room.totalAssets} người</p>
                            </>
                        ) : (
                            <p>No data.</p>
                        )}
                    </CardContent>
                </Card>
                <RoomAssetTable roomId={roomId} />
            </DrawerContent>
        </Drawer>
    )
}

export default RoomAssetDetailsDrawer
