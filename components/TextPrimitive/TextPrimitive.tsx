type Props = {
  content: string;
};

export default function TextPrimitive({ content }: Props) {
    return (
        <div>
            <p className="p-1 bg-white text-gray-700 relative">{content}</p>
        </div>
    );
}
