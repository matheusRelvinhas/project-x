'use client';

import { useAppContext } from "@/context/context";
import Image from "next/image";

export default function LoginPage() {
  const { message } = useAppContext();

  return (
    <div className="flex">
      {message}
    </div>
  );
}
