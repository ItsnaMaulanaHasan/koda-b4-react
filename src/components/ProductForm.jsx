import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { DrawerAdminContext } from "../context/DrawerContext";
import Input from "./Input";

const AddProductSchema = yup.object({
  name: yup
    .string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters"),
  price: yup
    .number()
    .required("Price is required")
    .positive("Price must be positive")
    .typeError("Price must be a number"),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  stock: yup
    .number()
    .required("Stock is required")
    .min(0, "Stock cannot be negative")
    .typeError("Stock must be a number"),
});

const ProductForm = ({ product = null, mode = "add" }) => {
  const { setShowDrawer } = useContext(DrawerAdminContext);
  const [images, setImages] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(AddProductSchema),
  });

  const sizes = ["R", "L", "XL", "250 gr", "500gr"];

  // Auto-fill form jika mode edit
  useEffect(() => {
    if (mode === "edit" && product) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("description", product.description || product.desc);
      setValue("stock", product.stock);

      // Set images jika ada
      if (product.images && Array.isArray(product.images)) {
        setImages(product.images);
      } else if (product.image) {
        setImages([product.image]);
      }

      // Set sizes jika ada
      if (product.sizes && Array.isArray(product.sizes)) {
        setSelectedSizes(product.sizes);
      } else if (product.size) {
        // Convert "R,L,XL,250gr" ke array
        const sizesArray = product.size.split(",").map((s) => s.trim());
        setSelectedSizes(sizesArray);
      }
    } else {
      // Reset form untuk mode add
      reset();
      setImages([]);
      setSelectedSizes([]);
    }
  }, [mode, product, setValue, reset]);

  // Handle multiple image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  // Remove image
  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Toggle size selection
  const toggleSize = (size) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((s) => s !== size);
      }
      return [...prev, size];
    });
  };

  const onSubmit = (data) => {
    const productData = {
      ...data,
      images: images,
      sizes: selectedSizes,
      id: mode === "edit" ? product.id : Date.now(),
    };

    if (mode === "edit") {
      console.log("Update Product:", productData);
    } else {
      console.log("Add Product:", productData);
    }
    setShowDrawer(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-5 p-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">
            {mode === "edit" ? "Edit Product" : "Add Product"}
          </h1>
          <button
            onClick={() => setShowDrawer(false)}
            className="flex items-center justify-center text-red-500 transition border-2 border-red-500 rounded-full w-7 h-7 hover:bg-red-50">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Photo Product */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Photo Product
            </label>

            {/* Image Preview Grid */}

            {/* Upload Button */}
            <div className="flex flex-col items-start gap-3">
              {images.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-20 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute flex items-center justify-center w-5 h-5 text-xs text-white transition bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100">
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-lg">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}

              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              <label
                htmlFor="image-upload"
                className="px-4 py-2 bg-[#FF8906] rounded-lg cursor-pointer hover:bg-[#e57a05] transition text-sm font-medium">
                Upload
              </label>
            </div>
          </div>

          {/* Product Name */}
          <Input
            {...register("name")}
            id="name"
            label="Product Name"
            error={errors}
            type="text"
            placeholder="Enter Product Name"
          />

          {/* Price */}
          <Input
            {...register("price")}
            id="price"
            label="Price"
            error={errors}
            type="number"
            placeholder="Enter Product Price"
          />

          {/* Description */}
          <div>
            <label className="font-bold text-sm sm:text-base text-[#0B132A] mb-3 block">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Enter Product Description"
              rows={5}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8906] resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Product Size */}
          <div>
            <label className="font-bold text-sm sm:text-base text-[#0B132A] mb-3 block">
              Product Size
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-6 py-2 text-sm rounded-lg border transition ${
                    selectedSizes.includes(size)
                      ? "bg-[#FF8906] text-white border-[#FF8906]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#FF8906]"
                  }`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="font-bold text-sm sm:text-base text-[#0B132A] mb-3 block">
              Stock
            </label>
            <input
              {...register("stock")}
              type="number"
              placeholder="Enter Product Stock"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8906]"
            />
            {errors.stock && (
              <p className="mt-1 text-xs text-red-500">
                {errors.stock.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#FF8906] text-white rounded-lg hover:bg-[#e57a05] transition font-medium mt-2">
            {mode === "edit" ? "Edit Save" : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
