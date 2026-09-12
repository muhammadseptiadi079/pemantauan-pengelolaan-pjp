const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png'];

function extensionOf(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() ?? '';
}

export type PreviewTarget = { url: string; fileName: string };

export default function FilePreviewModal({
    file,
    onClose,
}: {
    file: PreviewTarget | null;
    onClose: () => void;
}) {
    if (!file) return null;

    const ext = extensionOf(file.fileName);
    const isPdf = ext === 'pdf';
    const isImage = IMAGE_EXTENSIONS.includes(ext);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 animate-[fade-in_0.15s_ease-out]"
            onClick={onClose}
        >
            <div
                className="glass-card pop-in flex max-h-[85vh] w-full max-w-3xl flex-col p-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-3 flex items-center justify-between gap-3">
                    <p className="truncate text-sm font-semibold text-slate-900">{file.fileName}</p>
                    <div className="flex shrink-0 items-center gap-3">
                        <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                            Buka di tab baru
                        </a>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Tutup"
                            className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="h-5 w-5"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="min-h-0 flex-1 overflow-auto rounded-lg bg-slate-100">
                    {isPdf && (
                        <iframe src={file.url} title={file.fileName} className="h-[70vh] w-full" />
                    )}
                    {isImage && (
                        <img
                            src={file.url}
                            alt={file.fileName}
                            className="mx-auto max-h-[70vh] w-auto object-contain"
                        />
                    )}
                    {!isPdf && !isImage && (
                        <div className="flex h-40 flex-col items-center justify-center gap-2 p-6 text-center text-sm text-slate-500">
                            <p>
                                Pratinjau tidak didukung untuk tipe file ini (.{ext || '?'}).
                            </p>
                            <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-blue-600 hover:text-blue-800"
                            >
                                Buka / unduh filenya
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
