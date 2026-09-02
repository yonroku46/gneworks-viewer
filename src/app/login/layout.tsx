import { generatePageMetadata } from "@/common/utils/metaUtils";

export const metadata = generatePageMetadata('login');

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
