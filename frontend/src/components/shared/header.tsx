import Image from "next/image";
import Link from "next/link";
import * as React from "react";

export interface IHeaderProps {}

export default function Header(props: IHeaderProps) {
  return (
    <div className="w-full flex justify-center align-center">
      <div className="w-full flex max-w-7xl p-10 justify-between items-center gap-20">
        <h1 className="text-3xl tracking-widest text-gray-100 font-bold">
          Kerberos
        </h1>

        <div className="flex justify-evenly text-gray-200 gap-10 text-sm font-semibold items-center">
        </div>
      </div>
    </div>
  );
}
