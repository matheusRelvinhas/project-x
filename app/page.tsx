'use client'

import Button from "@/components/button";
import Checkbox from "@/components/checkbox";
import Icon from "@/components/icon";
import Input from "@/components/input";
import Switch from "@/components/switch";
import { useState } from "react";

export default function Home() {
    const [value, setValue] = useState<string|number|null>('');
    const [n, setN] = useState<string|number|null>(null);
    const [checkbox, setCheckbox] = useState(false);

    return (

        <div className="flex flex-col items-center justify-center gap-2 fadeIn text-default-900">
            HomePage

            <Button
                onClick={() => console.log('test')}
            >
                test
            </Button>

            <Input value={value} label={'text'} onValueChange={setValue} startContent={<Icon name="mdi:account-circle" className="text-2xl fadeIn rounded-full" />} />
            {value}

            <Input value={n} label={'number'} className="px-2" typeInput="number" size="sm" onValueChange={setN} />
            {value}
            
            <Checkbox checked={checkbox} onChange={setCheckbox}/>
            {checkbox ? 'true' : 'false'}
            
            <Switch checked={checkbox} onChange={setCheckbox}/>
            
        </div>
    );
}
