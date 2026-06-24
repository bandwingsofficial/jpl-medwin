"use client";

import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface Props {
  data: any;
  onChange: (field: string, value: any) => void;
}

export function ProductDetailsSection({ data, onChange }: Props) {
  const addSpec = () => {
    const newSpecs = [
      ...(data.specifications || []),
      { key: "", value: "" },
    ];

    onChange("specifications", newSpecs);
  };

  const updateSpec = (
    index: number,
    key: string,
    value: string
  ) => {
    const newSpecs = data.specifications.map(
      (s: any, i: number) =>
        i === index ? { ...s, [key]: value } : s
    );

    onChange("specifications", newSpecs);
  };

  const removeSpec = (index: number) => {
    const filtered = data.specifications.filter(
      (_: any, i: number) => i !== index
    );

    onChange("specifications", filtered);
  };

  const addFaq = () => {
    const newFaqs = [
      ...(data.faq || []),
      { question: "", answer: "" },
    ];

    onChange("faq", newFaqs);
  };

  const updateFaq = (
    index: number,
    key: string,
    value: string
  ) => {
    const newFaqs = data.faq.map(
      (f: any, i: number) =>
        i === index ? { ...f, [key]: value } : f
    );

    onChange("faq", newFaqs);
  };

  const removeFaq = (index: number) => {
    const filtered = data.faq.filter(
      (_: any, i: number) => i !== index
    );

    onChange("faq", filtered);
  };

  return (
    <div className="space-y-6">

      {/* SPECIFICATIONS */}
      <div className="space-y-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <h4 className="font-bold text-gray-800">
            Specifications
          </h4>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addSpec}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Spec
          </Button>
        </div>

        <div className="space-y-3">
          {data.specifications?.length === 0 && (
            <p className="text-xs text-gray-400 italic text-center py-2">
              No specifications added yet.
            </p>
          )}

          {data.specifications?.map((spec: any, idx: number) => (
            <div
              key={idx}
              className="flex gap-2 items-start"
            >
              <Input
                placeholder="Key"
                value={spec.key}
                onChange={(e) =>
                  updateSpec(idx, "key", e.target.value)
                }
              />

              <Input
                placeholder="Value"
                value={spec.value}
                onChange={(e) =>
                  updateSpec(idx, "value", e.target.value)
                }
              />

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSpec(idx)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-3">
          <h4 className="font-bold text-gray-800">
            FAQ
          </h4>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={addFaq}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add FAQ
          </Button>
        </div>

        <div className="space-y-4">
          {data.faq?.length === 0 && (
            <p className="text-xs text-gray-400 italic text-center py-2">
              No FAQ added yet.
            </p>
          )}

          {data.faq?.map((faq: any, idx: number) => (
            <div
              key={idx}
              className="flex gap-2 group"
            >
              <div className="flex-1 space-y-2">
                <Input
                  placeholder="Question"
                  value={faq.question}
                  onChange={(e) =>
                    updateFaq(
                      idx,
                      "question",
                      e.target.value
                    )
                  }
                />

                <Input
                  placeholder="Answer"
                  value={faq.answer}
                  onChange={(e) =>
                    updateFaq(
                      idx,
                      "answer",
                      e.target.value
                    )
                  }
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-1"
                onClick={() => removeFaq(idx)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* OTHER DETAILS */}
      <div className="space-y-4 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h4 className="font-bold text-gray-800 border-b pb-3">
          Other Details
        </h4>

        <div className="grid grid-cols-2 gap-6">

          {/* IS WEIGHTED */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Is Weighted?
            </label>

            <div className="flex p-1 bg-gray-100 rounded-lg w-fit">
              <button
                type="button"
                onClick={() =>
                  onChange("isWeighted", true)
                }
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                  data.isWeighted
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                Yes
              </button>

              <button
                type="button"
                onClick={() =>
                  onChange("isWeighted", false)
                }
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-md transition-all",
                  !data.isWeighted
                    ? "bg-white text-purple-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                No
              </button>
            </div>
          </div>

          {/* WARRANTY */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase">
              Warranty (Months)
            </label>

            <Input
              type="number"
              placeholder="e.g. 12"
              value={data.warrantyMonths}
              onChange={(e) =>
                onChange(
                  "warrantyMonths",
                  Number(e.target.value)
                )
              }
            />
          </div>

        </div>
      </div>
    </div>
  );
}