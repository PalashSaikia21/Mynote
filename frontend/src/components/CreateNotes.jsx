import React, { useState, useRef } from "react";
import { Eraser, Save } from "lucide-react";
import Toolbar from "./Toolbar";

export default function Createnote({ setActiveView }) {
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);
  const [isBoldActive, setIsBoldActive] = useState(false);
  const [isItalicActive, setIsItalicActive] = useState(false);
  const [isUnderlineActive, setIsUnderlineActive] = useState(false);
  const [activeAlignment, setActiveAlignment] = useState(null); // "left", "center",
  // "right"

  // --- UTILITIES ---

  // Cleans the HTML of invisible markers before saving to DB
  const getCleanHtml = () => {
    if (!editorRef.current) return "";
    const rawHtml = editorRef.current.innerHTML;
    // Remove Zero-Width Spaces (\u200B) and unstyled empty spans
    return rawHtml
      .replace(/\u200B/g, "")
      .replace(/<span style="all: initial;"> <\/span>/g, " ");
  };

  // --- CORE FORMATTING LOGIC ---

  const applyAmberHighlight = () => {
    const selection = window.getSelection();

    if (!selection.isCollapsed) {
      // This native method expands the selection to the nearest "word" boundaries
      selection.modify("extend", "backward", "word");
      selection.modify("extend", "forward", "word");
    } else {
      return alert("Select text to highlight first.");
    }

    const range = selection.getRangeAt(0);
    const parent = selection.anchorNode.parentElement;

    // --- REMOVE HIGHLIGHT LOGIC ---
    // Check if the selection is already inside our amber span
    if (parent && parent.classList.contains("bg-[#FFF2CC]")) {
      const textNode = document.createTextNode(parent.textContent);
      parent.replaceWith(textNode);
      editorRef.current.focus();
      return;
    }
    // 1. EXPANSION LOGIC: If a portion of a word is selected, expand to word boundaries

    // --- ADD HIGHLIGHT LOGIC ---
    const span = document.createElement("span");
    span.className = "bg-[#FFF2CC] px-1 rounded text-[#5C2E0E] font-bold";

    try {
      range.surroundContents(span);

      // Invisible marker fix (Zero-Width Space) to stop styling bleed
      // Use \u200B instead of \u00A0 to avoid visible extra spaces
      const invisibleMarker = document.createTextNode("\u200B");
      range.collapse(false);
      range.insertNode(invisibleMarker);

      // Move cursor to the invisible marker
      const newRange = document.createRange();
      newRange.setStartAfter(invisibleMarker);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    } catch (e) {
      return alert("Please select text within a single paragraph.");
    }

    editorRef.current.focus();
  };

  // Sync toolbar button states based on current selection
  const syncToolbarState = () => {
    setIsBoldActive(document.queryCommandState("bold"));
    setIsItalicActive(document.queryCommandState("italic"));
    setIsUnderlineActive(document.queryCommandState("underline"));
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const activeAlignmentReset = (sel) => {
    setActiveAlignment(sel);
  };

  const addBlock = (tagName, className) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    const el = document.createElement(tagName);
    el.className = className;
    el.innerHTML = selection.toString() || "\u00A0";

    range.deleteContents();
    range.insertNode(el);

    // Move cursor after the new block
    const spacer = document.createTextNode("\u00A0");
    el.after(spacer);
    range.setStartAfter(spacer);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    editorRef.current.focus();
  };

  const handleKeyDown = (e) => {
    const isMeta = e.metaKey || e.ctrlKey;
    if (isMeta && e.key.toLowerCase() === "l") {
      e.preventDefault(e);
      applyFormat("justifyLeft");
      setActiveAlignment("left");
    }
    if (isMeta && e.key.toLowerCase() === "e") {
      e.preventDefault(e);
      applyFormat("justifyCenter");
      setActiveAlignment("center");
    }

    if (isMeta && e.key.toLowerCase() === "r") {
      e.preventDefault(e);
      applyFormat("justifyRight");
      setActiveAlignment("right");
    }
    if (isMeta && e.key.toLowerCase() === "s") {
      e.preventDefault(e);
      handleSubmit(e);
    }
    if (isMeta && e.key.toLowerCase() === "z") {
      e.preventDefault(e);
      applyFormat("undo");
    }
    if (isMeta && e.key.toLowerCase() === "y") {
      e.preventDefault(e);
      applyFormat("redo");
    }

    //e.preventDefault();
    if (e.key === "Tab") {
      e.preventDefault(); // Critical: prevent moving focus off the editor
      applyTab();
    }
  };

  const applyTab = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);

    // 2. Create a "Tab" replacement (4 non-breaking spaces)
    // Or use '\u0009' if your CSS handles white-space: pre
    const tabNode = document.createTextNode("\u00A0\u00A0\u00A0\u00A0");

    // 3. Insert it and move the cursor
    range.insertNode(tabNode);
    range.setStartAfter(tabNode);
    range.setEndAfter(tabNode);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = getCleanHtml();

    if (!title.trim() || !content.trim() || content === "<br>")
      return alert("The archives require substance.");

    setIsSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `https://mynotebackend-qmqy.onrender.com/notes/createNote/${user._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ title, content }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();

      setTitle("");
      editorRef.current.innerHTML = "";
      setActiveView(data.note._id);
    } catch (error) {
      console.error("Error saving note:", error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1 bg-[#FDFBF7] border border-[#E5E1DA] rounded-lg shadow-sm font-serif">
      <form onSubmit={handleSubmit} className="space-y-1">
        {/* Title */}

        {/* Toolbar */}
        <div>
          <Toolbar
            handleSubmit={handleSubmit}
            applyFormat={applyFormat}
            applyAmberHighlight={applyAmberHighlight}
            isSaving={isSaving}
            isBoldActive={isBoldActive}
            setIsBoldActive={setIsBoldActive}
            isItalicActive={isItalicActive}
            setIsItalicActive={setIsItalicActive}
            isUnderlineActive={isUnderlineActive}
            setIsUnderlineActive={setIsUnderlineActive}
            activeAlignment={activeAlignment}
            activeAlignmentReset={activeAlignmentReset}
          />
        </div>
        {/* Editor Area */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Untitled Transcription..."
          className="w-full bg-transparent text-xl font-bold text-[#5C2E0E] placeholder-[#D4A373]/30 outline-none border-b border-[#F5F2ED] pb-4"
        />

        <div className="relative min-h-[400px]">
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onKeyDown={handleKeyDown}
            onSelect={syncToolbarState}
            onKeyUp={syncToolbarState}
            className="w-full px-4 min-h-[400px] text-[#2C2C2C] leading-relaxed text-lg outline-none"
            data-placeholder="Begin your transcription here..."
          />
          <style>{`
            [contenteditable]:empty:before { content: attr(data-placeholder); color: #D4A373; opacity: 0.5; }
            [contenteditable] h2 { font-size: 1.5rem; font-weight: bold; color: #5C2E0E; margin-top: 1.5rem; }
            [contenteditable] ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
            [contenteditable] p { margin-bottom: 1rem; }
          `}</style>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-[#F5F2ED]">
          <button
            type="button"
            onClick={() => {
              setTitle("");
              editorRef.current.innerHTML = "";
            }}
            className="text-[#A09B93] hover:text-[#8B4513] text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <Eraser size={14} /> Burn Draft
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-2 bg-[#8B4513] hover:bg-[#5C2E0E] text-[#FDFBF7] rounded shadow-md text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <Save size={14} /> {isSaving ? "Archiving..." : "Save Note"}
          </button>
        </div>
      </form>
    </div>
  );
}
