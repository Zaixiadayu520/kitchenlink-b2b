type Props = {
  imageUrl?: string | null;
  imageEmoji?: string | null;
  alt: string;
  className?: string;
  emojiClassName?: string;
};

export function ProductImage({
  imageUrl,
  imageEmoji = "📦",
  alt,
  className = "h-28 w-full object-cover",
  emojiClassName = "text-5xl",
}: Props) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageUrl} alt={alt} className={`rounded-xl bg-paper-2 ${className}`} />
    );
  }
  return (
    <div className={`flex items-center justify-center rounded-xl bg-paper-2 ${className} ${emojiClassName}`}>
      {imageEmoji}
    </div>
  );
}
