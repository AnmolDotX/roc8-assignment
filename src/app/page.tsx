"use client";

import { useUserContext } from "@/context/UserContext";
import type {
  Category,
  PaginatedCategoryResponseInterface,
} from "@/interfaces/CategoryFetchResponseInterface";
import appClient from "@/lib/appClient";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { toast } from "sonner";

const HomePage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toggleLoadingState, setToggleLoadingState] = useState<Record<number, boolean>>({});
  const [totalPages, setTotalPages] = useState<number>(1);
  const { loggedInUser } = useUserContext();

  const fetchCategories = async (page: number) => {
    try {
      setIsLoading(true);
      const { data }: { data: PaginatedCategoryResponseInterface } =
        await appClient.post(`/api/categories?page=${page}&limit=6`, {
          userId: loggedInUser.id,
        });
      if (data.success) {
        setCategories(data.data.categories);
        setTotalPages(data.data.pagination.totalPages);
        setIsLoading(false);
      } else {
        console.error("Failed to fetch categories:", data.message);
        toast.error(data.message);
        setIsLoading(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error fetching categories: ${error.message}`);
        setIsLoading(false);
      }
      toast.error("unknown error while loading categories");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage).catch((e: Error) => toast.error(e.message));
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const categoryChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const categoryId = parseInt(e.target.id);
    const isChecked = e.target.checked;
    try {
      setToggleLoadingState((prevState) => ({ ...prevState, [categoryId]: true }));
      await appClient.post("/api/toggle-category", {
        userId: loggedInUser.id,
        categoryId,
        isChecked,
      });
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category.id === categoryId ? { ...category, isChecked } : category,
        ),
      );
      setToggleLoadingState((prevState) => ({ ...prevState, [categoryId]: false }));
    } catch (error) {
      toast.error("Error toggling category app.tsx");
      setToggleLoadingState((prevState) => ({ ...prevState, [categoryId]: false }));
    }
  };

  const getPaginationButtons = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxButtons = 5;
    let startPage: number, endPage: number;

    if (totalPages <= maxButtons) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 3) {
        startPage = 1;
        endPage = maxButtons;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - (maxButtons - 1);
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const paginationButtons = getPaginationButtons();

  return (
    <div className="flex h-full justify-center pt-20">
      <div className="flex h-[600px] w-[550px] flex-col gap-7 rounded-2xl border-2 border-gray-300 p-10">
        <div className="flex flex-col gap-5 text-center">
          <h1 className="text-3xl font-semibold text-black">
            Please mark your interests!
          </h1>
          <h3 className="text-sm font-normal tracking-wide">
            We will keep you notified.
          </h3>
        </div>
        <div className="flex h-full flex-col justify-between">
          <h2 className="text-lg font-semibold">My saved interests!</h2>
          <ul className="flex flex-col justify-center gap-4">
            {isLoading ? (
              <div className="flex h-full w-full animate-pulse items-center justify-center font-bold tracking-widest text-gray-600">
                ...loading
              </div>
            ) : (
              categories.map((item) => (
                <li key={item.id} className="flex items-center gap-2">
                  {toggleLoadingState[item.id] ? (
                    <div className="spinner"></div>
                  ) : (
                    <input
                      style={{ backgroundColor: "gray" }}
                      type="checkbox"
                      id={item.id.toString()}
                      name={item.name}
                      checked={item.isChecked}
                      onChange={categoryChangeHandler}
                      className="h-5 w-5 bg-gray-500 checked:bg-black checked:text-white"
                    />
                  )}
                  <label htmlFor={item.id.toString()}>{item.name}</label>
                </li>
              ))
            )}
          </ul>
          <div className="mt-10 flex items-center justify-center gap-2 text-xl text-gray-400">
            <div
              onClick={() => handlePageChange(currentPage - 1)}
              className={`flex cursor-pointer text-lg transition-all duration-200 hover:text-gray-900 active:text-gray-400 ${currentPage === 1 ? "opacity-50" : ""}`}
            >
              <IoIosArrowBack />
              <IoIosArrowBack />
              <IoIosArrowBack />
            </div>
            {paginationButtons.map((page, index) => (
              <button
                key={index}
                onClick={() =>
                  typeof page === "number" && handlePageChange(page)
                }
                className={`mx-1 transition-all hover:text-gray-900 active:text-gray-500 ${currentPage === page ? "font-bold text-black" : ""}`}
                disabled={page === "..."}
              >
                {page}
              </button>
            ))}
            <div
              onClick={() => handlePageChange(currentPage + 1)}
              className={`flex cursor-pointer text-lg transition-all duration-200 hover:text-gray-900 active:text-gray-400 ${currentPage === totalPages ? "opacity-50" : ""}`}
            >
              <IoIosArrowForward />
              <IoIosArrowForward />
              <IoIosArrowForward />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
