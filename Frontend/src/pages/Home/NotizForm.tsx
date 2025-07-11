import React, { useState } from "react";
import { createNotiz, Notiz } from "../../api/notizenApi";
import { useToast } from "../../context/ToastContext";

interface NotizFormProps {
  setNotizen: React.Dispatch<React.SetStateAction<Notiz[]>>;
}

const NotizForm: React.FC<NotizFormProps> = ({ setNotizen }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const newNotiz = await createNotiz(title, text);
      setNotizen((prevNotizen) => [...prevNotizen, newNotiz]);
      setTitle("");
      setText("");
      showToast("Notiz erfolgreich erstellt", "success");
    } catch (error: unknown) {
      console.error("Fehler beim Hinzufügen:", error);
      showToast("Fehler beim Erstellen der Notiz", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Titel
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          aria-label="Titel eingeben"
        />
      </div>
      <div>
        <label
          htmlFor="text"
          className="block text-sm font-medium text-gray-700"
        >
          Text
        </label>
        <textarea
          id="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
          aria-label="Text eingeben"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-gradient-to-r from-[#a1c4fd] to-[#c2e9fb] text-[#4a90e2] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
        aria-label="Notiz hinzufügen"
      >
        Notiz Speichern
      </button>
    </form>
  );
};

export default NotizForm;
