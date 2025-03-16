"use client";

import { VanishInput } from "../../animations/VanishInput";

export function SearchAnimata(props) {
  const placeholders = [
    "All I Want",
    "My heart will go on",
    "Locked out of Heaven",
    "Amarena",
    "Sere nere",
  ];

  const handleChange = (e) => {
    console.log(e.target.value);
  };
  const onSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
  };
  return (
    <div className="flex flex-col justify-center  items-center">
      <h5 className="mb-4 text-2xl text-center dark:text-white text-black">
        {props.text}
      </h5>
      <VanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}
