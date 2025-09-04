import RenderIf from "@/components/RenderIf";
import Tooltip from "@/components/ToolTip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePrintPdf } from "@/hooks/usePrintPdf";
import { ContractDetailResponse } from "@/types";
import { httpRequest } from "@/utils/httpRequest";
import { useQuery } from "@tanstack/react-query";
import { Download, File } from "lucide-react";
import { useParams } from "react-router-dom";
import { saveAs } from "file-saver";
import { asBlob } from "html-docx-js-typescript";
import { useCallback } from "react";
import "ckeditor5/ckeditor5.css";
import { useTranslation } from "react-i18next";

const ContentContract = () => {
  const { t } = useTranslation();
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

  const handleDownloadDocx = useCallback(async () => {
    if (!content) return;

    const result = await asBlob(content, {
      orientation: "portrait",
      margins: { top: 720, bottom: 720 },
    });

    let blob: Blob;

    if (result instanceof Blob) {
      blob = result;
    } else if (result instanceof ArrayBuffer) {
      blob = new Blob([result], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blob = new Blob([new Uint8Array(result as any)], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
    }

    saveAs(blob, `hop_dong_${data?.id}.docx`);
  }, [content, data?.id]);

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
        <div className="flex justify-end items-center pb-2 gap-2">
          <Tooltip content={t("contract.pdf")}>
            <Button size={"icon"} className="text-white cursor-pointer" onClick={handleDownloadPdf}>
              <Download />
            </Button>
          </Tooltip>
          <Tooltip content={t("contract.docx")}>
            <Button
              size={"icon"}
              className="text-white cursor-pointer"
              onClick={handleDownloadDocx}
            >
              <File />
            </Button>
          </Tooltip>
        </div>
        <div className="bg-white rounded-md">
          <div
            ref={printRef}
            className="[&_.ck]:!border-none [&_.ck]:!shadow-none rounded-sm shadow-lg px-5 bg-white"
            dangerouslySetInnerHTML={{
              __html: content
                .replace(/\\"/g, '"')
                .replace(/contenteditable="true"/gi, 'contenteditable="false"'),
            }}
          ></div>
        </div>
      </RenderIf>
    </>
  );
};

export default ContentContract;
