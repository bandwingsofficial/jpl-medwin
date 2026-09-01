import * as React from "react";

export function Table({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        w-full
        bg-white
        rounded-xl
        border
        border-gray-100
        flex
        flex-col
      "
    >
      <div className="w-full overflow-x-auto">
        <table
          className="
            w-full
            table-auto
            border-collapse
            text-sm
          "
        >
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <thead
      className="
        bg-gray-50/70
        text-gray-500
        border-b
        border-gray-100
      "
    >
      {children}
    </thead>
  );
}

export function TableBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <tbody
      className="
        divide-y
        divide-gray-100
        bg-white
      "
    >
      {children}
    </tbody>
  );
}

export function TableRow({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <tr
      className="
        transition-colors
        hover:bg-gray-50/50
      "
    >
      {children}
    </tr>
  );
}

export function TableHead({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th
      className="
        px-4
        py-3
        text-left
        text-xs
        font-semibold
        uppercase
        tracking-wider
        text-gray-500
        align-middle
        whitespace-nowrap
      "
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td
      className="
        px-4
        py-3
        align-middle
        text-gray-700
        whitespace-nowrap
      "
    >
      {children}
    </td>
  );
}