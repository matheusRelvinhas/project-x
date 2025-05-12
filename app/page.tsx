'use client'

import Button from "@/components/button";
import Checkbox from "@/components/checkbox";
import Input from "@/components/input";
import Switch from "@/components/switch";
import { useAppContext } from "@/context/context";
import { axiosGet } from "@/utils/axios";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Home() {

    const { setAccessToken } = useAppContext();

    const [value, setValue] = useState<string|number|null>('');
    const [n, setN] = useState<string|number|null>(null);
    const [checkbox, setCheckbox] = useState(false);

    const logout = () => {
        axiosGet(`/login/logout`, (data) => {
            if(data.message == 'logout_success') {
                localStorage.setItem("token_access", 'not_user');
                setAccessToken('not_user');
            }
        }, () => {
            toast.error('Error')
        }, true);
    };

    return (

        <div className="flex flex-col items-center justify-center gap-2 w-full h-full fadeIn text-default-900">
            HomePage

            <Button typeButton={'primary'} onClick={() => logout()}>primary</Button>

            <Button onClick={() => console.log('secundary')}>secundary</Button>

            <Input value={value} label={'text'} onValueChange={setValue} />
            {value}

            <Input value={n} label={'number'} className="px-2" typeInput="number" size="sm" onValueChange={setN} />
            {n}
            
            <Checkbox checked={checkbox} onChange={setCheckbox}/>
            {checkbox ? 'true' : 'false'}
            
            <Switch checked={checkbox} onChange={setCheckbox}/>
            
        </div>
    );
};
