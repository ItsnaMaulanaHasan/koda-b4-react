import PromoSection from "../components/PromoSection";

function ProductPage() {
  return (
    <>
      <div className="flex flex-col gap-10 mt-20">
        <div className="px-20 py-20 bg-[url('img/img-header-product.png')] font-medium text-white text-5xl bg-no-repeat bg-cover bg-center">
          We Provide Good Coffee and Healthy Meals
        </div>
        <div className="px-20">
          <PromoSection />
        </div>
        <div className="px-20">
          <h1 className="font-medium text-5xl">
            Our <span className="text-[#8E6447]">Product</span>
          </h1>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
