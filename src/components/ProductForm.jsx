import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { AuthContext } from "../context/AuthContext";
import { DrawerAdminContext } from "../context/DrawerContext";
import { useFetchData } from "../hooks/useFetchData";
import Alert from "./Alert";
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
  discountPercent: yup
    .number()
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .typeError("Discount must be a number"),
  rating: yup
    .number()
    .min(0, "Rating cannot be negative")
    .max(5, "Rating cannot exceed 5")
    .typeError("Rating must be a number"),
});

const ProductForm = ({ product = null, mode = "add", onSuccess }) => {
  const { accessToken } = useContext(AuthContext);
  const { setShowDrawer } = useContext(DrawerAdminContext);
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isActive, setIsActive] = useState(true);
  const [isFavourite, setIsFavourite] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);

  const {
    data: { data: sizes = [] },
  } = useFetchData(import.meta.env.VITE_BASE_URL + "/sizes");

  const {
    data: { data: categories = [] },
  } = useFetchData(import.meta.env.VITE_BASE_URL + "/categories");

  const {
    data: { data: variants = [] },
  } = useFetchData(import.meta.env.VITE_BASE_URL + "/variants");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(AddProductSchema),
    defaultValues: {
      discountPercent: 0,
      rating: 5,
    },
  });

  // auto fill form mode edit
  useEffect(() => {
    if (mode === "edit" && product) {
      setValue("name", product.name);
      setValue("price", product.price);
      setValue("description", product.description);
      setValue("stock", product.stock);
      setValue("discountPercent", product.discountPercent || 0);
      setValue("rating", product.rating || 5);

      // set checkbox states
      setIsActive(product.isActive || false);
      setIsFavourite(product.isFavourite || false);
      setIsFlashSale(product.isFlashSale || false);

      // set preview edit mode
      if (product.productImages && product.productImages.length > 0) {
        setExistingImages(product.productImages);
        setImagePreviews([]);
        setImageFiles([]);
      }

      // set sizes
      if (product.productSizes && product.productSizes.length > 0) {
        const sizeIds = product.productSizes
          .map((sizeName) => {
            const size = sizes.find((s) => s.name === sizeName);
            return size ? size.id : null;
          })
          .filter((id) => id !== null);
        setSelectedSizes(sizeIds);
      }

      // set categories
      if (product.productCategories && product.productCategories.length > 0) {
        const categoryIds = product.productCategories
          .map((catName) => {
            const category = categories.find((c) => c.name === catName);
            return category ? category.id : null;
          })
          .filter((id) => id !== null);
        setSelectedCategories(categoryIds);
      }

      // set variants
      if (product.productVariants && product.productVariants.length > 0) {
        const variantIds = product.productVariants
          .map((varName) => {
            const variant = variants.find((v) => v.name === varName);
            return variant ? variant.id : null;
          })
          .filter((id) => id !== null);
        setSelectedVariants(variantIds);
      }
    } else {
      reset({
        discountPercent: 0,
        rating: 5,
      });
      setImageFiles([]);
      setImagePreviews([]);
      setSelectedSizes([]);
      setSelectedCategories([]);
      setSelectedVariants([]);
      setIsActive(true);
      setIsFavourite(false);
      setIsFlashSale(false);
    }
  }, [mode, product, setValue, reset, sizes, categories, variants]);

  // handle multiple image upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    const totalImages =
      existingImages.length + imageFiles.length + files.length;

    if (totalImages > 4) {
      setAlertStatus({
        type: "error",
        message: "Maximum 4 images allowed",
      });
      return;
    }

    const validFiles = [];
    const newPreviews = [];

    files.forEach((file) => {
      // validasi type
      if (!file.type.match(/image\/(jpeg|jpg|png)/)) {
        setAlertStatus({
          type: "error",
          message: "Only JPG, JPEG, and PNG images are allowed",
        });
        return;
      }

      // validasi size
      if (file.size > 1024 * 1024) {
        setAlertStatus({
          type: "error",
          message: `Image ${file.name} is too large. Maximum size is 1MB`,
        });
        return;
      }

      validFiles.push(file);

      // create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews((prev) => [...prev, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles((prev) => [...prev, ...validFiles]);
  };

  // remove new uploaded image
  const removeNewImage = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // remove existing image from backend
  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // toggle selection
  const toggleSize = (sizeId) => {
    setSelectedSizes((prev) =>
      prev.includes(sizeId)
        ? prev.filter((id) => id !== sizeId)
        : [...prev, sizeId]
    );
  };

  const toggleCategory = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleVariant = (variantId) => {
    setSelectedVariants((prev) =>
      prev.includes(variantId)
        ? prev.filter((id) => id !== variantId)
        : [...prev, variantId]
    );
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // validasi image untuk mode add
      if (mode === "add" && imageFiles.length === 0) {
        setAlertStatus({
          type: "error",
          message: "Please upload at least 1 product image",
        });
        setIsSubmitting(false);
        return;
      }

      // validasi mode edit
      if (
        mode === "edit" &&
        existingImages.length === 0 &&
        imageFiles.length === 0
      ) {
        setAlertStatus({
          type: "error",
          message: "Please keep at least 1 product image",
        });
        setIsSubmitting(false);
        return;
      }

      // validasi size
      if (selectedSizes.length === 0) {
        setAlertStatus({
          type: "error",
          message: "Please select at least 1 size",
        });
        setIsSubmitting(false);
        return;
      }

      // validasi category
      if (selectedCategories.length === 0) {
        setAlertStatus({
          type: "error",
          message: "Please select at least 1 category",
        });
        setIsSubmitting(false);
        return;
      }

      // validasi variant
      if (selectedVariants.length === 0) {
        setAlertStatus({
          type: "error",
          message: "Please select at least 1 variant",
        });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("discountPercent", data.discountPercent || 0);
      formData.append("rating", data.rating || 5);
      formData.append("stock", data.stock);
      formData.append("isFlashSale", isFlashSale);
      formData.append("isActive", isActive);
      formData.append("isFavourite", isFavourite);

      if (mode === "add") {
        imageFiles.forEach((file) => {
          formData.append("fileImages", file);
        });
      } else if (mode === "edit") {
        if (existingImages.length > 0) {
          formData.append("keepExistingImages", existingImages.join(","));
        }
        if (imageFiles.length > 0) {
          imageFiles.forEach((file) => {
            formData.append("fileImages", file);
          });
        }
      }

      formData.append("sizeProducts", selectedSizes.join(","));
      formData.append("productCategories", selectedCategories.join(","));
      formData.append("productVariants", selectedVariants.join(","));

      const url =
        mode === "edit"
          ? `${import.meta.env.VITE_BASE_URL}/admin/products/${product.id}`
          : `${import.meta.env.VITE_BASE_URL}/admin/products`;

      const method = mode === "edit" ? "PATCH" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to ${mode} product`);
      }

      setAlertStatus({
        type: "success",
        message: `Product ${
          mode === "edit" ? "updated" : "created"
        } successfully!`,
      });

      setTimeout(() => {
        setShowDrawer(false);
        if (onSuccess) {
          onSuccess();
        }
      }, 1000);

      // reset form
      reset({
        discountPercent: 0,
        rating: 5,
      });
      setImageFiles([]);
      setImagePreviews([]);
      setSelectedSizes([]);
      setSelectedCategories([]);
      setSelectedVariants([]);
      setIsActive(true);
      setIsFavourite(false);
      setIsFlashSale(false);
    } catch (err) {
      setAlertStatus({
        type: "error",
        message: err.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => setAlertStatus({ type: "", message: "" })}
      />
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
              Photo Product{" "}
              {mode === "add" && <span className="text-red-500">*</span>}
              <span className="text-xs text-gray-500">
                {" "}
                (Max 4 images, 1MB each)
              </span>
            </label>

            {/* preview image */}
            {mode === "edit" && existingImages.length > 0 && (
              <div className="mb-3">
                <p className="mb-2 text-xs text-gray-600">Current Images:</p>
                <div className="grid grid-cols-3 gap-2">
                  {existingImages.map((image, index) => (
                    <div key={`existing-${index}`} className="relative group">
                      <img
                        src={image}
                        alt={`Existing ${index + 1}`}
                        className="object-cover w-full h-20 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute flex items-center justify-center w-5 h-5 text-xs text-white transition bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100">
                        ✕
                      </button>
                      {index === 0 && (
                        <span className="absolute px-2 py-1 text-xs text-white bg-blue-500 rounded bottom-1 left-1">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {imagePreviews.length > 0 && (
              <div className="mb-3">
                <p className="mb-2 text-xs text-gray-600">
                  {mode === "edit"
                    ? "New Images to Upload:"
                    : "Preview Images:"}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={`new-${index}`} className="relative group">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="object-cover w-full h-20 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute flex items-center justify-center w-5 h-5 text-xs text-white transition bg-red-500 rounded-full opacity-0 top-1 right-1 group-hover:opacity-100">
                        ✕
                      </button>
                      {mode === "add" && index === 0 && (
                        <span className="absolute px-2 py-1 text-xs text-white bg-blue-500 rounded bottom-1 left-1">
                          Primary
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {mode === "add" && imagePreviews.length === 0 && (
              <div className="flex items-center justify-center w-16 h-16 mb-3 bg-gray-100 rounded-lg">
                <img src="/icon/empty-preview.svg" alt="Empty preview" />
              </div>
            )}

            {/* Upload Button */}
            <>
              <input
                type="file"
                id="image-upload"
                accept="image/jpeg,image/jpg,image/png"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                disabled={existingImages.length + imagePreviews.length >= 4}
              />
              <label
                htmlFor="image-upload"
                className={`px-4 py-2 rounded-lg cursor-pointer transition text-sm font-medium inline-block ${
                  existingImages.length + imagePreviews.length >= 4
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#FF8906] hover:bg-[#e57a05]"
                }`}>
                {existingImages.length + imagePreviews.length >= 4
                  ? "Max images reached"
                  : mode === "edit"
                  ? imageFiles.length > 0
                    ? "Add More Images"
                    : "Upload New Images"
                  : "Upload Images"}
              </label>
            </>
          </div>

          {/* Product Name */}
          <Input
            {...register("name")}
            id="name"
            label="Product Name"
            error={errors}
            type="text"
            placeholder="Enter Product Name"
            required
          />

          {/* Price */}
          <Input
            {...register("price")}
            id="price"
            label="Price (IDR)"
            error={errors}
            type="number"
            placeholder="Enter Product Price"
            required
          />

          {/* Discount & Rating */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register("discountPercent")}
              id="discountPercent"
              label="Discount (%)"
              error={errors}
              type="number"
              placeholder="0"
              step="0.01"
            />
            <Input
              {...register("rating")}
              id="rating"
              label="Rating"
              error={errors}
              type="number"
              placeholder="5"
              step="0.1"
              min="0"
              max="5"
            />
          </div>

          {/* Description */}
          <div>
            <label className="font-bold text-sm sm:text-base text-[#0B132A] mb-3 block">
              Description <span className="text-red-500">*</span>
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
              Product Size <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size.id}
                  type="button"
                  onClick={() => toggleSize(size.id)}
                  className={`px-6 py-2 text-sm rounded-lg border transition ${
                    selectedSizes.includes(size.id)
                      ? "bg-[#FF8906] text-white border-[#FF8906]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#FF8906]"
                  }`}>
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Category */}
          <div>
            <label className="font-bold text-sm sm:text-base text-[#0B132A] mb-3 block">
              Product Category <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => toggleCategory(category.id)}
                  className={`px-6 py-2 text-sm rounded-lg border transition ${
                    selectedCategories.includes(category.id)
                      ? "bg-[#FF8906] text-white border-[#FF8906]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#FF8906]"
                  }`}>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Variant */}
          <div>
            <label className="font-bold text-sm sm:text-base text-[#0B132A] mb-3 block">
              Product Variant <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => toggleVariant(variant.id)}
                  className={`px-6 py-2 text-sm rounded-lg border transition ${
                    selectedVariants.includes(variant.id)
                      ? "bg-[#FF8906] text-white border-[#FF8906]"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#FF8906]"
                  }`}>
                  {variant.name}
                </button>
              ))}
            </div>
          </div>

          {/* Stock */}
          <div>
            <label className="font-bold text-sm sm:text-base text-[#0B132A] mb-3 block">
              Stock <span className="text-red-500">*</span>
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

          <div>
            <label className="font-bold text-sm sm:text-base text-[#0B132A] mb-3 block">
              Product Status
            </label>
            <div className="flex flex-col gap-5">
              {/* Is Active */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-[#FF8906] border-gray-300 rounded focus:ring-[#FF8906]"
                />
                <span className="text-sm text-gray-700">Active Product</span>
              </label>

              {/* Is Favourite */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFavourite}
                  onChange={(e) => setIsFavourite(e.target.checked)}
                  className="w-4 h-4 text-[#FF8906] border-gray-300 rounded focus:ring-[#FF8906]"
                />
                <span className="text-sm text-gray-700">Favourite Product</span>
              </label>

              {/* Is Flash Sale */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFlashSale}
                  onChange={(e) => setIsFlashSale(e.target.checked)}
                  className="w-4 h-4 text-[#FF8906] border-gray-300 rounded focus:ring-[#FF8906]"
                />
                <span className="text-sm text-gray-700">Flash Sale</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-white rounded-lg font-medium mt-2 transition ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#FF8906] hover:bg-[#e57a05]"
            }`}>
            {isSubmitting
              ? "Saving..."
              : mode === "edit"
              ? "Save Changes"
              : "Save Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
