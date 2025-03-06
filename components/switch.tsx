'use client';

interface SwitchProps {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
}

export default function Switch({ checked = false, onChange = () => {} }: SwitchProps) {
    return (
        <label className="switch">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <span className="slider"></span>
        </label>
    );
}