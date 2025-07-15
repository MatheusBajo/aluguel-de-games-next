//@components/util/StarRating.tsx
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

interface StarRatingProps {
    value?: number;              // 0 – 5, casas decimais permitidas
}

export function StarRating({ value = 0 }: StarRatingProps) {
    const v      = Math.min(5, Math.max(0, value));
    const full   = Math.floor(v);
    const half   = v - full >= 0.25 && v - full < 0.75 ? 1 : 0;
    const empty  = 5 - full - half;

    return (
        <>
            {Array.from({ length: full  }).map((_, i) => (
                <FaStar key={`f${i}`} className="text-yellow-400" />
            ))}
            {half === 1 && <FaStarHalfAlt className="text-yellow-400" />}
            {Array.from({ length: empty }).map((_, i) => (
                <FaRegStar key={`e${i}`} className="text-yellow-400" />
            ))}
        </>
    );
}
