import { useContext, useState } from "react";
import Drawer from "../components/Drawer";
import UserForm from "../components/UserForm";
import { DrawerAdminContext } from "../context/DrawerContext";

const users = [
  {
    id: 1,
    image: "/img-menus/image1.png",
    fullName: "Eleanor Pena",
    phone: "(205) 555-0100",
    address: "3517 W. Gray St. Utica, Pennsylvania 57867",
    email: "cikaracak@gmail.com",
  },
  {
    id: 2,
    image: "/img-menus/image1.png",
    fullName: "Ronald Richards",
    phone: "(205) 555-0100",
    address: "1901 Thornridge Cir. Shiloh, Hawaii 81063",
    email: "cikaracak@gmail.com",
  },
  {
    id: 3,
    image: "/img-menus/image1.png",
    fullName: "Darlene Robertson",
    phone: "(209) 555-0104",
    address: "4140 Parker Rd. Allentown, New Mexico 31134",
    email: "cikaracak@gmail.com",
  },
  {
    id: 4,
    image: "/img-menus/image1.png",
    fullName: "Kristin Watson",
    phone: "(252) 555-0126",
    address: "2972 Westheimer Rd. Santa Ana, Illinois 85486",
    email: "cikaracak@gmail.com",
  },
  {
    id: 5,
    image: "/img-menus/image1.png",
    fullName: "Dianne Russell",
    phone: "(201) 555-0124",
    address: "4517 Washington Ave. Manchester, Kentucky 39495",
    email: "cikaracak@gmail.com",
  },
];

function UsersList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formMode, setFormMode] = useState("add");
  const [selectedUser, setSelectedUser] = useState(null);
  const drawerCtx = useContext(DrawerAdminContext);

  // Handler untuk Add User
  const handleAddUser = () => {
    setFormMode("add");
    setSelectedUser(null);
    drawerCtx.setShowDrawer(true);
  };

  // Handler untuk Edit User
  const handleEditUser = (product) => {
    setFormMode("edit");
    setSelectedUser(product);
    drawerCtx.setShowDrawer(true);
  };

  return (
    <div className="p-6">
      <Drawer
        drawerCtx={drawerCtx}
        bg="bg-white"
        textColor="text-[#0B132A]"
        direction="right"
        width="w-120">
        <UserForm mode={formMode} user={selectedUser} />
      </Drawer>

      <h1 className="mb-6 text-3xl font-semibold">Product List</h1>
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-[#FF8906] px-6 py-3 rounded-lg hover:bg-[#e57a05] transition">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add User
        </button>

        <div className="flex items-center gap-3">
          <div>
            <label className="block mb-2 text-sm text-gray-600">
              Search Product
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Enter User Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF8906]"
              />
              <svg
                className="absolute w-5 h-5 text-gray-400 -translate-y-1/2 right-3 top-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="mt-7">
            <button className="flex items-center gap-2 bg-[#FF8906] px-6 py-2 rounded-lg hover:bg-[#e57a05] transition">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-md shadow-sm">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded"
                />
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Image
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Full Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Phone
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Address
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((product, index) => (
              <tr
                key={product.id}
                className={index % 2 === 0 && "bg-[#E8E8E84D]"}>
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    className="w-4 h-4 border-gray-300 rounded"
                  />
                </td>
                <td className="px-4 py-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="object-cover w-12 h-12 rounded-lg"
                  />
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {product.fullName}
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {product.phone}
                </td>
                <td className="max-w-xs px-4 py-4 text-sm text-gray-600 truncate">
                  {product.address}
                </td>
                <td className="px-4 py-4 text-sm text-gray-800">
                  {product.email}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditUser(product)}
                      className="p-2 cursor-pointer bg-[#FF89061A] hover:bg-yellow-50 rounded-full transition">
                      <img
                        className="size-5"
                        src="/icon/icon-edit.svg"
                        alt="Icon Edit"
                      />
                    </button>
                    <button className="p-2 cursor-pointer bg-[#D000001A] hover:bg-red-50 rounded-full transition">
                      <img
                        className="size-5"
                        src="/icon/icon-delete.svg"
                        alt="Icon Delete"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Show 5 product of 100 product
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100">
              Prev
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-sm rounded ${
                  currentPage === page
                    ? "text-[#FF8906]"
                    : "text-gray-600 hover:bg-gray-100"
                }`}>
                {page}
              </button>
            ))}
            <button className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersList;
