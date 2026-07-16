"use client";

import EntityListPage from "@/components/entity-list-page";

interface Document {
  _id: string;
  title: string;
  type?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function DocumentsPage() {
  return (
    <EntityListPage<Document>
      title="Documents"
      icon="lucide:file-text"
      endpoint="documents"
      stats={(items) => [
        { label: "Total", value: items.length, icon: "lucide:file-text", color: "text-sky-400" },
      ]}
      renderItem={(doc) => (
        <div className="flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{doc.title}</p>
            <div className="flex items-center gap-3 mt-0.5 text-[10px] text-gray-500">
              {doc.type && <span className="capitalize">{doc.type}</span>}
              {doc.createdAt && <span>{new Date(doc.createdAt).toLocaleDateString()}</span>}
              {doc.updatedAt && <span>updated {new Date(doc.updatedAt).toLocaleDateString()}</span>}
            </div>
          </div>
        </div>
      )}
    />
  );
}
