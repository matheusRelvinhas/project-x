'use client'

import Button from "@/components/button";
import Icon from "@/components/icon";
import Input from "@/components/input";
import { useState } from "react";

export default function Home() {
  const [value, setValue] = useState('')

  return (

    <div className="flex fadeIn text-default-900">
      HomePage
      <Button
        onClick={() => console.log('test')}
      >
        test
      </Button>
      <Input value={value} label={'test'} onValueChange={setValue} startContent={<Icon name="mdi:account-circle" className="text-2xl fadeIn rounded-full" />} />
      {value}
    </div>
  );
}
