import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Alert from "../components/Alert";
import Drawer from "../components/Drawer";
import Input from "../components/Input";
import ModalConfirmation from "../components/ModalConfirmation";
import UserForm from "../components/UserForm";
import { AuthContext } from "../context/AuthContext";
import { DrawerAdminContext } from "../context/DrawerContext";
import { useFetchData } from "../hooks/useFetchData";

function UsersList() {
  const { accessToken } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [alertStatus, setAlertStatus] = useState({ type: "", message: "" });

  // state untuk pagination dan search
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 5;

  // build url dengan query params
  const buildURL = () => {
    const params = new URLSearchParams({
      page: currentPage,
      limit: limit,
    });

    if (debouncedSearch.trim()) {
      params.append("search", debouncedSearch.trim());
    }

    return `${import.meta.env.VITE_BASE_URL}/admin/users?${params.toString()}`;
  };

  const {
    data: response = {},
    isLoading,
    error,
    refetch,
  } = useFetchData(buildURL(), accessToken);

  const users = response.data || [];
  const meta = response.meta || {};
  const totalPages = meta.totalPages || 1;
  const totalData = meta.totalData || 0;

  const [selectedUser, setSelectedUser] = useState(null);
  const [formMode, setFormMode] = useState("add");
  const drawerCtx = useContext(DrawerAdminContext);

  const { register, watch } = useForm();
  const searchValue = watch("search");

  // debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue || "");
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchValue]);

  // refetch when currentPage atau debouncedSearch berubah
  useEffect(() => {
    refetch();
  }, [currentPage, debouncedSearch, refetch]);

  // Handler untuk Add User
  const handleAddUser = () => {
    setFormMode("add");
    setSelectedUser(null);
    drawerCtx.setShowDrawer(true);
  };

  // Handler untuk Edit User
  const handleEditUser = (user) => {
    setFormMode("edit");
    setSelectedUser(user);
    drawerCtx.setShowDrawer(true);
  };

  // handle pagination
  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const deleteUser = async (id) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_BASE_URL + "/admin/users/" + id,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await res.json();

      if (!result.success) {
        throw new Error(result.message || "Failed to delete user");
      }

      setAlertStatus({
        type: "success",
        message: "User deleted successfully",
      });

      setShowModal(false);
      refetch();
    } catch (error) {
      setAlertStatus({
        type: "error",
        message: error.message || "Failed to delete user",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Alert
        type={alertStatus.type}
        message={alertStatus.message}
        onClose={() => setAlertStatus({ type: "", message: "" })}
      />

      <Drawer
        drawerCtx={drawerCtx}
        bg="bg-white"
        textColor="text-[#0B132A]"
        direction="right"
        width="w-120">
        <UserForm mode={formMode} user={selectedUser} onSuccess={refetch} />
      </Drawer>

      <ModalConfirmation
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={() => deleteUser(selectedUser.id)}
        title="Confirm Delete"
        message="Are you sure you want to delete this user?"
        confirmText="Delete"
        cancelText="Cancel"
        type="warning"
      />

      <h1 className="mb-6 text-3xl font-semibold">Users List</h1>
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        {/* button add */}
        <button
          onClick={handleAddUser}
          className="flex items-center gap-2 bg-[#5a8120] px-6 py-3 rounded-lg hover:bg-[#b9c228] transition">
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

        {/* form search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              {...register("search")}
              id="search"
              type="search"
              label="Search User"
              placeholder="Search by name or description"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden bg-white rounded-md shadow-sm">
        <table className="w-full">
          {/* table header */}
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              {/* <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-gray-300 rounded"
                />
              </th> */}
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Photo
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Full Name
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Email
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Phone
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Address
              </th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-gray-700">
                Action
              </th>
            </tr>
          </thead>

          {/* table body */}
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="11"
                  className="px-4 py-8 text-center text-gray-500">
                  {debouncedSearch
                    ? "No users found matching your search"
                    : "No users available"}
                </td>
              </tr>
            ) : (
              users.map((user, index) => (
                <tr
                  key={user.id}
                  className={index % 2 === 0 && "bg-[#E8E8E84D]"}>
                  {/* <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border-gray-300 rounded"
                    />
                  </td> */}
                  <td className="px-4 py-4">
                    <img
                      src={user.profilePhoto || "/img/empty-photo-profile.jpeg"}
                      alt={user.name}
                      className="object-cover w-12 h-12 rounded-lg"
                      onError={(e) => {
                        e.target.src = "/img/empty-photo-profile.jpeg";
                      }}
                    />
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {user.fullName}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {user.phone}
                  </td>
                  <td className="max-w-xs px-4 py-4 text-sm text-gray-600 truncate">
                    {user.address}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 cursor-pointer bg-[#5a81201A] hover:bg-yellow-50 rounded-full transition">
                        <img
                          className="size-5"
                          src="/icon/icon-edit.svg"
                          alt="Icon Edit"
                        />
                      </button>
                      <button
                        onClick={() => {
                          setShowModal(true);
                          setSelectedUser(user);
                        }}
                        className="p-2 cursor-pointer bg-[#D000001A] hover:bg-red-50 rounded-full transition">
                        <img
                          className="size-5"
                          src="/icon/icon-delete.svg"
                          alt="Icon Delete"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Show {users.length} user of {totalData || 0} users
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              if (
                totalPages <= 5 ||
                pageNumber === 1 ||
                pageNumber === totalPages ||
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`px-3 py-1 text-sm rounded ${
                      currentPage === pageNumber
                        ? "bg-[#5a8120] text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}>
                    {pageNumber}
                  </button>
                );
              } else if (
                pageNumber === currentPage - 2 ||
                pageNumber === currentPage + 2
              ) {
                return (
                  <span key={pageNumber} className="px-2 text-gray-400">
                    ...
                  </span>
                );
              }
              return null;
            })}

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm text-gray-600 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersList;
