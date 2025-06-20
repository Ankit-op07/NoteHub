"use client";

export default function PDFViewer({ fileurl }) {
  return (
    <div className="w-full h-screen">
      <iframe
        src={fileurl}
        className="w-full h-full"
        frameBorder="0"
        title="PDF Viewer"
      >
        <p>
          Your browser does not support iframes.{" "}
          <a href={fileurl}>Download PDF</a>
        </p>
      </iframe>
    </div>
  );
}
