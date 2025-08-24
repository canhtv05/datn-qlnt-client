import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const contractDescription = [
  { label: "Mã hợp đồng", value: "{{contractCode}}" },
  { label: "Mã phòng", value: "{{roomCode}}" },
  { label: "Tên quản lý", value: "{{nameManager}}" },
  { label: "SĐT quản lý", value: "{{phoneNumberManager}}" },
  { label: "Tên người thuê", value: "{{nameUser}}" },
  { label: "Email người thuê", value: "{{emailUser}}" },
  { label: "SĐT người thuê", value: "{{phoneNumberUser}}" },
  { label: "CMND/CCCD", value: "{{identityCardUser}}" },
  { label: "Địa chỉ người thuê", value: "{{addressUser}}" },
  { label: "Ngày bắt đầu", value: "{{startDate}}" },
  { label: "Ngày kết thúc", value: "{{endDate}}" },
  { label: "Tiền cọc", value: "{{deposit}}" },
  { label: "Giá phòng", value: "{{roomPrice}}" },
  { label: "Địa chỉ tòa nhà", value: "{{buildingAddress}}" },
  { label: "Trạng thái", value: "{{status}}" },
  { label: "Giá điện", value: "{{electricPrice}}" },
  { label: "Giá nước", value: "{{waterPrice}}" },
  { label: "Khách thuê", value: "{{tenants}}" },
  { label: "Tài sản", value: "{{assets}}" },
  { label: "Dịch vụ", value: "{{services}}" },
  { label: "Phương tiện", value: "{{vehicles}}" },
  { label: "Ngày tạo", value: "{{createdAt}}" },
  { label: "Ngày cập nhật", value: "{{updatedAt}}" },
];

const DescriptionValueForContract = () => {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow className="[&>th]:border-r last:border-r-0">
          <TableHead>Giá trị</TableHead>
          <TableHead>Diễn giải</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contractDescription.map((contract) => (
          <TableRow key={contract.value} className="[&>td]:border-r last:border-r-0">
            <TableCell className="font-medium text-primary">
              <span className="cursor-pointer" onClick={() => navigator.clipboard.writeText(contract.value)}>
                {contract.value}
              </span>
            </TableCell>
            <TableCell>{contract.label}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DescriptionValueForContract;
