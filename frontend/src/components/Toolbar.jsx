import React, { useState, useRef } from "react";
import {
  Highlighter,
  Heading,
  List,
  Type,
  Eraser,
  Save,
  Italic,
  Underline,
  Bold,
  AlignCenter,
  AlignLeft,
  AlignRight,
  Undo2,
  Redo2,
} from "lucide-react";

export default function Toolbar({
  applyFormat,
  applyAmberHighlight,
  isBoldActive,
  setIsBoldActive,
  isItalicActive,
  setIsItalicActive,
  isUnderlineActive,
  setIsUnderlineActive,
  isSaving,
  activeAlignment,
  activeAlignmentReset,
  handleSubmit,
}) {
  const [title, setTitle] = useState("");

  const editorRef = useRef(null);
  //const [isBoldActive, setIsBoldActive] = useState(false);
  // const [isItalicActive, setIsItalicActive] = useState(false);
  //const [isUnderlineActive, setIsUnderlineActive] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center gap-1 border-y border-[#F5F2ED] sticky top-0 bg-[#FDFBEB] z-10">
        <button
          type="button"
          onClick={(e) => {
            handleSubmit(e);
          }}
          disabled={isSaving}
          className="p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded flex items-center gap-1 text-xs font-bold uppercase transition-all active:scale-95"
          title="Italic (Ctrl+I)"
        >
          <Save size={18} strokeWidth={3} />
          Save
          <span className="hidden md:inline "></span>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("undo")}
          className="p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded flex items-center gap-1 text-xs font-bold uppercase transition-all active:scale-95"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={18} strokeWidth={3} />
          <span className="hidden md:inline "></span>
        </button>
        <button
          type="button"
          onClick={() => applyFormat("redo")}
          className="p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded flex items-center gap-1 text-xs font-bold uppercase transition-all active:scale-95"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={18} strokeWidth={3} />
          <span className="hidden md:inline "></span>
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-1 border-y border-[#F5F2ED] sticky top-0 bg-[#FDFBEB] z-10">
        {/* Highlight Button */}
        <button
          type="button"
          onClick={applyAmberHighlight}
          className="p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded text-xs font-bold uppercase flex items-center gap-1 transition-all active:scale-95"
        >
          <Highlighter size={18} />
          <span className="hidden md:inline">Highlight</span>
        </button>

        {/* Heading Button */}
        <button
          type="button"
          onClick={() => applyFormat("formatBlock", "H2")}
          className="p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded text-xs font-bold uppercase flex items-center gap-1 transition-all active:scale-95"
        >
          <Heading size={18} />
          <span className="hidden md:inline">Heading</span>
        </button>

        {/* List Button */}
        <button
          type="button"
          onClick={() => applyFormat("insertUnorderedList")}
          className="p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded text-xs font-bold uppercase flex items-center gap-1 transition-all active:scale-95"
          title="Add/Remove Bullet List"
        >
          <List size={18} />
          <span className="hidden md:inline">Bullet</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setIsBoldActive(!isBoldActive);
            applyFormat("bold");
          }}
          className={`p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded flex items-center gap-1 text-xs font-bold uppercase transition-all active:scale-95 ${
            isBoldActive ? "bg-[#FFF2CC]" : ""
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} strokeWidth={3} />
          <span className="hidden md:inline"></span>
        </button>
        <button
          type="button"
          onClick={() => {
            setIsItalicActive(!isItalicActive);
            applyFormat("Italic");
          }}
          className={`p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded flex items-center gap-1 text-xs uppercase transition-all active:scale-95 ${
            isItalicActive ? "bg-[#FFF2CC]" : ""
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} strokeWidth={3} />
          <span className="hidden md:inline "></span>
        </button>
        <button
          type="button"
          onClick={() => {
            setIsUnderlineActive(!isUnderlineActive);
            applyFormat("underline");
          }}
          className={`p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded flex items-center gap-1 text-xs uppercase transition-all active:scale-95 ${
            isUnderlineActive ? "bg-[#FFF2CC]" : ""
          }`}
          title="Underline (Ctrl+U)"
        >
          <Underline size={18} strokeWidth={3} />
          <span className="hidden md:inline "></span>
        </button>
        <button
          type="button"
          onClick={() => {
            activeAlignmentReset("left");
            applyFormat("justifyLeft");
          }}
          className={`p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded flex items-center gap-1 text-xs font-bold uppercase transition-all active:scale-95 ${
            activeAlignment === "left" ? "bg-[#FFF2CC]" : ""
          }`}
          title="Left Align (Ctrl+L)"
        >
          <AlignLeft size={18} strokeWidth={3} />
          <span className="hidden md:inline "></span>
        </button>
        <button
          type="button"
          onClick={() => {
            activeAlignmentReset("center");
            applyFormat("justifyCenter");
          }}
          className={`p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded flex items-center gap-1 text-xs font-bold uppercase transition-all active:scale-95 ${
            activeAlignment === "center" ? "bg-[#FFF2CC]" : ""
          }`}
          title="Center Align (Ctrl+E)"
        >
          <AlignCenter size={18} strokeWidth={3} />
          <span className="hidden md:inline "></span>
        </button>
        <button
          type="button"
          onClick={() => {
            activeAlignmentReset("right");
            applyFormat("justifyRight");
          }}
          className={`p-3 md:p-2 hover:bg-[#F5F2ED] text-[#8B4513] rounded flex items-center gap-1 text-xs font-bold uppercase transition-all active:scale-95 ${
            activeAlignment === "right" ? "bg-[#FFF2CC]" : ""
          }`}
          title="Right Align (Ctrl+R)"
        >
          <AlignRight size={18} strokeWidth={3} />
          <span className="hidden md:inline "></span>
        </button>
      </div>
    </>
  );
}
