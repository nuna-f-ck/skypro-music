"use client";

import { useParams } from "next/navigation";
import CenterBlock from "../../../../components/CenterBlock/CenterBlock";

export default function CategoryPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;

  // key заставляет компонент перезагрузиться при переходе между подборками
  return <CenterBlock key={id} selectionId={id} title="Подборка" />;
}
