import { generatePageMetadata } from "@/common/utils/metaUtils";

export const metadata = generatePageMetadata('contact');

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
