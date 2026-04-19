import { useAppContext } from "@/context/context";
import { useTypewriter } from "@/utils/utils";

type TypewriterProps = {
    text: string;
};

export function Typewriter({ text }: TypewriterProps) {
    const { theme } = useAppContext();

    const typedText = useTypewriter(text, 30);
    const isTyping = typedText !== text;

    const htmlWithCursor = isTyping
        ? typedText + `<span class="typing-cursor"></span>`
        : typedText;

    return (
        <div className='flex w-full fadeIn gap-2'>
            <img
                className="h-[28px] min-w-[28px] animate-float"
                src={`/img/logo-${theme}.png`}
            />

            <div className='flex w-full pt-3'>
                <div className="bg-default-50 w-full text-xs rounded-tr-xl rounded-br-xl rounded-bl-xl rounded-tl-none py-2 px-3 leading-relaxed">

                    <div
                        className="
                            text-sm leading-snug
                            [&>ul]:list-disc
                            [&>ul]:pl-5
                            [&>ul]:my-2
                            [&>li]:mb-1
                            [&>p]:mb-2
                        "
                        dangerouslySetInnerHTML={{ __html: htmlWithCursor }}
                    />

                    <style>
                        {`
                            .typing-cursor {
                                display: inline-block;
                                width: 6px;
                                height: 1em;
                                margin-left: 4px;
                                margin-bottom: 2px;
                                background: var(--primary-600);
                                animation: blink 1s steps(1) infinite;
                                vertical-align: bottom;
                            }

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