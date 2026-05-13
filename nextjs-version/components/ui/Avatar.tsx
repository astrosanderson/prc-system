import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: number;
}

export function Avatar({ src, alt, size = 40 }: AvatarProps) {
  if (!src) {
    return (
      <div
        className="avatar d-flex align-items-center justify-content-center bg-secondary bg-opacity-25"
        style={{ width: size, height: size, fontSize: size * 0.45, color: 'var(--color-muted)' }}
        aria-label={alt}
      >
        <span className="material-symbols-outlined">person</span>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={src}
      alt={alt}
      className="avatar"
      style={{ width: size, height: size }}
    />
  );
}
