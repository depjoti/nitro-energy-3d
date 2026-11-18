import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const FacebookIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M13.5 21v-7.3h2.4l.4-2.9h-2.8V9c0-.8.3-1.4 1.4-1.4h1.5V5.1c-.3 0-1.2-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.7v2.1H8.2v2.9h2.4V21h2.9Z" />
  </svg>
);

const InstagramIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
    <rect x="4" y="4" width="16" height="16" rx="4.5" />
    <circle cx="12" cy="12" r="3.6" />
    <circle cx="16.9" cy="7.1" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const XIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M17.2 4.5h2.7l-5.9 6.8 7 8.2h-5.5l-4.3-5.6-4.9 5.6H3.6l6.3-7.3L3.2 4.5h5.6l3.9 5.1 4.5-5.1Zm-1 13.4h1.5L8 6H6.4l9.8 11.9Z" />
  </svg>
);

const LinkedInIcon = (props: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M6.9 8.9H4.1V19h2.8V8.9ZM5.5 4.5a1.7 1.7 0 1 0 0 3.3 1.7 1.7 0 0 0 0-3.3ZM19.9 13.4c0-2.7-.6-4.8-3.8-4.8-1.5 0-2.6.8-3 1.6V8.9h-2.7V19h2.8v-5c0-1.3.3-2.6 1.9-2.6 1.6 0 1.6 1.5 1.6 2.7V19h2.8v-5.6h.4Z" />
  </svg>
);

export const socials = [
  { label: "Facebook", href: "https://facebook.com", Icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", Icon: InstagramIcon },
  { label: "X", href: "https://x.com", Icon: XIcon },
  { label: "LinkedIn", href: "https://linkedin.com", Icon: LinkedInIcon },
] as const;

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-3 md:gap-4 ${className}`}>
      {socials.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Nitro on ${label}`}
            className="grid size-10 place-items-center rounded-full border border-nitro text-nitro transition-[background-color,color,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-nitro hover:text-black hover:shadow-[0_0_24px_-4px_var(--color-nitro)] md:size-11"
          >
            <Icon className="size-[18px]" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
