/*
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import {
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import Card from "../card/Card";

const sortOptions = [
  { name: "Most Popular", current: true, value: "Most Popular" },
  { name: "Best Rating", current: false, value: "Best Rating" },
  { name: "Newest", current: false, value: "newest" },
  { name: "Price: Low to High", current: false, value: "asc" },
  { name: "Price: High to Low", current: false, value: "desc" },
];

const color = [
  {
    id: 1,
    name: "color",
    options: [
      { value: "white", label: "White", checked: false },
      { value: "beige", label: "Beige", checked: false },
      { value: "blue", label: "Blue", checked: false },
      { value: "black", label: "black", checked: false },
      { value: "red", label: "red", checked: false },
      { value: "purple", label: "Purple", checked: false },
    ],
  },
];
const sizes = [
  {
    id: 2,
    name: "size",
    options: [
      { value: "36", label: "36", checked: false },
      { value: "37", label: "37", checked: false },
      { value: "38", label: "38", checked: false },
      { value: "39", label: "39", checked: false },
      { value: "40", label: "40", checked: false },
      { value: "41", label: "41", checked: false },
      { value: "42", label: "42", checked: false },
      { value: "43", label: "43", checked: false },
      { value: "44", label: "44", checked: false },
      { value: "45", label: "45", checked: false },
      { value: "46", label: "46", checked: false },
    ],
  },
];
const categories = [
  {
    id: 3,
    name: "Category",
    options: [
      { value: "Women", label: "Women", checked: false },
      { value: "Men", label: "Men", checked: false },
      { value: "Kids", label: "Kids", checked: false },
    ],
  },
];
const producer = [
  {
    id: 4,
    name: "Brands",
    options: [
      { value: "Sandal", label: "Sandal", checked: false },
      { value: "ZIP", label: "ZIP", checked: false },
      { value: "b.o.c", label: "b.o.c", checked: false },
      { value: "Nike", label: "Nike", checked: false },
      { value: "Adidas", label: "Adidas", checked: false },
      { value: "Oxford", label: "Oxford", checked: false },
    ],
  },
];

export default function Filter() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scategory, setSCategory] = useState([]);
  const [big, setBig] = useState(false);
  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const searchParams = new URLSearchParams(location.search);

  const query = searchParams.get("q");
  const category =
    query === null
      ? pathSegments[2] !== undefined
        ? decodeURIComponent(pathSegments[2])
        : null
      : null;
  const subcategory =
    pathSegments[3] !== undefined ? decodeURIComponent(pathSegments[3]) : null;
  const subsubcategory =
    pathSegments[4] !== undefined ? decodeURIComponent(pathSegments[4]) : null;
  const [sort, setSort] = useState({});
  const [filter, setFilter] = useState({});
  const compareQuantity = useSelector((state) => state.user.compare.quantity);

  let size = [];

  if (category === "Women") {
    size = [
      {
        id: 2,
        name: "size",
        options: [
          { value: "36", label: "36", checked: false },
          { value: "37", label: "37", checked: false },
          { value: "38", label: "38", checked: false },
          { value: "39", label: "39", checked: false },
          { value: "40", label: "40", checked: false },
        ],
      },
    ];
  } else if (category === "Men") {
    size = [
      {
        id: 2,
        name: "size",
        options: [
          { value: "40", label: "40", checked: false },
          { value: "41", label: "41", checked: false },
          { value: "42", label: "42", checked: false },
          { value: "43", label: "43", checked: false },
          { value: "44", label: "44", checked: false },
          { value: "45", label: "45", checked: false },
          { value: "46", label: "46", checked: false },
          { value: "47", label: "47", checked: false },
          { value: "48", label: "48", checked: false },
        ],
      },
    ];
  } else if (category === "Kids") {
    size = [
      {
        id: 2,
        name: "size",
        options: [
          { value: "28", label: "28", checked: false },
          { value: "29", label: "29", checked: false },
          { value: "30", label: "30", checked: false },
          { value: "31", label: "31", checked: false },
          { value: "32", label: "32", checked: false },
        ],
      },
    ];
  } else {
    size = sizes;
  }

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      //console.log("subsubcategory=>",subsubcategory)
      const apiUrl = `http://localhost:8000/category/name/${category}`;

      try {
        const response = await axios.get(apiUrl);
        const data = await response.data.find((cat) => cat.name === category);

        //console.log("search=>",query)
        if (data && !query) {
          const subCategory = data.subcategories.find(
            (subCat) => subCat.name === subcategory
          );
          //console.log(subCategory);

          setSCategory(subCategory.subsubcategories);

          /* if (subCategory) {
            //console.log(subCategory.subsubcategories);
            setSCategory(subCategory.subsubcategories);
          } */
          // setIsLoading(false);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching subCategories:", error);
        setIsLoading(false);
        setSCategory(null);
      }
    };

    fetchData();
  }, [subsubcategory, subcategory, categories]);

  const handleFilters = (e) => {
    const value = e.target.value;
    const name = e.target.name;

    if (e.target.checked) {
      // Checkbox is checked, add the value to the filter
      setFilter({
        ...filter,
        [name]: value,
      });
    } else {
      // Checkbox is unchecked, remove the value from the filter
      const updatedFilter = { ...filter };
      delete updatedFilter[name];
      setFilter(updatedFilter);
    }
  };

  return (
    <div className="bg-white">
      <div>
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    <ul
                      role="list"
                      className="space-y-4 border-b p-4 border-gray-200 pb-6 text-sm font-medium text-gray-900"
                    >
                      {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                          <TailSpin color="#007BFF" size={40} />
                        </div>
                      ) : (
                        scategory.map((subsubcategory) => (
                          <li key={subsubcategory}>
                            <a href={subsubcategory}>{subsubcategory}</a>
                          </li>
                        ))
                      )}
                    </ul>

                    <Disclosure
                      as="div"
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Color
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {color[0].options.map((val) => (
                                <div className="flex items-center" key={val.id}>
                                  <input
                                    name="color"
                                    value={val.value}
                                    onChange={handleFilters}
                                    checked={filter.color === val.value} // Check if the value is selected in the filter
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                    {val.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure
                      as="div"
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Category
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {categories[0].options.map((val) => (
                                <div className="flex items-center" key={val.id}>
                                  <input
                                    name="category"
                                    value={val.value}
                                    onChange={handleFilters}
                                    checked={filter.category === val.value} // Check if the value is selected in the filter
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                    {val.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure
                      as="div"
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Size
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {size[0].options.map((val) => (
                                <div className="flex items-center" key={val.id}>
                                  <input
                                    name="size"
                                    value={val.value}
                                    onChange={handleFilters}
                                    checked={filter.size === val.value} // Check if the value is selected in the filter
                                    type="checkbox"
                                    className="h-4 w-4 rounded  border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                    {val.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                    <Disclosure
                      as="div"
                      className="border-t border-gray-200 px-4 py-6"
                    >
                      {({ open }) => (
                        <>
                          <h3 className="-mx-2 -my-3 flow-root">
                            <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                              <span className="font-medium text-gray-900">
                                Brands
                              </span>
                              <span className="ml-6 flex items-center">
                                {open ? (
                                  <MinusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <PlusIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                )}
                              </span>
                            </Disclosure.Button>
                          </h3>
                          <Disclosure.Panel className="pt-6">
                            <div className="space-y-6">
                              {producer[0].options.map((val) => (
                                <div className="flex items-center" key={val.id}>
                                  <input
                                    name="producer"
                                    value={val.value}
                                    onChange={handleFilters}
                                    checked={filter.producer === val.value} // Check if the value is selected in the filter
                                    type="checkbox"
                                    className="h-4 w-4 rounded  border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label className="ml-3 min-w-0 flex-1 text-gray-500">
                                    {val.label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </Disclosure.Panel>
                        </>
                      )}
                    </Disclosure>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
            <h1 className="md:text-4xl text-2xl font-bold tracking-tight text-gray-900">
              {subsubcategory ? subsubcategory : query}
            </h1>

            <div className="flex items-center" id="Top">
              <Menu as="div" className="relative  inline-block text-left">
                <select
                  className="p-2 py-2 md:text-base text-sm md:w-auto w-32"
                  onChange={(e) => setSort(e.target.value)}
                  name=""
                  id=""
                >
                  {sortOptions.map((val) => (
                    <Menu.Item key={val.name}>
                      {({ active }) => (
                        <option key={val.value} value={val.value}>
                          {val.name}
                        </option>
                      )}
                    </Menu.Item>
                  ))}
                </select>
              </Menu>
              <Link to="/compare">
                <button
                  type="button"
                  className={`relative w-6 h-6 ml-2 ${
                    compareQuantity > 0 ? "block" : "hidden"
                  }`}
                >
                  {compareQuantity > 0 && (
                    <img
                      src="/eyeCompare.svg"
                      className="w-6 h-6 text-white top-0 -right-1 hover:scale-125 duration-300"
                      alt=""
                    />
                  )}
                </button>
              </Link>

              <button
                onClick={() => setBig(!big)}
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5  w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters */}
              <form className="hidden lg:block">
                <h3 className="sr-only">Categories</h3>
                <ul
                  role="list"
                  className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900"
                >
                  {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <TailSpin color="#007BFF" size={40} />
                    </div>
                  ) : (
                    scategory.map((subsubcategory) => (
                      <li key={subsubcategory}>
                        <a href={subsubcategory}>{subsubcategory}</a>
                      </li>
                    ))
                  )}
                </ul>

                <Disclosure as="div" className="border-b border-gray-200 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Color
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {color[0].options.map((val) => (
                            <div className="flex items-center" key={val.id}>
                              <input
                                name="color"
                                value={val.value}
                                type="checkbox"
                                onChange={handleFilters}
                                checked={filter.color === val.value} // Check if the value is selected in the filter
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="ml-3 text-sm text-gray-600">
                                {val.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure as="div" className="border-b border-gray-200 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Size
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-2 grid grid-cols-2">
                          {size[0].options.map((val) => (
                            <div className="flex items-center" key={val.id}>
                              <input
                                name="size"
                                value={val.value}
                                type="checkbox"
                                onChange={handleFilters}
                                checked={filter.size === val.value} // Check if the value is selected in the filter
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="ml-3 text-sm text-gray-600">
                                {val.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <Disclosure as="div" className="border-b border-gray-200 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Categories
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {categories[0].options.map((val) => (
                            <div className="flex items-center" key={val.id}>
                              <input
                                name="category"
                                defaultValue={val.value}
                                type="checkbox"
                                onChange={handleFilters}
                                checked={filter.category === val.value} // Check if the value is selected in the filter
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="ml-3 text-sm text-gray-600">
                                {val.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
                <Disclosure as="div" className="border-b border-gray-200 py-6">
                  {({ open }) => (
                    <>
                      <h3 className="-my-3 flow-root">
                        <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                          <span className="font-medium text-gray-900">
                            Brands
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel className="pt-6">
                        <div className="space-y-4">
                          {producer[0].options.map((val) => (
                            <div className="flex items-center" key={val.id}>
                              <input
                                name="producer"
                                defaultValue={val.value}
                                type="checkbox"
                                onChange={handleFilters}
                                checked={filter.producer === val.value} // Check if the value is selected in the filter
                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                              <label className="ml-3 text-sm text-gray-600">
                                {val.label}
                              </label>
                            </div>
                          ))}
                        </div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <Card
                  search={query}
                  bigger={big}
                  category={category}
                  subcategory={subcategory}
                  subsubcategory={subsubcategory}
                  filter={filter}
                  sort={sort}
                />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
