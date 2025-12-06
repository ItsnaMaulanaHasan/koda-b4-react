import { useState } from "react";

function ImageGallerySection({ product }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const images =
    Array.isArray(product.prouductImages) && product.prouductImages.length > 0
      ? product.prouductImages
      : [product.prouductImages || "/img/empty-image-placeholder.webp"];

  return (
    <div className="flex flex-col gap-3 sm:gap-4 md:gap-5">
      {/* main image */}
      <div className="relative w-full h-64 overflow-hidden bg-gray-100 shadow-lg sm:h-80 md:h-96 rounded-2xl group">
        <img
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          src={images[selectedImageIndex]}
          alt={`${product.name} - Main view`}
        />

        {/* image counter */}
        {images.length > 1 && (
          <div className="absolute px-3 py-2 text-sm font-medium text-white rounded-full shadow-lg top-4 right-4 bg-black/60 backdrop-blur-sm">
            {selectedImageIndex + 1} / {images.length}
          </div>
        )}

        {images.length > 1 && (
          <>
            {/* next */}
            <button
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="absolute flex items-center justify-center w-10 h-10 transition-all duration-300 -translate-y-1/2 rounded-full shadow-lg opacity-0 left-4 top-1/2 bg-white/90 hover:bg-white group-hover:opacity-100 hover:scale-110"
              aria-label="Previous image">
              <img
                className="rotate-90"
                src="/icon/icon-dropdown.svg"
                alt="Icon Next"
              />
            </button>

            {/* prev */}
            <button
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute flex items-center justify-center w-10 h-10 transition-all duration-300 -translate-y-1/2 rounded-full shadow-lg opacity-0 right-4 top-1/2 bg-white/90 hover:bg-white group-hover:opacity-100 hover:scale-110"
              aria-label="Next image">
              <img
                className="-rotate-90"
                src="/icon/icon-dropdown.svg"
                alt="Icon Next"
              />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div
          className={`grid gap-2 sm:gap-3 ${
            images.length === 2
              ? "grid-cols-2"
              : images.length === 3
              ? "grid-cols-3"
              : "grid-cols-4"
          }`}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`relative h-20 sm:h-24 md:h-32 rounded-lg overflow-hidden transition-all duration-300 ${
                selectedImageIndex === index
                  ? "ring-4 ring-[#5a8120] ring-offset-2 scale-95"
                  : "hover:ring-2 hover:ring-gray-300 hover:scale-95 opacity-70 hover:opacity-100"
              }`}>
              <img
                className="object-cover w-full h-full"
                src={image}
                alt={`${product.name} - View ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageGallerySection;
