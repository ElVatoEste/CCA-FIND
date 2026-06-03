import { redirect } from "next/navigation";

export default function EncontradosPage() {
  redirect("/catalogo?tipo=found");
}
