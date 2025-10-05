import Button from "./Button";

function CardMenu({ dataMenu }) {
  return (
    <div className="w-full h-full">
      <div className="relative">
        <img className="size-full" src={dataMenu.image} alt={dataMenu.name} />
        {dataMenu.isFlashSale && (
          <span className="absolute top-2 left-2 py-3 px-2 bg-[#D00000] text-white uppercase font-bold rounded-full">
            Flash sale!
          </span>
        )}
      </div>
      <div className="py-5 px-4 w-12/13 mx-auto -mt-13 z-50 bg-white shadow-md relative flex flex-col gap-3">
        <h1 className="font-medium text-2xl">{dataMenu.name}</h1>
        <p className="text-[#4F5665] text-sm">{dataMenu.description}</p>
        <div className="flex items-center gap-2">
          {dataMenu.discountPrice && (
            <span className="text-sm line-through text-red-500">
              IDR ${dataMenu.price.toLocaleString("id")}
            </span>
          )}
          <span className="font-medium text-2xl text-[#FF8906]">
            {dataMenu.discountPrice
              ? `IDR ${dataMenu.discountPrice.toLocaleString("id")}`
              : `IDR ${dataMenu.price.toLocaleString("id")}`}
          </span>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#FF8906] flex-2">Buy</Button>
          <Button className="flex-1 border border-[#FF8906] text-[#FF8906] justify-items-center content-center">
            <img src="/icon/icon-cart-orange.svg" alt="Icon Cart Orange" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default CardMenu;
