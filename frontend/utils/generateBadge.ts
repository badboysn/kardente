import { toPng } from "html-to-image";
import JSZip from "jszip";

async function downloadNodeAsPng(node: HTMLElement, filename: string) {
  const dataUrl = await toPng(node, {
    cacheBust: true,
    pixelRatio: 3
  });
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  link.click();
}

export async function downloadBadgeRecto(node: HTMLElement, filename = "badge-recto.png") {
  await downloadNodeAsPng(node, filename);
}

export async function downloadBadgeRectoVerso(
  rectoNode: HTMLElement,
  versoNode: HTMLElement,
  baseFilename = "badge"
) {
  const rectoDataUrl = await toPng(rectoNode, {
    cacheBust: true,
    pixelRatio: 3
  });
  const versoDataUrl = await toPng(versoNode, {
    cacheBust: true,
    pixelRatio: 3
  });

  const zip = new JSZip();
  zip.file(`${baseFilename}-recto.png`, rectoDataUrl.split(",")[1], { base64: true });
  zip.file(`${baseFilename}-verso.png`, versoDataUrl.split(",")[1], { base64: true });

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${baseFilename}.zip`;
  link.click();
  URL.revokeObjectURL(url);
}
