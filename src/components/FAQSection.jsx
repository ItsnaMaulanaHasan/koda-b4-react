import { useState } from "react";
import { useFetchData } from "../hooks/useFetchData";

function FAQSection() {
  const { data: faqs, isLoading, error } = useFetchData("/data/faqs.json");
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#5a8120] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center">
        <div className="p-8 text-center border border-red-200 rounded-lg bg-red-50">
          <img src="/icon/icon-warning.svg" alt="Icon Warning" />
          <p className="font-medium text-red-600">Error: {error}</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-7">
      {faqs.map((faq, index) => (
        <div
          key={faq.id}
          className="overflow-hidden transition-all duration-300 bg-white border border-gray-100 shadow-md rounded-2xl hover:shadow-xl">
          <button
            onClick={() => toggleFAQ(index)}
            className="flex items-center justify-between w-full p-6 text-left transition-colors duration-200 hover:bg-green-50/50"
            aria-expanded={openIndex === index}>
            <span className="pr-8 text-lg font-semibold text-gray-800">
              {faq.question}
            </span>
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full bg-[#5a8120] flex items-center justify-center transition-transform duration-300 ${
                openIndex === index ? "rotate-180" : ""
              }`}>
              <img
                className="h-6"
                src="/public/icon/icon-dropdown-white.svg"
                alt="Icon Dropdown"
              />
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openIndex === index ? "max-h-96" : "max-h-0"
            }`}>
            <div className="px-6 pb-6 leading-relaxed text-gray-600">
              {faq.answer}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default FAQSection;
