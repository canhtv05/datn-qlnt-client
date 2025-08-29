import FieldsSelectLabel, { FieldsSelectLabelType } from "@/components/FieldsSelectLabel";
import InputLabel from "@/components/InputLabel";
import TextareaLabel from "@/components/TextareaLabel";
import { NotificationCreationAndUpdateRequest, Option } from "@/types";
import { Dispatch, useCallback, useEffect, useState } from "react";
import FieldsMultiSelectLabel from "../ui/FieldsMultiSelectLabel";
import { NotificationType } from "@/enums";
import RadioLabel from "../RadioLabel";
import { ImageIcon, XCircleIcon } from "lucide-react";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import Dropzone from "react-dropzone";
import { useTranslation } from "react-i18next";

interface NotificationProps {
  value: NotificationCreationAndUpdateRequest;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setValue: Dispatch<React.SetStateAction<NotificationCreationAndUpdateRequest>>;
  errors: Partial<Record<keyof NotificationCreationAndUpdateRequest, string>>;
  tennantOptions: Option[];
}

const ImagePreview = ({ url, onRemove }: { url: string; onRemove: () => void }) => (
  <div className="relative aspect-square w-40">
    <button
      type="button"
      className="absolute cursor-pointer top-0 right-0 translate-x-1/2 -translate-y-1/2"
      onClick={onRemove}
    >
      <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
    </button>
    <img
      src={url}
      height={500}
      width={500}
      alt=""
      className="border border-border h-full w-full rounded-md object-cover"
    />
  </div>
);

const AddOrUpdateNotification = ({
  value,
  handleChange,
  tennantOptions: tenantOptions,
  setValue,
  errors,
}: NotificationProps) => {
  const { t } = useTranslation();
  const [uploadImage, setUploadImage] = useState<string | null>(null);
  const toSelectType = (options: Option[]): FieldsSelectLabelType[] =>
    options.map((o) => ({ label: o.label, value: o.value }));

  const handleChangeFieldMultipleSelect = useCallback(
    <K extends keyof NotificationCreationAndUpdateRequest>(
      field: K,
      newValue: NotificationCreationAndUpdateRequest[K]
    ) => {
      setValue((prev) => ({ ...prev, [field]: newValue }));
    },
    [setValue]
  );

  useEffect(() => {
    if (value.image instanceof File) {
      setUploadImage(URL.createObjectURL(value.image));
    } else if (typeof value.image === "string") {
      setUploadImage(value.image);
    } else {
      setUploadImage(null);
    }
  }, [value.image]);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-5 w-full">
        <InputLabel
          id="title"
          name="title"
          placeholder={t("notification.addOrUpdate.title")}
          type="text"
          label={t("notification.addOrUpdate.title")}
          required
          value={value.title ?? ""}
          onChange={handleChange}
          errorText={errors.title}
        />
        <FieldsSelectLabel
          data={[
            {
              label: t("statusBadge.notificationType.common"),
              value: NotificationType.CHUNG,
            },
            {
              label: t("statusBadge.notificationType.system"),
              value: NotificationType.HE_THONG,
            },
            {
              label: t("statusBadge.notificationType.other"),
              value: NotificationType.KHAC,
            },
          ]}
          placeholder={t("notification.filter.placeholderType")}
          label={t("notification.addOrUpdate.type")}
          id="notificationType"
          name="notificationType"
          value={value.notificationType ?? ""}
          onChange={(val) =>
            handleChangeFieldMultipleSelect("notificationType", val as NotificationType)
          }
          labelSelect={t("notification.addOrUpdate.type")}
          showClear
          errorText={errors.notificationType}
          required
        />
      </div>
      <RadioLabel
        data={[
          {
            label: t("statusBadge.yes"),
            value: true,
          },
          {
            label: t("statusBadge.no"),
            value: false,
          },
        ]}
        value={value.sendToAll}
        onChange={(val) => setValue((prev) => ({ ...prev, sendToAll: val as boolean }))}
        id="sendToAll"
        name="sendToAll"
        label={t("notification.addOrUpdate.sendAll")}
        required
      />
      <FieldsMultiSelectLabel
        data={toSelectType(tenantOptions)}
        placeholder={t("notification.addOrUpdate.tenantPlaceholder")}
        label={t("notification.addOrUpdate.receiver")}
        id="users"
        name="users"
        value={toSelectType(tenantOptions).filter((opt) =>
          value?.users?.includes(String(opt.value))
        )}
        onChange={(selected) =>
          handleChangeFieldMultipleSelect(
            "users",
            selected.map((item) => String(item.value))
          )
        }
        required={String(value.sendToAll) === "false"}
        errorText={errors.users}
        isDisabled={String(value.sendToAll) === "true"}
      />
      <div>
        <Label htmlFor="upload">{t("notification.addOrUpdate.attachment")}</Label>

        <div className="mt-1">
          {uploadImage ? (
            <ImagePreview url={uploadImage} onRemove={() => setUploadImage(null)} />
          ) : (
            <Dropzone
              onDrop={(acceptedFiles) => {
                const file = acceptedFiles[0];
                if (file) {
                  const imageUrl = URL.createObjectURL(file);
                  setUploadImage(imageUrl);
                  setValue((prev) => ({ ...prev, image: file }));
                }
              }}
              accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
              maxFiles={1}
            >
              {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => (
                <div
                  {...getRootProps()}
                  className={cn(
                    "border border-dashed border-input flex items-center justify-center aspect-square w-40 rounded-md focus:outline-none focus:border-primary cursor-pointer",
                    {
                      "border-primary bg-secondary": isDragActive && isDragAccept,
                      "border-destructive bg-destructive/20": isDragActive && isDragReject,
                    }
                  )}
                >
                  <input {...getInputProps()} id="upload" />
                  <ImageIcon className="h-10 w-10" strokeWidth={1.25} />
                </div>
              )}
            </Dropzone>
          )}
        </div>
      </div>
      <TextareaLabel
        required
        errorText={errors.content}
        id="content"
        name="content"
        placeholder={t("notification.addOrUpdate.content")}
        label={t("notification.addOrUpdate.content")}
        value={value.content ?? ""}
        onChange={(e) => setValue((prev) => ({ ...prev, content: e.target.value }))}
      />
    </div>
  );
};

export default AddOrUpdateNotification;
