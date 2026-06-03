import { redirect } from "next/navigation";

export default function PerdidosPage() {
  redirect("/catalogo?tipo=lost");
}
