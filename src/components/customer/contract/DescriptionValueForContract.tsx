import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";

const DescriptionValueForContract = () => {
  const { t } = useTranslation();
  const contractDescription = [
    { label: t("contract.contract.contractCode"), value: "{{contractCode}}" },
    { label: t("contract.contract.roomCode"), value: "{{roomCode}}" },
    { label: t("contract.contract.nameManager"), value: "{{nameManager}}" },
    { label: t("contract.contract.phoneNumberManager"), value: "{{phoneNumberManager}}" },
    { label: t("contract.contract.nameUser"), value: "{{nameUser}}" },
    { label: t("contract.contract.emailUser"), value: "{{emailUser}}" },
    { label: t("contract.contract.phoneNumberUser"), value: "{{phoneNumberUser}}" },
    { label: t("contract.contract.identityCardUser"), value: "{{identityCardUser}}" },
    { label: t("contract.contract.addressUser"), value: "{{addressUser}}" },
    { label: t("contract.contract.startDate"), value: "{{startDate}}" },
    { label: t("contract.contract.endDate"), value: "{{endDate}}" },
    { label: t("contract.contract.deposit"), value: "{{deposit}}" },
    { label: t("contract.contract.roomPrice"), value: "{{roomPrice}}" },
    { label: t("contract.contract.buildingAddress"), value: "{{buildingAddress}}" },
    { label: t("contract.contract.status"), value: "{{status}}" },
    { label: t("contract.contract.electricPrice"), value: "{{electricPrice}}" },
    { label: t("contract.contract.waterPrice"), value: "{{waterPrice}}" },
    { label: t("contract.contract.tenants"), value: "{{tenants}}" },
    { label: t("contract.contract.assets"), value: "{{assets}}" },
    { label: t("contract.contract.vehicles"), value: "{{vehicles}}" },
    { label: t("contract.contract.createdAt"), value: "{{createdAt}}" },
    { label: t("contract.contract.updatedAt"), value: "{{updatedAt}}" },
  ];

  return (
    <Table className="border">
      <TableHeader>
        <TableRow className="[&>th]:border-r last:border-r-0">
          <TableHead>{t("contract.value")}</TableHead>
          <TableHead>{t("contract.description")}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contractDescription.map((contract) => (
          <TableRow key={contract.value} className="[&>td]:border-r last:border-r-0">
            <TableCell className="font-medium text-primary">
              <span
                className="cursor-pointer"
                onClick={() => navigator.clipboard.writeText(contract.value)}
              >
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
