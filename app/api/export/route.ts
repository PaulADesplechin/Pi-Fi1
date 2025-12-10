import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "alerts";

  // Générer un CSV basé sur le type
  let csv = "";
  let filename = "";

  if (type === "alerts") {
    filename = `pifi-alertes-${new Date().toISOString().split("T")[0]}.csv`;
    csv = "Date,Symbole,Nom,Type,Variation (%),Seuil (%)\n";
    // Les données réelles viendront du localStorage côté client
  } else if (type === "favorites") {
    filename = `pifi-favoris-${new Date().toISOString().split("T")[0]}.csv`;
    csv = "Symbole,Nom,Type,Prix,Variation (%)\n";
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

