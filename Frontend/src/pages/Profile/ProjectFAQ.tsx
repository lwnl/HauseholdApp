import React, { useState } from "react";
import useDarkMode from "../../context/useDarkMode";

const faqs = [
  {
    question: "Wie kann ich mein Profilbild ändern?",
    answer:
      "Klicken Sie auf das Stiftsymbol unten rechts im Profilbild, um ein neues Bild hochzuladen.",
  },
  {
    question: "Wie aktiviere ich den Dark Mode?",
    answer:
      'Klicken Sie auf den "Dark Mode"-Button in den Einstellungen, um den Dunkelmodus zu aktivieren.',
  },
  {
    question: "Wie ändere ich meine Spracheinstellungen?",
    answer:
      "Gehen Sie zu den Einstellungen und wählen Sie Ihre bevorzugte Sprache aus der Dropdown-Liste aus.",
  },
  {
    question: "Wie kann ich mein Passwort zurücksetzen?",
    answer:
      "Besuchen Sie die Passwort-Wiederherstellungsseite und folgen Sie den Anweisungen, um Ihr Passwort zurückzusetzen.",
  },
];

const ProjectFAQ: React.FC = () => {
  const { darkMode } = useDarkMode();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className={`p-4 max-w-2xl mx-auto ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {faqs.map((faq, index) => (
        <div
          key={index}
          className={`border-b ${
            darkMode ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <button
            onClick={() => toggleAccordion(index)}
            className={`w-full flex justify-between items-center p-4 text-left focus:outline-none ${
              darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            }`}
          >
            <span className="font-medium">{faq.question}</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${
                openIndex === index ? "rotate-180" : ""
              }`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {openIndex === index && (
            <div className="p-4">
              <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProjectFAQ;
