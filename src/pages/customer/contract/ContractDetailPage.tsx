import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ContractDetailResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";

import "@/assets/css/print.css";
import "ckeditor5/ckeditor5.css";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";

const ContractDetailPage = () => {
  const { contractId } = useParams();
  const [data, setData] = useState<ContractDetailResponse | null>(null);
  useEffect(() => {
    if (contractId) {
      httpRequest
        .get(`/contracts/${contractId}`)
        .then((res) => setData(res.data.data))
        .catch(() => setData(null));
    }
  }, [contractId]);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({
    contentRef,
    documentTitle: "Hop_Dong_" + data?.contractCode,
  });

  if (!data) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu hợp đồng...</div>;

  let content = data.content;
  if (typeof content === "string" && content.startsWith('"') && content.endsWith('"')) {
    content = content.slice(1, -1);
  }

  return (
    <div>
      <Button variant={"status"} className="text-white" onClick={reactToPrintFn}>
        Tải hóa đơn
      </Button>
      <div
        ref={contentRef}
        className="[&_.ck]:!border-none [&_.ck]:!shadow-none bg-background rounded-sm shadow-lg px-5"
        dangerouslySetInnerHTML={{
          __html: content.replace(/\\"/g, '"').replace(/contenteditable="true"/gi, 'contenteditable="false"'),
        }}
      ></div>
    </div>
  );
};

export default ContractDetailPage;
