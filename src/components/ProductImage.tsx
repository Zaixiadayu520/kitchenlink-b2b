type Props = {
  imageUrl?: string | null;
  imageEmoji?: string | null;
  alt: string;
  className?: string;
  emojiClassName?: string;
  rounded?: boolean;
};

export function ProductImage({
  imageUrl,
  imageEmoji = "📦",
  alt,
  className = "h-28 w-full object-cover",
  emojiClassName = "text-5xl",
  rounded = true,
}: Props) {
  const round = rounded ? "rounded-[14px]" : "rounded-none";
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt={alt} className={`${round} bg-surface-soft ${className}`} />
    );
  }
  return (
    <div className={`flex items-center justify-center bg-surface-soft ${round} ${className} ${emojiClassName}`}>
      {imageEmoji}
    </div>
  );
}
