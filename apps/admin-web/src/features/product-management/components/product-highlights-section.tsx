"use client";

import { Input } from "@/shared/components/ui/input";

import {
  X,
} from "lucide-react";

import {
  KeyboardEvent,
  useRef,
} from "react";

interface Props {
  data: any;

  onChange: (
    field: string,
    value: any
  ) => void;
}

export function ProductHighlightsSection({
  data,
  onChange,
}: Props) {

  // =========================================
  // INPUT REFS
  // =========================================

  const inputRefs =
    useRef<Record<string, HTMLInputElement | null>>({});

  // =========================================
  // HANDLE ENTER KEY
  // =========================================

  const handleKeyDown =
    (
      e: KeyboardEvent<HTMLInputElement>,
      field: string
    ) => {

      if (
        e.key !== "Enter"
      ) {
        return;
      }

      // STOP FORM SUBMIT
      e.preventDefault();

      e.stopPropagation();

      const input =
        e.currentTarget;

      const value =
        input.value.trim();

      // EMPTY
      if (!value) {
        return;
      }

      const currentArray =
        Array.isArray(
          data[field]
        )
          ? data[field]
          : [];

      // AVOID DUPLICATES
      if (
        !currentArray.includes(
          value
        )
      ) {

        onChange(
          field,
          [
            ...currentArray,
            value,
          ]
        );
      }

      // CLEAR INPUT
      input.value = "";

      // MAINTAIN FOCUS
      setTimeout(() => {

        inputRefs.current[field]?.focus();

      }, 0);
    };

  // =========================================
  // REMOVE TAG
  // =========================================

  const removeTag =
    (
      field: string,
      index: number
    ) => {

      const updatedArray =
        data[field].filter(
          (
            _: any,
            i: number
          ) =>
            i !== index
        );

      onChange(
        field,
        updatedArray
      );
    };

  // =========================================
  // HIGHLIGHT INPUT
  // =========================================

  const HighlightInput = ({
    label,
    field,
    placeholder,
  }: {
    label: string;
    field: string;
    placeholder: string;
  }) => (

    <div className="space-y-2">

      <label
        className="
          text-xs font-bold
          text-gray-500 uppercase
        "
      >
        {label}
      </label>

      <div className="space-y-2">

        <Input
          ref={(el) => {
            inputRefs.current[field] = el;
          }}
          type="text"
          placeholder={placeholder}
          autoComplete="off"
          onKeyDown={(e) =>
            handleKeyDown(
              e,
              field
            )
          }
        />

        <div className="flex flex-wrap gap-2">

          {data[field]?.map(
            (
              tag: string,
              idx: number
            ) => (

              <span
                key={idx}
                className="
                  inline-flex items-center gap-1
                  bg-purple-50 text-purple-700
                  px-2 py-1 rounded text-xs
                  font-medium border
                  border-purple-100
                "
              >

                {tag}

                <button
  type="button"
  onMouseDown={(e) => {
    e.preventDefault();
  }}
  onClick={(e) => {

    e.preventDefault();

    e.stopPropagation();

    removeTag(
      field,
      idx
    );

  }}
>
                  <X
                    className="
                      h-3 w-3
                      hover:text-purple-900
                    "
                  />
                </button>

              </span>
            )
          )}

        </div>

      </div>

    </div>
  );

  // =========================================
  // UI
  // =========================================

  return (
    <div
      className="
        bg-white border border-gray-100
        rounded-2xl p-6 shadow-sm
        space-y-6
      "
    >

      <h4
        className="
          font-bold text-gray-800
          border-b pb-3
        "
      >
        Highlights & Info
      </h4>

      <HighlightInput
        label="Features"
        field="features"
        placeholder="Add features (press Enter to add more)"
      />

      <HighlightInput
        label="Tags"
        field="tags"
        placeholder="Add tags (press Enter to add more)"
      />

      <HighlightInput
        label="Display Notes"
        field="displayNotes"
        placeholder="Add display notes (press Enter to add more)"
      />

      <HighlightInput
        label="Packing"
        field="packing"
        placeholder="Add packing info (press Enter to add more)"
      />

      <HighlightInput
        label="Direction Of Use"
        field="directionOfUse"
        placeholder="Add direction of use (press Enter to add more)"
      />

      <HighlightInput
        label="Additional Information"
        field="additionalInfo"
        placeholder="Add additional info (press Enter to add more)"
      />

    </div>
  );
}