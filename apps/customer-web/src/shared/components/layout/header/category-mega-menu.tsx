'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';

import { useCategories } from '@/features/category/hooks/use-category';
import { useSubCategories } from '@/features/category/hooks/use-sub-categories';
import { useMiniCategories } from '@/features/category/hooks/use-mini-categories';

import { Spinner } from '@/shared/components/ui/spinner';

interface CategoryMegaMenuProps {
  onClose?: () => void;
}

interface MiniCategory {
  id: string;
  name: string;
}

export function CategoryMegaMenu({ onClose }: CategoryMegaMenuProps) {
  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const [searchTerm, setSearchTerm] = useState('');

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const [activeSubCategoryId, setActiveSubCategoryId] = useState<string | null>(null);

  useEffect(() => {
    if (categories && categories.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories, activeCategoryId]);

  const filteredCategories = categories?.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const activeCategoryName = categories?.find((c) => c.id === activeCategoryId)?.name || 'Items';

  return (
    <div
      className="
      absolute
      top-full
      left-1/2
      -translate-x-1/2
      pt-2
      w-[1100px]
      z-50
    "
    >
      <div
        className="
        bg-white
        border
        border-gray-200
        rounded-2xl
        shadow-2xl
        overflow-hidden
        flex
        flex-col
        h-[380px]
      "
      >
        {/* SEARCH */}

        <div
          className="
          p-3
          border-b
          border-gray-100
        "
        >
          <div className="relative">
            <Search
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                w-4
                h-4
                text-gray-400
              "
            />

            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="
                w-full
                pl-10
                pr-4
                py-2
                rounded-full
                bg-gray-50
                border
                border-gray-200
                text-sm
                outline-none
              "
            />
          </div>
        </div>

        {/* THREE COLUMN AREA */}

        <div
          className="
          flex
          flex-1
          min-h-0
        "
        >
          {/* CATEGORY COLUMN */}

          <div
            className="
            w-[240px]
            bg-gray-50/70
            border-r
            border-gray-100
            overflow-y-auto
            py-2
          "
          >
            {isCategoriesLoading ? (
              <Spinner />
            ) : (
              filteredCategories?.map((category) => {
                const active = activeCategoryId === category.id;

                return (
                  <div
                    key={category.id}
                    onMouseEnter={() => {
                      setActiveCategoryId(category.id);

                      setActiveSubCategoryId(null);
                    }}
                    className={`
                      flex
                      items-center
                      justify-between
                      px-4
                      py-3
                      mx-2
                      rounded-xl
                      cursor-pointer
                      ${active ? 'bg-[#E6F7F5] text-[#0F9EA5]' : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    <span
                      className="
                      text-[13px]
                      font-medium
                    "
                    >
                      {category.name}
                    </span>

                    {active && (
                      <ChevronRight
                        className="
                          w-4
                          h-4
                        "
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* SUB CATEGORY COLUMN */}

          <div
            className="
            w-[360px]
            border-r
            border-gray-100
            p-5
            overflow-y-auto
          "
          >
            {activeCategoryId && (
              <SubCategoryPanel
                categoryId={activeCategoryId}
                categoryName={activeCategoryName}
                activeSubCategoryId={activeSubCategoryId}
                setActiveSubCategoryId={setActiveSubCategoryId}
                onClose={onClose}
              />
            )}
          </div>

          {/* MINI CATEGORY COLUMN */}

          <div
            className="
            flex-1
            p-5
            overflow-y-auto
          "
          >
            <MiniCategoryPanel subCategoryId={activeSubCategoryId} onClose={onClose} />
          </div>
        </div>

        {/* FOOTER */}

        <div
          className="
          border-t
          border-gray-100
          px-5
          py-3
        "
        >
          <Link
            href="/categories"
            onClick={onClose}
            className="
              text-xs
              font-semibold
              text-[#0F9EA5]
            "
          >
            Full Store Directory
          </Link>
        </div>
      </div>
    </div>
  );
}

interface SubCategoryPanelProps {
  categoryId: string;

  categoryName: string;

  activeSubCategoryId: string | null;

  setActiveSubCategoryId: (id: string | null) => void;

  onClose?: () => void;
}

function SubCategoryPanel({
  categoryId,

  categoryName,

  setActiveSubCategoryId,

  onClose,
}: SubCategoryPanelProps) {
  const { data: subCategories, isLoading } = useSubCategories(categoryId);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <h3
        className="
        font-bold
        text-gray-800
        mb-4
      "
      >
        {categoryName}
      </h3>

      <div
        className="
        space-y-3
      "
      >
        {subCategories?.map((sub) => (
          <Link
            key={sub.id}
            href={`/categories/${categoryId}/${sub.id}`}
            onMouseEnter={() => setActiveSubCategoryId(sub.id)}
            onClick={onClose}
            className="
              block
              text-sm
              text-gray-600
              hover:text-[#0F9EA5]
            "
          >
            {sub.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MiniCategoryPanel({
  subCategoryId,

  onClose,
}: {
  subCategoryId: string | null;

  onClose?: () => void;
}) {
  const {
    data: miniCategories = [],

    isLoading,
  } = useMiniCategories(subCategoryId ?? undefined);

  if (!subCategoryId) {
    return (
      <p
        className="
        text-sm
        text-gray-400
      "
      >
        Hover sub category
      </p>
    );
  }

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      <h3
        className="
        font-bold
        text-gray-800
        mb-4
      "
      >
        Mini Categories
      </h3>

      <div
        className="
        space-y-3
      "
      >
        {miniCategories.map((mini: MiniCategory) => (
          <Link
            key={mini.id}
            href={`/categories/${subCategoryId}/${mini.id}`}
            onClick={onClose}
            className="
              block
              text-sm
              text-gray-600
              hover:text-[#0F9EA5]
            "
          >
            {mini.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
