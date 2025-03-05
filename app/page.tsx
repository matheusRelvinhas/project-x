'use client'

import Button from "@/components/button";

export default function Home() {
  return (
    <div className="flex text-default-900">
      HomePage
      <Button
        onClick={() => console.log('test')}
        rounded={true}
        border={true}
        className="px-2 py-1 bg-primary-400 hover:bg-primary-900 text-default-100"
      >
        test
      </Button>
    </div>
  );
}
