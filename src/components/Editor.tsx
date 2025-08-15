import { useState, useEffect, useRef, useMemo } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  ClassicEditor,
  Alignment,
  Autoformat,
  Autosave,
  BalloonToolbar,
  BlockQuote,
  Bold,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  Fullscreen,
  Heading,
  HorizontalLine,
  HtmlComment,
  ImageEditing,
  ImageUtils,
  Indent,
  IndentBlock,
  Italic,
  List,
  ListProperties,
  Mention,
  Paragraph,
  PasteFromOffice,
  PlainTableOutput,
  RemoveFormat,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableLayout,
  TableProperties,
  TableToolbar,
  TextTransformation,
  TodoList,
  Underline,
  AlignmentSupportedOption,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

const headingOptions = [
  { model: "paragraph", title: "Tiêu đề", class: "ck-heading_paragraph" },
  { model: "heading1", view: "h1", title: "Tiêu đề 1", class: "ck-heading_heading1" },
  { model: "heading2", view: "h2", title: "Tiêu đề 2", class: "ck-heading_heading2" },
  { model: "heading3", view: "h3", title: "Tiêu đề 3", class: "ck-heading_heading3" },
  { model: "heading4", view: "h4", title: "Tiêu đề 4", class: "ck-heading_heading4" },
  { model: "heading5", view: "h5", title: "Tiêu đề 5", class: "ck-heading_heading5" },
  { model: "heading6", view: "h6", title: "Tiêu đề 6", class: "ck-heading_heading6" },
] as const;

interface EditorProps {
  content: string;
  onChange: (data: string) => void;
}

const Editor = ({ content, onChange }: EditorProps) => {
  const editorContainerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const LICENSE_KEY =
    "eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NTYzMzkxOTksImp0aSI6IjM2MDRmYWZmLWI1NmUtNGQ5MC1iZTY0LWZkNWI3OGNhMzc2NyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6IjcwNjY4MWVjIn0.jLe84SU1nwUZ5XUgI9zl6zzaH9f0h8_SohbzkKtz2ch78rLRdViK0fl0p-1dLeLebC5Cv9iE_q0MsketnUforQ";

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return { editorConfig: null };
    }

    return {
      editorConfig: {
        toolbar: {
          items: [
            "heading",
            "|",
            "undo",
            "redo",
            "|",
            "findAndReplace",
            "fullscreen",
            "|",
            "fontSize",
            "fontFamily",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "bold",
            "italic",
            "underline",
            "removeFormat",
            "|",
            "specialCharacters",
            "horizontalLine",
            "insertTable",
            "insertTableLayout",
            "blockQuote",
            "|",
            "alignment",
            "|",
            "bulletedList",
            "numberedList",
            "todoList",
            "outdent",
            "indent",
          ],
          shouldNotGroupWhenFull: false,
        },
        plugins: [
          Alignment,
          Autoformat,
          Autosave,
          BalloonToolbar,
          BlockQuote,
          Bold,
          Essentials,
          FindAndReplace,
          FontBackgroundColor,
          FontColor,
          FontFamily,
          FontSize,
          Fullscreen,
          Heading,
          HorizontalLine,
          HtmlComment,
          ImageEditing,
          ImageUtils,
          Indent,
          IndentBlock,
          Italic,
          List,
          ListProperties,
          Mention,
          Paragraph,
          PasteFromOffice,
          PlainTableOutput,
          RemoveFormat,
          SpecialCharacters,
          SpecialCharactersArrows,
          SpecialCharactersCurrency,
          SpecialCharactersEssentials,
          SpecialCharactersLatin,
          SpecialCharactersMathematical,
          SpecialCharactersText,
          Table,
          TableCaption,
          TableCellProperties,
          TableColumnResize,
          TableLayout,
          TableProperties,
          TableToolbar,
          TextTransformation,
          TodoList,
          Underline,
        ],
        alignment: {
          options: ["left", "center", "right", "justify"] as AlignmentSupportedOption[],
        },
        balloonToolbar: ["bold", "italic", "|", "bulletedList", "numberedList"],
        fontFamily: {
          supportAllValues: true,
        },
        fontSize: {
          options: [10, 12, 14, "default", 18, 20, 22],
          supportAllValues: true,
        },
        fullscreen: {
          onEnterCallback: (container: HTMLElement) =>
            container.classList.add(
              "editor-container",
              "editor-container_classic-editor",
              "editor-container_include-fullscreen",
              "main-container"
            ),
        },
        heading: { allowAttributes: ["alignment"], options: headingOptions },
        initialData: content || "",
        language: "vi",
        licenseKey: LICENSE_KEY,
        list: {
          properties: {
            styles: true,
            startIndex: true,
            reversed: true,
          },
        },
        mention: {
          feeds: [
            {
              marker: "@",
              feed: [
                /* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
              ],
            },
          ],
        },
        placeholder: "Viết nội dung hợp đồng vào đây!",
        table: {
          contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableProperties", "tableCellProperties"],
        },
        paragraph: {
          allowAttributes: ["alignment"],
        },
        tableCell: { allowAttributes: ["alignment"] },
      },
    };
  }, [content, isLayoutReady]);

  return (
    <div
      className="editor-container editor-container_classic-editor editor-container_include-fullscreen"
      ref={editorContainerRef}
    >
      <div className="editor-container__editor">
        <div ref={editorRef}>
          {editorConfig && (
            <CKEditor
              data={content || ""}
              editor={ClassicEditor}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              config={editorConfig}
              onChange={(_, editor) => onChange(editor.getData())}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
