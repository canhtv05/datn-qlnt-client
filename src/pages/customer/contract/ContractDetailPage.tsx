import { useParams } from "react-router-dom";
import { ContractDetailResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";

import "@/assets/css/print.css";
import "ckeditor5/ckeditor5.css";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { usePrintPdf } from "@/hooks/usePrintPdf";

const ContractDetailPage = () => {
  const { contractId } = useParams();

  const { data, isLoading } = useQuery<ContractDetailResponse>({
    queryKey: ["contract-detail", contractId],
    queryFn: async () => (await httpRequest.get(`/contracts/${contractId}`)).data.data,
    enabled: !!contractId,
    retry: 1,
  });

  const { handleDownloadPdf, printRef } = usePrintPdf("hop_dong" + data?.id);

  if (isLoading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu hợp đồng...</div>;

  let content: string = data?.content ?? "";

  if (content.startsWith('"') && content.endsWith('"')) {
    content = content.slice(1, -1);
  }

  return (
    <>
      <div className="flex justify-end my-2">
        <Button variant={"status"} className="text-white cursor-pointer" onClick={handleDownloadPdf}>
          Tải hợp đồng
        </Button>
      </div>
      <div className="bg-white rounded-md">
        <div
          ref={printRef}
          className="[&_.ck]:!border-none [&_.ck]:!shadow-none rounded-sm shadow-lg px-5 bg-white"
          dangerouslySetInnerHTML={{
            __html: content.replace(/\\"/g, '"').replace(/contenteditable="true"/gi, 'contenteditable="false"'),
          }}
        ></div>
      </div>
    </>
  );
};

export default ContractDetailPage;
