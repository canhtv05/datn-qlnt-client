import RenderIf from "@/components/RenderIf";
import Tooltip from "@/components/ToolTip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrintPdf } from "@/hooks/usePrintPdf";
import { ContractDetailResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { useParams } from "react-router-dom";

const ContentContract = () => {
  const { contractId } = useParams();
  const { data, isLoading } = useQuery<ContractDetailResponse>({
    queryKey: ["contract-detail", contractId],
    queryFn: async () => (await httpRequest.get(`/contracts/${contractId}`)).data.data,
    enabled: !!contractId,
    retry: 1,
  });

  const { handleDownloadPdf, printRef } = usePrintPdf("hop_dong" + data?.id);
  let content: string = data?.content ?? "";

  if (content.startsWith('"') && content.endsWith('"')) {
    content = content.slice(1, -1);
  }

  return (
    <>
      <RenderIf value={isLoading}>
        <div className="bg-background p-5 rounded-md space-y-5">
          <Skeleton
            style={{
              background: "var(--color-background)",
            }}
            className="py-50"
          />
        </div>
      </RenderIf>
      <RenderIf value={!isLoading}>
        <div className="flex justify-end items-center pb-2">
          <Tooltip content="Tải hợp đồng">
            <Button size={"icon"} className="text-white cursor-pointer" onClick={handleDownloadPdf}>
              <Download />
            </Button>
          </Tooltip>
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
      </RenderIf>
    </>
  );
};

export default ContentContract;
