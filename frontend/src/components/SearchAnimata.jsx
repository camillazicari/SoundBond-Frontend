"use client";

import { VanishInput } from "./personalizedComponents/VanishInput";

export function SearchAnimata(props) {
  const placeholders = props.placeholders;

  return (
    <div className="flex flex-col justify-center items-center">
      <h5
        className="mb-4 md:text-xl lg:text-2xl text-center"
        style={{ color: "#9b1fff" }}
      >
        {props.text}
      </h5>
      <VanishInput
        placeholders={placeholders}
        onChange={props.onChange}
        onSubmit={props.onSubmit}
        value={props.search}
      />
    </div>
  );
}
