import Image from 'next/image';
import { AspectRatio } from '#/components/ui/aspect-ratio';

type Props = {
    src: string;
    alt: string;
};

export default function ImagePrimitive({ src, alt }: Props) {
    return (
        <AspectRatio ratio={16 / 9}>
            <Image
                className="object-cover rounded pointer-events-none"
                src={src?.length > 0 ? src : '/placeholder.svg'}
                alt={alt?.length > 0 ? alt : 'image placeholder'}
                fill
            />
        </AspectRatio>
    );
}
