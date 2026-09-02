import { generatePageMetadata } from "@/common/utils/metaUtils";
import ManageLayoutClient from "./ManageLayoutClient";

export const metadata = generatePageMetadata('manage');

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ManageLayoutClient>{children}</ManageLayoutClient>;
}
