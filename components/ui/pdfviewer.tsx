import { Suspense, useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`; // original beam

interface PdfViewerProps {
  pdfUrl: any;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl }) => {
  const [numPages, setNumPages] = useState<number>(0);
  const [scrolledToBottom, setScrolledToBottom] = useState(false);
  const containerRef:any = useRef(null); // Create a ref for the document container

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    // console.log('numPages', numPages)
    setNumPages(numPages);
  }

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = containerRef.current.scrollTop;
        const scrollHeight = containerRef.current.scrollHeight;
        const clientHeight = containerRef.current.clientHeight;

        // Check if scrolled to bottom of the container
        if (scrollTop + clientHeight >= scrollHeight - 10) {
          setScrolledToBottom(true);
        } else {
          setScrolledToBottom(false);
        }
      }
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);

    return () => {
      container?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} className='w-full rounded-md space-y-3'>
        {numPages > 0 && Array.from({ length: numPages }, (_, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} className='w-full flex justify-center rounded-md'/>
        ))}
      </Document>
    </div>

  );
};

export default PdfViewer;