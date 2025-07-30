// components/RoomAssetDetailsDrawer.tsx
import React from "react"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { useRoomAssetDrawerStore } from "@/zustand/openModalStore"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import RoomAssetTable from "./RoomAssetTable"

const RoomAssetDetailsDrawer = () => {
    const { open, closeDrawer, room } = useRoomAssetDrawerStore()
    const roomId = room?.id || ""
    return (
        <Drawer open={open} onOpenChange={closeDrawer} direction="right">
            <DrawerContent className="!w-[1000px] !max-w-none">
                <DrawerHeader>
                    <DrawerTitle>Room Details</DrawerTitle>
                </DrawerHeader>
                <Card className="w-fit border border-black rounded-[20px]">
                    <CardHeader>
                        <h3 className="text-lg font-bold">{room?.roomCode ?? "Room Details"}</h3>
                    </CardHeader>
                    <CardContent className="p-4 text-sm space-y-1">
                        {room ? (
                            <>
                                <p><strong>Acreage:</strong> {room.roomCode} m²</p>
                                {/* <p><strong>Price:</strong> {room.price.toLocaleString()} VND</p>
                                <p><strong>Maximum People:</strong> {room.maximumPeople}</p>
                                <p><strong>Room Type:</strong> {room.roomType}</p>
                                <p><strong>Status:</strong> {room.status}</p>
                                <p><strong>Description:</strong> {room.description || "N/A"}</p>
                                <p><strong>Floor:</strong> {room.floor?.nameFloor}</p> */}
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
