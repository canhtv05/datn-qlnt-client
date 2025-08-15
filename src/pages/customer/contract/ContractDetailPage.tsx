import { useParams } from "react-router-dom";
import { useRef } from "react";
import { ContractDetailResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";

import "@/assets/css/print.css";
import "ckeditor5/ckeditor5.css";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useQuery } from "@tanstack/react-query";

const ContractDetailPage = () => {
  const { contractId } = useParams();

  const { data, isLoading } = useQuery<ContractDetailResponse>({
    queryKey: ["contract-detail", contractId],
    queryFn: async () => (await httpRequest.get(`/contracts/${contractId}`)).data.data,
    enabled: !!contractId,
    retry: 1,
  });

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Hop_Dong_" + data?.content,
  });

  if (isLoading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu hợp đồng...</div>;

  let content: string = data?.content ?? "";

  if (content.startsWith('"') && content.endsWith('"')) {
    content = content.slice(1, -1);
  }

  return (
    <>
      <Button variant={"status"} className="text-white" onClick={reactToPrintFn}>
        Tải hóa đơn
      </Button>
      <div className="bg-white rounded-md">
        <div
          ref={contentRef}
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
