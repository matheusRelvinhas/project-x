import { useAppContext } from "@/context/context";
import { useTypewriter } from "@/utils/utils";

type TypewriterProps = {
    text: string;
};

export function Typewriter({ text }: TypewriterProps) {
    const { theme } = useAppContext();

    const typedText = useTypewriter(text, 30);

    const isTyping = typedText !== text;

    return (
        <div className='flex w-full fadeIn gap-2'>
            <img className="h-[28px] min-w-[28px] animate-float" src={`/img/logo-${theme}.png`} />
            <div className='flex w-full pt-3'>
                <div className="bg-default-50 w-full text-xs rounded-tr-xl rounded-br-xl rounded-bl-xl rounded-tl-xs py-2 px-3 whitespace-pre-line leading-relaxed">
                    {typedText}

                    {isTyping && (
                        <span
                            className="ml-1 text-primary-600 inline-block w-[3px] h-[1em] bg-current"
                            style={{
                                animation: "blink 1s steps(1) infinite",
                            }}
                        />
                    )}

                    <style>
                        {`
                            @keyframes blink {
                                0%, 50%, 100% { opacity: 1; }
                                25%, 75% { opacity: 0; }
                            }
                        `}
                    </style>
                </div>
            </div>
        </div>

    );
}