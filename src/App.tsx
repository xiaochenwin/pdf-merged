import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { FileUp, GripVertical, FileText, Download, Loader2, X } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并 Tailwind CSS 类名的辅助函数
 * @param inputs 类名列表
 * @returns 合并后的类名字符串
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的字符串 (KB, MB)
 */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

interface PdfFile {
  id: string;
  file: File;
}

export default function App() {
  const [files, setFiles] = useState<PdfFile[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [mergedPdfUrl, setMergedPdfUrl] = useState<string | null>(null);

  /**
   * 处理文件上传
   * @param event 文件输入框的 change 事件
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles: PdfFile[] = [];
    if (event.target.files) {
      Array.from(event.target.files).forEach((file) => {
        if (file.type === 'application/pdf') {
          newFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            file,
          });
        } else {
          alert(`文件 ${file.name} 不是 PDF 文件，已跳过。`);
        }
      });
    }
    setFiles((prev) => [...prev, ...newFiles]);
    setMergedPdfUrl(null); // Reset merged file if new files are added
    // Reset input value to allow uploading same file again if needed
    event.target.value = '';
  };

  /**
   * 移除单个文件
   * @param id 文件 ID
   */
  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setMergedPdfUrl(null);
  };

  /**
   * 处理拖拽结束事件，用于重新排序
   * @param result 拖拽结果
   */
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(files);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFiles(items);
    setMergedPdfUrl(null);
  };

  /**
   * 合并 PDF 文件
   */
  const handleMerge = async () => {
    if (files.length < 2) {
      alert('请至少上传两个 PDF 文件进行合并。');
      return;
    }

    setIsMerging(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of files) {
        const fileBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setMergedPdfUrl(url);
    } catch (error) {
      console.error('Error merging PDFs:', error);
      alert('合并 PDF 时发生错误，请重试。');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">PDF 合并工具</h1>
          <p className="text-lg text-gray-600">
            安全、快速地在浏览器中合并您的 PDF 文件。无需上传到服务器，保护您的隐私。
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          {/* 上传区域 */}
          <div className="p-8 border-b border-gray-100 bg-gray-50/50">
            <label
              htmlFor="file-upload"
              className="relative group flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-4 bg-blue-100 text-blue-600 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <FileUp className="w-8 h-8" />
                </div>
                <p className="mb-2 text-lg text-gray-700 font-medium">
                  点击或拖拽上传 PDF 文件
                </p>
                <p className="text-sm text-gray-500">支持多文件上传</p>
              </div>
              <input
                id="file-upload"
                type="file"
                accept="application/pdf"
                multiple
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>

          {/* 文件列表 */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-500" />
                已选择文件 ({files.length})
              </h2>
              {files.length > 0 && (
                <button
                  onClick={() => {
                    setFiles([]);
                    setMergedPdfUrl(null);
                  }}
                  className="text-sm text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                >
                  清空列表
                </button>
              )}
            </div>

            {files.length === 0 ? (
              <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                暂无文件，请上传 PDF
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="pdf-list">
                  {(provided) => (
                    <ul
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-3"
                    >
                      {files.map((file, index) => (
                        <Draggable key={file.id} draggableId={file.id} index={index}>
                          {(provided, snapshot) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={cn(
                                "flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl transition-all",
                                snapshot.isDragging && "shadow-lg ring-2 ring-blue-500 z-10 scale-[1.02]"
                              )}
                            >
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div
                                  {...provided.dragHandleProps}
                                  className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
                                >
                                  <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="p-2 bg-red-50 text-red-500 rounded-lg">
                                  <FileText className="w-6 h-6" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate" title={file.file.name}>
                                    {file.file.name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {formatFileSize(file.file.size)}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleRemoveFile(file.id)}
                                className="ml-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title="移除文件"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </div>

          {/* 底部操作栏 */}
          <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-4">
             <button
              onClick={handleMerge}
              disabled={files.length < 2 || isMerging}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white shadow-md transition-all",
                files.length < 2 || isMerging
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95"
              )}
            >
              {isMerging ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  正在合并...
                </>
              ) : (
                <>
                  <FileText className="w-5 h-5" />
                  开始合并 PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* 下载区域 */}
        {mergedPdfUrl && (
          <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-between animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-green-800">合并完成！</h3>
                <p className="text-green-700">您的 PDF 文件已准备好下载。</p>
              </div>
            </div>
            <a
              href={mergedPdfUrl}
              download="merged-document.pdf"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 shadow-md hover:shadow-lg transition-all active:scale-95"
            >
              <Download className="w-5 h-5" />
              下载文件
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
