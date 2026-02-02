import React, { useState, useEffect, useRef } from "react";
import { Eraser, Save, Undo2, Redo2 } from "lucide-react";
import Toolbar from "./Toolbar";

export default function Editnotes({ thisNote, setActiveView }) {
  const [title, setTitle] = useState(thisNote?.title || "");
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef(null);
  const [activeAlignment, setActiveAlignment] = useState(null);

  const getCleanHtml = () => {
    if (!editorRef.current) return "";
    const rawHtml = editorRef.current.innerHTML;
    // Remove Zero-Width Spaces (\u200B) and unstyled empty spans
    return rawHtml
      .replace(/\u200B/g, "")
      .replace(/<span style="all: initial;"> <\/span>/g, " ");
  };

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

    if (document.queryCommandState("justifyCenter"))
      setActiveAlignment("center");
    else if (document.queryCommandState("justifyRight"))
      setActiveAlignment("right");
    else setActiveAlignment("left");
  };

  useEffect(() => {
    if (editorRef.current && thisNote?.content) {
      editorRef.current.innerHTML = thisNote.content;
    }
  }, [thisNote]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const content = editorRef.current.innerHTML;
    let privacy = thisNote.privacy;

    // Privacy logic preservation
    if (privacy === "public" || privacy === "reject") privacy = "private";

    if (!title.trim() || !content.trim() || content === "<br>")
      return alert("The archives require both a title and substance.");

    setIsSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await fetch(
        `http://localhost:3400/notes/updateNote/${thisNote._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ title, content, privacy }),
        }
      );

      if (!response.ok) throw new Error("The archives failed to update.");
      setActiveView(thisNote._id);
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const applyFormat = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
  };

  const activeAlignmentReset = (sel) => {
    setActiveAlignment(sel);
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

  return (
    <div className="w-full max-w-4xl mx-auto p-1 bg-[#FDFBF7] border border-[#E5E1DA] rounded-lg shadow-sm font-serif">
      <form onSubmit={handleSubmit} className="space-y-1">
        {/* Toolbar */}
        <div>
          <div>
            <Toolbar
              handleSubmit={handleSubmit}
              applyFormat={applyFormat}
              applyAmberHighlight={applyAmberHighlight}
              isSaving={isSaving}
              activeAlignment={activeAlignment}
              activeAlignmentReset={activeAlignmentReset}
            />
          </div>
        </div>
        {/* contentEditable Area */}

        <div className="relative min-h-[400px]">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled Transcription..."
            className="w-full bg-transparent text-xl font-bold text-[#5C2E0E] placeholder-[#D4A373]/30 outline-none border-b border-[#F5F2ED] pb-4"
          />
          <div
            ref={editorRef}
            contentEditable
            onKeyDown={handleKeyDown}
            suppressContentEditableWarning={true}
            className="w-full p-4 min-h-[400px] text-[#2C2C2C] leading-relaxed font-serif text-lg outline-none prose prose-stone"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 border-t border-[#F5F2ED]">
          <button
            type="button"
            onClick={() => (editorRef.current.innerHTML = "")}
            className="px-6 py-2 text-xs font-bold text-[#A09B93] hover:text-[#8B4513] uppercase tracking-widest flex items-center gap-2"
          >
            <Eraser size={14} /> Clear Page
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-2 bg-[#8B4513] hover:bg-[#5C2E0E] text-[#FDFBF7] rounded shadow-md disabled:opacity-50 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
          >
            <Save size={14} /> {isSaving ? "Updating..." : "Update Archive"}
          </button>
        </div>
      </form>
    </div>
  );
}
