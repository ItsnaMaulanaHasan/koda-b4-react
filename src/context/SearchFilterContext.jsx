import { createContext } from "react";

export const SearchFilterContext = createContext({
  searchFilter: {
    search: "",
    categoryFilter: [],
    sortName: "",
    sortPrice: "",
    priceRange: { minPrice: 0, maxPrice: 1000000 },
  },
  setSearchFilter: function () {},
});
