import { generatePageMetadata } from "@/common/utils/metaUtils";

export const metadata = generatePageMetadata('portal');

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
