'use client';

interface CheckboxProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

export default function Checkbox({ checked = false, onChange= () => {} }: CheckboxProps) {
    return (
        <input 
            type="checkbox" 
            className="ui-checkbox select-none" 
            checked={checked}
            onChange={() => onChange(!checked)}
        />
    );
}