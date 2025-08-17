import { create } from "zustand";
import type { Editor } from "@ckeditor/ckeditor5-core";

interface EditorState {
  editorInstance: Editor | null;
  setEditor: (editor: Editor) => void;
  getEditor: () => Editor | null;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  editorInstance: null,

  setEditor: (editor) => set({ editorInstance: editor }),

  getEditor: () => get().editorInstance,
}));
