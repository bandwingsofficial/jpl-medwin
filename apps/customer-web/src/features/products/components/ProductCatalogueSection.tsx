"use client"; 
 
import { useState } from "react"; 
import { FileText, Eye, Download } from "lucide-react"; 
import { Product } from "@/features/products/types/product.type"; 
import { CataloguePreviewDialog } from "./CataloguePreviewDialog"; 
 
interface ProductCatalogueSectionProps { 
  product: Product; 
} 
 
export function ProductCatalogueSection({ 
  product, 
}: ProductCatalogueSectionProps) { 
  const [isPreviewOpen, setIsPreviewOpen] = useState(false); 
  const [isDownloading, setIsDownloading] = useState(false); 
 
  // If product doesn't have a catalogue attached, render nothing 
  if (!product.hasCatalogue || !product.catalogueFileUrl) { 
    return null; 
  } 
 
  const catalogueName = 
    product.catalogueFileName || "Product Catalogue"; 
 
  const handleDownload = async () => { 
    if (!product.catalogueFileUrl) return; 
    try { 
      setIsDownloading(true); 
      const response = await fetch(product.catalogueFileUrl, { mode: "cors" }); 
      if (!response.ok) throw new Error("Download failed"); 
      const blob = await response.blob(); 
      const blobUrl = window.URL.createObjectURL(blob); 
      const link = document.createElement("a"); 
      link.href = blobUrl; 
      link.download = catalogueName; 
      document.body.appendChild(link); 
      link.click(); 
      document.body.removeChild(link); 
      window.URL.revokeObjectURL(blobUrl); 
    } catch { 
      window.open(product.catalogueFileUrl, "_blank"); 
    } finally { 
      setIsDownloading(false); 
    } 
  }; 
 
  return ( 
    <> 
      <div 
        className=" 
          rounded-2xl 
          border border-orange-200 
          bg-orange-50/60 
          p-4 sm:p-5 
          shadow-sm 
          transition-all 
        " 
      > 
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"> 
          {/* Left: Document Icon & Name */} 
          <div className="flex items-center gap-3.5 min-w-0 flex-1"> 
            <div className="p-2.5 sm:p-3 bg-orange-500 text-white rounded-xl flex-shrink-0 shadow-sm"> 
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" /> 
            </div> 
            <div className="min-w-0"> 
              <span className="text-[11px] font-bold uppercase tracking-wider text-orange-700 block mb-0.5"> 
                Product Catalogue 
              </span> 
              <p 
                className="text-sm sm:text-base font-bold text-gray-900 truncate" 
                title={catalogueName} 
              > 
                {catalogueName} 
              </p> 
            </div> 
          </div> 
 
          {/* Right: Actions */} 
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-shrink-0"> 
            {/* View Button */} 
            <button 
              type="button" 
              onClick={() => setIsPreviewOpen(true)} 
              className=" 
                inline-flex items-center justify-center gap-1.5 
                flex-1 sm:flex-initial 
                px-4 py-2.5 
                text-xs sm:text-sm font-semibold 
                text-orange-700 
                bg-white 
                border border-orange-200 
                hover:bg-orange-50 hover:border-orange-300 
                active:bg-orange-100 
                rounded-xl 
                shadow-xs 
                transition 
              " 
            > 
              <Eye className="h-4 w-4" /> 
              <span>View</span> 
            </button> 
 
            {/* Download Button */} 
            <button 
              type="button" 
              onClick={handleDownload} 
              disabled={isDownloading} 
              className=" 
                inline-flex items-center justify-center gap-1.5 
                flex-1 sm:flex-initial 
                px-4 py-2.5 
                text-xs sm:text-sm font-semibold 
                text-white 
                bg-orange-500 
                hover:bg-orange-600 
                active:bg-orange-700 
                rounded-xl 
                shadow-sm 
                transition 
                disabled:opacity-70 
              " 
            > 
              <Download className="h-4 w-4" /> 
              <span>{isDownloading ? "Downloading..." : "Download"}</span> 
            </button> 
          </div> 
        </div> 
      </div> 
 
      {/* Responsive Preview Modal */} 
      {isPreviewOpen && ( 
        <CataloguePreviewDialog 
          open={isPreviewOpen} 
          onClose={() => setIsPreviewOpen(false)} 
          fileUrl={product.catalogueFileUrl} 
          fileName={product.catalogueFileName} 
          fileType={product.catalogueFileType} 
        /> 
      )} 
    </> 
  ); 
}